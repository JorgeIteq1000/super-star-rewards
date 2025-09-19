import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAPI } from '@/lib/supabase';
import { mockUsers } from '@/data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  points: number;
  avatar_url?: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('supabase_token');
    const savedUser = localStorage.getItem('supabase_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await supabaseAPI.login(email, password);
      const accessToken = authResponse.access_token;
      const userId = authResponse.user.id;
      
      // Get user data
      const userData = await supabaseAPI.getUser(userId, accessToken);
      
      setToken(accessToken);
      setUser(userData);
      
      // Save to localStorage
      localStorage.setItem('supabase_token', accessToken);
      localStorage.setItem('supabase_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('supabase_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('supabase_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}