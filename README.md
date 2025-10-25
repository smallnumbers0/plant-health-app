# Plant Health Diagnostic Web App

A full-stack web application that uses AI to identify plant species, diagnose diseases, and provide treatment recommendations with an interactive timeline.

## Features

- **AI-Powered Diagnosis**: Upload plant images for instant species identification and disease detection
- **Treatment Timeline**: Visual, interactive timeline with step-by-step recovery plans
- **User Authentication**: Secure email/password authentication via Supabase
- **Image Storage**: Cloud-based image storage with Supabase Storage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS with custom green-black theme
- **Backend & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **AI Inference**: Cloudflare Workers
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6

## Color Palette

- Primary Green: `#5AAB61`
- Secondary Green: `#62BD69`
- Accent Green: `#358856`
- Background: `#0F0F0F`
- Surface: `#1A1A1A`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthForm.tsx
│   ├── ImageUpload.tsx
│   └── TreatmentTimeline.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   └── PlantDetail.tsx
├── services/           # API and service layer
│   ├── supabase.ts
│   ├── auth.ts
│   └── database.types.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx
│   ├── useQuery.tsx
│   ├── usePlants.ts
│   └── useTreatments.ts
└── styles/             # Global styles
    └── theme.css
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Cloudflare account for Workers (free tier available)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd plant-health-app
npm install
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL in `supabase-schema.sql` in the Supabase SQL Editor
4. Create a storage bucket:
   - Go to Storage
   - Create bucket named `plant-images`
   - Make it public
   - Set allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Set max file size: 5MB

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AI_WORKER_URL=https://your-worker.workers.dev
```

### 5. Deploy Cloudflare Worker

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy

# Copy the deployed URL to your .env as VITE_AI_WORKER_URL
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in the deployment settings
4. Deploy!

**Build Command**: `npm run build`
**Output Directory**: `dist`

### Cloudflare Worker

The worker is already deployed if you followed step 5 above. To update:

```bash
wrangler deploy
```

## Database Schema

### users
- `id` (UUID, references auth.users)
- `email` (TEXT)
- `name` (TEXT)
- `created_at` (TIMESTAMP)

### plants
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `image_url` (TEXT)
- `plant_name` (TEXT)
- `diagnosis` (JSONB)
- `created_at` (TIMESTAMP)

### treatments
- `id` (UUID)
- `plant_id` (UUID, foreign key)
- `step` (INTEGER)
- `description` (TEXT)
- `date` (DATE)
- `completed` (BOOLEAN)

## AI Model Integration

The current implementation uses mock diagnosis data. To integrate a real AI model:

### Option 1: Hugging Face Inference API

Replace the `diagnosePlant` function in `cloudflare-worker.js`:

```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
    },
    body: imageBlob,
  }
);
```

### Option 2: Replicate API

```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'model-version-id',
    input: { image: imageUrl },
  }),
});
```

### Option 3: Custom TensorFlow.js Model

Load and run a custom model directly in the Worker.

## Features Roadmap

- [ ] Social sharing of plant diagnoses
- [ ] Community forum for plant care tips
- [ ] Push notifications for treatment reminders
- [ ] Multiple language support
- [ ] Plant care journal and notes
- [ ] Export diagnosis reports as PDF
- [ ] Integration with plant care calendars

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check the Cloudflare Workers docs: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)

---

Built with React, Supabase, and Cloudflare Workers
