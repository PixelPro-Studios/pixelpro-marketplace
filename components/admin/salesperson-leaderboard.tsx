"use client";

import { Trophy, Medal, Award } from "lucide-react";

interface SalespersonData {
  name: string;
  value: number;
  sales: number;
}

interface SalespersonLeaderboardProps {
  data: SalespersonData[];
}

export function SalespersonLeaderboard({ data }: SalespersonLeaderboardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-platinum">
        No salesperson data available
      </div>
    );
  }

  // Sort by revenue descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-brand-platinum font-bold">{index + 1}</div>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 1:
        return "bg-gray-500/10 border-gray-500/30";
      case 2:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-brand-graphite/50 border-brand-graphite";
    }
  };

  return (
    <div className="h-[300px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-brand-graphite scrollbar-track-transparent">
      <div className="space-y-3">
        {sortedData.map((person, index) => (
          <div
            key={person.name}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:border-brand-off-white/30 ${getRankColor(index)}`}
          >
            <div className="flex-shrink-0">
              {getRankIcon(index)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base truncate">{person.name}</div>
              <div className="text-sm text-brand-platinum">
                {person.sales} {person.sales === 1 ? 'sale' : 'sales'}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-lg text-green-500">${person.value.toFixed(2)}</div>
              <div className="text-xs text-brand-platinum">revenue</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
