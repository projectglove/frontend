import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { VoteHistoryProps, VoteData, ReferendumData, SubscanVoteData } from '@/lib/types'; // Ensure these types are defined
import { Button } from './ui/button';
import { useDialog } from '@/lib/providers/dialog';
import { getReferendaList, getVotesByPollIndex } from '@/lib/utils';
import { useAccounts } from '@/lib/providers/account';

const VoteHistory = () => {
  const { setOpenVoteHistory, openVoteHistory } = useDialog();
  const [referenda, setReferenda] = useState<ReferendumData[]>([]);
  const [votedPollIndices, setVotedPollIndices] = useState<Set<number>>(new Set());
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [subscanVotes, setSubscanVotes] = useState<{ [pollIndex: number]: VoteData; }>({});
  const { currentProxy, selectedAccount, voteData } = useAccounts();

  useEffect(() => {
    const loadReferenda = async () => {
      const data = await getReferendaList();
      if (data) {
        const treasuryRefs = data.filter(ref => ref.call_module.includes('Treasury') && (ref.status.includes('Submitted') || ref.status.includes('Decision')));
        setReferenda(treasuryRefs);
      }
    };

    const intervalId = setInterval(loadReferenda, 120000);
    loadReferenda();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (voteData) {
      const indexes = new Set<number>();
      voteData.forEach(vote => {
        indexes.add(vote.pollIndex);
      });
      setVotedPollIndices(indexes);
    }
  }, [voteData]);

  useEffect(() => {
    if (!selectedAccount || !currentProxy) {
      return;
    }

    const loadVotes = async () => {
      for (const pollIndex of Array.from(votedPollIndices)) {
        const votes = await getVotesByPollIndex(currentProxy, selectedAccount.address, pollIndex);
        if (votes) {
          const mappedVote: VoteData = votes.filter((vote: SubscanVoteData) => vote.referendum_index === pollIndex)
            .map((vote: SubscanVoteData) => ({
              amount: vote.amount,
              direction: vote.status,
              pollIndex,
              extrinsicHash: vote.extrinsic_index,
              voteTime: vote.voting_time
            }));
          console.log('mappedVote', mappedVote);
          setSubscanVotes(prevVotes => ({ ...prevVotes, [pollIndex]: mappedVote }));
        }
      }
    };

    loadVotes();
  }, [selectedAccount, currentProxy]);

  return (
    <Dialog open={openVoteHistory} onOpenChange={setOpenVoteHistory}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="bg-background rounded-lg border-2 border-secondary p-6 m-6">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold mb-4">Vote History</DialogTitle>
          </DialogHeader>
          <ul>
            {votes.map((vote, index) => (
              <li key={index}>
                <p>Amount: {vote.amount}</p>
                <p>Direction: {vote.direction}</p>
                {vote.voteTime && <p>Vote Time: {new Date(vote.voteTime).toLocaleString()}</p>}
                <a href={`https://rococo.subscan.io/extrinsic/${ vote.extrinsicHash }`} target="_blank" rel="noopener noreferrer">
                  View Transaction
                </a>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="ghost" className="px-4 py-2 rounded-md w-full" onClick={() => setOpenVoteHistory(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteHistory;