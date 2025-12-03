# Supabase Email Verification Setup

## Important: Configure Redirect URLs in Supabase

To make email verification work correctly, you need to add the following URLs to your Supabase project settings:

### Steps:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `kpdwzbxanqrslupyslkw`

2. **Navigate to Authentication Settings:**
   - Click on **Authentication** (left sidebar)
   - Click on **URL Configuration**

3. **Add Redirect URLs:**
   
   Add the following URLs to the **"Redirect URLs"** list:
   
   ```
   https://genesis-production-6396.up.railway.app/auth/callback
   https://next-web3-platform.preview.emergentagent.com/auth/callback
   http://localhost:3000/auth/callback
   ```

4. **Save Changes**

### What This Does:

- When users click the verification link in their email, Supabase will redirect them to `/auth/callback`
- The callback route exchanges the verification code for a session
- Users are then redirected back to the homepage with a success message
- They can now log in with their verified account

### Test the Flow:

1. Register a new account
2. Check your email for verification link
3. Click the link
4. You should be redirected back to the app with a "Email Verified Successfully!" message
5. Log in with your credentials

---

## Current Configuration:

- **Supabase URL:** https://kpdwzbxanqrslupyslkw.supabase.co
- **Production URL:** https://genesis-production-6396.up.railway.app
- **Preview URL:** https://next-web3-platform.preview.emergentagent.com
- **Callback Route:** `/auth/callback`
