"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/providers/dialog";
import { useEffect, useState } from "react";
import { useAccounts } from "@/lib/providers/account";
import { useApi } from "@/lib/providers/api";
import useSnackbar from "@/lib/providers/snackbar";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { APP_NAME } from "@/lib/consts";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { Signer } from "@polkadot/api/types";

export default function GloveProxy() {
  const [hasJoined, setHasJoined] = useState(false);
  const { openGloveProxy, setOpenGloveProxy, setOpenLearnMore } = useDialog();
  const api = useApi();
  const { selectedAccount: activeAccount, currentProxy, gloveProxy } = useAccounts();
  const { addMessage } = useSnackbar();

  useEffect(() => {
    if (currentProxy && (currentProxy !== '' || currentProxy !== null)) {
      setHasJoined(true);
    } else {
      setHasJoined(false);
    }
  }, [currentProxy]);

  const handleLearnMore = () => {
    setOpenLearnMore(true);
  };

  const handleProxyAssignment = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    await web3Enable(APP_NAME);

    if (!activeAccount || !gloveProxy) {
      return;
    }

    if (api && activeAccount?.address && gloveProxy) {
      try {
        const activeExtension: InjectedExtension | undefined = await web3FromAddress(activeAccount.address);
        const signer: Signer | undefined = activeExtension?.signer;
        if (api.isConnected) {
          const transaction = !hasJoined ?
            api.tx.proxy.addProxy(gloveProxy, "Governance", 0) :
            api.tx.proxy.removeProxy(gloveProxy, "Governance", 0);

          const unsub = await transaction.signAndSend(activeAccount.address, { signer }, ({ status }) => {
            if (status.isBroadcast) {
              console.log('Transaction broadcasted');
              addMessage({
                title: "",
                content: !hasJoined ? "Assigning user to Glove proxy..." : "Removing user from Glove proxy...",
                type: "info",
              });
            } else if (status.isInBlock) {
              console.log('Transaction in block', status);
              addMessage({
                title: "",
                content: "Waiting for transaction to be finalized...",
                type: "info",
              });
            } else if (status.isFinalized) {
              console.log('This transaction is now finalized!', status);
              unsub();
              setOpenGloveProxy(false);
              addMessage({
                title: "",
                content: !hasJoined ? "Your proxy has been assigned to the Glove Operator." : "Your proxy has been removed from the Glove Operator.",
                type: "success",
              });
            }
          });
        } else {
          addMessage({
            title: "",
            content: "Error connecting to wallet",
            type: "error",
          });
        }
      } catch (error) {
        console.error('error', error);
        addMessage({
          title: "",
          content: "There was an error with the transaction",
          type: "error",
        });
      }
    }
  };

  return (
    <Dialog open={openGloveProxy} onOpenChange={setOpenGloveProxy}>
      <div className="join-dialog flex justify-center">
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-background rounded-lg border-2 border-secondary p-6 flex items-center justify-center m-6">
            <div>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold mb-4">{hasJoined ? 'Sad to see you go' : 'How to join Glove'}</DialogTitle>
              </DialogHeader>
              <div>
                <p className="flex items-center justify-center gap-1">
                  <span className="text-sm text-accent">
                    {hasJoined ? 'Are you sure you want to exit Glove?' : 'Participating in Glove requires assigning your GovProxy to the Glove Operator'}
                  </span>
                  <span className="text-xs text-secondary hover:text-secondary/80 cursor-pointer" onClick={handleLearnMore}>ℹ️</span>
                </p>
                <Button variant="default" className="px-4 py-2 rounded-md w-full font-medium my-3" onClick={(e) => handleProxyAssignment(e)}>
                  {hasJoined ? "Exit Glove" : "Join Glove"}
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenGloveProxy(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};
