import type { LeaderboardEntry } from '@/types';
import { PodiumCard } from './PodiumCard';

interface PodiumProps {
  entries: LeaderboardEntry[];
  onTeamClick: (teamId: string) => void;
}

export function Podium({ entries, onTeamClick }: PodiumProps) {
  const topThree = entries.slice(0, 3);

  if (topThree.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No teams yet. Add some teams to see the podium!</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="podium-title" className="mb-8">
      <h2 id="podium-title" className="sr-only">
        Top 3 Teams
      </h2>
      
      <div className="flex justify-center items-end gap-4 md:gap-8 px-4">
        {topThree[1] && (
          <PodiumCard
            entry={topThree[1]}
            position={2}
            onClick={() => onTeamClick(topThree[1].id)}
          />
        )}
        {topThree[0] && (
          <PodiumCard
            entry={topThree[0]}
            position={1}
            onClick={() => onTeamClick(topThree[0].id)}
          />
        )}
        {topThree[2] && (
          <PodiumCard
            entry={topThree[2]}
            position={3}
            onClick={() => onTeamClick(topThree[2].id)}
          />
        )}
      </div>
    </section>
  );
}
