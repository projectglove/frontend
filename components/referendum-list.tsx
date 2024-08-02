"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getReferendaList } from "@/lib/utils";
import VotingOptions from "./voting-options";
import { useDialog } from "@/lib/providers/dialog";
import { Conviction, PreferredDirection, ReferendumData } from "@/lib/types";
import { useAccounts } from "@/lib/providers/account";

export function ReferendumList() {
  const [filter, setFilter] = useState("all");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [amounts, setAmounts] = useState<{ [key: number]: number | string; }>({});
  const [multipliers, setMultipliers] = useState<{ [key: number]: Conviction; }>({});
  const [preferredDirection, setPreferredDirection] = useState<{ [key: number]: PreferredDirection; }>({});
  const [referenda, setReferenda] = useState<ReferendumData[]>([]);
  const [votedPollIndices, setVotedPollIndices] = useState<Set<number>>(new Set());
  const { setOpenReferendumDialog, setReferendum, setVotingOptions, openReferendumDialog } = useDialog();
  const { currentNetwork, voteData } = useAccounts();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeRemaining((prevTime) => prevTime - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const load = async () => {
      const data = await getReferendaList();
      if (data) {
        const treasuryRefs = data.filter(ref => ref.call_module.includes('Treasury') && ref.status.includes('Submitted'));
        setReferenda(treasuryRefs);
      }
    };
    load();
  }, []);

  useEffect(() => {
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
  }, [voteData]);

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
    setVotingOptions(amounts, multipliers, preferredDirection);
  }, [amounts, multipliers, preferredDirection]);

  const filteredData = useMemo(() => {
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
  }, [filter, referenda, votedPollIndices]);

  const formatTimeRemaining = () => {
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);
    return `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  };
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
    setOpenReferendumDialog(true);
    setReferendum({ index, referendumNumber, confirmVote });
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
                    {timeRemaining <= 0 ? "Ref Ended" : formatTimeRemaining()}
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