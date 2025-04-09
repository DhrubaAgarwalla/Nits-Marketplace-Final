'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session from storage
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Email OTP sign in
  const signIn = async (email: string) => {
    // Validate NIT Silchar email
    if (!email.endsWith('nits.ac.in')) {
      throw new Error('Please use your NIT Silchar email address');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      // Determine the correct redirect URL
      // For Vercel, use the NEXT_PUBLIC_SITE_URL environment variable
      // For local development, use window.location.origin
      const isVercel = typeof window !== 'undefined' &&
                      window.location.hostname.includes('vercel.app');

      // Force the Vercel URL if we're on Vercel
      const redirectUrl = isVercel
        ? 'https://nits-marketplace-final.vercel.app/auth/callback'
        : `${window.location.origin}/auth/callback`;

      console.log('Using redirect URL:', redirectUrl);

      // First, attempt to sign in with Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Restrict to NIT Silchar domain
            hd: 'nits.ac.in',
          },
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      // Add a listener for when the user returns from OAuth
      const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        // Check if the user has signed in
        if (event === 'SIGNED_IN' && session?.user) {
          const email = session.user.email;

          // Validate that the email is from NIT Silchar
          if (!email || !email.endsWith('nits.ac.in')) {
            console.error('Non-NIT Silchar email detected:', email);
            // Sign out the user immediately
            await supabase.auth.signOut();
            // Show error message
            alert('Only NIT Silchar email addresses (.nits.ac.in) are allowed to use this platform.');
          }
        }

        // Remove the listener after it's been triggered
        authListener.data.subscription.unsubscribe();
      });
    } catch (err) {
      console.error('Error in Google sign in:', err);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
