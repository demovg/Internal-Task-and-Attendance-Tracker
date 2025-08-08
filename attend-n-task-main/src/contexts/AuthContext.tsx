import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { User, AuthContext as AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define profile type manually since types aren't generated yet
interface Profile {
  id: string;
  display_name: string | null;
  role: string | null;
  department: string | null;
  position: string | null;
  avatar_url: string | null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // For now, create a basic user object until database migration is run
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '',
            role: (session.user.user_metadata?.role as 'admin' | 'user') || 'user',
            department: session.user.user_metadata?.department,
            position: session.user.user_metadata?.position
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The auth state change listener will handle setting the user
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: userData.name,
          department: userData.department,
          position: userData.position,
          role: userData.role
        }
      }
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    // Wait a bit for the user to be created, then create sample tasks
    setTimeout(async () => {
      try {
        // Get the current user after signup
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Call the function to create sample tasks
          await supabase.rpc('create_sample_tasks_for_user', { user_id: user.id });
        }
      } catch (error) {
        console.error('Error creating sample tasks:', error);
      }
    }, 2000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};