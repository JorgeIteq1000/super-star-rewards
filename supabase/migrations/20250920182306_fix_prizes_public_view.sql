-- 1. Remove a política antiga que exige autenticação para ver os prêmios.
-- log: Removendo política restritiva de visualização de prêmios.
DROP POLICY "Qualquer usuário autenticado pode ver os prêmios" ON public.prizes;

-- 2. Cria uma nova política que permite que qualquer pessoa (logada ou não) veja os prêmios ativos.
-- log: Criando nova política para visualização pública de prêmios ativos.
CREATE POLICY "Prêmios ativos são visíveis para todos" 
ON public.prizes FOR SELECT 
USING (active = true);

-- 3. Garante que a política de administração continue funcionando.
-- log: Mantendo a política de gerenciamento para administradores.
-- (Esta política já existe, mas é bom garantir que ela não seja afetada).
-- Se a política de admin foi removida acidentalmente, adicione-a novamente:
-- CREATE POLICY "Admins podem gerenciar prêmios" 
-- ON public.prizes FOR ALL 
-- USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = true);