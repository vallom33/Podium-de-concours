import { Trophy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { LeaderboardEntry } from '@/types';

interface AdminLeaderboardProps {
  entries: LeaderboardEntry[];
  onRefetch: () => void;
}

export function AdminLeaderboard({ entries, onRefetch }: AdminLeaderboardProps) {
  const { toast } = useToast();

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    try {
      const { error } = await supabase.from('teams').delete().eq('id', teamId);

      if (error) throw error;

      toast({
        title: 'Team deleted',
        description: `${teamName} has been removed from the leaderboard.`,
      });

      onRefetch();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete team',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
        Current Leaderboard
      </h3>

      <ScrollArea className="h-[400px]">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No teams yet. Add some teams to get started!
          </p>
        ) : (
          <div className="space-y-2 pr-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg w-8 text-center text-muted-foreground">
                    #{entry.rank}
                  </span>
                  {entry.logo_url ? (
                    <img
                      src={entry.logo_url}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-bold text-xs">
                        {entry.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {entry.level} • {entry.total_points} pts
                    </p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${entry.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Team</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{entry.name}"? This action cannot
                        be undone and will remove all associated score events and badges.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTeam(entry.id, entry.name)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
