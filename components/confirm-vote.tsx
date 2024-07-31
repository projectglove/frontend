// extension-dapp

"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from '@/lib/providers/dialog';
import { Conviction } from '@/lib/types';
import useSnackbar from '@/lib/providers/snackbar';
import { useApi } from '@/lib/providers/api';
import { useAccounts } from '@/lib/providers/account';
import { randomBytes } from 'crypto';
import { web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { APP_NAME } from '@/lib/consts';
import { hexToU8a, u8aToHex } from '@polkadot/util';

export default function ConfirmVote() {
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string[]>([]);
  const { openReferendumDialog, setOpenReferendumDialog, referendum, amounts, multipliers, directions: preferredDirection } = useDialog();
  const { addMessage } = useSnackbar();
  const { selectedAccount } = useAccounts();
  const api = useApi();

  useEffect(() => {
    if (!referendum) return;

    const voteAmount = amounts[referendum.index];
    const voteMultiplier = multipliers[referendum.index];
    const voteDirection = preferredDirection[referendum.index];
    const errors = [];

    if (!voteDirection) {
      errors.push('Direction must be selected');
    }

    if (voteAmount === '' || Number(voteAmount) <= 0) {
      errors.push('Amount must be greater than zero');
    }

    if (!Object.values(Conviction).includes(voteMultiplier)) {
      errors.push('Conviction must be selected');
    }

    setInputError(errors);
  }, [amounts, multipliers, preferredDirection, referendum]);

  const handleVoteSubmission = async () => {
    if (typeof window === 'undefined') return;
    if (!referendum || !api || !selectedAccount || referendum.referendumNumber === 0) return;

    setLoading(true);

    const voteAmount = amounts[referendum.index];
    const voteMultiplier = multipliers[referendum.index];
    const voteDirection = preferredDirection[referendum.index];

    await web3Enable(APP_NAME);

    const injector = await web3FromAddress(selectedAccount.address);
    const signer = injector.signer?.signRaw;

    if (!signer) {
      throw new Error('Signer is not available');
    }

    const [chainDecimals, genesisHash] = await Promise.all([
      api.registry.chainDecimals[0],
      api.rpc.chain.getBlockHash(0)
    ]);

    const tokenDecimals = +chainDecimals;
    const nonce = new Uint32Array(randomBytes(4).buffer)[0];
    const blockHash = genesisHash.toHex();
    const pollIndex = referendum.referendumNumber;
    const balance = Number(voteAmount) * Math.pow(10, tokenDecimals);
    const accountAddress = selectedAccount.address;

    const voteRequest = api.createType('VoteRequest', {
      account: accountAddress,
      genesis_hash: blockHash,
      poll_index: pollIndex,
      nonce,
      aye: voteDirection === 'Aye',
      balance: Number(balance),
      conviction: voteMultiplier
    });
    const hexRequest = Buffer.from(voteRequest.toU8a()).toString('hex'); // removes 0x

    // Convert the VoteRequest into SCALE-encoded bytes, and then encode the bytes into hex
    const voteRequestScaleHex = u8aToHex(voteRequest.toU8a());

    const signerResult = await signer({
      // The hex is converted into raw bytes before being signed. So the signature produced is over the SCALE-encoded
      // bytes (i.e. voteRequest.toU8a())
      data: voteRequestScaleHex,
      type: 'bytes',
      address: accountAddress
    });

    // Glove API expects a `MultiSignature` object for the signature. So we prefix the raw signature with a single
    // byte of value 1 to represent `MultiSignature::Sr25519`.
    const rawSignature = hexToU8a(signerResult.signature);
    const encodedMultiSignature = new Uint8Array(1 + rawSignature.length); // Allocate memory
    encodedMultiSignature.set(Uint8Array.of(1), 0);
    encodedMultiSignature.set(rawSignature, 1); // Set the rest of the bytes to signature

    const signature = Buffer.from(message.signature).toString('hex'); // removes 0x
    const signedVoteRequest = {
      request: voteRequestScaleHex,
      signature: u8aToHex(encodedMultiSignature)
    };

    console.log('signedVoteRequest', signedVoteRequest);

    addMessage({ type: 'info', content: "Submitting your vote to the Glove mixer...", title: '' });

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signedVoteRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log({ error, response });
        const errorMessage = error.message || 'Failed to submit vote: ' + response.status + ' ' + response.statusText;
        addMessage({ type: 'error', content: errorMessage, title: '' });
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        addMessage({ type: 'success', content: `Vote submitted successfully to mixer but it may take a while longer to finalize.`, title: '' });
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            <Button disabled={inputError.length > 0} variant="default" className="px-4 py-2 rounded-md w-full" onClick={() => handleVoteSubmission()}>
              Add/Update Vote
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
