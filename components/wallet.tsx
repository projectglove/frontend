import { memo, useState } from 'react';
import Image from 'next/image';
import { BaseWallet } from '@polkadot-onboard/core';
import { useApi } from '@/lib/providers/api';
import { useAccounts } from '@/lib/providers/account';

const Wallet = ({ wallet }: { wallet: BaseWallet; }) => {
  const { setAccounts, setActiveWallet, activeWallet } = useAccounts();
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const walletClickHandler = async (event: React.MouseEvent) => {
    if (!isBusy) {
      try {
        setIsBusy(true);
        if (activeWallet?.metadata.id === wallet.metadata.id) {
          setActiveWallet(null);
          setAccounts([]);
        } else {
          setActiveWallet(wallet);
          await wallet.connect();
          let accounts = await wallet.getAccounts();
          setAccounts(accounts);
        }
      } catch (error) {
        // handle error
      } finally {
        setIsBusy(false);
      }
    }
  };

  return (
    <div onClick={walletClickHandler} className={`p-3 flex flex-col items-center justify-center`}>
      <div className="flex flex-col items-center justify-center cursor-pointer opacity-60 hover:opacity-100">
        <div className='flex items-center justify-center'>
          {wallet?.metadata?.iconUrl && <Image width={45} height={45} src={wallet.metadata.iconUrl} alt='wallet icon' />}
        </div>
        <div className="text-xs mt-1">{`${ wallet.metadata.title } ${ wallet.metadata.version || '' }`}</div>
      </div>
    </div>
  );
};

export default memo(Wallet);