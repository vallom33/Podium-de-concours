import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Podium } from '@/components/Podium';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { TeamDetailsModal } from '@/components/TeamDetailsModal';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLeaderboard } from '@/hooks/useLeaderboard';

export default function Index() {
  const { entries, loading, error } = useLeaderboard();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>LivePodium - Podium de concours – BDE MIAGE Paris Cité</title>
        <meta
          name="description"
          content="Track team rankings, scores, and achievements in real-time during hackathon competitions."
        />
      </Helmet>

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 hero-gradient">
          <div className="container py-8 px-4">
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-2 text-glow animate-fade-in">
                Live Leaderboard
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Podium de concours – BDE MIAGE Paris Cité
              </p>
            </section>

            {error && (
              <div className="text-center py-8 text-destructive" role="alert">
                <p>{error}</p>
              </div>
            )}

            {!error && (
              <>
                {/* Podium for Top 3 */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <Podium entries={entries} onTeamClick={setSelectedTeamId} />
                </div>

                {/* Full Leaderboard Table */}
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <LeaderboardTable entries={entries} onTeamClick={setSelectedTeamId} />
                </div>
              </>
            )}
          </div>
        </main>

        <footer className="border-t border-border py-4">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Podium de concours – BDE MIAGE Paris Cité</p>
          </div>
        </footer>

        {/* Team Details Modal */}
        <TeamDetailsModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      </div>
    </>
  );
}
