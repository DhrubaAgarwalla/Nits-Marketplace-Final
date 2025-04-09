# Fixing Authentication Redirect Issues on Vercel Deployment

When deploying your NITS BAZAAR application to Vercel, you may encounter authentication issues where the login process fails after email verification. This happens because Supabase needs to be configured with your production URL as an authorized redirect URL.

## Solution

Follow these steps to fix the authentication redirect issues:

### 1. Get Your Vercel Deployment URL

First, make sure you know your Vercel deployment URL. It should look something like:
- `https://your-project-name.vercel.app`

### 2. Update Supabase Authentication Settings

1. Go to the [Supabase Dashboard](https://app.supabase.io/)
2. Select your project (the one used for NITS BAZAAR)
3. Navigate to **Authentication** > **URL Configuration** in the sidebar
4. Update the following settings:

#### Site URL
- Set the Site URL to your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`)

#### Redirect URLs
- Add your Vercel callback URL: `https://your-project-name.vercel.app/auth/callback`
- Keep the existing localhost URL: `http://localhost:3000/auth/callback`

Your redirect URLs should look something like this:
```
http://localhost:3000/auth/callback
https://your-project-name.vercel.app/auth/callback
```

5. Click **Save** to apply the changes

### 3. Verify the Configuration

1. Go to your Vercel deployment URL
2. Try to sign in with your institute email
3. After receiving the email and clicking the link, you should be properly redirected back to your application

## Troubleshooting

If you're still experiencing issues:

1. **Check Browser Console**: Look for any errors in the browser console that might provide more information
2. **Verify Environment Variables**: Make sure your Vercel deployment has the correct Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Check Supabase Logs**: In the Supabase dashboard, check the authentication logs for any errors
4. **Clear Browser Cache**: Try clearing your browser cache or using an incognito window

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
