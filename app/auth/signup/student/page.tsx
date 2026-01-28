'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { OAuthButton } from '@/components/auth/OAuthButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';

export default function StudentSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'teacher' | 'student'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'student',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Account creation failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Profile should be created automatically by database trigger
      // But we'll verify and create if needed
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: authData.user.email!,
          role: 'student',
          full_name: fullName,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Profile might already exist from trigger, continue anyway
      }

      // Check if email confirmation is required
      if (authData.session) {
        // User is automatically signed in, redirect to dashboard
        router.push('/student');
      } else {
        // Email confirmation required
        router.push('/auth/signin?message=Please check your email to confirm your account');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Student Account</CardTitle>
          <CardDescription>
            Sign up to start learning French and join classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm
            role="student"
            onSubmit={handleSignUp}
            isLoading={isLoading}
            error={error}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <OAuthButton provider="google" role="student" variant="outline" />

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
