# 🌱 START HERE - Plant Health App

## Quick Start (3 Steps)

### 1️⃣ Set Up Database (One-Time, 2 minutes)

Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/sql/new):

1. Copy ALL contents from `supabase-schema.sql`
2. Paste into SQL Editor
3. Click **Run**

Then create storage bucket:
1. Go to [Storage](https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/storage/buckets)
2. Click **New bucket** → Name: `plant-images` → Public: ON → Save

### 2️⃣ Start the App

```bash
npm run dev
```

### 3️⃣ Test It!

Open http://localhost:5173 and click:

**🚀 Demo Mode (Test Without Account)**

That's it! You're now in the app with a test account.

## What You Can Do Now

- 📸 **Upload plant images** - Click "Add Plant"
- 🤖 **See AI diagnosis** - View plant health analysis
- ✅ **Track treatments** - Mark steps as complete
- 📊 **View dashboard** - See all your plants

## Next Steps (Optional)

### Deploy Cloudflare Worker (Optional)

Currently using your already-deployed worker at:
`https://plant-health-ai-worker.jchoi53.workers.dev`

If you want to redeploy or update it:
```bash
npm run worker:deploy
```

### Create Your Own Account

Click "Sign Up" instead of Demo Mode to create a personal account.

### Deploy to Production

See `README.md` for Vercel/Netlify deployment instructions.

## Files & Documentation

- 📘 **START_HERE.md** ← You are here
- 🚀 **DEMO_MODE.md** - Demo mode details
- 📋 **SETUP_CHECKLIST.md** - Detailed setup steps
- ⚡ **QUICK_START.md** - Quick reference
- 📖 **README.md** - Full documentation
- ☁️ **DEPLOY_WORKER.md** - Cloudflare Worker guide

## Troubleshooting

**App won't start?**
```bash
npm install
npm run dev
```

**Demo mode fails?**
- Make sure you ran `supabase-schema.sql` in Supabase
- Check Supabase project is active

**Need help?**
Check the documentation files above or the Supabase dashboard.

---

## Your Configuration

✅ Supabase URL: `https://uztehmamkyawmbghtncz.supabase.co`
✅ Worker URL: `https://plant-health-ai-worker.jchoi53.workers.dev`
✅ Environment: Configured in `.env`

Everything is ready! Just run the 3 steps above. 🎉
