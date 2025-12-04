import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Badge } from '@/types';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function BadgeIcon({ badge, size = 'md', showTooltip = true }: BadgeIconProps) {
  const icon = (
    <span
      role="img"
      aria-label={badge.name}
      className={cn(
        'inline-block cursor-default transition-transform hover:scale-110',
        sizeClasses[size]
      )}
    >
      {badge.icon}
    </span>
  );

  if (!showTooltip) {
    return icon;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {icon}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-semibold">{badge.name}</p>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
