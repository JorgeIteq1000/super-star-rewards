import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Users, Gift, Plus, LogOut, Star, Target, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserCard } from "@/components/ui/user-card";
import { PrizeCard } from "@/components/ui/prize-card";
import { mockUsers, mockPrizes } from "@/data/mockData";

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  department: string;
  avatar_url?: string;
  is_admin: boolean;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_cost: number;
  quantity_available: number;
}

export default function AdminDashboard() {
  const { userProfile, user, session, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [pointsDescription, setPointsDescription] = useState("");
  
  // Prize form states
  const [isCreatingPrize, setIsCreatingPrize] = useState(false);
  const [prizeForm, setPrizeForm] = useState({
    name: "",
    description: "",
    image_url: "",
    points_cost: "",
    quantity_available: ""
  });

  useEffect(() => {
    // Permite acesso se houver perfil em memória (modo demo) OU sessão real
    if (!userProfile && (!user || !session)) {
      navigate('/login');
      return;
    }

    // Redirect non-admin users to user dashboard
    if (!userProfile?.is_admin) {
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, [user, userProfile, session, navigate]);

  const fetchData = async () => {
    if (!session) return;

    try {
      // Use mock data for now
      setUsers(mockUsers);
      setPrizes(mockPrizes);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers(mockUsers);
      setPrizes(mockPrizes);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !session || !pointsToAdd || !pointsDescription) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingPoints(true);
    try {
      // Mock implementation for now
      toast({
        title: "Pontos adicionados!",
        description: `${pointsToAdd} pontos foram adicionados para ${selectedUser.name}.`,
      });
      
      setIsAddingPoints(false);
      setSelectedUser(null);
      setPointsToAdd("");
      setPointsDescription("");
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Erro ao adicionar pontos",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsAddingPoints(false);
    }
  };

  const handleCreatePrize = async () => {
    if (!session || !prizeForm.name || !prizeForm.points_cost) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome e custo em pontos.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingPrize(true);
    try {
      // Mock implementation for now
      toast({
        title: "Prêmio criado!",
        description: "O novo prêmio foi adicionado com sucesso.",
      });
      
      // Reset form
      setPrizeForm({
        name: "",
        description: "",
        image_url: "",
        points_cost: "",
        quantity_available: ""
      });
    } catch (error) {
      console.error('Error creating prize:', error);
      toast({
        title: "Erro ao criar prêmio",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingPrize(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">GameWork Admin</h1>
                <p className="text-sm text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.name || userProfile?.email} />
                  <AvatarFallback>
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 
                     userProfile?.email?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-semibold">{userProfile?.name || userProfile?.email || 'Usuário'}</p>
                  <Badge variant="secondary">Admin</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Colaboradores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-success/10">
                  <Gift className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{prizes.length}</p>
                  <p className="text-sm text-muted-foreground">Prêmios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-warning/10">
                  <Star className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.reduce((acc, u) => acc + u.points, 0)}</p>
                  <p className="text-sm text-muted-foreground">Pontos Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-destructive/10">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">32</p>
                  <p className="text-sm text-muted-foreground">Resgates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <Card className="gaming-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Colaboradores</CardTitle>
                  <CardDescription>Adicione pontos e gerencie usuários</CardDescription>
                </div>
                <Dialog open={isAddingPoints} onOpenChange={setIsAddingPoints}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Pontos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Pontos</DialogTitle>
                      <DialogDescription>
                        Selecione um colaborador e adicione pontos
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Colaborador</Label>
                        <Select onValueChange={(value) => setSelectedUser(users.find(u => u.id === value) || null)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um colaborador" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.filter(u => !u.is_admin).map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.department})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Pontos</Label>
                        <Input 
                          type="number" 
                          value={pointsToAdd} 
                          onChange={(e) => setPointsToAdd(e.target.value)}
                          placeholder="Ex: 100" 
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input 
                          value={pointsDescription} 
                          onChange={(e) => setPointsDescription(e.target.value)}
                          placeholder="Ex: Meta batida em vendas" 
                        />
                      </div>
                      <Button onClick={handleAddPoints} disabled={isAddingPoints} className="w-full">
                        {isAddingPoints ? "Adicionando..." : "Adicionar Pontos"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.filter(u => !u.is_admin).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prizes Management */}
          <Card className="gaming-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciar Prêmios</CardTitle>
                  <CardDescription>Crie e edite prêmios disponíveis</CardDescription>
                </div>
                <Dialog open={isCreatingPrize} onOpenChange={setIsCreatingPrize}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Prêmio
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Prêmio</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do prêmio
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome</Label>
                        <Input 
                          value={prizeForm.name} 
                          onChange={(e) => setPrizeForm({...prizeForm, name: e.target.value})}
                          placeholder="Nome do prêmio" 
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input 
                          value={prizeForm.description} 
                          onChange={(e) => setPrizeForm({...prizeForm, description: e.target.value})}
                          placeholder="Descrição do prêmio" 
                        />
                      </div>
                      <div>
                        <Label>URL da Imagem</Label>
                        <Input 
                          value={prizeForm.image_url} 
                          onChange={(e) => setPrizeForm({...prizeForm, image_url: e.target.value})}
                          placeholder="URL da imagem" 
                        />
                      </div>
                      <div>
                        <Label>Custo em Pontos</Label>
                        <Input 
                          type="number"
                          value={prizeForm.points_cost} 
                          onChange={(e) => setPrizeForm({...prizeForm, points_cost: e.target.value})}
                          placeholder="Ex: 500" 
                        />
                      </div>
                      <div>
                        <Label>Quantidade Disponível</Label>
                        <Input 
                          type="number"
                          value={prizeForm.quantity_available} 
                          onChange={(e) => setPrizeForm({...prizeForm, quantity_available: e.target.value})}
                          placeholder="Ex: 10" 
                        />
                      </div>
                      <Button onClick={handleCreatePrize} disabled={isCreatingPrize} className="w-full">
                        {isCreatingPrize ? "Criando..." : "Criar Prêmio"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {prizes.map((prize) => (
                  <div key={prize.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <img 
                      src={prize.image_url} 
                      alt={prize.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{prize.name}</h4>
                      <p className="text-sm text-muted-foreground">{prize.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{prize.points_cost} pts</Badge>
                        <Badge variant="secondary">{prize.quantity_available} disponível</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}