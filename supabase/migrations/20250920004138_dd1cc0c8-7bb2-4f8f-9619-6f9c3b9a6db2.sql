-- Create trigger to sync auth.users to public.users using existing function
-- Safe to re-create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure RLS is enabled on users table (idempotent if already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;