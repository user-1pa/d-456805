import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { resetPassword, updatePassword } from '@/lib/api/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // For the request password reset form
  const [email, setEmail] = useState('');
  
  // For the set new password form
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Determine if this is a password reset request or setting a new password
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);

  useEffect(() => {
    // Check if we are in the reset password flow
    const checkHashParams = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('type=recovery')) {
        // We are in the password reset flow
        setIsSettingNewPassword(true);
        
        // If there's a hash, extract the access token
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setError('Invalid or expired recovery link. Please try again.');
          }
          
          if (!data.session) {
            setError('No valid session found. The recovery link may have expired.');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred');
        }
      }
    };
    
    checkHashParams();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError);
      } else {
        setSuccessMessage(
          'Password reset instructions have been sent to your email address. Please check your inbox.'
        );
        setEmail('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    if (!password) {
      setError('Please enter a new password');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        setError(updateError);
      } else {
        setSuccessMessage('Your password has been successfully updated.');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-brand-accent p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">
              {isSettingNewPassword ? 'Set New Password' : 'Reset Password'}
            </h1>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-6 bg-green-700 text-white border-green-600">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            
            {!isSettingNewPassword ? (
              // Request password reset form
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-mint hover:bg-mint/90 text-forest"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-mint hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              // Set new password form
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-mint hover:bg-mint/90 text-forest"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
