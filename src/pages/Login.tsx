import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { demoCredentials, mockUsers } from "@/data/mockData";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, userProfile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (userProfile || user) {
      if (userProfile?.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [userProfile, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Check demo credentials first
      if (email === demoCredentials.user.email && password === demoCredentials.user.password) {
        // Mock user login
        const mockUser = mockUsers.find(u => !u.is_admin) || mockUsers[0];
        localStorage.setItem('supabase_token', 'demo_token_user');
        localStorage.setItem('supabase_user', JSON.stringify(mockUser));
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta ao GameWork! (Modo Demo)",
        });
        navigate('/dashboard');
        return;
      }
      
      if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
        // Mock admin login
        const mockAdmin = mockUsers.find(u => u.is_admin) || mockUsers[3];
        localStorage.setItem('supabase_token', 'demo_token_admin');
        localStorage.setItem('supabase_user', JSON.stringify(mockAdmin));
        toast({
          title: "Login realizado!",
          description: "Bem-vindo, Administrador! (Modo Demo)",
        });
        navigate('/admin');
        return;
      }

      // Try real Supabase login
      await login(email, password);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta ao GameWork!",
      });
      const stored = localStorage.getItem('supabase_user');
      const parsed = stored ? JSON.parse(stored) : null;
      const isAdmin = parsed?.is_admin === true;
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente ou use as credenciais de demonstração.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-primary animate-pulse-glow">
              <Trophy className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">GameWork</h1>
          <p className="text-muted-foreground">Entre e comece a conquistar pontos!</p>
        </div>

        {/* Login Form */}
        <Card className="gaming-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Fazer Login</CardTitle>
            <CardDescription>
              Acesse sua conta para ver seus pontos e resgatar prêmios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Voltar para página inicial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Para demonstração:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>👤 Colaborador: user@gamework.com / password123</p>
                <p>👑 Admin: admin@gamework.com / admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}