'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type OAuthProvider = 'google' | 'github' | 'facebook';

interface OAuthButtonProps {
  provider: OAuthProvider;
  role?: 'teacher' | 'student';
  onClick?: () => void;
  variant?: ButtonProps['variant'];
  className?: string;
}

const providerConfig: Record<
  OAuthProvider,
  { label: string; icon?: React.ReactNode }
> = {
  google: {
    label: 'Continue with Google',
  },
  github: {
    label: 'Continue with GitHub',
  },
  facebook: {
    label: 'Continue with Facebook',
  },
};

export function OAuthButton({
  provider,
  role,
  onClick,
  variant = 'outline',
  className,
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      onClick();
    }

    // Store role preference: cookie (for server callback) and URL (in case redirect preserves it)
    if (role && typeof document !== 'undefined') {
      document.cookie = `oauth_role_preference=${role}; path=/; max-age=600; samesite=lax`;
      localStorage.setItem('oauth_role_preference', role);
    }

    setIsLoading(true);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = role
        ? `${origin}/auth/callback?role=${role}`
        : `${origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        setIsLoading(false);
        // Error will be handled by Supabase redirect or can be shown via toast
      }
      // If successful, user will be redirected to OAuth provider
      // and then back to /auth/callback
    } catch (err) {
      console.error('OAuth initiation error:', err);
      setIsLoading(false);
    }
  };

  const config = providerConfig[provider];

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
      className={cn('w-full', className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        config.label
      )}
    </Button>
  );
}
