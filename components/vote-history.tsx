import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { VoteHistoryProps, VoteData, ReferendumData, SubscanVoteData } from '@/lib/types'; // Ensure these types are defined
import { Button } from './ui/button';
import { useDialog } from '@/lib/providers/dialog';
import { getReferendaList, getVotesByPollIndex } from '@/lib/utils';
import { useAccounts } from '@/lib/providers/account';
import { GLOVE_URL, TEST_SUBSCAN_NETWORK } from '@/lib/consts';
import { ExternalLinkIcon } from './referendum-list';

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
          setSubscanVotes(prevVotes => ({ ...prevVotes, [pollIndex]: mappedVote }));
        }
      }
    };

    loadVotes();
  }, [selectedAccount, currentProxy, votedPollIndices]);

  return (
    <Dialog open={openVoteHistory} onOpenChange={setOpenVoteHistory}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="bg-background rounded-lg border-2 border-secondary p-6 m-6">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold mb-4">Vote History</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-between lg:flex-row mb-6 gap-4 max-h-[400px] overflow-y-auto">
            <div className="w-full lg:w-1/3">
              <h3 className="text-md font-bold">Votes made via Glove</h3>
              <ul className="flex flex-col mb-5">
                {Object.keys(subscanVotes).length === 0 ? (
                  <li className="text-sm text-gray-500">No voting history available yet.</li>
                ) : (
                  Object.keys(subscanVotes).map((key: string, index: number) => {
                    const data = (subscanVotes[key as unknown as number] as any)[0] as unknown as VoteData;
                    if (!data) {
                      return null;
                    }
                    return (
                      <li key={key} className="text-sm hover:text-white/80 hover:underline underline-offset-2 cursor-pointer flex items-center gap-1">
                        <a href={`https://${ TEST_SUBSCAN_NETWORK }.subscan.io/extrinsic/${ data.extrinsicHash }`} target="_blank" rel="noopener noreferrer">
                          {data.direction.includes('Aye') ? '+' : '-'} You voted <span className={`${ data.direction.includes('Aye') ? 'text-green-500' : 'text-red-500' }`}>{data.direction.slice(0, -1)}</span> on ref #{data.pollIndex}
                        </a>
                        <ExternalLinkIcon className="w-3 h-3" />
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-bold">Verifying your on-chain vote</h3>
              <p className="text-sm">In a terminal, follow these steps to verify that your vote was genuinely mixed by Glove:</p>
              <ul className="text-xs mt-3">
                <li className="flex flex-col gap-1 mb-3">
                  <span>1) Clone the repository</span>
                  <div className="bg-secondary p-2 rounded-md">git clone https://github.com/projectglove/glove-monorepo.git</div>
                </li>
                <li className="flex flex-col gap-1 mb-3">
                  <span>
                    2) Navigate to the repository
                  </span>
                  <div className="bg-secondary p-2 rounded-md">cd glove-monorepo</div>
                </li>
                <li className="flex flex-col gap-1 mb-3">
                  <span>
                    3) Build the client
                  </span>
                  <div className="bg-secondary p-2 rounded-md">./build.sh client</div>
                </li>
                <li className="flex flex-col gap-1 mb-3">
                  <span>
                    4) Run the client (replace {`{REFERENDUM_INDEX}`} with the number of the referendum)
                  </span>
                  <div className="bg-secondary p-2 rounded-md whitespace-pre-wrap">target/release/client --glove-url={GLOVE_URL} verify-vote --account={selectedAccount?.address} --poll-index={`{REFERENDUM_INDEX}`}</div>
                </li>
                <li className="mb-3">For more information, please read: <a href="https://github.com/projectglove/glove-monorepo#verifying-glove-votes" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white/80 underline underline-offset-2">https://github.com/projectglove/glove-monorepo#verifying-glove-votes</a></li>
              </ul>
            </div>
          </div>
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