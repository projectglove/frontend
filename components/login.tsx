"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDialog } from "@/lib/providers/dialog";

const WALLET_BUTTON_STYLE = "rounded-md text-base font-medium bg-primary/90 text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/80 transition-colors";

export function Login() {
  const { open, setOpen } = useDialog();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black dark">
      <div className="max-w-3xl w-full bg-background p-8 rounded-lg shadow-md sm:px-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white"><span className="pr-1">🧤</span>Welcome to Glove</h1>
          <p className="text-lg text-gray-400 leading-tight">
            Glove is an open-source confidential voting solution for Kusama OpenGov.
          </p>
        </div>
        <div className="login-dialog flex justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-8 py-3 rounded-md text-lg font-medium bg-primary/90 text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/80 transition-colors sm:px-12">
                Connect Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
              <div className="bg-background rounded-lg border-2 border-primary p-6 w-full flex items-center justify-center m-6">
                <div className="w-full">
                  <DialogHeader className="flex justify-between items-center">
                    <DialogTitle className="text-xl font-bold mb-4">Connect Wallet</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols gap-4 mb-6 sm:grid-cols-2">
                    <Button className={WALLET_BUTTON_STYLE}>
                      Talisman
                    </Button>
                    <Button className={WALLET_BUTTON_STYLE}>
                      Sub Wallet
                    </Button>
                    <Button className={WALLET_BUTTON_STYLE}>
                      Nova Wallet
                    </Button>
                    <Button className={WALLET_BUTTON_STYLE}>
                      Polkadot JS
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
