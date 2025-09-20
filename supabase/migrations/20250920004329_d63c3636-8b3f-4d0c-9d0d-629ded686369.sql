-- Fix search path for existing functions
CREATE OR REPLACE FUNCTION public.add_point_transaction(p_user_id uuid, p_event_type_id uuid, p_points integer, p_description text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log: Inserindo o registro da transação
    INSERT INTO public.point_transactions(user_id, event_type_id, points, description, created_by)
    VALUES (p_user_id, p_event_type_id, p_points, p_description, auth.uid());

    -- Log: Atualizando o saldo total de pontos do usuário na tabela `users`
    UPDATE public.users
    SET points = points + p_points
    WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.redeem_prize(p_prize_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_user_points integer;
    v_prize_cost integer;
    v_prize_quantity integer;
BEGIN
    -- Log: Buscando informações do usuário e do prêmio
    SELECT points INTO v_user_points FROM public.users WHERE id = v_user_id;
    SELECT points_cost, quantity_available INTO v_prize_cost, v_prize_quantity FROM public.prizes WHERE id = p_prize_id AND active = true;

    -- Log: Verificações de segurança e de negócio
    IF v_prize_cost IS NULL THEN
        RETURN 'Prêmio não encontrado ou inativo.';
    END IF;

    IF v_user_points IS NULL OR v_user_points < v_prize_cost THEN
        RETURN 'Pontos insuficientes.';
    END IF;

    IF v_prize_quantity IS NOT NULL AND v_prize_quantity <= 0 THEN
        RETURN 'Prêmio esgotado.';
    END IF;

    -- Log: Atualizando a quantidade do prêmio se houver controle de estoque
    IF v_prize_quantity IS NOT NULL THEN
        UPDATE public.prizes SET quantity_available = quantity_available - 1 WHERE id = p_prize_id;
    END IF;

    -- Log: Debitando os pontos e registrando o resgate
    UPDATE public.users SET points = points - v_prize_cost WHERE id = v_user_id;
    INSERT INTO public.redemptions(user_id, prize_id, points_cost)
    VALUES (v_user_id, p_prize_id, v_prize_cost);

    -- Log: Inserindo uma transação negativa para manter o histórico
    INSERT INTO public.point_transactions(user_id, points, description, created_by)
    VALUES (v_user_id, -v_prize_cost, 'Resgate de prêmio: ' || (SELECT name FROM prizes WHERE id = p_prize_id), v_user_id);

    RETURN 'Resgate realizado com sucesso!';
END;
$$;