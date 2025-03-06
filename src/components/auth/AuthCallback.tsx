import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash (fragment)
        const hash = window.location.hash;
        
        // If there's a hash, process it
        if (hash) {
          // The supabase client will automatically handle the hash and set the session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }

          if (data.session) {
            // Successfully authenticated, redirect to home or previous page
            navigate('/');
          } else {
            throw new Error('No session found after authentication');
          }
        } else {
          // No hash, might be an error or direct access
          throw new Error('No authentication data found');
        }
      } catch (err: any) {
        console.error('Error processing authentication callback:', err);
        setError(err.message || 'An error occurred during authentication');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-xl font-bold text-red-500 mb-4">Authentication Error</div>
            <div className="text-text-muted mb-4">{error}</div>
            <div>Redirecting to login page...</div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-bold mb-2">Completing Authentication</div>
            <div className="text-text-muted">Please wait while we log you in...</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
