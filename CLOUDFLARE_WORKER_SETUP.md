# Cloudflare Worker Setup Guide

This guide will help you deploy your AI diagnosis worker to Cloudflare Workers.

## Prerequisites

- A Cloudflare account (free tier is fine)
- Node.js installed (you already have this)

## Step 1: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for managing Workers.

```bash
npm install -g wrangler
```

Or if you prefer to use it locally in this project:

```bash
npm install wrangler --save-dev
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will:
1. Open your browser
2. Ask you to log in to Cloudflare
3. Authorize Wrangler to access your account

## Step 3: Update wrangler.toml (Optional)

The `wrangler.toml` file is already configured, but you can customize it:

```toml
name = "plant-health-ai-worker"
main = "cloudflare-worker.js"
compatibility_date = "2024-01-01"

# Optional: Add your account ID for better organization
# account_id = "your-account-id-here"
```

To find your account ID:
1. Go to https://dash.cloudflare.com
2. Click on "Workers & Pages" in the left sidebar
3. Your Account ID is shown on the right side

## Step 4: Deploy the Worker

From your project root directory, run:

```bash
wrangler deploy
```

Or if you installed it locally:

```bash
npx wrangler deploy
```

You should see output like:

```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded plant-health-ai-worker (X.XX sec)
Published plant-health-ai-worker (X.XX sec)
  https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev
Current Deployment ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Step 5: Copy Your Worker URL

Copy the URL from the output (something like):
```
https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev
```

## Step 6: Update Your .env File

Open your `.env` file and update the `VITE_AI_WORKER_URL`:

```env
# Old (local development)
VITE_AI_WORKER_URL=http://localhost:8787

# New (production worker)
VITE_AI_WORKER_URL=https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev
```

## Step 7: Restart Your Dev Server

Stop your React dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

Now your app will use the Cloudflare Worker instead of the local mock server!

## Testing Your Worker

You can test the worker directly with curl:

```bash
curl -X POST https://plant-health-ai-worker.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/plant.jpg"}'
```

You should get back a JSON response with plant diagnosis data.

## Managing Your Worker

### View Worker Logs

```bash
wrangler tail
```

This shows real-time logs from your worker.

### View Worker in Dashboard

Go to: https://dash.cloudflare.com/workers

Here you can:
- View deployment history
- See usage metrics
- Edit worker settings
- View logs

### Update/Redeploy Worker

After making changes to `cloudflare-worker.js`:

```bash
wrangler deploy
```

The URL stays the same, so you don't need to update `.env` again.

### Delete Worker

```bash
wrangler delete
```

## Upgrading to Real AI (Optional)

The current worker uses mock data. To connect a real AI model:

### Option 1: Hugging Face

1. Sign up at https://huggingface.co
2. Get an API token from Settings > Access Tokens
3. Update `cloudflare-worker.js`:

```javascript
async function diagnosePlant(imageUrl) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
      },
      body: imageUrl,
    }
  );
  return await response.json();
}
```

4. Add API key to wrangler.toml:

```toml
[vars]
HUGGINGFACE_API_KEY = "your-api-key-here"
```

5. Redeploy: `wrangler deploy`

### Option 2: Replicate

1. Sign up at https://replicate.com
2. Get API token
3. Similar process as Hugging Face

### Option 3: OpenAI Vision API

1. Get OpenAI API key
2. Use GPT-4 Vision for plant analysis
3. Update worker code accordingly

## Troubleshooting

### "Error: Not logged in"
Run `wrangler login` again.

### "Error: No account found"
Make sure you've created a Cloudflare account and verified your email.

### "Error: Worker name already taken"
Change the `name` in `wrangler.toml` to something unique:
```toml
name = "plant-health-ai-YOUR-NAME"
```

### CORS errors
The worker already has CORS headers configured. If you still see errors:
1. Check the browser console
2. Make sure you're using the correct worker URL
3. Try redeploying: `wrangler deploy`

### Worker returns 500 errors
1. Check logs: `wrangler tail`
2. Look for JavaScript errors
3. Make sure the request has `imageUrl` in the body

## Cost & Limits

Cloudflare Workers **Free Tier**:
- ✅ 100,000 requests per day
- ✅ Up to 10ms CPU time per request
- ✅ More than enough for development and small projects

If you exceed these limits, you can upgrade to the paid plan ($5/month for 10 million requests).

## Next Steps

Once your worker is deployed:
1. You can stop running `npm run ai-server` (the local mock)
2. Your app will use the Cloudflare Worker for all AI requests
3. The worker will work from anywhere, not just localhost
4. You can deploy your frontend to production

## Summary

```bash
# Quick reference
npm install -g wrangler          # Install CLI
wrangler login                   # Login to Cloudflare
wrangler deploy                  # Deploy worker
wrangler tail                    # View logs
```

That's it! Your Cloudflare Worker is now live and connected to your app. 🎉
