# Google OAuth Setup Guide

This guide will walk you through configuring Google OAuth authentication in your Supabase project.

## Prerequisites

- A Supabase project (already set up)
- A Google Cloud account
- Access to Google Cloud Console

## Step 1: Create OAuth Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. **Create or Select a Project:**
   - If you don't have a project, click "Create Project"
   - Enter a project name (e.g., "Learn French App")
   - Click "Create"
   - Wait for the project to be created, then select it

3. **Enable Required APIs:**
   - In the left sidebar, go to **APIs & Services** → **Library**
   - Search for "Google+ API" (or "People API" for newer implementations)
   - Click on it and click **Enable**

4. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** at the top
   - Select **OAuth client ID**

5. **Configure OAuth Consent Screen (if prompted):**
   - If this is your first time, you'll need to configure the consent screen
   - Choose **External** (unless you have a Google Workspace account)
   - Fill in the required information:
     - App name: "Learn French" (or your app name)
     - User support email: Your email
     - Developer contact information: Your email
   - Click **Save and Continue**
   - On the Scopes page, click **Save and Continue** (default scopes are fine)
   - On the Test users page, you can add test users or skip for now
   - Click **Back to Dashboard**

6. **Create OAuth Client ID:**
   - Application type: Select **Web application**
   - Name: "Learn French Web Client" (or any name you prefer)
   - **Authorized redirect URIs:** Add the following:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     - To find your project reference:
       - Go to your Supabase project dashboard
       - Look at the URL: `https://app.supabase.com/project/<project-ref>`
       - Or go to **Settings** → **API** and check the Project URL
       - Example: If your Project URL is `https://abcdefghijklmnop.supabase.co`, then your redirect URI is:
         ```
         https://abcdefghijklmnop.supabase.co/auth/v1/callback
         ```
   - Click **Create**

7. **Copy Your Credentials:**
   - A popup will appear with your **Client ID** and **Client Secret**
   - **Important:** Copy both values immediately - you won't be able to see the Client Secret again
   - If you lose the Client Secret, you'll need to create new credentials

## Step 2: Configure Google OAuth in Supabase

1. **Navigate to Authentication Settings:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - In the left sidebar, click **Authentication**
   - Click **Providers** in the submenu

2. **Enable Google Provider:**
   - Find **Google** in the list of providers
   - Click the toggle to **Enable** it (or click on Google to open settings)

3. **Enter OAuth Credentials:**
   - **Client ID (for OAuth):** Paste your Google OAuth Client ID
   - **Client Secret (for OAuth):** Paste your Google OAuth Client Secret
   - Click **Save**

4. **Verify Configuration:**
   - The Google provider should now show as **Enabled**
   - You can test it by attempting to sign in with Google in your application

## Step 3: Configure OAuth Scopes (Optional)

By default, Supabase requests the following scopes from Google:
- `openid`
- `email`
- `profile`

These are sufficient for basic authentication. If you need additional scopes, you can configure them in the Supabase dashboard under the Google provider settings.

## Step 4: Test OAuth Authentication

1. **In Your Application:**
   - Navigate to your sign-in page
   - Click the "Sign in with Google" button
   - You should be redirected to Google's consent screen
   - After authorizing, you'll be redirected back to your app
   - A profile should be automatically created in the `profiles` table

2. **Verify Profile Creation:**
   - Go to Supabase dashboard → **Table Editor** → `profiles`
   - You should see a new profile entry with:
     - `id`: The user's UUID from `auth.users`
     - `email`: The user's Google email
     - `role`: Defaults to 'student' (unless specified in user metadata)
     - `full_name`: Extracted from Google profile (if available)

## Troubleshooting

### "Redirect URI mismatch" Error

- **Problem:** Google shows an error about redirect URI not matching
- **Solution:** 
  - Double-check the redirect URI in Google Cloud Console
  - Make sure it exactly matches: `https://<your-project-ref>.supabase.co/auth/v1/callback`
  - The URI is case-sensitive and must include `https://`

### "Invalid client" Error

- **Problem:** Supabase shows "Invalid client" error
- **Solution:**
  - Verify your Client ID and Client Secret are correct
  - Make sure there are no extra spaces when copying
  - Regenerate credentials in Google Cloud Console if needed

### Profile Not Created After OAuth Sign-in

- **Problem:** User signs in but no profile is created
- **Solution:**
  - Check that the trigger `on_auth_user_created` exists in your database
  - Verify the trigger function `handle_new_user()` is working
  - Check Supabase logs for any errors
  - Ensure RLS policies allow the trigger to insert (the function uses `SECURITY DEFINER`)

### OAuth Button Not Appearing

- **Problem:** Google OAuth option doesn't show in your app
- **Solution:**
  - Verify Google provider is enabled in Supabase dashboard
  - Check your application code is correctly calling Supabase OAuth methods
  - Ensure you're using the correct Supabase client configuration

## Security Best Practices

1. **Keep Credentials Secure:**
   - Never commit OAuth credentials to version control
   - Use environment variables if storing credentials in your codebase
   - Rotate credentials if they're accidentally exposed

2. **Restrict Redirect URIs:**
   - Only add the Supabase callback URL in Google Cloud Console
   - Don't add localhost URLs in production

3. **Monitor OAuth Usage:**
   - Regularly check Google Cloud Console for unusual activity
   - Review Supabase authentication logs

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Providers Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Next Steps

After configuring Google OAuth:

1. Update your sign-in/sign-up pages to include Google OAuth buttons
2. Handle OAuth callbacks in your application
3. Test the complete authentication flow
4. Consider adding role selection for OAuth signups (teacher vs student)
