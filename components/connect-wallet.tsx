"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/providers/dialog";
import Identicon from "@polkadot/react-identicon";
import { useEffect, useState } from "react";
import { useAccounts } from "@/lib/providers/account";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { APP_NAME, TEST_SS58_FORMAT } from "@/lib/consts";
import Cookies from "js-cookie";

export default function ConnectWallet() {
  const { setOpenExtensions } = useDialog();
  const { selectedAccount: activeAccount, setAccounts, setExtensions, extensions, selectedExtension } = useAccounts();
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  useEffect(() => {
    if (activeAccount?.address) {
      setCurrentAddress(activeAccount?.address);
    }
  }, [activeAccount?.address]);

  const handleConnectWallet = async () => {
    if (typeof window !== 'undefined') {
      const wallets = await web3Enable(APP_NAME);
      if (wallets.length > 0 && !extensions.length) {
        setExtensions(wallets);

        const savedSelectedExtension = Cookies.get('activeWallet');
        if (savedSelectedExtension) {
          const parsedSavedSelectedExtension = JSON.parse(savedSelectedExtension);
          const activeExtension = wallets.find(extension => extension.name === parsedSavedSelectedExtension?.name);

          if (activeExtension) {
            const allAccounts = await web3Accounts({ ss58Format: TEST_SS58_FORMAT, extensions: [activeExtension.name] });
            setAccounts(allAccounts);
          } else {
            console.log('No active extension found matching:', selectedExtension?.name);
          }
        }
      } else {
        if (wallets.length === 0) console.log('No wallets enabled');
        if (extensions.length > 0) console.log('Extensions already set');
      }
    }
  };

  const handleOpenChange = () => {
    setOpenExtensions(true);
    handleConnectWallet();
  };

  return (
    <div className="flex items-center justify-center">
      {currentAddress ? <Button onClick={handleOpenChange} variant="outline" className="px-4 py-2 rounded-md">
        <div className="flex items-center">
          {currentAddress && <Identicon value={currentAddress} size={32} theme="substrate" />}
          <span className="ml-2">{activeAccount?.meta?.name ?? ''}</span>
        </div>
      </Button> : <Button
        onClick={handleOpenChange}
        className="px-8 py-3 rounded-md text-md font-medium bg-primary/90 text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/80 transition-colors sm:px-12">
        Connect Wallet
      </Button>}
    </div>
  );
};
