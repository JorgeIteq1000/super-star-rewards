-- Fix infinite recursion in RLS policies for users table
-- First, drop problematic policies
DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver a si mesmos" ON public.users;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin FROM public.users WHERE id = _user_id LIMIT 1;
$$;

-- Create new policies using the security definer function
CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
TO authenticated
USING (public.is_user_admin() = true)
WITH CHECK (public.is_user_admin() = true);

CREATE POLICY "Users can view themselves"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Ensure all users can view other users for ranking (but not edit)
CREATE POLICY "Authenticated users can view all users for ranking"
ON public.users
FOR SELECT
TO authenticated
USING (true);