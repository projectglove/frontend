import React, { useState, useEffect } from 'react';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { useAccounts } from '@/lib/providers/account';
import { APP_NAME } from '@/lib/consts';

const ROCOCO_WS_PROVIDER = 'wss://rococo-rpc.polkadot.io';

const GloveTest = () => {
  const [error, setError] = useState('');
  const { setAccounts, accounts } = useAccounts();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const button = document.querySelector<HTMLButtonElement>('#hero-connect-accounts');
      if (!button) {
        console.error('Button #hero-connect-accounts not found');
        return;
      }

      const connectAccountsHandler = async () => {
        try {
          const allInjected = await web3Enable('example-dapp');
          if (allInjected.length === 0) {
            console.log('Connection rejected', allInjected);
            setError('Connection rejected');
          } else {
            const allAccounts = await web3Accounts();
            console.log('web3Accounts', allAccounts);
            setAccounts(allAccounts);
          }
        } catch (err) {
          console.error('An error occurred while connecting accounts', err);
          setError('An error occurred while connecting accounts');
        }
      };

      button.addEventListener('click', connectAccountsHandler);

      return () => {
        button.removeEventListener('click', connectAccountsHandler);
      };
    }
  }, []);

  return (
    <div></div>
  );
};

export default GloveTest;