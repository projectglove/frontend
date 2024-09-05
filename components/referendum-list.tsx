"use client";

import { useState, useMemo, useEffect, ReactNode, useRef } from "react";
import { Button } from "@/components/ui/button";
import { getReferendaList, getVotesByPollIndex } from "@/lib/utils";
import VotingOptions from "./voting-options";
import { useDialog } from "@/lib/providers/dialog";
import { ComponentTestProps, Conviction, SubscanVoteData, PreferredDirection, ReferendumData, VoteData } from "@/lib/types";
import { useAccounts } from "@/lib/providers/account";
import { useApi } from "@/lib/providers/api";
import { time } from "console";

export function ReferendumList({ isTest }: ComponentTestProps) {
  const [filter, setFilter] = useState("all");
  const [elapsedTime, setElapsedTime] = useState<{ [key: number]: number; }>({});
  const [blockNumbers, setBlockNumbers] = useState<{ [key: number]: number; }>({});
  const [amounts, setAmounts] = useState<{ [key: number]: number | string; }>({});
  const [multipliers, setMultipliers] = useState<{ [key: number]: Conviction; }>({});
  const [preferredDirection, setPreferredDirection] = useState<{ [key: number]: PreferredDirection; }>({});
  const [referenda, setReferenda] = useState<ReferendumData[]>([]);
  const [votedPollIndices, setVotedPollIndices] = useState<Set<number>>(new Set());
  const [subscanVotes, setSubscanVotes] = useState<{ [pollIndex: number]: VoteData; }>({});
  const { setOpenReferendumDialog, setReferendum, setVotingOptions, setOpenGloveProxy, setOpenVoteHistory } = useDialog();
  const { currentNetwork, voteData, currentProxy, gloveProxy, selectedAccount } = useAccounts();
  const api = useApi();
  const originalTimestamps = useRef<{ [key: number]: number; }>({});

  useEffect(() => {
    if (isTest) {
      return;
    }
    const load = async () => {
      const data = await getReferendaList();
      if (data) {
        const treasuryRefs = data.filter(ref => ref.call_module.includes('Treasury') && (ref.status.includes('Submitted') || ref.status.includes('Decision')));
        setReferenda(treasuryRefs);
      }
    };

    const intervalId = setInterval(load, 120000);

    load();

    return () => clearInterval(intervalId);
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
          const currentTime = Math.floor(Date.now() / 1000);
          const timeData = await Promise.all(data.map(res => res.ok ? res.json() : { mixing_time: null, error: `${ res.status } (${ res.statusText })` }));
          const indicesArray = Array.from(referenda).map(ref => ref.referendum_index);
          const newTimeRemaining: { [key: number]: number; } = timeData.reduce((acc, curr, index) => {
            if (curr.mixing_time && 'timestamp' in curr.mixing_time) {
              acc[indicesArray[index]] = curr.mixing_time.timestamp;
            }
            if (curr.mixing_time && 'block_number' in curr.mixing_time) {
              setBlockNumbers(prevBlockNumbers => ({ ...prevBlockNumbers, [indicesArray[index]]: curr.mixing_time.block_number }));
            }
            return acc;
          }, {});
          originalTimestamps.current = newTimeRemaining;
          setElapsedTime(newTimeRemaining);
        } else {
          console.error("No data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(loadMixTimes, 30000);

    loadMixTimes();

    return () => clearInterval(intervalId);
  }, [referenda, isTest]);

  // useEffect(() => {
  //   if (isTest) {
  //     return;
  //   }
  //   if (!selectedAccount || !currentProxy) {
  //     return;
  //   }

  //   const loadVotes = async () => {
  //     for (const pollIndex of Array.from(votedPollIndices)) {
  //       const votes = await getVotesByPollIndex(currentProxy, selectedAccount.address, pollIndex);
  //       if (votes) {
  //         const mappedVote: VoteData = votes.filter((vote: SubscanVoteData) => vote.referendum_index === pollIndex)
  //           .map((vote: SubscanVoteData) => ({
  //             amount: vote.amount,
  //             direction: vote.status,
  //             pollIndex,
  //             extrinsicHash: vote.extrinsic_index,
  //             voteTime: vote.voting_time
  //           }));
  //         console.log('mappedVote', mappedVote);
  //         setSubscanVotes(prevVotes => ({ ...prevVotes, [pollIndex]: mappedVote }));
  //       }
  //     }
  //   };

  //   loadVotes();
  // }, [isTest, referenda, currentProxy, selectedAccount, votedPollIndices]);

  useEffect(() => {
    if (isTest) {
      return;
    }
    setVotingOptions(amounts, multipliers, preferredDirection, elapsedTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amounts, multipliers, preferredDirection, elapsedTime, isTest]);

  useEffect(() => {
    if (isTest) {
      return;
    }

    const intervalId = setInterval(() => {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      setElapsedTime(prevTimeRemaining => {
        const newTimeRemaining = { ...prevTimeRemaining };

        Object.keys(originalTimestamps.current).forEach(key => {
          const index = Number(key);
          const futureTimestampInSeconds = originalTimestamps.current[index];
          const timeRemaining = futureTimestampInSeconds - currentTimeInSeconds;

          newTimeRemaining[index] = futureTimestampInSeconds - 1;
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

    const currentTime = Math.floor(Date.now() / 1000);
    let timeInSeconds = currentTime - originalTimestamps.current[pollIndex];

    if (!timeInSeconds) {
      return "Active";
    }

    const weeks = Math.floor(timeInSeconds / (7 * 24 * 60 * 60));
    const days = Math.floor((timeInSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = timeInSeconds % 60;

    let timeString = 'Decision started ';
    timeString += weeks > 0 ? `${ weeks }w ` : '';
    timeString += days > 0 ? `${ days }d ` : '';
    timeString += hours > 0 ? `${ hours }h ` : '';
    timeString += minutes > 0 ? `${ minutes }m ` : '';
    timeString += seconds > 0 ? `${ seconds }s` : '';
    timeString += ' ago';

    return timeString.trim();
  }, []);

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
        <div>
          <h1 className="text-2xl font-bold">Active Treasury Referenda</h1>
          <h6 className="flex flex-row text-xs gap-1 cursor-pointer text-gray-400 hover:text-primary hover:underline items-center mt-1 mb-3 underline-offset-2" onClick={() => setOpenVoteHistory(true)}>
            <VoteHistoryIcon className="w-2 h-2" />
            <span>Previous Vote History</span>
          </h6>
        </div>
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
        {filteredData.length > 0 ? filteredData.map((ref, index) => {
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
              </div>
              <div key={index} className="hover:bg-muted/50 transition-colors rounded-md hover:cursor-glove" onClick={() => handleOpenReferendumDialog(ref.referendum_index, ref.referendum_index, <ConfirmVote />)}>
                <div className="pointer-events-none">
                  <ConfirmVote />
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="flex items-center justify-center">
            <span className="text-muted-foreground">No referenda available at this time.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExternalLinkIcon(props: any) {
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

function VoteHistoryIcon(props: any) {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.50073 2.23345C5.03941 2.23345 2.23345 5.03941 2.23345 8.50073C2.23345 11.9621 5.0394 14.768 8.50073 14.768C11.4708 14.768 13.9583 12.7021 14.6046 9.92883L14.3035 10.2299C13.9975 10.5358 13.5015 10.5357 13.1956 10.2297C12.8896 9.92375 12.8897 9.42772 13.1957 9.12182L14.7629 7.555C14.9098 7.4081 15.1091 7.32559 15.3169 7.32561C15.5247 7.32564 15.7239 7.4082 15.8708 7.55514L17.4372 9.12196C17.7431 9.42794 17.7431 9.92397 17.4371 10.2299C17.1311 10.5358 16.6351 10.5357 16.3292 10.2297L16.1762 10.0767C15.4468 13.648 12.2876 16.3348 8.50073 16.3348C4.17408 16.3348 0.666626 12.8274 0.666626 8.50073C0.666626 4.17408 4.17408 0.666626 8.50073 0.666626C11.3758 0.666626 13.8883 2.21589 15.2502 4.52138C15.4703 4.8939 15.3467 5.37428 14.9741 5.59434C14.6016 5.8144 14.1212 5.69081 13.9012 5.31829C12.8094 3.4702 10.7991 2.23345 8.50073 2.23345ZM8.50073 3.80027C8.93339 3.80027 9.28414 4.15101 9.28414 4.58368V8.08146L11.2855 9.41571C11.6455 9.65571 11.7428 10.1421 11.5028 10.5021C11.2628 10.8621 10.7764 10.9594 10.4164 10.7194L8.06617 9.15257C7.84823 9.00727 7.71732 8.76266 7.71732 8.50073V4.58368C7.71732 4.15101 8.06806 3.80027 8.50073 3.80027Z" fill="currentColor" />
    </svg>

  );
}