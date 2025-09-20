import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Plus } from "lucide-react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  department?: string | null;
  points: number;
  avatar_url?: string | null;
  is_admin: boolean;
}

interface UserCardProps {
  user: User;
  rank?: number;
  onAddPoints?: (userId: string) => void;
  isAdmin?: boolean;
}

export function UserCard({ user, rank, onAddPoints, isAdmin = false }: UserCardProps) {
  const level = Math.floor(user.points / 100) + 1;
  const progressToNextLevel = (user.points % 100) / 100 * 100;

  const getRankBadgeVariant = (rank?: number) => {
    if (!rank) return "default";
    if (rank === 1) return "destructive"; // Gold
    if (rank === 2) return "secondary"; // Silver
    if (rank === 3) return "outline"; // Bronze
    return "default";
  };

  const getRankIcon = (rank?: number) => {
    if (rank && rank <= 3) return <Trophy className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  return (
    <Card className="rank-item">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          {rank && (
            <Badge variant={getRankBadgeVariant(rank)} className="flex items-center gap-1">
              {getRankIcon(rank)}
              #{rank}
            </Badge>
          )}
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
            <AvatarFallback>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name || user.email || 'Usuário'}</h3>
            <p className="text-muted-foreground text-sm">{user.department || 'Sem departamento'}</p>
          </div>
          {user.is_admin && (
            <Badge variant="outline">Admin</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pontos</span>
            <span className="points-badge">{user.points}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nível {level}</span>
              <span className="text-muted-foreground">{progressToNextLevel.toFixed(0)}%</span>
            </div>
            <div className="level-progress">
              <div 
                className="level-progress-bar" 
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>

          {isAdmin && onAddPoints && (
            <Button 
              onClick={() => onAddPoints(user.id)}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pontos
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}