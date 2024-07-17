import { useAccounts } from '@/lib/providers/account';
import { useDialog } from '@/lib/providers/dialog';
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
  account: { address: string; name: string; };
  signer: any;
  api: any;
  isList: boolean;
}

export const AccountBox = ({ api, account, signer }: AccountBoxParams) => {
  const { setActiveAccount } = useAccounts();
  const { setOpenExtensions } = useDialog();
  const setAccountHandler = () => {
    setActiveAccount(account);
    setOpenExtensions(false);
  };
  const signTransactionHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (api && account?.address && signer) {
      const decimals = api.registry.chainDecimals[0];

      await api.tx.system.remark('I am signing this transaction!').signAndSend(account.address, { signer }, () => {
        // do something with result
      });
    }
  };
  const signMessageHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const signRaw = signer?.signRaw;

    if (!!signRaw && account?.address) {
      const { signature } = await signRaw({
        address: account.address,
        data: 'I am signing this message',
        type: 'bytes',
      });
    }
  };

  return (
    <div>
      <div onClick={setAccountHandler} className="flex flex-row items-center justify-start gap-2 opacity-80 hover:opacity-100 cursor-pointer hover:bg-primary/20 hover:rounded-lg py-2 px-4">
        <div className="mt-1">
          <Identicon value={account?.address} size={32} theme="substrate" />
        </div>
        <div>
          <div className="text-xs">{shorten(account?.name)}</div>
          <div className="text-sm">{shorten(account?.address)}</div>
        </div>
      </div>
      {/* <div>
        <button onClick={(e) => signTransactionHandler(e)}>
          Submit Transaction
        </button>
        <button onClick={(e) => signMessageHandler(e)}>
          Sign Message
        </button>
      </div> */}
    </div>
  );
};