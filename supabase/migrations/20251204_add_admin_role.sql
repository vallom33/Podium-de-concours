-- Make every authenticated user behave as admin (for hackathon demo)

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- For the hackathon, we consider all authenticated users as admins.
  -- This bypasses the need to insert rows into user_roles.
  SELECT true;
$$;
