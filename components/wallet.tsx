'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAccounts } from '@/lib/providers/account';
import { InjectedAccounts, InjectedExtension } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { APP_NAME, TEST_SS58_FORMAT } from '@/lib/consts';
import Cookies from 'js-cookie';
import { extensionConfig } from '@/lib/extension-config';
import { ComponentTestProps } from '@/lib/types';

const config = extensionConfig.supported || [];

export default function Wallet({ wallet, isTest, callbackTest }: { wallet: InjectedExtension; } & ComponentTestProps) {
  const { setAccounts, setSelectedExtension: setActiveWallet, selectedExtension: activeWallet } = useAccounts();
  const [iconSrc, setIconSrc] = useState<string>('');

  useEffect(() => {
    const matchedWallet = config.find(supportedWallet => supportedWallet.id === wallet.name);
    if (matchedWallet && matchedWallet.iconUrl) {
      setIconSrc(matchedWallet.iconUrl);
    }
  }, [wallet.name]);

  const walletClickHandler = async (event: React.MouseEvent) => {
    if (isTest && callbackTest) {
      callbackTest();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (typeof window !== "undefined") {
      setActiveWallet(wallet);
      await web3Enable(APP_NAME);
      const allAccounts = await web3Accounts({ ss58Format: TEST_SS58_FORMAT, extensions: [wallet.name] });
      setAccounts(allAccounts);
      Cookies.set('activeWallet', JSON.stringify(wallet));
    }
  };

  return (
    <div data-testid={wallet.name} onClick={walletClickHandler} className={`p-3 flex flex-col items-center justify-center`}>
      <div className="flex flex-col items-center justify-center cursor-glove opacity-60 hover:opacity-100">
        <div className='flex items-center justify-center'>
          {iconSrc && <Image width={45} height={45} src={iconSrc} alt='wallet icon' />}
        </div>
        <div className="text-xs mt-1">{`${ wallet.name }`}</div>
      </div>
    </div>
  );
};