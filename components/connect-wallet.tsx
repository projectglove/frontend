import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/lib/providers/dialog";
import Wallets from "./wallets";

export const ConnectWallet = () => {
  const { openExtensions, setOpenExtensions } = useDialog();
  return (
    <div className="login-dialog flex justify-center">
      <Dialog open={openExtensions} onOpenChange={setOpenExtensions}>
        <DialogTrigger asChild>
          <Button
            className="px-8 py-3 rounded-md text-lg font-medium bg-primary/90 text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/80 transition-colors sm:px-12">
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-background rounded-lg border-2 border-secondary p-6 flex items-center justify-center m-6">
            <div>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold mb-4">Connect Wallet</DialogTitle>
              </DialogHeader>
              <Wallets />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
