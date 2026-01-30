'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/SignInForm';
import { OAuthButton } from '@/components/auth/OAuthButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams.get('message');
    const err = searchParams.get('error');
    if (msg) setMessage(decodeURIComponent(msg));
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Failed to sign in. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError('Sign in failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Get user role from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Still redirect, but default to student if profile not found
        router.push('/student');
        return;
      }

      // Redirect based on role
      if (profile?.role === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              {message}
            </div>
          )}
          <SignInForm onSubmit={handleSignIn} isLoading={isLoading} error={error} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <OAuthButton provider="google" variant="outline" />

          <div className="text-center text-sm">
            <Link
              href="/auth/reset-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <div className="mt-2 space-x-4">
              <Link
                href="/auth/signup/teacher"
                className="text-primary hover:underline"
              >
                Sign up as Teacher
              </Link>
              <span className="text-muted-foreground">or</span>
              <Link
                href="/auth/signup/student"
                className="text-primary hover:underline"
              >
                Sign up as Student
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
