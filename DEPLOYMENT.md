# 🚀 Vercel Deployment Guide

Deploy your PlantCare AI app to Vercel in minutes!

## Prerequisites

- GitHub account (to connect your repository)
- Vercel account (free at https://vercel.com)
- Your Cloudflare Worker already deployed
- Supabase project set up

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - PlantCare AI app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/plant-health-app.git
git branch -M main
git push -u origin main
```

## Step 2: Import Project to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `plant-health-app` repository
5. Vercel will auto-detect it's a Vite project ✅

## Step 3: Configure Environment Variables

Before deploying, add these environment variables in Vercel:

Click **"Environment Variables"** and add:

### Required Variables:

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `VITE_SUPABASE_URL` | `https://gfnzcfwjntaewjqkibga.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase anon key |
| `VITE_AI_WORKER_URL` | `https://plant-health-ai-worker.jchoi53.workers.dev` | Your Cloudflare Worker URL |

**Important:** Make sure to set these for **Production**, **Preview**, and **Development** environments.

## Step 4: Deploy Settings

Vercel should auto-detect these settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

If not, set them manually.

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. 🎉 Your app is live!

You'll get a URL like: `https://plant-health-app-xyz.vercel.app`

## Step 6: Set Up Custom Domain (Optional)

1. Go to your project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Post-Deployment Checklist

✅ Test the deployed app thoroughly:
- [ ] Authentication works (Sign up/Sign in)
- [ ] Demo mode works
- [ ] Image upload works
- [ ] AI diagnosis works (check Cloudflare Worker is accessible)
- [ ] Plant detail pages load correctly
- [ ] Dashboard shows plants
- [ ] Delete functionality works

## Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency errors
**Solution:** Make sure all dependencies are in `package.json`
```bash
npm install
```

### Environment Variables Not Working

**Error:** API calls fail or show undefined
**Solution:**
1. Make sure variable names start with `VITE_`
2. Redeploy after adding environment variables
3. Check Vercel deployment logs

### CORS Errors

**Error:** Blocked by CORS policy
**Solution:** Your Cloudflare Worker already has CORS headers. Make sure the worker URL is correct.

### Supabase Connection Issues

**Error:** Can't connect to Supabase
**Solution:**
1. Verify your Supabase URL and anon key
2. Check Supabase project is not paused
3. Verify RLS policies are disabled (from earlier setup)

## Updating Your Deployment

Every time you push to GitHub, Vercel will automatically redeploy:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will:
1. Detect the push
2. Build your app
3. Deploy automatically
4. Give you a preview URL

## Environment Variables Reference

Your `.env` file (for local development):
```env
VITE_SUPABASE_URL=https://gfnzcfwjntaewjqkibga.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbnpjZndqbnRhZXdqcWtpYmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzYwNDIsImV4cCI6MjA3NjkxMjA0Mn0.3JuK3jYxV4QKEBJYXx2tRMO01fG-3cTRAill079i0bM
VITE_AI_WORKER_URL=https://plant-health-ai-worker.jchoi53.workers.dev
```

**Note:** Never commit `.env` files to Git! They're in `.gitignore`.

## Performance Optimization

Your app is already optimized with:
- ✅ Static asset caching (1 year)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized images
- ✅ CSS minification
- ✅ Tree shaking

## Monitoring

After deployment, monitor your app:

1. **Vercel Analytics** - Built-in performance monitoring
2. **Supabase Dashboard** - Database usage and API calls
3. **Cloudflare Dashboard** - Worker requests and performance
4. **OpenAI Dashboard** - API usage and costs

## Cost Breakdown

### Free Tier Limits:
- **Vercel:** Unlimited bandwidth, 100GB bandwidth per month
- **Supabase:** 500MB database, 2GB bandwidth
- **Cloudflare Workers:** 100,000 requests/day
- **OpenAI:** Pay per use (~$0.01/image)

Your app should run on free tiers for personal use!

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **Supabase Docs:** https://supabase.com/docs

---

**Pro Tip:** Set up preview deployments for each branch to test changes before going to production! 🚀
