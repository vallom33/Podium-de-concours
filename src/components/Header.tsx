import { Trophy, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showAdminLink?: boolean;
}

export function Header({ showAdminLink = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link 
          to="/" 
          className="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
          aria-label="LivePodium Home"
        >
          <div className="relative">
            <Trophy className="h-8 w-8 text-primary" aria-hidden="true" />
            <div className="absolute inset-0 blur-lg bg-primary/30" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider text-glow">
              LivePodium
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Hackathon Leaderboard
            </p>
          </div>
        </Link>

        <nav aria-label="Main navigation">
          {showAdminLink && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <Link to="/admin">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Admin</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
