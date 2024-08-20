"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getReferendaList, getVotesByPollIndex } from "@/lib/utils";
import VotingOptions from "./voting-options";
import { useDialog } from "@/lib/providers/dialog";
import { ComponentTestProps, Conviction, PreferredDirection, ReferendumData, VoteData } from "@/lib/types";
import { useAccounts } from "@/lib/providers/account";

export function ReferendumList({ isTest }: ComponentTestProps) {
  const [filter, setFilter] = useState("all");
  const [timeRemaining, setTimeRemaining] = useState<{ [key: number]: number; }>({});
  const [amounts, setAmounts] = useState<{ [key: number]: number | string; }>({});
  const [multipliers, setMultipliers] = useState<{ [key: number]: Conviction; }>({});
  const [preferredDirection, setPreferredDirection] = useState<{ [key: number]: PreferredDirection; }>({});
  const [referenda, setReferenda] = useState<ReferendumData[]>([]);
  const [votedPollIndices, setVotedPollIndices] = useState<Set<number>>(new Set());
  const [subscanVotes, setSubscanVotes] = useState<{ [pollIndex: number]: VoteData; }>({});
  const { setOpenReferendumDialog, setReferendum, setVotingOptions, setOpenGloveProxy } = useDialog();
  const { currentNetwork, voteData, currentProxy, gloveProxy, selectedAccount } = useAccounts();

  useEffect(() => {
    if (isTest) {
      return;
    }
    const load = async () => {
      const data = await getReferendaList();
      if (data) {
        console.log('referenda', data);
        const treasuryRefs = data.filter(ref => ref.call_module.includes('Treasury') && (ref.status.includes('Submitted') || ref.status.includes('Decision')));
        setReferenda(treasuryRefs);
      }
    };
    load();
  }, [isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    if (voteData) {
      const newAmounts: { [key: number]: number | string; } = {};
      const newMultipliers: { [key: number]: Conviction; } = {};
      const newPreferredDirections: { [key: number]: PreferredDirection; } = {};

      voteData.forEach(vote => {
        newAmounts[vote.pollIndex] = vote.amount;
        newMultipliers[vote.pollIndex] = vote.conviction;
        newPreferredDirections[vote.pollIndex] = vote.direction;
      });

      setAmounts(newAmounts);
      setMultipliers(newMultipliers);
      setPreferredDirection(newPreferredDirections);
    }
  }, [voteData, isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    if (voteData) {
      const indexes = new Set<number>();
      voteData.forEach(vote => {
        indexes.add(vote.pollIndex);
      });
      setVotedPollIndices(indexes);
    }
  }, [voteData, isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    const loadMixTimes = async () => {
      try {
        const data = await Promise.all(Array.from(referenda).map(ref =>
          fetch(`/api/poll`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: ref.referendum_index })
          })
        ));

        if (data) {
          const timeData = await Promise.all(data.map(res => res.ok ? res.json() : { mixing_time: null, error: `${ res.status } (${ res.statusText })` }));
          const indicesArray = Array.from(referenda).map(ref => ref.referendum_index);
          const newTimeRemaining: { [key: number]: number; } = timeData.reduce((acc, curr, index) => {
            if (curr.mixing_time && 'timestamp' in curr.mixing_time) {
              acc[indicesArray[index]] = curr.mixing_time.timestamp;
            }
            return acc;
          }, {});
          console.log('newTimeRemaining', newTimeRemaining);
          setTimeRemaining(newTimeRemaining);
        } else {
          console.error("No data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(loadMixTimes, 30000); // Poll every 30 seconds

    loadMixTimes(); // Initial call to load times immediately

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [referenda, isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    if (!selectedAccount || !currentProxy) {
      return;
    }

    const loadVotes = async () => {
      for (const pollIndex of Array.from(votedPollIndices)) {
        const votes = await getVotesByPollIndex(currentProxy, selectedAccount.address, pollIndex);
        if (votes) {
          const mappedVote: VoteData = votes.map((vote: { amount: number; status: string; extrinsic_index: string; referendum_index: number; voting_time: number; }) => ({
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
  }, [isTest, referenda, currentProxy, selectedAccount, votedPollIndices]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    setVotingOptions(amounts, multipliers, preferredDirection, timeRemaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amounts, multipliers, preferredDirection, timeRemaining, isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeRemaining(prevTimeRemaining => {
        const newTimeRemaining = { ...prevTimeRemaining };
        Object.keys(newTimeRemaining).forEach((key: string) => {
          if (newTimeRemaining[Number(key)] > 0) {
            newTimeRemaining[Number(key)] -= 1;
          }
        });
        return newTimeRemaining;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTest]);

  const filteredData = useMemo(() => {
    if (isTest) {
      return [];
    }
    return referenda.map(ref => ({
      ...ref,
      voted: votedPollIndices.has(ref.referendum_index)
    })).filter(ref => {
      switch (filter) {
        case "voted":
          return ref.voted;
        case "not-voted":
          return !ref.voted;
        default:
          return true;
      }
    }).sort((a, b) => b.referendum_index - a.referendum_index);
  }, [filter, referenda, votedPollIndices, isTest]);

  const formatTimeRemaining = useMemo(() => (pollIndex: number) => {
    const timeInSeconds = timeRemaining[pollIndex];
    if (!timeInSeconds || timeInSeconds <= 0) {
      return "Active";
    }

    const weeks = Math.floor(timeInSeconds / (7 * 24 * 60 * 60));
    const days = Math.floor((timeInSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = timeInSeconds % 60;

    return `Mixing in ${ weeks }w ${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  }, [timeRemaining]);

  const handleAmountChange = (index: number, value: string) => {
    if (value === '') {
      const newAmounts = { ...amounts };
      newAmounts[index] = value;
      setAmounts(newAmounts);
    } else if (!isNaN(parseFloat(value))) {
      const newValue = Math.max(0, parseFloat(value));
      const newAmounts = { ...amounts };
      newAmounts[index] = newValue;
      setAmounts(newAmounts);
    } else {
      console.error("Invalid input for amount");
    }
  };

  const handleMultiplierChange = (index: number, value: Conviction | '') => {
    if (value === '') {
      const newMultipliers = { ...multipliers };
      newMultipliers[index] = Conviction.None;
      setMultipliers(newMultipliers);
    } else {
      const newMultipliers = { ...multipliers };
      newMultipliers[index] = value;
      setMultipliers(newMultipliers);
    }
  };

  const handlePreferredDirectionChange = (index: number, value: PreferredDirection) => {
    const newPreferredDirection = { ...preferredDirection };
    newPreferredDirection[index] = value;
    setPreferredDirection(newPreferredDirection);
  };

  const handleOpenReferendumDialog = (index: number, referendumNumber: number, confirmVote: ReactNode) => {
    setReferendum(null);
    if (currentProxy && currentProxy === gloveProxy) {
      setOpenReferendumDialog(true);
      setReferendum({ index, referendumNumber, confirmVote });
    } else {
      setOpenGloveProxy(true);
    }
  };

  return (
    <div className="p-4 h-scroll-73 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative">
        <h1 className="text-2xl font-bold">Active Treasury Refs</h1>
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <div className="flex items-center justify-center gap-2">
            <FilterIcon className="w-5 h-5" />
            <span className="sr-only">Filter</span>
          </div>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={`rounded-md ${ filter === "all" ? "border-transparent" : "border-1" }`}
          >
            All
          </Button>
          <Button
            variant={filter === "voted" ? "default" : "outline"}
            onClick={() => setFilter("voted")}
            className={`rounded-md ${ filter === "voted" ? "border-transparent" : "border-1" }`}
          >
            Voted
          </Button>
          <Button
            variant={filter === "not-voted" ? "default" : "outline"}
            onClick={() => setFilter("not-voted")}
            className={`rounded-md ${ filter === "not-voted" ? "border-transparent" : "border-1" }`}
          >
            Not Voted
          </Button>
        </div>
      </div>
      <div className={filteredData.length > 0 ? "border rounded-md overflow-auto" : "border-0 rounded-md overflow-auto"}>
        {filteredData.map((ref, index) => {
          const ConfirmVote = () =>
            <VotingOptions
              key={ref.referendum_index}
              index={ref.referendum_index}
              amounts={amounts}
              multipliers={multipliers}
              preferredDirection={preferredDirection}
              handlePreferredDirectionChange={handlePreferredDirectionChange}
              handleAmountChange={handleAmountChange}
              handleMultiplierChange={handleMultiplierChange}
            />;

          return (
            <div
              key={index}
              className={`border-b pb-4 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 p-4 ${ index % 2 === 0 ? 'bg-background' : 'bg-secondary/30' } ${ index === filteredData.length - 1 ? "border-b-0" : "" }`}
            >
              <div className="flex flex-col items-start">
                <div className="bg-muted flex items-center justify-center rounded-md p-2 flex-shrink-0 gap-2">
                  <a
                    href={`https://${ currentNetwork }.polkassembly.io/referenda/${ ref.referendum_index }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-muted-foreground underline-offset-2 hover:underline flex items-center gap-1"
                  >
                    <span>Ref #{ref.referendum_index.toString().padStart(3, "0")}</span>
                    <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                  {/* {ref % 2 !== 0 && <Button className="ml-auto">Update Vote</Button>} */}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                    {/* {index % 3 === 0 ? "Anonymized" : "Not Anonymized"} */}
                    Anonymized
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${ ref.voted ? "border border-emerald-400 text-emerald-400" : "border border-red-500 text-red-500"
                      }`}
                  >
                    {ref.voted ? "Voted" : "Not Voted"}
                  </div>
                  <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                    {formatTimeRemaining(ref.referendum_index)}
                  </div>
                </div>
                <code>{JSON.stringify(subscanVotes[ref.referendum_index])}</code>
              </div>
              <div key={index} className="hover:bg-muted/50 transition-colors rounded-md hover:cursor-glove" onClick={() => handleOpenReferendumDialog(ref.referendum_index, ref.referendum_index, <ConfirmVote />)}>
                <div className="pointer-events-none">
                  <ConfirmVote />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExternalLinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}


function FilterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}