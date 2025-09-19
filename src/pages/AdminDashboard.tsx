import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCard } from "@/components/ui/user-card";
import { PrizeCard } from "@/components/ui/prize-card";
import { supabaseAPI } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  LogOut, 
  Users,
  Gift,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Crown
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  points: number;
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
  const { user, token, logout } = useAuth();
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
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Redirect non-admin users to user dashboard
    if (!user.is_admin) {
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, [user, token, navigate]);

  const fetchData = async () => {
    if (!token) return;

    try {
      const [usersData, prizesData] = await Promise.all([
        supabaseAPI.getUsers(token),
        supabaseAPI.getPrizes(token)
      ]);

      setUsers(usersData);
      setPrizes(prizesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !token || !pointsToAdd || !pointsDescription) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingPoints(true);
    try {
      // You'll need an event_type_id for this to work properly
      // For demo purposes, we'll use a dummy ID
      await supabaseAPI.addPointTransaction(
        selectedUser.id, 
        "dummy-event-type-id", // This should be a real event type ID
        parseInt(pointsToAdd), 
        pointsDescription, 
        token
      );
      
      toast({
        title: "Pontos adicionados!",
        description: `${pointsToAdd} pontos foram adicionados para ${selectedUser.name}.`,
      });
      
      // Reset form and refresh data
      setSelectedUser(null);
      setPointsToAdd("");
      setPointsDescription("");
      fetchData();
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
    if (!token || !prizeForm.name || !prizeForm.points_cost) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome e custo em pontos.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingPrize(true);
    try {
      await supabaseAPI.createPrize({
        name: prizeForm.name,
        description: prizeForm.description,
        image_url: prizeForm.image_url || "https://via.placeholder.com/400x300",
        points_cost: parseInt(prizeForm.points_cost),
        quantity_available: parseInt(prizeForm.quantity_available) || 1
      }, token);
      
      toast({
        title: "Prêmio criado!",
        description: "O novo prêmio foi adicionado com sucesso.",
      });
      
      // Reset form and refresh data
      setPrizeForm({
        name: "",
        description: "",
        image_url: "",
        points_cost: "",
        quantity_available: ""
      });
      fetchData();
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

  if (!user) return null;

  const totalUsers = users.length;
  const totalPrizes = prizes.length;
  const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">GameWork Admin</h1>
                <p className="text-sm text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-semibold">{user.name}</p>
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

      {/* Stats Cards */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Colaboradores</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-success/10">
                    <Star className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalPoints}</p>
                    <p className="text-sm text-muted-foreground">Pontos Totais</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-warning/10">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{averagePoints}</p>
                    <p className="text-sm text-muted-foreground">Média de Pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Gift className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalPrizes}</p>
                    <p className="text-sm text-muted-foreground">Prêmios Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Colaboradores
              </TabsTrigger>
              <TabsTrigger value="prizes">
                <Gift className="h-4 w-4 mr-2" />
                Prêmios
              </TabsTrigger>
              <TabsTrigger value="ranking">
                <Trophy className="h-4 w-4 mr-2" />
                Ranking
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle>Gerenciar Colaboradores</CardTitle>
                  <CardDescription>
                    Adicione pontos e gerencie seus colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <UserCard 
                        key={user.id} 
                        user={user}
                        onAddPoints={(userId) => {
                          const user = users.find(u => u.id === userId);
                          setSelectedUser(user || null);
                        }}
                        isAdmin={true}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prizes Tab */}
            <TabsContent value="prizes">
              <Card className="gaming-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Prêmios</CardTitle>
                    <CardDescription>
                      Crie e gerencie os prêmios disponíveis
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Prêmio
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Prêmio</DialogTitle>
                        <DialogDescription>
                          Adicione um novo prêmio para os colaboradores resgatarem
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome do Prêmio</Label>
                          <Input
                            id="name"
                            value={prizeForm.name}
                            onChange={(e) => setPrizeForm({...prizeForm, name: e.target.value})}
                            placeholder="Ex: Vale-presente Amazon R$ 100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={prizeForm.description}
                            onChange={(e) => setPrizeForm({...prizeForm, description: e.target.value})}
                            placeholder="Descreva o prêmio..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="image_url">URL da Imagem</Label>
                          <Input
                            id="image_url"
                            value={prizeForm.image_url}
                            onChange={(e) => setPrizeForm({...prizeForm, image_url: e.target.value})}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="points_cost">Custo em Pontos</Label>
                            <Input
                              id="points_cost"
                              type="number"
                              value={prizeForm.points_cost}
                              onChange={(e) => setPrizeForm({...prizeForm, points_cost: e.target.value})}
                              placeholder="500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={prizeForm.quantity_available}
                              onChange={(e) => setPrizeForm({...prizeForm, quantity_available: e.target.value})}
                              placeholder="10"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleCreatePrize} 
                          disabled={isCreatingPrize}
                          className="w-full"
                        >
                          {isCreatingPrize ? "Criando..." : "Criar Prêmio"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prizes.map((prize) => (
                      <PrizeCard 
                        key={prize.id} 
                        prize={prize} 
                        isRedeemable={false}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ranking Tab */}
            <TabsContent value="ranking">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle>Ranking Geral</CardTitle>
                  <CardDescription>
                    Ranking completo de todos os colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users
                      .sort((a, b) => b.points - a.points)
                      .map((user, index) => (
                        <UserCard 
                          key={user.id} 
                          user={user} 
                          rank={index + 1}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add Points Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Pontos</DialogTitle>
            <DialogDescription>
              Adicione pontos para {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="points">Quantidade de Pontos</Label>
              <Input
                id="points"
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={pointsDescription}
                onChange={(e) => setPointsDescription(e.target.value)}
                placeholder="Ex: Venda realizada com sucesso"
              />
            </div>
            <Button 
              onClick={handleAddPoints} 
              disabled={isAddingPoints}
              className="w-full"
            >
              {isAddingPoints ? "Adicionando..." : "Adicionar Pontos"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}