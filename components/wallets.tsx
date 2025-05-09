'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccounts } from '@/lib/providers/account';
import AccountBox from './account-box';
import { InjectedExtension } from '@polkadot/extension-inject/types';
import Wallet from './wallet';
import { AccountState } from '@/lib/types';
import { isEnvTest } from '@/lib/utils';

export default function Wallets({ defaultValue }: { defaultValue?: any; }) {
  const [accountState, setAccountState] = useState<AccountState>(defaultValue);
  const { accounts, extensions, selectedExtension: activeWallet, selectedAccount: activeAccount } = useAccounts();
  const activeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccountState({ accounts, extensions, selectedExtension: activeWallet, selectedAccount: activeAccount, currentProxy: null, gloveProxy: null, currentNetwork: null, voteData: null, attestationBundle: null });
  }, [accounts, extensions, activeWallet, activeAccount]);

  useEffect(() => {
    if (activeAccount && activeAccountRef.current && activeWallet && accounts.length > 0) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount, activeWallet, accounts?.length]);

  return (
    <div>
      <div className={`flex flex-row items-start justify-center gap-4 mb-3`}>
        {!!accountState && !!accountState.extensions && accountState.extensions.length > 0 && accountState.extensions.map((wallet: InjectedExtension) => (
          <div key={wallet.name} className={`${ accountState.selectedExtension?.name === wallet.name ? 'border-2 border-primary bg-primary/10 rounded-lg' : 'border-2 border-transparent' }`}>
            <Wallet key={wallet.name} wallet={wallet} id={wallet.name} />
          </div>
        ))}
      </div>
      <div id="all-accounts" className="overflow-y-scroll max-h-[300px] relative border rounded-lg px-3 py-2 bg-black/20">
        {!!accountState && !!accountState.accounts && accountState.accounts.length > 0 ?
          accountState.accounts.map(({ address, meta }) => (
            <div ref={activeAccount && activeAccount.address === address ? activeAccountRef : null} key={address} className={`my-1 ${ activeAccount?.address === address ? 'border-2 border-accent bg-accent/20 rounded-lg' : 'border-2 border-transparent' }`}>
              <AccountBox key={address} account={{ address, meta }} isList={true} />
            </div>
          )) : <div className="text-center text-xs text-white">Connect with one of the wallet extensions above.</div>}
      </div>
    </div>
  );
};