import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrizeCard } from "@/components/ui/prize-card";
import { UserCard } from "@/components/ui/user-card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  LogOut, 
  TrendingUp, 
  Gift, 
  History, 
  Users,
  Target,
  Award
} from "lucide-react";

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_cost: number;
  quantity_available: number;
}

interface Transaction {
  id: string;
  points: number;
  description: string;
  created_at: string;
  event_type: { name: string };
}

interface Redemption {
  id: string;
  created_at: string;
  prize: Prize;
}

interface RankingUser {
  id: string;
  name: string;
  email: string;
  points: number;
  department: string;
  avatar_url?: string;
  is_admin: boolean;
}

export default function Dashboard() {
  const { userProfile, user, session, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !session) {
      navigate('/login');
      return;
    }

    // Redirect admin users to admin dashboard
    if (userProfile?.is_admin) {
      navigate('/admin');
      return;
    }

    fetchData();
  }, [user, session, userProfile, navigate]);

  const fetchData = async () => {
    if (!user || !session) return;

    try {
      // For now, use mock data since tables may not exist yet
      const mockPrizes: Prize[] = [
        {
          id: '1',
          name: 'Mouse Gamer',
          description: 'Mouse gamer de alta precisão',
          image_url: '/src/assets/gaming-mouse.jpg',
          points_cost: 500,
          quantity_available: 10
        },
        {
          id: '2',
          name: 'Fones Bluetooth',
          description: 'Fones de ouvido sem fio',
          image_url: '/src/assets/wireless-headphones.jpg',
          points_cost: 800,
          quantity_available: 5
        },
        {
          id: '3',
          name: 'Gift Card Amazon',
          description: 'Cartão presente Amazon R$ 100',
          image_url: '/src/assets/amazon-gift-card.jpg',
          points_cost: 1000,
          quantity_available: 20
        }
      ];

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          points: 100,
          description: 'Tarefa completada: Projeto X',
          created_at: new Date().toISOString(),
          event_type: { name: 'Tarefa' }
        },
        {
          id: '2',
          points: 50,
          description: 'Check-in diário',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          event_type: { name: 'Check-in' }
        }
      ];

      const mockRedemptions: Redemption[] = [];

      // Try to get ranking from users table, fallback to mock if it fails
      let rankingData = [];
      try {
        const { data } = await supabase.from('users').select('*').order('points', { ascending: false });
        rankingData = data || [];
      } catch (error) {
        console.log('Using mock ranking data');
        rankingData = [userProfile].filter(Boolean);
      }

      setPrizes(mockPrizes);
      setTransactions(mockTransactions);
      setRedemptions(mockRedemptions);
      setRanking(rankingData);
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

  const handleRedeemPrize = async (prizeId: string) => {
    if (!userProfile || !session) return;

    try {
      // Mock implementation for now
      toast({
        title: "Prêmio resgatado!",
        description: "Parabéns! Seu prêmio foi resgatado com sucesso.",
      });
      
      // Refresh data would go here
    } catch (error) {
      console.error('Error redeeming prize:', error);
      toast({
        title: "Erro no resgate",
        description: "Não foi possível resgatar o prêmio. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!userProfile) return null;

  const level = Math.floor(userProfile.points / 100) + 1;
  const progressToNextLevel = (userProfile.points % 100) / 100 * 100;
  const userRank = ranking.findIndex(u => u.id === userProfile.id) + 1;

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
                <h1 className="text-2xl font-bold gradient-text">GameWork</h1>
                <p className="text-sm text-muted-foreground">Dashboard do Colaborador</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-semibold">{userProfile.name}</p>
                  <p className="text-sm text-muted-foreground">{userProfile.department}</p>
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
                  <div className="p-3 rounded-full bg-success/10">
                    <Star className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userProfile.points}</p>
                    <p className="text-sm text-muted-foreground">Pontos Totais</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Nível {level}</p>
                    <p className="text-sm text-muted-foreground">{progressToNextLevel.toFixed(0)}% para próximo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-warning/10">
                    <Trophy className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">#{userRank}</p>
                    <p className="text-sm text-muted-foreground">Posição no Ranking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{redemptions.length}</p>
                    <p className="text-sm text-muted-foreground">Prêmios Resgatados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="gaming-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso do Nível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nível {level}</span>
                  <span>Nível {level + 1}</span>
                </div>
                <div className="level-progress">
                  <div 
                    className="level-progress-bar" 
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {100 - (userProfile.points % 100)} pontos para o próximo nível
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="prizes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prizes">
                <Gift className="h-4 w-4 mr-2" />
                Prêmios
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="redemptions">
                <Award className="h-4 w-4 mr-2" />
                Meus Resgates
              </TabsTrigger>
              <TabsTrigger value="ranking">
                <Users className="h-4 w-4 mr-2" />
                Ranking
              </TabsTrigger>
            </TabsList>

            {/* Prizes Tab */}
            <TabsContent value="prizes">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle>Resgatar Prêmios</CardTitle>
                  <CardDescription>
                    Use seus pontos para resgatar prêmios incríveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="gaming-card animate-pulse">
                          <div className="h-48 bg-muted rounded-lg mb-4"></div>
                          <div className="h-6 bg-muted rounded mb-2"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {prizes.map((prize) => (
                        <PrizeCard 
                          key={prize.id} 
                          prize={prize} 
                          userPoints={userProfile.points}
                          onRedeem={handleRedeemPrize}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle>Histórico de Pontos</CardTitle>
                  <CardDescription>
                    Veja como você conquistou seus pontos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge 
                          variant={transaction.points > 0 ? "default" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          <Star className="h-3 w-3" />
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Redemptions Tab */}
            <TabsContent value="redemptions">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle>Meus Resgates</CardTitle>
                  <CardDescription>
                    Prêmios que você já resgatou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {redemptions.map((redemption) => (
                      <div key={redemption.id} className="gaming-card">
                        <img 
                          src={redemption.prize.image_url} 
                          alt={redemption.prize.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold mb-1">{redemption.prize.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Resgatado em {new Date(redemption.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <Badge variant="secondary">
                          {redemption.prize.points_cost} pontos
                        </Badge>
                      </div>
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
                    Veja onde você está no ranking da empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ranking.map((user, index) => (
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
    </div>
  );
}