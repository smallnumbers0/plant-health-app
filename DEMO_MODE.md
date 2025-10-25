# 🚀 Demo Mode - Quick Testing Guide

## Instant Testing Without Setup

Demo Mode lets you test the app immediately without creating an account or setting up Supabase.

## How to Use Demo Mode

### Step 1: Make Sure Supabase is Set Up

You still need to run the database schema in Supabase (one-time setup):

1. Go to: https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/sql/new
2. Copy the contents of `supabase-schema.sql`
3. Paste and click **Run**

### Step 2: Start the App

```bash
npm run dev
```

### Step 3: Click Demo Mode

1. Open http://localhost:5173
2. Click the **"🚀 Demo Mode (Test Without Account)"** button
3. You're in! No email, no password needed.

## What Demo Mode Does

- ✅ Automatically creates a demo account (if needed)
- ✅ Logs you in instantly
- ✅ Full access to all features
- ✅ Same experience as a real user
- ✅ Data persists between sessions

## Demo Account Details

If you want to manually log in later:

- **Email:** `demo@example.com`
- **Password:** `demo123456`

## Try It Out

Once logged in with Demo Mode, you can:

1. **Upload a plant image** - Click "Add Plant"
2. **See AI diagnosis** - View plant name, issues, and recommendations
3. **Track treatments** - Mark treatment steps as complete
4. **View dashboard** - See all your uploaded plants

## When to Use Demo Mode

- ✅ **Quick testing** - Just want to see how the app works
- ✅ **Development** - Testing features without creating test accounts
- ✅ **Demos** - Showing the app to someone
- ✅ **First time setup** - Get familiar with the app before creating your own account

## When to Create Your Own Account

- Use real sign up when you want to:
  - Keep your own plant history separate
  - Have a personalized account
  - Deploy the app for real users

## Disable Email Confirmation (Optional)

For even faster testing, disable email confirmation in Supabase:

1. Go to: https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/auth/providers
2. Scroll to **"Email Auth"**
3. Toggle **OFF** "Confirm email"
4. Click **Save**

Now all sign-ups are instant (no email verification needed).

## Technical Details

Demo Mode:
- Uses a shared demo account: `demo@example.com`
- Automatically creates the account on first use
- Stores data in your Supabase database
- Works exactly like a normal account
- Can be reset by deleting the user in Supabase dashboard

## Reset Demo Account

To start fresh:

1. Go to: https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/auth/users
2. Find `demo@example.com`
3. Click delete
4. Next time you use Demo Mode, it will create a fresh account

That's it! Demo Mode makes testing super easy. 🌱
