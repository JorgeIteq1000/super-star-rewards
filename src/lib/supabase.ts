// Supabase API integration layer
// This file handles all API calls to Supabase backend

const SUPABASE_URL = "https://ykzkkusvgchflaprplnn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlremtrdXN2Z2NoZmxhcHJwbG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjUwNzMsImV4cCI6MjA3MzkwMTA3M30.g7BMW6rg-F8i7R-pNxYtYrberEAxOCn0jxffcxboC0Q";

class SupabaseAPI {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `${SUPABASE_URL}/rest/v1`;
    this.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  private getAuthHeaders(token?: string): HeadersInit {
    return {
      ...this.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  async signup(email: string, password: string, name: string, department: string) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ 
        email, 
        password,
        data: { name, department }
      })
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  }

  // Users
  async getUsers(token: string) {
    const response = await fetch(`${this.baseUrl}/users`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  }

  async getUser(userId: string, token: string) {
    const response = await fetch(`${this.baseUrl}/users?id=eq.${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const users = await response.json();
    return users[0] || null;
  }

  async updateUser(userId: string, data: any, token: string) {
    const response = await fetch(`${this.baseUrl}/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  }

  // Prizes
  async getPrizes(token?: string) {
    const response = await fetch(`${this.baseUrl}/prizes`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch prizes');
    }
    
    return response.json();
  }

  async createPrize(prize: any, token: string) {
    const response = await fetch(`${this.baseUrl}/prizes`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(prize)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create prize');
    }
    
    return response.json();
  }

  async updatePrize(prizeId: string, data: any, token: string) {
    const response = await fetch(`${this.baseUrl}/prizes?id=eq.${prizeId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update prize');
    }
    
    return response.json();
  }

  async deletePrize(prizeId: string, token: string) {
    const response = await fetch(`${this.baseUrl}/prizes?id=eq.${prizeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete prize');
    }
    
    return response.json();
  }

  // Point Transactions
  async getPointTransactions(userId: string, token: string) {
    const response = await fetch(`${this.baseUrl}/point_transactions?user_id=eq.${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch point transactions');
    }
    
    return response.json();
  }

  // Redemptions
  async getRedemptions(userId: string, token: string) {
    const response = await fetch(`${this.baseUrl}/redemptions?user_id=eq.${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch redemptions');
    }
    
    return response.json();
  }

  // RPC Calls
  async addPointTransaction(userId: string, eventTypeId: string, points: number, description: string, token: string) {
    const response = await fetch(`${this.baseUrl}/rpc/add_point_transaction`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        user_id: userId,
        event_type_id: eventTypeId,
        points,
        description
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add point transaction');
    }
    
    return response.json();
  }

  async redeemPrize(userId: string, prizeId: string, token: string) {
    const response = await fetch(`${this.baseUrl}/rpc/redeem_prize`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        user_id: userId,
        prize_id: prizeId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to redeem prize');
    }
    
    return response.json();
  }

  // Ranking
  async getRanking(token?: string) {
    const response = await fetch(`${this.baseUrl}/users?select=id,name,email,points,department,avatar_url,is_admin&order=points.desc`, {
      headers: this.getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch ranking');
    }
    
    return response.json();
  }
}

export const supabaseAPI = new SupabaseAPI();