import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AuthSession, 
  Profile, 
  getSession, 
  getProfile, 
  signIn, 
  signUp, 
  signOut, 
  signInWithGoogle, 
  onAuthStateChange 
} from '@/lib/api/auth';

interface AuthContextType {
  user: AuthSession['user'];
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthSession['user']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!user;

  // Function to refresh the user's profile
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      try {
        const { profile: userProfile, error: profileError } = await getProfile();
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError(profileError);
        } else {
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
        setError('An unexpected error occurred fetching your profile.');
      }
    } else {
      setProfile(null);
    }
  };

  // Load the initial session and profile
  useEffect(() => {
    const loadUserSession = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        setUser(session.user);
        if (session.user) {
          await refreshProfile();
        }
      } catch (err) {
        console.error('Error loading user session:', err);
        setError('Failed to load user session.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    const { data: authSubscription } = onAuthStateChange(async (session) => {
      setUser(session.user);
      if (session.user) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      // Cleanup subscription when component unmounts
      if (authSubscription && authSubscription.unsubscribe) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Sign in handler
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError, session } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
        return { error: signInError };
      }
      
      setUser(session?.user || null);
      if (session?.user) {
        await refreshProfile();
      }
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign in.';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up handler
  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signUpError, session } = await signUp(email, password, fullName);
      if (signUpError) {
        setError(signUpError);
        return { error: signUpError };
      }
      
      setUser(session?.user || null);
      if (session?.user) {
        await refreshProfile();
      }
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign up.';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await signOut();
      if (signOutError) {
        setError(signOutError);
        return { error: signOutError };
      }
      
      setUser(null);
      setProfile(null);
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign out.';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google handler
  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: googleSignInError } = await signInWithGoogle();
      if (googleSignInError) {
        setError(googleSignInError);
        return { error: googleSignInError };
      }
      
      // Note: The actual auth state change will be handled by the onAuthStateChange subscription
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during Google sign in.';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
