"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/providers/dialog";
import { useAccounts } from "@/lib/providers/account";

export default function LearnMore() {
  const { openLearnMore, setOpenLearnMore } = useDialog();
  const { currentProxy } = useAccounts();

  return (
    <Dialog open={openLearnMore} onOpenChange={setOpenLearnMore}>
      <div className="learn-dialog flex justify-center">
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-background rounded-lg border-2 border-secondary p-6 flex items-center justify-center m-6">
            <div>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold mb-4">Learn more</DialogTitle>
              </DialogHeader>
              <div>
                <p className="flex items-center justify-center gap-1">
                  <span className="text-sm text-accent">
                    {currentProxy ? 'You can re-assign your GovProxy to Glove at any time.' : 'You can remove this proxy at any time. Glove doesn’t keep custody of your funds.'}
                  </span>
                </p>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenLearnMore(false)}>
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
