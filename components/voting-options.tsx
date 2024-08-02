import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Conviction, PreferredDirection, VotingOptionsProps } from '@/lib/types';
import { useDialog } from '@/lib/providers/dialog';

export default function VotingOptions({ index, handleAmountChange, handleMultiplierChange, handlePreferredDirectionChange }: VotingOptionsProps) {
  const { amounts, multipliers, directions: preferredDirection } = useDialog();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 col-span-2 p-3 items-center">
      <div>
        <span className="flex flex-row sm:flex-col md:flex-row gap-x-1 text-xs font-medium mb-1 text-emerald-500 truncate">
          Direction <span className="text-gray-400 whitespace-normal ellipsis">(Aye/Nay)</span>
        </span>
        <Select onValueChange={(value) => handlePreferredDirectionChange(index, value as PreferredDirection)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={preferredDirection[index] || "Select Direction"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aye">Aye</SelectItem>
            <SelectItem value="Nay">Nay</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <span className="flex flex-row sm:flex-col md:flex-row gap-x-1 text-xs font-medium mb-1 text-emerald-500 truncate">
          Amount <span className="text-gray-400 whitespace-normal ellipsis">(KSM)</span>
        </span>
        <Input
          type="number"
          defaultValue={amounts[index]}
          onChange={(e) => handleAmountChange(index, e.target.value)}
          className="w-full"
          required
          min={0}
          pattern="[0-9]*"
        />
      </div>
      <div>
        <span className="flex flex-row sm:flex-col md:flex-row gap-x-1 text-xs font-medium mb-1 text-emerald-500 truncate">
          Conviction <span className="text-gray-400 whitespace-normal ellipsis">(None - 6x)</span>
        </span>
        <Select onValueChange={(value) => handleMultiplierChange(index, value as Conviction)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={multipliers[index]?.toString().replace('Locked', '') || "Select Conviction"} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Conviction).map((value) => (
              <SelectItem value={value} key={value}>{value.replace('Locked', '')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};