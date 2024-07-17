import { memo, useEffect, useRef } from 'react';
import { useWallets } from '@polkadot-onboard/react';
import { BaseWallet } from '@polkadot-onboard/core';
import Wallet from './wallet';
import { useAccounts } from '@/lib/providers/account';
import { AccountBox } from './account-box';
import { useApi } from '@/lib/providers/api';

const Wallets = () => {
  const { wallets } = useWallets();
  const { accounts, activeWallet, activeAccount } = useAccounts();
  const api = useApi();
  const activeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]);

  if (!Array.isArray(wallets)) {
    return null;
  }

  return (
    <div>
      <div className={`flex flex-row items-start justify-center gap-4 mb-3`}>
        {wallets.map((wallet: BaseWallet) => (
          <div key={wallet.metadata.title} className={`${ activeWallet?.metadata.id === wallet.metadata.id ? 'border-2 border-primary bg-primary/10 rounded-lg' : 'border-2 border-transparent' }`}>
            <Wallet wallet={wallet} />
          </div>
        ))}
      </div>
      <div className="overflow-y-scroll max-h-[300px] relative border rounded-lg px-3 py-2">
        {accounts.length > 0 ?
          accounts.map(({ address, name = '' }) => (
            <div ref={activeAccount?.address === address ? activeAccountRef : null} key={address} className={`my-1 ${ activeAccount?.address === address ? 'border-2 border-accent bg-accent/20 rounded-lg' : 'border-2 border-transparent' }`}>
              <AccountBox api={api} account={{ address, name }} signer={activeWallet?.signer} isList={true} />
            </div>
          )) : <div className="text-center text-xs text-white">Connect with one of the wallet extensions above.</div>}
      </div>
    </div>
  );
};

export default memo(Wallets);