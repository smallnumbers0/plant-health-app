# Setup Checklist

Follow these steps in order to get your Plant Health app running:

## ✅ Completed Steps

- [x] Install dependencies (`npm install`)
- [x] Configure environment variables (`.env` file created)
- [x] Install local AI server dependencies

## 🔄 Do These Next

### 1. Set Up Supabase Database (5 minutes)

**a) Run the SQL Schema:**
1. Go to: https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/sql/new
2. Copy ALL the contents from `supabase-schema.sql`
3. Paste into the SQL Editor
4. Click **Run** button

**b) Create Storage Bucket:**
1. Go to: https://supabase.com/dashboard/project/uztehmamkyawmbghtncz/storage/buckets
2. Click **New bucket**
3. Name: `plant-images`
4. Toggle **Public bucket** ON
5. Click **Save**
6. Click on `plant-images` bucket
7. Click **Policies** > **New policy** > **Full customization**
8. Add this policy:
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'plant-images');
   ```
9. Click **Review** > **Save policy**
10. Add another policy for reading:
    ```sql
    CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'plant-images');
    ```
11. Click **Review** > **Save policy**

### 2. Run the App (1 minute)

You'll need TWO terminal windows:

**Terminal 1 - AI Server:**
```bash
npm run ai-server
```
You should see: "🌱 Mock AI Server running on http://localhost:8787"

**Terminal 2 - React App:**
```bash
npm run dev
```
You should see: "Local: http://localhost:5173"

### 3. Test the App

1. Open http://localhost:5173 in your browser
2. Click **Sign Up** and create an account
3. Upload a plant image (any image will work for testing)
4. See the AI diagnosis and treatment timeline!

## 🎉 You're Done!

Your app should now be running. Here's what you can do:

- **Upload plants**: Click "Add Plant" to upload images
- **View diagnosis**: See AI-generated plant health reports
- **Track treatments**: Mark treatment steps as complete
- **View history**: See all your plants in the dashboard

## 🚀 Optional: Deploy to Production

When you're ready to deploy:

1. **Deploy Cloudflare Worker** (for real AI):
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```
   Then update `VITE_AI_WORKER_URL` in `.env`

2. **Deploy Frontend** (Vercel or Netlify):
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Add environment variables
   - Deploy!

## 🐛 Troubleshooting

**App won't start?**
- Make sure both servers are running (ai-server and dev)
- Check that ports 5173 and 8787 are not in use

**Can't sign up?**
- Verify SQL schema was run in Supabase
- Check Supabase console for errors

**Image upload fails?**
- Make sure `plant-images` bucket exists
- Verify bucket is public
- Check storage policies are created

**AI diagnosis not working?**
- Make sure `npm run ai-server` is running
- Check console for errors

## 📚 Need Help?

- Check `README.md` for full documentation
- Check `QUICK_START.md` for detailed setup
- Review Supabase docs: https://supabase.com/docs
