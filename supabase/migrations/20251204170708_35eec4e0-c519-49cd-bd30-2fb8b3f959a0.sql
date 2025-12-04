-- Create level calculation function
CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level up every 100 points
  RETURN GREATEST(1, FLOOR(points / 100.0) + 1);
END;
$$;

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create score_events table
CREATE TABLE public.score_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badge criteria enum
CREATE TYPE public.badge_criteria_type AS ENUM ('TOP_POSITION', 'FAST_PROGRESS', 'MOST_IMPROVED', 'STREAK', 'POINTS_MILESTONE');

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria_type badge_criteria_type NOT NULL,
  criteria_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_badges table
CREATE TABLE public.team_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, badge_id)
);

-- Create admin roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public read access for leaderboard display
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Anyone can view score_events" ON public.score_events FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view team_badges" ON public.team_badges FOR SELECT USING (true);

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin-only write policies
CREATE POLICY "Admins can insert teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update teams" ON public.teams FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete teams" ON public.teams FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert score_events" ON public.score_events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete score_events" ON public.score_events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert team_badges" ON public.team_badges FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete team_badges" ON public.team_badges FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage badges" ON public.badges FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Function to update team points and level when score event is added
CREATE OR REPLACE FUNCTION public.update_team_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total INTEGER;
BEGIN
  -- Calculate new total points
  SELECT COALESCE(SUM(points), 0) INTO new_total
  FROM public.score_events
  WHERE team_id = NEW.team_id;
  
  -- Update team with new total and calculated level
  UPDATE public.teams
  SET 
    total_points = new_total,
    level = public.calculate_level(new_total),
    updated_at = now()
  WHERE id = NEW.team_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update points on score event insert
CREATE TRIGGER on_score_event_insert
  AFTER INSERT ON public.score_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_points();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for teams updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.score_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_badges;

-- Insert seed badges
INSERT INTO public.badges (name, description, icon, criteria_type, criteria_value) VALUES
  ('Champion', 'Currently in first place', '🏆', 'TOP_POSITION', 1),
  ('Runner Up', 'Currently in second place', '🥈', 'TOP_POSITION', 2),
  ('Bronze Star', 'Currently in third place', '🥉', 'TOP_POSITION', 3),
  ('Fast Climber', 'Gained 50+ points in the last hour', '🚀', 'FAST_PROGRESS', 50),
  ('Rising Star', 'Moved up 3+ ranks in a short period', '⭐', 'MOST_IMPROVED', 3),
  ('On Fire', 'Scored 3 times in a row', '🔥', 'STREAK', 3),
  ('Century', 'Reached 100 points', '💯', 'POINTS_MILESTONE', 100),
  ('Legendary', 'Reached 500 points', '👑', 'POINTS_MILESTONE', 500);

-- Insert seed teams
INSERT INTO public.teams (name, description, total_points, level) VALUES
  ('Code Warriors', 'Full-stack wizards building the future', 245, 3),
  ('Binary Beasts', 'Breaking boundaries with every commit', 198, 2),
  ('Pixel Pioneers', 'Designing tomorrow, one pixel at a time', 156, 2),
  ('Debug Dragons', 'No bug escapes our fire', 134, 2),
  ('Stack Overflow', 'We copy-paste with style', 89, 1),
  ('Null Pointers', 'We embrace the undefined', 67, 1);