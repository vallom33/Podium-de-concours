import { format } from 'date-fns';
import { X, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTeamDetails } from '@/hooks/useTeamDetails';
import { BadgeIcon } from './BadgeIcon';
import { cn } from '@/lib/utils';

interface TeamDetailsModalProps {
  teamId: string | null;
  onClose: () => void;
}

export function TeamDetailsModal({ teamId, onClose }: TeamDetailsModalProps) {
  const { team, loading, error } = useTeamDetails(teamId);

  return (
    <Dialog open={!!teamId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg glass-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-3">
            {team?.logo_url && (
              <img
                src={team.logo_url}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            )}
            {team?.name || 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading team details...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-destructive">
            <p>{error}</p>
          </div>
        )}

        {team && !loading && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Total Points
                </p>
                <p className="font-display text-2xl font-bold text-primary">
                  {team.total_points.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Level
                </p>
                <p className="font-display text-2xl font-bold">
                  {team.level}
                </p>
              </div>
            </div>

            {/* Description */}
            {team.description && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  About
                </h3>
                <p className="text-sm">{team.description}</p>
              </div>
            )}

            {/* Badges */}
            {team.badges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Badges Earned
                </h3>
                <div className="flex flex-wrap gap-3">
                  {team.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50"
                    >
                      <BadgeIcon badge={badge} size="md" showTooltip={false} />
                      <div>
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Score History */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Score History
              </h3>
              <ScrollArea className="h-[200px]">
                {team.scoreEvents.length > 0 ? (
                  <div className="space-y-2 pr-4">
                    {team.scoreEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <div
                          className={cn(
                            'p-1.5 rounded-full',
                            event.points >= 0
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          )}
                        >
                          {event.points >= 0 ? (
                            <TrendingUp className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <TrendingDown className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{event.reason}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {format(new Date(event.created_at), 'MMM d, HH:mm')}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'font-display font-bold',
                            event.points >= 0 ? 'text-green-400' : 'text-red-400'
                          )}
                        >
                          {event.points >= 0 ? '+' : ''}
                          {event.points}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No score events yet
                  </p>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
