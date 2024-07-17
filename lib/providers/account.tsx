import { Account, BaseWallet } from '@polkadot-onboard/core';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext<{
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  activeAccount: Account | null;
  setActiveAccount: React.Dispatch<React.SetStateAction<Account | null>>;
  activeWallet: BaseWallet | null;
  setActiveWallet: React.Dispatch<React.SetStateAction<BaseWallet | null>>;
} | null>(null);

const AccountProvider = ({ children }: { children: React.ReactNode; }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    if (typeof window !== "undefined") {
      const savedActiveAccount = sessionStorage.getItem('activeAccount');
      return savedActiveAccount ? JSON.parse(savedActiveAccount) : null;
    }
    return null;
  });
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeAccount) {
        sessionStorage.setItem('activeAccount', JSON.stringify(activeAccount));
      } else {
        sessionStorage.removeItem('activeAccount');
      }
    }
  }, [activeAccount]);

  const value = {
    accounts,
    setAccounts,
    activeAccount,
    setActiveAccount,
    activeWallet,
    setActiveWallet
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};

export { AccountProvider, useAccounts };
