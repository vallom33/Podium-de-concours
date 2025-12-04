import { Helmet } from 'react-helmet-async';
import { ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { AuthForm } from '@/components/admin/AuthForm';
import { TeamForm } from '@/components/admin/TeamForm';
import { ScoreForm } from '@/components/admin/ScoreForm';
import { AdminLeaderboard } from '@/components/admin/AdminLeaderboard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { useLeaderboard } from '@/hooks/useLeaderboard';

export default function Admin() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { entries, loading: leaderboardLoading, refetch } = useLeaderboard();

  if (authLoading) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Helmet>
          <title>Admin Login - LivePodium</title>
          <meta name="description" content="Admin login for LivePodium hackathon leaderboard." />
        </Helmet>

        <div className="min-h-screen flex flex-col">
          <Header showAdminLink={false} />

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Leaderboard
              </Link>

              <AuthForm />
            </div>
          </main>
        </div>
      </>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <>
        <Helmet>
          <title>Access Denied - LivePodium</title>
        </Helmet>

        <div className="min-h-screen flex flex-col">
          <Header showAdminLink={false} />

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center glass-card rounded-xl p-8 max-w-md">
              <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You don't have admin privileges. Contact the administrator to request access.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Leaderboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Admin dashboard
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - LivePodium</title>
        <meta name="description" content="Manage teams and scores for the LivePodium hackathon leaderboard." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header showAdminLink={false} />

        <main className="flex-1 py-8">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Leaderboard
                </Link>
                <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {leaderboardLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <AdminLeaderboard entries={entries} onRefetch={refetch} />
                </div>
                <div className="space-y-6">
                  <TeamForm />
                  <ScoreForm teams={entries} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
