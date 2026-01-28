import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rolePreference = requestUrl.searchParams.get('role') as 'teacher' | 'student' | null;

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=Authentication failed', requestUrl.origin)
      );
    }

    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Check if this is a new user (OAuth signup)
    if (!profile) {
      // Use role preference from URL, or default to student
      const userRole = rolePreference || 'student';
      
      // Create profile with role preference
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
        // Still redirect even if profile creation fails
      }

      // Redirect based on role
      if (userRole === 'teacher') {
        return NextResponse.redirect(new URL('/teacher', requestUrl.origin));
      } else {
        return NextResponse.redirect(new URL('/student', requestUrl.origin));
      }
    }

    // Existing user - redirect based on their profile role
    const userRole = profile.role;
    if (userRole === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', requestUrl.origin));
    } else {
      return NextResponse.redirect(new URL('/student', requestUrl.origin));
    }
  }

  // No code parameter, redirect to sign in
  return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
}
