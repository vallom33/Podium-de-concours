import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Team, Badge, TeamBadge, LeaderboardEntry } from '@/types';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousRanksRef = useRef<Map<string, number>>(new Map());

  const fetchLeaderboard = useCallback(async () => {
    try {
      // Fetch teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('total_points', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      // Fetch team badges
      const { data: teamBadges, error: tbError } = await supabase
        .from('team_badges')
        .select('*');

      if (tbError) throw tbError;

      // Get max points for progress calculation
      const maxPoints = teams && teams.length > 0 ? teams[0].total_points : 100;

      // Build leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = (teams || []).map((team, index) => {
        const teamBadgeIds = (teamBadges || [])
          .filter((tb: TeamBadge) => tb.team_id === team.id)
          .map((tb: TeamBadge) => tb.badge_id);
        
        const teamBadgesList = (badgesData || []).filter((b: Badge) => teamBadgeIds.includes(b.id));
        const rank = index + 1;
        const previousRank = previousRanksRef.current.get(team.id);

        return {
          ...team,
          badges: teamBadgesList,
          rank,
          previousRank,
          progressPercentage: maxPoints > 0 ? (team.total_points / maxPoints) * 100 : 0,
        };
      });

      // Update previous ranks for next comparison
      const newRanks = new Map<string, number>();
      leaderboardEntries.forEach((entry) => {
        newRanks.set(entry.id, entry.rank);
      });
      previousRanksRef.current = newRanks;

      setEntries(leaderboardEntries);
      setBadges(badgesData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time changes
    const teamsChannel = supabase
      .channel('leaderboard-teams')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    const scoresChannel = supabase
      .channel('leaderboard-scores')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'score_events' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    const badgesChannel = supabase
      .channel('leaderboard-badges')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_badges' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(scoresChannel);
      supabase.removeChannel(badgesChannel);
    };
  }, [fetchLeaderboard]);

  return { entries, badges, loading, error, refetch: fetchLeaderboard };
}
