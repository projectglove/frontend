import { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import Cookies from 'js-cookie';
import { useApi } from './api';
import { useDialog } from './dialog';
import { AccountContextType, VoteData } from '../types';

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode; }) => {
  const [accounts, setAccountsState] = useState<InjectedAccountWithMeta[]>([]);
  const [extensions, setExtensionsState] = useState<InjectedExtension[]>([]);
  const [selectedAccount, setSelectedAccountState] = useState<InjectedAccountWithMeta | null>(null);
  const [selectedExtension, setSelectedExtensionState] = useState<InjectedExtension | null>(null);
  const [currentProxy, setCurrentProxyState] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetworkState] = useState<string | null>(null);
  const [gloveProxy, setGloveProxyState] = useState<string | null>(null);
  const [voteData, setVoteDataState] = useState<VoteData[] | null>(null);
  const api = useApi();
  const { openGloveProxy } = useDialog();

  useEffect(() => {
    const savedSelectedAccount = Cookies.get('activeAccount');
    if (savedSelectedAccount) {
      setSelectedAccountState(JSON.parse(savedSelectedAccount));
    }

    const savedSelectedExtension = Cookies.get('activeWallet');
    if (savedSelectedExtension) {
      setSelectedExtensionState(JSON.parse(savedSelectedExtension));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProxyInfo = async () => {
        try {
          const response = await fetch('/api/proxy');
          if (!response.ok) {
            throw new Error('Failed to fetch proxy account information');
          }
          const data = await response.json();

          if ('proxy_account' in data && data.proxy_account) {
            setGloveProxyState(data.proxy_account);
          }

          if ('network_name' in data && data.network_name) {
            setCurrentNetworkState(data.network_name);
          }
        } catch (error) {
          console.error('Error fetching proxy account:', error);
        }
      };

      fetchProxyInfo();
    }
  }, []);

  useEffect(() => {
    const setUserProxy = async () => {
      if (api && gloveProxy && selectedAccount?.address) {
        try {
          const entries = await api.query.proxy.proxies(selectedAccount?.address);
          const proxyEntry = entries.toJSON() as [{ delegate: string, proxyType: string, delay: number; }, number][];

          if (proxyEntry && proxyEntry[0][0] && proxyEntry[0][0].delegate) {
            const delegate = proxyEntry[0][0].delegate;
            const hasJoined = delegate === gloveProxy;

            if (hasJoined) {
              setCurrentProxyState(gloveProxy);
            } else {
              setCurrentProxyState(null);
            }
          } else {
            setCurrentProxyState(null);
          }
        } catch (error) {
          console.error('Error fetching proxy entries:', error);
        }
      }
    };

    setUserProxy();
  }, [api, gloveProxy, selectedAccount?.address, openGloveProxy]);

  useEffect(() => {
    const savedVoteData = Cookies.get('voteData');
    if (savedVoteData) {
      const voteData: VoteData[] = JSON.parse(savedVoteData);
      const currentProxyVoteData = voteData.filter((vote) => vote.proxy === currentProxy);
      setVoteDataState(currentProxyVoteData);
      Cookies.set('voteData', JSON.stringify(currentProxyVoteData));
    }
  }, [currentProxy]);

  const setAccounts = (accounts: InjectedAccountWithMeta[]) => {
    setAccountsState(accounts);
  };

  const setExtensions = (extensions: InjectedExtension[]) => {
    setExtensionsState(extensions);
  };

  const setSelectedAccount = (account: InjectedAccountWithMeta | null) => {
    setSelectedAccountState(account);
    if (account) {
      Cookies.set('activeAccount', JSON.stringify(account));
    } else {
      Cookies.remove('activeAccount');
    }
  };

  const setCurrentProxy = (proxy: string | null) => {
    setCurrentProxyState(proxy);
  };

  const setSelectedExtension = (extension: InjectedExtension | null) => {
    setSelectedExtensionState(extension);
    if (extension) {
      Cookies.set('activeWallet', JSON.stringify(extension));
    } else {
      Cookies.remove('activeWallet');
    }
  };

  const setCurrentNetwork = (network: string | null) => {
    setCurrentNetworkState(network);
  };

  const setVoteData = (voteData: VoteData[] | null) => {
    setVoteDataState(voteData);
    if (voteData) {
      Cookies.set('voteData', JSON.stringify(voteData));
    } else {
      Cookies.remove('voteData');
    }
  };

  const providerValue = useMemo(() => ({
    accounts,
    extensions,
    selectedAccount,
    selectedExtension,
    setAccounts,
    setExtensions,
    setSelectedAccount,
    setSelectedExtension,
    currentProxy,
    setCurrentProxy,
    gloveProxy,
    currentNetwork,
    setCurrentNetwork,
    voteData,
    setVoteData
  }), [accounts, extensions, selectedAccount, selectedExtension, currentProxy, gloveProxy, currentNetwork, voteData]);

  return (
    <AccountContext.Provider value={providerValue}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};