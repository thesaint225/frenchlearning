# Production Testing Checklist

Use this when testing the app in production (e.g. Vercel, Railway, or any deployed URL).

## 1. Environment variables

Ensure your production env has:

- `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anon/public key

If either is missing, the Create Student Account form will show a clear error (e.g. `Missing NEXT_PUBLIC_SUPABASE_URL environment variable`).

## 2. Supabase Auth URLs (required for sign-up/sign-in)

In [Supabase Dashboard](https://app.supabase.com) → **Authentication** → **URL Configuration**:

- **Site URL**  
  Set to your production URL, e.g. `https://your-app.vercel.app`

- **Redirect URLs**  
  Add your production callback and any other redirect URLs, for example:
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-app.vercel.app/**`  
  (or list each path you use: `/auth/callback`, `/student`, `/teacher`, etc.)

Without these, email/password sign-up and “Continue with Google” can fail or redirect to the wrong place.

## 3. Google OAuth (for “Continue with Google”)

In **Google Cloud Console** → your project → **APIs & Services** → **Credentials** → your OAuth 2.0 Client:

- **Authorized redirect URIs**  
  Must include:  
  `https://<your-project-ref>.supabase.co/auth/v1/callback`  
  (same as local; no change needed if you already use this.)

Your app redirects users to your own `/auth/callback`, which then talks to Supabase. The “Redirect URLs” in step 2 are what must include your production domain.

## 4. Testing the Create Student Account flow

1. Open the production sign-up page (e.g. `/auth/signup/student`).
2. Fill **Full name**, **Email**, **Password** (min 8 chars, upper, lower, number), **Confirm password**.
3. Click **Sign Up**.

If something goes wrong, the form now shows the **real error message** (from Supabase or the app) instead of “An unexpected error occurred,” so you can fix env vars, Supabase URLs, or RLS as needed.

## 5. Common production issues

| Symptom | What to check |
|--------|----------------|
| “Missing NEXT_PUBLIC_SUPABASE_…” | Add/fix those env vars in your hosting provider and redeploy. |
| “Invalid redirect URL” / redirect to wrong place | Add production URL to Supabase **Redirect URLs** and set **Site URL**. |
| “Failed to create account” / Auth errors | Supabase Auth logs (Dashboard → Logs → Auth), and that **Site URL** / **Redirect URLs** match the URL in the browser. |
| Email/password works but Google fails | Confirm Google OAuth client has the Supabase callback URI; confirm Supabase Google provider is enabled and client ID/secret are set. |

After changing Supabase or env settings, try sign-up again and use the displayed error to narrow down the cause.
