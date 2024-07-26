'use client';

import { useEffect, useRef } from 'react';
import { useAccounts } from '@/lib/providers/account';
import AccountBox from './account-box';
import { InjectedExtension } from '@polkadot/extension-inject/types';
import Wallet from './wallet';

export default function Wallets() {
  const { accounts, extensions, selectedExtension: activeWallet, selectedAccount: activeAccount } = useAccounts();
  const activeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeAccount && activeAccountRef.current && activeWallet && accounts.length > 0) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount, activeWallet, accounts?.length]);

  return (
    <div>
      <div className={`flex flex-row items-start justify-center gap-4 mb-3`}>
        {!!extensions && extensions.length > 0 && extensions.map((wallet: InjectedExtension) => (
          <div key={wallet.name} className={`${ activeWallet?.name === wallet.name ? 'border-2 border-primary bg-primary/10 rounded-lg' : 'border-2 border-transparent' }`}>
            <Wallet key={wallet.name} wallet={wallet} />
          </div>
        ))}
      </div>
      <div className="overflow-y-scroll max-h-[300px] relative border rounded-lg px-3 py-2 bg-black/20">
        {!!accounts && accounts.length > 0 ?
          accounts.map(({ address, meta }) => (
            <div ref={activeAccount && activeAccount.address === address ? activeAccountRef : null} key={address} className={`my-1 ${ activeAccount?.address === address ? 'border-2 border-accent bg-accent/20 rounded-lg' : 'border-2 border-transparent' }`}>
              <AccountBox key={address} account={{ address, meta }} isList={true} />
            </div>
          )) : <div className="text-center text-xs text-white">Connect with one of the wallet extensions above.</div>}
      </div>
    </div>
  );
};