import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { mockUsers } from '@/data/mockData';

interface UserProfile {
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
  userProfile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserProfile: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile from our users table with a small delay to avoid deadlock
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.log('Profile fetch error:', error);
            }
          }, 100);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for existing session
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.log('Profile fetch error:', error);
          }
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check demo credentials first
      if (email === 'user@gamework.com' && password === 'password123') {
        const mockUser = mockUsers.find(u => !u.is_admin) || mockUsers[0];
        setUserProfile(mockUser);
        setLoading(false);
        return;
      }
      
      if (email === 'admin@gamework.com' && password === 'admin123') {
        const mockAdmin = mockUsers.find(u => u.is_admin) || mockUsers[3];
        setUserProfile(mockAdmin);
        setLoading(false);
        return;
      }

      // Try real Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
      
      // User profile will be set by the auth state change listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setSession(null);
  };

  const updateUserProfile = (userData: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...userData };
      setUserProfile(updatedProfile);
    }
  };

  const value = {
    user,
    userProfile,
    session,
    login,
    logout,
    loading,
    updateUserProfile
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