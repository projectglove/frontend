import { APP_NAME } from '@/lib/consts';
import { useAccounts } from '@/lib/providers/account';
import { useDialog } from '@/lib/providers/dialog';
import { useSnackbar } from '@/lib/providers/snackbar';
import { ApiPromise } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Identicon } from '@polkadot/react-identicon';

const shorten = (str: string) => {
  let size = 10;
  let result = str;
  if (str && str.length > 2 * size) {
    let start = str.slice(0, size);
    let end = str.slice(-size);
    result = `${ start }...${ end }`;
  }
  return result;
};

interface AccountBoxParams {
  account: InjectedAccountWithMeta;
  isList: boolean;
}

export default function AccountBox({ account }: AccountBoxParams) {
  const { addMessage } = useSnackbar();
  const { setSelectedAccount: setActiveAccount } = useAccounts();
  const { setOpenExtensions } = useDialog();

  const handleSetAccount = async () => {
    setActiveAccount(account);
    if (account.meta.name) {
      addMessage({
        type: 'info',
        title: '',
        content: `Logged in with account "${ shorten(account.meta.name) }"`
      });
    }
    setOpenExtensions(false);
  };

  const handleIdenticonClick = () => {
    addMessage({
      type: 'info',
      title: '',
      content: `Address copied successfully!`
    });
  };

  return (
    <div className="flex flex-row items-center justify-start gap-2 opacity-80 hover:opacity-100  hover:bg-primary/20 hover:rounded-lg py-2 px-4">
      <div className="mt-1" onClick={handleIdenticonClick}>
        <Identicon value={account?.address} size={32} theme="substrate" />
      </div>
      <div onClick={handleSetAccount} className="cursor-glove">
        <div className="text-xs">{shorten(account?.meta.name ?? '')}</div>
        <div className="text-sm">{shorten(account?.address)}</div>
      </div>
    </div>
  );
};