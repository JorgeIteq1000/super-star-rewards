-- Create users table for additional user information
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT auth.uid() PRIMARY KEY,
  email TEXT,
  name TEXT,
  department TEXT,
  points INTEGER DEFAULT 0,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create event_types table
CREATE TABLE public.event_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  points INTEGER NOT NULL,
  max_per_day INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- Create prizes table
CREATE TABLE public.prizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  quantity_available INTEGER,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Create point_transactions table
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type_id UUID,
  points INTEGER NOT NULL,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  prize_id UUID,
  points_cost INTEGER NOT NULL,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Usuários autenticados podem ver todos os usuários" 
ON public.users FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios dados" 
ON public.users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins podem gerenciar todos os usuários" 
ON public.users FOR ALL 
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- RLS Policies for event_types
CREATE POLICY "Qualquer usuário autenticado pode ver os tipos de evento" 
ON public.event_types FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem gerenciar os tipos de evento" 
ON public.event_types FOR ALL 
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- RLS Policies for prizes
CREATE POLICY "Qualquer usuário autenticado pode ver os prêmios" 
ON public.prizes FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem gerenciar prêmios" 
ON public.prizes FOR ALL 
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- RLS Policies for point_transactions
CREATE POLICY "Usuários podem ver suas próprias transações" 
ON public.point_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as transações" 
ON public.point_transactions FOR SELECT 
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- RLS Policies for redemptions
CREATE POLICY "Usuários podem ver seus próprios resgates" 
ON public.redemptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os resgates" 
ON public.redemptions FOR SELECT 
USING (
  (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
);

-- Function to add point transaction
CREATE OR REPLACE FUNCTION public.add_point_transaction(
  user_id UUID,
  event_type_id UUID,
  points INTEGER,
  description TEXT
) RETURNS void AS $$
BEGIN
  -- Insert transaction
  INSERT INTO public.point_transactions (user_id, event_type_id, points, description, created_by)
  VALUES (user_id, event_type_id, points, description, auth.uid());
  
  -- Update user points
  UPDATE public.users 
  SET points = points + add_point_transaction.points 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem prize
CREATE OR REPLACE FUNCTION public.redeem_prize(
  user_id UUID,
  prize_id UUID
) RETURNS void AS $$
DECLARE
  prize_cost INTEGER;
  user_points INTEGER;
BEGIN
  -- Get prize cost
  SELECT points_cost INTO prize_cost FROM public.prizes WHERE id = prize_id;
  
  -- Get user points
  SELECT points INTO user_points FROM public.users WHERE id = user_id;
  
  -- Check if user has enough points
  IF user_points < prize_cost THEN
    RAISE EXCEPTION 'Pontos insuficientes';
  END IF;
  
  -- Create redemption
  INSERT INTO public.redemptions (user_id, prize_id, points_cost)
  VALUES (user_id, prize_id, prize_cost);
  
  -- Deduct points from user
  UPDATE public.users 
  SET points = points - prize_cost 
  WHERE id = user_id;
  
  -- Decrease prize quantity if applicable
  UPDATE public.prizes 
  SET quantity_available = quantity_available - 1 
  WHERE id = prize_id AND quantity_available > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default event types
INSERT INTO public.event_types (title, key, points) VALUES
  ('Venda Realizada', 'sale_completed', 100),
  ('Meta Batida', 'goal_achieved', 200),
  ('Presença Perfeita', 'perfect_attendance', 50),
  ('Feedback Positivo', 'positive_feedback', 75);

-- Insert some sample prizes
INSERT INTO public.prizes (name, description, points_cost, quantity_available) VALUES
  ('Fones de Ouvido Wireless', 'Fones de ouvido Bluetooth de alta qualidade', 500, 10),
  ('Mouse Gamer RGB', 'Mouse gamer com iluminação RGB personalizável', 300, 15),
  ('Vale-Presente Amazon R$50', 'Vale-presente para compras na Amazon', 400, 20);