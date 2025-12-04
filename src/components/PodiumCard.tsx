import { cn } from '@/lib/utils';
import { Crown, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { BadgeIcon } from './BadgeIcon';

interface PodiumCardProps {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
  onClick: () => void;
}

const positionConfig = {
  1: {
    icon: Crown,
    label: '1st Place',
    gradient: 'from-yellow-500/20 via-yellow-600/10 to-transparent',
    border: 'border-yellow-500/50 hover:border-yellow-400',
    iconColor: 'text-yellow-400',
    glow: 'gold-glow',
    size: 'h-48',
    order: 'order-2',
  },
  2: {
    icon: Medal,
    label: '2nd Place',
    gradient: 'from-gray-400/20 via-gray-500/10 to-transparent',
    border: 'border-gray-400/50 hover:border-gray-300',
    iconColor: 'text-gray-300',
    glow: '',
    size: 'h-40',
    order: 'order-1',
  },
  3: {
    icon: Award,
    label: '3rd Place',
    gradient: 'from-orange-600/20 via-orange-700/10 to-transparent',
    border: 'border-orange-600/50 hover:border-orange-500',
    iconColor: 'text-orange-400',
    glow: '',
    size: 'h-36',
    order: 'order-3',
  },
};

export function PodiumCard({ entry, position, onClick }: PodiumCardProps) {
  const config = positionConfig[position];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-end p-4 rounded-xl border-2 transition-all duration-300',
        'bg-gradient-to-b',
        config.gradient,
        config.border,
        config.glow,
        config.size,
        config.order,
        'w-full max-w-[200px]',
        'hover:scale-105 hover:-translate-y-1',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
      aria-label={`${config.label}: ${entry.name} with ${entry.total_points} points`}
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Icon 
          className={cn('h-8 w-8', config.iconColor)} 
          aria-hidden="true"
        />
      </div>

      <div className="text-center space-y-2">
        {entry.logo_url && (
          <img
            src={entry.logo_url}
            alt=""
            className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-border"
          />
        )}
        
        <h3 className="font-display font-semibold text-sm truncate max-w-full px-2">
          {entry.name}
        </h3>

        <div className={cn('font-display text-2xl font-bold', config.iconColor)}>
          {entry.total_points.toLocaleString()}
        </div>

        <div className="text-xs text-muted-foreground">
          Level {entry.level}
        </div>

        {entry.badges.length > 0 && (
          <div className="flex justify-center gap-1 flex-wrap" aria-label="Badges">
            {entry.badges.slice(0, 3).map((badge) => (
              <BadgeIcon key={badge.id} badge={badge} size="sm" />
            ))}
            {entry.badges.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{entry.badges.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
