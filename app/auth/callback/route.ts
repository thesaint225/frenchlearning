import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function redirectWithCookieClear(url: URL): NextResponse {
  const res = NextResponse.redirect(url);
  res.cookies.set('oauth_role_preference', '', { path: '/', maxAge: 0 });
  return res;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const roleFromUrl = requestUrl.searchParams.get('role') as 'teacher' | 'student' | null;
  const roleFromCookie = request.cookies.get('oauth_role_preference')?.value as 'teacher' | 'student' | undefined;
  const rolePreference = roleFromUrl ?? (roleFromCookie === 'teacher' || roleFromCookie === 'student' ? roleFromCookie : null);

  if (code) {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth callback error:', error);
      return redirectWithCookieClear(
        new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return redirectWithCookieClear(
        new URL('/auth/signin?error=Authentication failed', requestUrl.origin)
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      const userRole = rolePreference || 'student';

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          role: userRole,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      if (userRole === 'teacher') {
        return redirectWithCookieClear(new URL('/teacher', requestUrl.origin));
      }
      return redirectWithCookieClear(new URL('/student', requestUrl.origin));
    }

    const userRole = profile.role;
    if (userRole === 'teacher') {
      return redirectWithCookieClear(new URL('/teacher', requestUrl.origin));
    }
    return redirectWithCookieClear(new URL('/student', requestUrl.origin));
  }

  return redirectWithCookieClear(new URL('/auth/signin', requestUrl.origin));
}
