import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type AuthSession = {
  user: {
    id: string;
    email: string;
  } | null;
  session: any | null;
};

// Sign up a new user with email and password
export const signUp = async (
  email: string,
  password: string,
  fullName: string,
): Promise<{ error: string | null; session: AuthSession | null }> => {
  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    // If the sign-up is successful but requires email confirmation
    if (authData.user && authData.user.identities?.length === 0) {
      return {
        error: 'A user with this email already exists.',
        session: null,
      };
    }

    // If email confirmation is required
    if (authData.user && !authData.session) {
      return {
        error: null,
        session: {
          user: null,
          session: null,
        },
      };
    }

    // Create the user profile in the profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
        });

      if (profileError) {
        throw profileError;
      }
    }

    return {
      error: null,
      session: {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email as string,
        } : null,
        session: authData.session,
      },
    };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return {
      error: error.message || 'An error occurred during signup.',
      session: null,
    };
  }
};

// Sign in a user with email and password
export const signIn = async (
  email: string,
  password: string,
): Promise<{ error: string | null; session: AuthSession | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      error: null,
      session: {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email as string,
        } : null,
        session: data.session,
      },
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return {
      error: error.message || 'An error occurred during signin.',
      session: null,
    };
  }
};

// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return { error: error.message || 'An error occurred during Google signin.' };
  }
};

// Sign out a user
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { error: error.message || 'An error occurred during signout.' };
  }
};

// Get the current user session
export const getSession = async (): Promise<AuthSession> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return {
      user: data.session?.user ? {
        id: data.session.user.id,
        email: data.session.user.email as string,
      } : null,
      session: data.session,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return { user: null, session: null };
  }
};

// Get the current user's profile
export const getProfile = async (): Promise<{ profile: Profile | null; error: string | null }> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { profile: null, error: 'No active session.' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Error getting profile:', error);
    return { profile: null, error: error.message || 'An error occurred while fetching the profile.' };
  }
};

// Update the current user's profile
export const updateProfile = async (
  updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>>
): Promise<{ profile: Profile | null; error: string | null }> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      return { profile: null, error: 'No active session.' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', sessionData.session.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { profile: null, error: error.message || 'An error occurred while updating the profile.' };
  }
};

// Reset password (send reset email)
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    console.error('Error sending reset password email:', error);
    return { error: error.message || 'An error occurred while sending the reset password email.' };
  }
};

// Update password
export const updatePassword = async (password: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return { error: error.message || 'An error occurred while updating the password.' };
  }
};

// Listen for auth changes
export const onAuthStateChange = (callback: (session: AuthSession) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    callback({
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email as string,
      } : null,
      session,
    });
  });
};
