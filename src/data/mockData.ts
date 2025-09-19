// Mock data for development and demonstration
import amazonGiftCard from "@/assets/amazon-gift-card.jpg";
import wirelessHeadphones from "@/assets/wireless-headphones.jpg";
import gamingMouse from "@/assets/gaming-mouse.jpg";

export const mockPrizes = [
  {
    id: "1",
    name: "Amazon Gift Card R$ 100",
    description: "Vale-presente da Amazon para compras online. Válido por 12 meses.",
    image_url: amazonGiftCard,
    points_cost: 500,
    quantity_available: 10
  },
  {
    id: "2", 
    name: "Fones de Ouvido Bluetooth Premium",
    description: "Fones de ouvido wireless com cancelamento de ruído e qualidade de som excepcional.",
    image_url: wirelessHeadphones,
    points_cost: 800,
    quantity_available: 5
  },
  {
    id: "3",
    name: "Mouse Gamer RGB",
    description: "Mouse ergonômico para gamers com iluminação RGB personalizável e alta precisão.",
    image_url: gamingMouse,
    points_cost: 300,
    quantity_available: 15
  },
  {
    id: "4",
    name: "Vale Spa Day",
    description: "Um dia relaxante no spa com massagem e tratamentos de beleza.",
    image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    points_cost: 1200,
    quantity_available: 3
  },
  {
    id: "5",
    name: "Smartwatch Fitness",
    description: "Relógio inteligente com monitor de atividades e saúde.",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    points_cost: 1000,
    quantity_available: 7
  },
  {
    id: "6",
    name: "Kit Home Office Premium",
    description: "Kit completo com teclado, mouse pad ergonômico e suporte para notebook.",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    points_cost: 600,
    quantity_available: 12
  }
];

export const mockUsers = [
  {
    id: "user1",
    name: "Ana Silva",
    email: "ana.silva@empresa.com",
    department: "Vendas",
    points: 1250,
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b3d4?w=150&h=150&fit=crop&crop=face",
    is_admin: false
  },
  {
    id: "user2", 
    name: "Carlos Santos",
    email: "carlos.santos@empresa.com",
    department: "Marketing",
    points: 980,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    is_admin: false
  },
  {
    id: "user3",
    name: "Maria Costa",
    email: "maria.costa@empresa.com", 
    department: "TI",
    points: 1450,
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    is_admin: false
  },
  {
    id: "admin1",
    name: "João Admin",
    email: "admin@empresa.com",
    department: "Administração",
    points: 2000,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    is_admin: true
  },
  {
    id: "user4",
    name: "Fernanda Lima",
    email: "fernanda.lima@empresa.com",
    department: "RH",
    points: 750,
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    is_admin: false
  }
];

export const mockTransactions = [
  {
    id: "t1",
    user_id: "user1",
    points: 100,
    description: "Venda realizada com sucesso",
    created_at: "2024-01-15T10:30:00Z",
    event_type: { name: "Venda" }
  },
  {
    id: "t2",
    user_id: "user1", 
    points: 50,
    description: "Participação em treinamento",
    created_at: "2024-01-14T14:20:00Z",
    event_type: { name: "Treinamento" }
  },
  {
    id: "t3",
    user_id: "user1",
    points: 200,
    description: "Meta mensal atingida",
    created_at: "2024-01-13T16:45:00Z", 
    event_type: { name: "Meta" }
  }
];

export const mockRedemptions = [
  {
    id: "r1",
    user_id: "user1",
    prize_id: "3",
    created_at: "2024-01-10T12:00:00Z",
    prize: mockPrizes[2]
  }
];

// Demo credentials for login
export const demoCredentials = {
  user: {
    email: "user@gamework.com",
    password: "password123"
  },
  admin: {
    email: "admin@gamework.com", 
    password: "admin123"
  }
};