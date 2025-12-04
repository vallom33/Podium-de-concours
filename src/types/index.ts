export interface Team {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  total_points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface ScoreEvent {
  id: string;
  team_id: string;
  points: number;
  reason: string;
  created_at: string;
}

export type BadgeCriteriaType = 'TOP_POSITION' | 'FAST_PROGRESS' | 'MOST_IMPROVED' | 'STREAK' | 'POINTS_MILESTONE';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: BadgeCriteriaType;
  criteria_value: number;
  created_at: string;
}

export interface TeamBadge {
  id: string;
  team_id: string;
  badge_id: string;
  awarded_at: string;
  badge?: Badge;
}

export interface TeamWithBadges extends Team {
  badges: Badge[];
  rank: number;
  previousRank?: number;
}

export interface LeaderboardEntry extends TeamWithBadges {
  progressPercentage: number;
}
