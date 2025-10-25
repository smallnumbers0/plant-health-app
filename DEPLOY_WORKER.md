# 🚀 Deploy Cloudflare Worker - Quick Guide

## Simple 3-Step Process

### Step 1: Login to Cloudflare
```bash
npm run worker:login
```
This opens your browser. Log in with your Cloudflare account (or create one if you don't have it).

### Step 2: Deploy the Worker
```bash
npm run worker:deploy
```
This uploads your worker to Cloudflare. You'll see output like:
```
Published plant-health-ai-worker (0.50 sec)
  https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev
```

### Step 3: Update Your .env File

Copy the URL from Step 2 and update your `.env` file:

```env
VITE_AI_WORKER_URL=https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev
```

Then restart your dev server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## That's It! 🎉

Your worker is now live. You can stop the local AI server (`npm run ai-server`) - you don't need it anymore!

## Useful Commands

```bash
npm run worker:login    # Login to Cloudflare
npm run worker:deploy   # Deploy/update worker
npm run worker:logs     # View real-time logs
npm run worker:delete   # Delete the worker
```

## Test Your Worker

Test it with curl:
```bash
curl -X POST https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"test.jpg"}'
```

Or just upload a plant image in your app - it should work automatically!

## Need More Details?

See `CLOUDFLARE_WORKER_SETUP.md` for the full guide with troubleshooting, AI integration options, and more.

## Free Tier Limits

Cloudflare Workers Free Tier includes:
- ✅ 100,000 requests/day (plenty for testing and small projects)
- ✅ No credit card required
- ✅ Global edge network (fast worldwide)

Perfect for this app! 🌱
