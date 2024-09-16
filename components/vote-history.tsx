import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { VoteHistoryProps, VoteData, ReferendumData, SubscanVoteData } from '@/lib/types'; // Ensure these types are defined
import { Button } from './ui/button';
import { useDialog } from '@/lib/providers/dialog';
import { getReferendaList, getVotesByPollIndex } from '@/lib/utils';
import { useAccounts } from '@/lib/providers/account';
import { GLOVE_URL, TEST_SUBSCAN_NETWORK } from '@/lib/consts';
import { ExternalLinkIcon } from './referendum-list';
import Cookies from 'js-cookie';

const VoteHistory = () => {
  const { setOpenVoteHistory, openVoteHistory, setOpenVerifyVote } = useDialog();
  const [referenda, setReferenda] = useState<ReferendumData[]>([]);
  const [votedPollIndices, setVotedPollIndices] = useState<Set<number>>(new Set());
  const [subscanVotes, setSubscanVotes] = useState<{ [pollIndex: number]: VoteData; }>({});
  const [isMacUser, setIsMacUser] = useState<boolean>(true);
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
    const accountAddress = selectedAccount?.address;
    if (accountAddress) {
      const savedVoteData = Cookies.get(`voteData-${ accountAddress }`);
      if (savedVoteData) {
        const voteData: VoteData[] = JSON.parse(savedVoteData);
        setSubscanVotes(voteData.reduce((acc, vote) => ({
          ...acc,
          [vote.pollIndex]: vote
        }), {}));
      }
    }
  }, [selectedAccount?.address]);

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
              <p className="text-xs text-gray-400 mb-3">Time-sensitive view of your mixed vote history while treasury referenda is still active.</p>
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
              <h3 className="text-md font-bold">Verifying your mixed on-chain vote</h3>
              <p className="text-xs text-gray-400 mb-3">Manual on-chain vote verification of the Glove mixer can only be achieved after vote mixing occurs during the Decision phase, or after. Learn more here: <a href="https://github.com/projectglove/glove-monorepo#verifying-glove-votes" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white/80 underline underline-offset-2">https://github.com/projectglove/glove-monorepo#verifying-glove-votes</a>
              </p>
              <div className="flex flex-row gap-2 my-5">
                <Button variant={isMacUser ? 'secondary' : 'ghost'} onClick={() => setIsMacUser(true)}>MacOS users</Button>
                <Button variant={isMacUser ? 'ghost' : 'secondary'} onClick={() => setIsMacUser(false)}>Non-MacOS users</Button>
              </div>
              {isMacUser ? <>
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
                    <div className="bg-secondary p-2 rounded-md">cargo build</div>
                  </li>
                  <li className="flex flex-col gap-1 mb-3">
                    <span>
                      4) Run the client by pasting the following command below into your terminal (replace {`{REFERENDUM_INDEX}`} with the number of the referendum):
                    </span>
                    <div className="bg-secondary p-2 rounded-md whitespace-pre-wrap">cargo run --bin client -- --glove-url={GLOVE_URL} verify-vote --account={selectedAccount?.address} --poll-index={`{REFERENDUM_INDEX}`}</div>
                  </li>
                  <li className="flex flex-col mb-3">
                    <span className="mb-2">
                      5) Verify your PCR-0 output below:
                    </span>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => setOpenVerifyVote(true)}>Verify</Button>
                    </div>
                  </li>
                </ul>
              </> : <>
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
                      4) Run the client by pasting the following command below into your terminal (replace {`{REFERENDUM_INDEX}`} with the number of the referendum):
                    </span>
                    <div className="bg-secondary p-2 rounded-md whitespace-pre-wrap">target/release/client --glove-url={GLOVE_URL} verify-vote --account={selectedAccount?.address} --poll-index={`{REFERENDUM_INDEX}`}</div>
                  </li>
                  <li className="flex flex-col mb-3">
                    <span className="mb-2">
                      5) Verify your PCR-0 output below:
                    </span>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => setOpenVerifyVote(true)}>Verify</Button>
                    </div>
                  </li>
                </ul>
              </>}
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