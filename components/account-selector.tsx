"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/providers/dialog";
import Wallets from "./wallets";

export default function AccountSelector() {
  const { openExtensions, setOpenExtensions } = useDialog();

  return (
    <Dialog open={openExtensions} onOpenChange={setOpenExtensions}>
      <div className="connect-dialog flex justify-center">
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-background rounded-lg border-2 border-secondary p-6 flex items-center justify-center m-6">
            <div>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold mb-4">Connect Wallet</DialogTitle>
              </DialogHeader>
              <Wallets />
              <DialogFooter className="mt-4">
                <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenExtensions(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};
