/**
 * Cloudflare Worker - Plant Disease Detection AI
 *
 * This worker handles AI inference for plant disease detection.
 * Deploy this to Cloudflare Workers and update VITE_AI_WORKER_URL in your .env
 *
 * Setup Instructions:
 * 1. Install Wrangler CLI: npm install -g wrangler
 * 2. Login to Cloudflare: wrangler login
 * 3. Deploy: wrangler deploy
 *
 * This example uses a mock AI model. For production:
 * - Replace with actual AI model API (e.g., Hugging Face, Replicate, or custom model)
 * - Add authentication/rate limiting
 * - Implement proper error handling
 */

/**
 * Mock AI diagnosis function
 * In production, replace this with actual AI model inference
 */
async function diagnosePlant(imageUrl) {
  // This is a mock response. In production, you would:
  // 1. Fetch the image from the URL
  // 2. Process it with an AI model (e.g., TensorFlow.js, or external API)
  // 3. Return real diagnosis results

  // Example: Using Hugging Face Inference API
  // const response = await fetch('https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ inputs: imageUrl }),
  // });

  // Mock plant diseases and recommendations
  const mockDiseases = [
    {
      plantName: 'Tomato',
      confidence: 0.89,
      issues: [
        {
          name: 'Early Blight',
          severity: 'medium',
          description: 'Fungal disease causing dark spots on leaves',
        },
      ],
      recommendations: [
        {
          action: 'Remove affected leaves and dispose of them properly',
          timeline: 'Immediately',
          priority: 1,
        },
        {
          action: 'Apply copper-based fungicide every 7-10 days',
          timeline: 'Week 1-3',
          priority: 2,
        },
        {
          action: 'Ensure proper spacing between plants for air circulation',
          timeline: 'Ongoing',
          priority: 3,
        },
        {
          action: 'Water at the base of plants, avoid wetting leaves',
          timeline: 'Daily',
          priority: 2,
        },
      ],
    },
    {
      plantName: 'Rose',
      confidence: 0.92,
      issues: [
        {
          name: 'Powdery Mildew',
          severity: 'low',
          description: 'White powdery coating on leaves and stems',
        },
      ],
      recommendations: [
        {
          action: 'Spray affected areas with neem oil solution',
          timeline: 'Every 3 days for 2 weeks',
          priority: 1,
        },
        {
          action: 'Improve air circulation around the plant',
          timeline: 'Immediately',
          priority: 2,
        },
        {
          action: 'Reduce nitrogen fertilizer application',
          timeline: 'Next feeding cycle',
          priority: 3,
        },
      ],
    },
    {
      plantName: 'Snake Plant',
      confidence: 0.95,
      issues: [
        {
          name: 'Root Rot',
          severity: 'high',
          description: 'Overwatering causing root decay',
        },
      ],
      recommendations: [
        {
          action: 'Remove plant from pot and trim rotted roots',
          timeline: 'Immediately',
          priority: 1,
        },
        {
          action: 'Repot in fresh, well-draining soil',
          timeline: 'Day 1',
          priority: 2,
        },
        {
          action: 'Reduce watering frequency to once every 2-3 weeks',
          timeline: 'Ongoing',
          priority: 3,
        },
      ],
    },
  ];

  // Return a random mock diagnosis for demonstration
  const randomDiagnosis = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return randomDiagnosis;
}

/**
 * CORS headers for browser requests
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main worker handler
 */
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      // Parse request body
      const { imageUrl } = await request.json();

      if (!imageUrl) {
        return new Response(
          JSON.stringify({ error: 'Image URL is required' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Get diagnosis from AI model
      const diagnosis = await diagnosePlant(imageUrl);

      // Return diagnosis result
      return new Response(JSON.stringify(diagnosis), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Failed to process image',
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};
