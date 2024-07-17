"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getReferendaList, getReferendumTracks } from "@/lib/utils";

export function ReferendumList() {
  const [filter, setFilter] = useState("all");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [amounts, setAmounts] = useState([0, 0, 0, 0, 0]);
  const [multipliers, setMultipliers] = useState([1, 1, 1, 1, 1]);
  const filteredData = useMemo(() => {
    switch (filter) {
      case "voted":
        return [1, 2, 3, 4, 5].filter((ref) => ref % 2 === 0);
      case "not-voted":
        return [1, 2, 3, 4, 5].filter((ref) => ref % 2 !== 0);
      default:
        return [1, 2, 3, 4, 5];
    }
  }, [filter]);
  useEffect(() => {
    const load = async () => {
      const data = await getReferendaList();
      // const tracks = await getReferendumTracks();
      console.log({ data });
    };
    load();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTimeRemaining = () => {
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);
    return `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  };
  const handleAmountChange = (index: number, value: string) => {
    const newValue = Math.max(0, parseFloat(value));
    const newAmounts = [...amounts];
    newAmounts[index] = newValue;
    setAmounts(newAmounts);
  };
  const handleMultiplierChange = (index: number, value: string) => {
    const newValue = Math.max(0.1, Math.min(6, parseFloat(value)));
    const newMultipliers = [...multipliers];
    newMultipliers[index] = newValue;
    setMultipliers(newMultipliers);
  };
  return (
    <div className="p-4 h-scroll-73 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative">
        <h1 className="text-2xl font-bold">Active Treasury Refs</h1>
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <FilterIcon className="w-5 h-5" />
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
      <div className="border rounded-md overflow-auto">
        {filteredData.map((ref, index) => (
          <div
            key={ref}
            className={`border-b pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 ${ index % 2 === 0 ? 'bg-background' : 'bg-secondary/20' } ${ index === filteredData.length - 1 ? "border-b-0" : "" }`}
          >
            <div className="flex flex-col items-start">
              <div className="bg-muted flex items-center justify-center rounded-md p-2 flex-shrink-0 gap-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-muted-foreground hover:underline flex items-center gap-1"
                >
                  <span>Ref #{ref.toString().padStart(3, "0")}</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
                {/* {ref % 2 !== 0 && <Button className="ml-auto">Update Vote</Button>} */}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                  {ref % 3 === 0 ? "Anonymized" : "Not Anonymized"}
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-xs font-medium ${ ref % 2 === 0 ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"
                    }`}
                >
                  {ref % 2 === 0 ? "Voted" : "Not Voted"}
                </div>
                <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                  {timeRemaining <= 0 ? "Ref Ended" : formatTimeRemaining()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 col-span-2">
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Direction <span className="text-muted-foreground">(Aye/Nay/Abstain)</span>
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={ref % 2 === 0 ? "Aye" : "Nay"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aye">Aye</SelectItem>
                    <SelectItem value="nay">Nay</SelectItem>
                    <SelectItem value="abstain">Abstain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Amount <span className="text-muted-foreground">(KSM)</span>
                </label>
                <Input
                  type="number"
                  value={amounts[index]}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="w-full"
                  required
                  min={0}
                  pattern="[0-9]*"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Multiplier <span className="text-muted-foreground">(.1x - 6x)</span>
                </label>
                <Input
                  type="number"
                  value={multipliers[index]}
                  onChange={(e) => handleMultiplierChange(index, e.target.value)}
                  className="w-full"
                  required
                  min={0.1}
                  max={6}
                  step={0.1}
                  pattern="[0-9]+(.[0-9]+)?"
                />
              </div>
            </div>
          </div>
        ))}
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