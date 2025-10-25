# Quick Start Guide

This guide will help you get the Plant Health Diagnostic app up and running quickly.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- A Supabase account (sign up at https://supabase.com)
- A Cloudflare account (sign up at https://cloudflare.com)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details and create

### 2.2 Get Your Credentials

1. Go to Settings > API
2. Copy your Project URL and anon/public key

### 2.3 Run the Database Schema

1. Go to the SQL Editor in Supabase
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run"

### 2.4 Create Storage Bucket

1. Go to Storage in Supabase
2. Click "New bucket"
3. Name it: `plant-images`
4. Make it public
5. Set allowed MIME types: `image/jpeg, image/png, image/webp`
6. Set max file size: 5MB

## Step 3: Deploy Cloudflare Worker

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker (from project root)
wrangler deploy

# Note the deployed URL (e.g., https://plant-health-ai-worker.yourname.workers.dev)
```

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_AI_WORKER_URL=https://your-worker.yourname.workers.dev
```

Replace the values with:
- Your Supabase URL from Step 2.2
- Your Supabase anon key from Step 2.2
- Your Cloudflare Worker URL from Step 3

## Step 5: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 6: Test the App

1. **Sign Up**: Create a new account with email and password
2. **Upload**: Click "Add Plant" and upload a plant image
3. **View**: See the AI diagnosis results and treatment timeline
4. **Track**: Mark treatment steps as completed

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add your environment variables
6. Click "Deploy"

### Deploy Frontend to Netlify

1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add your environment variables in Site settings > Environment variables
7. Click "Deploy site"

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check that Node.js version is 18 or higher: `node --version`

### Can't connect to Supabase
- Verify your `.env` file has the correct credentials
- Check that the Supabase project is active
- Make sure you ran the SQL schema from `supabase-schema.sql`

### Images won't upload
- Verify the `plant-images` storage bucket exists in Supabase
- Check that the bucket is public
- Ensure allowed MIME types are set correctly

### AI diagnosis not working
- Verify the Cloudflare Worker is deployed and running
- Check that `VITE_AI_WORKER_URL` in `.env` is correct
- Try visiting the worker URL directly to test if it's responding

## Next Steps

- Read the full README.md for more details
- Customize the AI model integration in `cloudflare-worker.js`
- Add your own styling modifications
- Explore the codebase and add new features!

## Support

For issues and questions:
- Check the README.md file
- Review the Supabase docs: https://supabase.com/docs
- Review the Cloudflare Workers docs: https://developers.cloudflare.com/workers
