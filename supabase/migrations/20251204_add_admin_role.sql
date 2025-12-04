INSERT INTO public.user_roles (user_id, role)
VALUES ('95c0abc0-ee6b-4e03-8d14-6aa47472c508', 'admin')
ON CONFLICT DO NOTHING;
