import { Trophy } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative inline-block">
          <Trophy className="h-16 w-16 text-primary animate-pulse" aria-hidden="true" />
          <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" aria-hidden="true" />
        </div>
        <p className="mt-4 font-display text-lg text-muted-foreground">
          Loading leaderboard...
        </p>
      </div>
    </div>
  );
}
