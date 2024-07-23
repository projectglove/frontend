import { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import Cookies from 'js-cookie';
import { useApi } from './api';
import { useDialog } from './dialog';

type AccountState = {
  accounts: InjectedAccountWithMeta[];
  extensions: InjectedExtension[];
  selectedAccount: InjectedAccountWithMeta | null;
  selectedExtension: InjectedExtension | null;
  currentProxy: string | null;
  gloveProxy: string | null;
};

type AccountContextType = AccountState & {
  setAccounts: (accounts: InjectedAccountWithMeta[]) => void;
  setExtensions: (extensions: InjectedExtension[]) => void;
  setSelectedAccount: (account: InjectedAccountWithMeta | null) => void;
  setSelectedExtension: (extension: InjectedExtension | null) => void;
  setCurrentProxy: (proxy: string | null) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode; }) => {
  const [accounts, setAccountsState] = useState<InjectedAccountWithMeta[]>([]);
  const [extensions, setExtensionsState] = useState<InjectedExtension[]>([]);
  const [selectedAccount, setSelectedAccountState] = useState<InjectedAccountWithMeta | null>(null);
  const [selectedExtension, setSelectedExtensionState] = useState<InjectedExtension | null>(null);
  const [currentProxy, setCurrentProxyState] = useState<string | null>(null);
  const [gloveProxy, setGloveProxyState] = useState<string | null>(null);
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
          console.log('Current Glove Proxy address', data.proxy_account);
          setGloveProxyState(data.proxy_account);
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
    gloveProxy
  }), [accounts, extensions, selectedAccount, selectedExtension, currentProxy, gloveProxy]);

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