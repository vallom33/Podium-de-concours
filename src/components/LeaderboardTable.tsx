import type { LeaderboardEntry } from '@/types';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  onTeamClick: (teamId: string) => void;
}

export function LeaderboardTable({ entries, onTeamClick }: LeaderboardTableProps) {
  // Skip top 3 as they're shown in podium
  const tableEntries = entries.slice(3);

  if (tableEntries.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="leaderboard-table-title">
      <h2 id="leaderboard-table-title" className="sr-only">
        Full Leaderboard Rankings
      </h2>
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="grid">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th 
                  scope="col" 
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Rank
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Team
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Points
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell"
                >
                  Progress
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell"
                >
                  Level
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableEntries.map((entry) => (
                <LeaderboardRow
                  key={entry.id}
                  entry={entry}
                  onClick={() => onTeamClick(entry.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
