import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from '@/lib/providers/dialog';
import { Conviction } from '@/lib/types';

export default function ConfirmVote() {
  const [inputError, setInputError] = useState<string[]>([]);
  const { openReferendumDialog, setOpenReferendumDialog, referendum, amounts, multipliers, directions: preferredDirection } = useDialog();

  useEffect(() => {
    if (!referendum) return;
    const voteAmount = amounts[referendum.index];
    const voteMultiplier = multipliers[referendum.index];
    const voteDirection = preferredDirection[referendum.index];
    const errors = [];

    if (voteAmount === '' || Number(voteAmount) <= 0) {
      errors.push('Amount must be greater than zero');
    }
    if (!Object.values(Conviction).includes(voteMultiplier)) {
      errors.push('Conviction must be selected');
    }
    if (!voteDirection) {
      errors.push('Direction must be selected');
    }

    setInputError(errors);
  }, [amounts, multipliers, preferredDirection, referendum]);

  return (
    <Dialog open={openReferendumDialog} onOpenChange={setOpenReferendumDialog}>
      <DialogContent className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-background rounded-lg border-2 border-secondary p-6 flex flex-col items-center justify-center m-6">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold mb-4">Voting on Referendum #{referendum?.referendumNumber}</DialogTitle>
          </DialogHeader>
          {referendum?.confirmVote}
          <div className="flex flex-col items-center justify-center">
            {inputError.map((error, index) => (
              <span key={index} className="text-red-500 text-sm/tight">{error}</span>
            ))}
          </div>
          <DialogFooter className="mt-4 flex justify-between w-full gap-y-2">
            <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenReferendumDialog(false)}>
              Cancel
            </Button>
            <Button disabled={inputError.length > 0} variant="default" className="px-4 py-2 rounded-md w-full" onClick={() => { /* handle vote submission logic */ }}>
              Add/Update Vote
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};