import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Team, ScoreEvent, Badge, TeamBadge } from '@/types';

interface TeamDetails extends Team {
  scoreEvents: ScoreEvent[];
  badges: Badge[];
}

export function useTeamDetails(teamId: string | null) {
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    const fetchTeamDetails = async () => {
      setLoading(true);
      try {
        // Fetch team
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();

        if (teamError) throw teamError;

        // Fetch score events
        const { data: scoreEvents, error: seError } = await supabase
          .from('score_events')
          .select('*')
          .eq('team_id', teamId)
          .order('created_at', { ascending: false });

        if (seError) throw seError;

        // Fetch team badges with badge details
        const { data: teamBadges, error: tbError } = await supabase
          .from('team_badges')
          .select('badge_id')
          .eq('team_id', teamId);

        if (tbError) throw tbError;

        // Fetch badge details
        let badges: Badge[] = [];
        if (teamBadges && teamBadges.length > 0) {
          const badgeIds = teamBadges.map((tb: TeamBadge) => tb.badge_id);
          const { data: badgesData, error: bError } = await supabase
            .from('badges')
            .select('*')
            .in('id', badgeIds);

          if (bError) throw bError;
          badges = badgesData || [];
        }

        setTeam({
          ...teamData,
          scoreEvents: scoreEvents || [],
          badges,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Failed to load team details');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  return { team, loading, error };
}
