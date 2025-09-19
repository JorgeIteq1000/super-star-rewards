import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";

interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_cost: number;
  quantity_available: number;
}

interface PrizeCardProps {
  prize: Prize;
  userPoints?: number;
  onRedeem?: (prizeId: string) => void;
  isRedeemable?: boolean;
}

export function PrizeCard({ prize, userPoints = 0, onRedeem, isRedeemable = true }: PrizeCardProps) {
  const canAfford = userPoints >= prize.points_cost;
  const isAvailable = prize.quantity_available > 0;

  return (
    <Card className="gaming-card group cursor-pointer transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img 
            src={prize.image_url} 
            alt={prize.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Esgotado</Badge>
            </div>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          {prize.name}
        </CardTitle>
        <CardDescription>{prize.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-success" />
            <span className="points-badge">{prize.points_cost} pontos</span>
          </div>
          <Badge variant="outline">
            {prize.quantity_available} disponíveis
          </Badge>
        </div>
        
        {isRedeemable && onRedeem && (
          <Button 
            onClick={() => onRedeem(prize.id)}
            disabled={!canAfford || !isAvailable}
            className="w-full"
            variant={canAfford && isAvailable ? "default" : "secondary"}
          >
            {!isAvailable ? "Esgotado" : 
             !canAfford ? "Pontos insuficientes" : "Resgatar"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}