import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PrizeCard } from "@/components/ui/prize-card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabaseAPI } from "@/lib/supabase";
import { mockPrizes } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Target, Award } from "lucide-react";

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_cost: number;
  quantity_available: number;
}

export default function Landing() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const prizesData = await supabaseAPI.getPrizes();
        setPrizes(prizesData);
      } catch (error) {
        console.error('Error fetching prizes:', error);
        // Fall back to mock data for demo
        setPrizes(mockPrizes);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">GameWork</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gamificação</p>
            </div>
          </div>
          <Button onClick={handleLogin} variant="default" size="lg">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="mb-4">
              🚀 Sistema de Recompensas
            </Badge>
            <h1 className="text-5xl font-bold gradient-text leading-tight">
              Transforme Performance em Recompensas
            </h1>
            <p className="text-xl text-muted-foreground">
              Conquiste pontos por suas realizações e troque por prêmios incríveis. 
              Sua dedicação merece ser reconhecida!
            </p>
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <p className="font-semibold">Colaboração</p>
                <p className="text-sm text-muted-foreground">Time unido</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-2">
                  <Target className="h-8 w-8 text-success" />
                </div>
                <p className="font-semibold">Metas</p>
                <p className="text-sm text-muted-foreground">Objetivos claros</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-warning/10 w-fit mx-auto mb-2">
                  <Award className="h-8 w-8 text-warning" />
                </div>
                <p className="font-semibold">Recompensas</p>
                <p className="text-sm text-muted-foreground">Prêmios incríveis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Prêmios Disponíveis</h2>
            <p className="text-muted-foreground text-lg">
              Veja alguns dos prêmios que você pode conquistar com seus pontos
            </p>
          </div>

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
          ) : prizes.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {prizes.map((prize) => (
                  <CarouselItem key={prize.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <PrizeCard prize={prize} isRedeemable={false} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Em breve teremos prêmios incríveis para você!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Pronto para Começar?</h2>
            <p className="text-xl text-muted-foreground">
              Faça login e comece a conquistar pontos por suas realizações!
            </p>
            <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-6">
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 GameWork. Sistema de gamificação para equipes de alta performance.
          </p>
        </div>
      </footer>
    </div>
  );
}