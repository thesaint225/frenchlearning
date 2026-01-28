Sign In and Sign Up Pages Implementation
Implement a complete authentication system with separate signup flows for teachers and students, unified sign-in, password reset, and OAuth support.

Architecture Overview
The authentication flow will use Supabase Auth with the following structure:

Unified sign-in page (/auth/signin) - works for both teachers and students
Separate signup pages (/auth/signup/teacher, /auth/signup/student)
Password reset flow (/auth/reset-password, /auth/reset-password/confirm)
User role stored in Supabase user metadata or a separate profiles table
Protected routes with authentication middleware
Database Schema
Profiles Table (to store user role and additional info):

id (uuid, references auth.users)
email (text)
role (text: 'teacher' | 'student')
full_name (text, nullable)
created_at (timestamptz)
updated_at (timestamptz)
File Structure
app/
auth/
signin/
page.tsx # Unified sign-in page
signup/
teacher/
page.tsx # Teacher signup page
student/
page.tsx # Student signup page
reset-password/
page.tsx # Request password reset
confirm/
page.tsx # Confirm password reset with token
callback/
route.ts # OAuth callback handler
lib/
auth/
actions.ts # Server actions for auth operations
middleware.ts # Auth middleware for protected routes
schemas.ts # Zod schemas for auth forms
supabase/
client.ts # (already exists)
server.ts # (already exists)
components/
auth/
SignInForm.tsx # Sign-in form component
SignUpForm.tsx # Reusable signup form component
OAuthButton.tsx # OAuth provider buttons
PasswordResetForm.tsx # Password reset request form
PasswordResetConfirmForm.tsx # Password reset confirmation form
Implementation Details

1. Database Setup
   Create profiles table in Supabase with RLS policies
   Set up trigger to automatically create profile on user signup
   Configure OAuth providers in Supabase dashboard (Google)
2. Authentication Pages
   Sign In Page (app/auth/signin/page.tsx):

Email/password form
OAuth buttons (Google)
Link to signup pages (separate links for teacher/student)
Link to password reset
Redirect to appropriate dashboard based on user role after login
Teacher Signup Page (app/auth/signup/teacher/page.tsx):

Email, password, confirm password, full name fields
OAuth signup option
Create user with role='teacher' in profile
Redirect to teacher dashboard after signup
Student Signup Page (app/auth/signup/student/page.tsx):

Email, password, confirm password, full name fields
OAuth signup option
Create user with role='student' in profile
Redirect to student dashboard after signup
Password Reset Pages:

Request page: email input to send reset link
Confirm page: new password form (accessed via email link) 3. Server Actions (lib/auth/actions.ts)
Functions:

signIn(email, password) - Sign in with email/password
signUp(email, password, fullName, role) - Sign up new user
signInWithOAuth(provider, role) - OAuth sign in/signup
resetPassword(email) - Send password reset email
confirmPasswordReset(token, newPassword) - Confirm password reset
signOut() - Sign out current user
getUserRole() - Get current user's role 4. Authentication Middleware
Update app/page.tsx to check authentication:

If not authenticated → redirect to /auth/signin
If authenticated → redirect based on role (/teacher or /student)
Create middleware for protected routes:

Check authentication status
Verify user role matches route (teacher routes require teacher role)
Redirect unauthorized users 5. UI Components
SignInForm:

Email and password inputs
Submit button
Error message display
Loading states
SignUpForm (reusable):

Email, password, confirm password, full name inputs
Role selection (if needed) or passed as prop
Validation with Zod
Error handling
OAuthButton:

Button for each OAuth provider
Handles OAuth flow initiation
Stores role preference in session/localStorage 6. Validation Schemas (lib/auth/schemas.ts)
Zod schemas for:

Sign in form (email, password)
Sign up form (email, password, confirmPassword, fullName)
Password reset request (email)
Password reset confirm (token, newPassword) 7. Layout Updates
Update app/teacher/layout.tsx and app/student/layout.tsx:

Add authentication check
Redirect to sign-in if not authenticated
Add sign-out button in header
Display user name/email
OAuth Flow
User clicks OAuth button (Google)
Redirect to Supabase OAuth provider
After authentication, redirect to /auth/callback
Callback route creates/updates user profile with role
Redirect to appropriate dashboard
Security Considerations
Password validation (min length, complexity)
CSRF protection via Supabase
RLS policies on profiles table
Secure session management via Supabase
Rate limiting on auth endpoints (handled by Supabase)
User Experience
Clear error messages for failed authentication
Loading states during auth operations
Smooth redirects after authentication
Remember role preference for OAuth flows
Responsive design matching existing app style
Integration Points
Update existing pages that use placeholder user IDs to use authenticated user
Add logout functionality to navigation components
Update services to use authenticated user ID from Supabase session
