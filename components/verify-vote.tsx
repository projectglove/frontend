import { Button } from "./ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useDialog } from "@/lib/providers/dialog";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useAccounts } from "@/lib/providers/account";

const VerifyVote = () => {
  const [pcrOutput, setPcrOutput] = useState<string>('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const { openVerifyVote, setOpenVerifyVote } = useDialog();
  const { attestationBundle } = useAccounts();

  useEffect(() => {
    if (openVerifyVote) {
      setPcrOutput('');
      setIsMatch(null);
    }
  }, [openVerifyVote]);

  const verifyOutput = () => {
    const normalizedPcrOutput = pcrOutput.startsWith('0x') ? pcrOutput.slice(2) : pcrOutput;
    setIsMatch(attestationBundle?.includes(normalizedPcrOutput) || false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPcrOutput(e.target.value);
  };

  return (
    <Dialog open={openVerifyVote} onOpenChange={setOpenVerifyVote}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="bg-background rounded-lg border-2 border-secondary p-6 m-6">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold mb-4">Verify your PCR-0 output</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] max-w-[400px] overflow-y-auto mb-5">
            <p className="text-xs text-gray-400 mb-3">Paste your PCR-0 output here to check if it matches the value from the Glove enclave at the time when your vote was mixed.</p>
            <div className="flex flex-col gap-3">
              <Input value={pcrOutput} onChange={handleInputChange} />
              <Button onClick={verifyOutput}>Submit</Button>
              {pcrOutput && isMatch !== null && (
                <p className={`text-xs mb-3 ${ isMatch ? 'text-green-500' : 'text-red-500' }`}>
                  {isMatch ? 'The PCR-0 output matches the one from the attestation bundle! This proves that your vote was genuinely mixed by the Glove enclave.' : 'The PCR-0 output does not match the one from the attestation bundle. The mixing of your vote was not done from a genuine Glove enclave.'}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenVerifyVote(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyVote;