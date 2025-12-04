import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { BadgeIcon } from './BadgeIcon';
import { Progress } from '@/components/ui/progress';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  onClick: () => void;
}

export function LeaderboardRow({ entry, onClick }: LeaderboardRowProps) {
  const rankChange = entry.previousRank !== undefined 
    ? entry.previousRank - entry.rank 
    : 0;

  const getRankChangeClass = () => {
    if (rankChange > 0) return 'animate-rank-up';
    if (rankChange < 0) return 'animate-rank-down';
    return '';
  };

  const RankIcon = rankChange > 0 ? ChevronUp : rankChange < 0 ? ChevronDown : Minus;
  const rankIconColor = rankChange > 0 
    ? 'text-green-400' 
    : rankChange < 0 
      ? 'text-red-400' 
      : 'text-muted-foreground';

  return (
    <tr
      className={cn(
        'group cursor-pointer transition-colors',
        'hover:bg-secondary/50',
        'focus-within:bg-secondary/50',
        getRankChangeClass()
      )}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      aria-label={`View details for ${entry.name}, rank ${entry.rank}, ${entry.total_points} points`}
    >
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="font-display font-bold text-lg w-8">
            {entry.rank}
          </span>
          <RankIcon 
            className={cn('h-4 w-4', rankIconColor)} 
            aria-hidden="true"
          />
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {entry.logo_url ? (
            <img
              src={entry.logo_url}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <span className="font-display font-bold text-sm">
                {entry.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold group-hover:text-primary transition-colors">
              {entry.name}
            </p>
            {entry.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-center">
        <span className="font-display font-bold text-lg text-primary">
          {entry.total_points.toLocaleString()}
        </span>
      </td>

      <td className="py-4 px-4 hidden md:table-cell">
        <div className="w-full max-w-[150px]">
          <Progress 
            value={entry.progressPercentage} 
            className="h-2"
            aria-label={`${Math.round(entry.progressPercentage)}% of top score`}
          />
        </div>
      </td>

      <td className="py-4 px-4 text-center hidden sm:table-cell">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary">
          <span className="text-xs text-muted-foreground">Lv.</span>
          <span className="font-display font-bold">{entry.level}</span>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex gap-1 flex-wrap justify-center" aria-label="Badges">
          {entry.badges.length > 0 ? (
            <>
              {entry.badges.slice(0, 4).map((badge) => (
                <BadgeIcon key={badge.id} badge={badge} size="sm" />
              ))}
              {entry.badges.length > 4 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{entry.badges.length - 4}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </td>
    </tr>
  );
}
