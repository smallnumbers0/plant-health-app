/**
 * Cloudflare Worker - Plant Disease Detection
 *
 * Uses OpenAI Vision API for universal plant identification and disease diagnosis
 */

async function diagnosePlant(imageUrl, apiKey) {
  try {
    // Call OpenAI Vision API
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are a plant health expert. Analyze this plant image and provide a diagnosis in JSON format.

Identify:
1. The plant name (common name)
2. Any diseases, pests, or health issues visible
3. Severity level: "low" (healthy/minor), "medium" (treatable concern), or "high" (serious/urgent)
4. Brief description of the issue (or healthy status)
5. List of possible causes (3-4 bullet points)
6. 3-5 specific actionable recommendations with timeline and priority
7. 4-5 care tips specific to THIS plant species (not generic)

Return ONLY valid JSON in this exact format:
{
  "plantName": "string",
  "confidence": 0.95,
  "issues": [
    {
      "name": "string (disease/pest name or 'Healthy' if no issues)",
      "severity": "low|medium|high",
      "description": "string",
      "causes": [
        "Cause 1",
        "Cause 2",
        "Cause 3"
      ]
    }
  ],
  "recommendations": [
    {
      "action": "string (specific action to take)",
      "timeline": "string (when to do it: 'Immediately', 'Daily', 'Weekly', etc.)",
      "priority": 1
    }
  ],
  "careTips": [
    {
      "icon": "💧",
      "title": "Short tip title",
      "description": "Specific care tip for this exact plant species"
    }
  ]
}

For careTips - BE EXTREMELY SPECIFIC TO THE EXACT PLANT IDENTIFIED:
- Use relevant emojis: 💧 (water), ☀️ (light), 🌡️ (temperature), 🌫️ (humidity), ✂️ (pruning), 🌱 (soil), 🔍 (monitoring), ⚠️ (urgent), 💡 (general)
- NEVER use generic phrases like "this plant", "most plants", "houseplants"
- ALWAYS use the exact plant name in tips (e.g., "Monstera deliciosa needs...", "Fiddle Leaf Figs prefer...")
- Include EXACT care requirements specific to this species:
  * Precise watering frequency (e.g., "Water your Pothos every 7-10 days")
  * Exact light levels (e.g., "Snake Plants thrive in low to bright indirect light")
  * Specific temperature ranges for this species (e.g., "Orchids prefer 65-75°F during day, 60-65°F at night")
  * Humidity percentages if relevant (e.g., "Calatheas need 60-70% humidity")
  * Species-specific quirks and needs (e.g., "Peace Lilies will droop when thirsty - a reliable watering indicator")
- Make each tip actionable and measurable
- Limit to 4-5 tips

If the plant is healthy, return severity "low" and issue name "Healthy" with general care causes.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response (handle markdown code blocks)
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    const diagnosis = JSON.parse(jsonContent);

    return {
      plantName: diagnosis.plantName,
      confidence: diagnosis.confidence || 0.90,
      issues: diagnosis.issues || [],
      recommendations: diagnosis.recommendations || [],
      careTips: diagnosis.careTips || [],
      modelOutput: {
        model: 'gpt-4o',
        rawResponse: content
      }
    };

  } catch (error) {
    console.error('OpenAI diagnosis error:', error);
    throw error;
  }
}

// Fallback mock for when API is unavailable
async function getMockDiagnosis() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    plantName: 'Plant',
    confidence: 0.70,
    issues: [{
      name: 'General Plant Care',
      severity: 'low',
      description: 'AI analysis temporarily unavailable - showing general care tips',
    }],
    recommendations: [
      { action: 'Water when top inch of soil is dry', timeline: 'Check daily', priority: 1 },
      { action: 'Provide appropriate light for this plant type', timeline: 'Ongoing', priority: 2 },
      { action: 'Check for common pests (aphids, mealybugs, spider mites)', timeline: 'Weekly', priority: 3 },
      { action: 'Fertilize with balanced plant food', timeline: 'Monthly', priority: 4 },
    ],
    careTips: [
      { icon: '💡', title: 'Monitor Daily', description: 'Check your plant at the same time each day to catch early warning signs.' },
      { icon: '💧', title: 'Water Wisely', description: 'Most plants prefer to dry out slightly between waterings.' },
      { icon: '☀️', title: 'Light Requirements', description: 'Ensure your plant gets appropriate light for its species.' },
      { icon: '🌡️', title: 'Temperature', description: 'Most houseplants prefer temperatures between 65-75°F.' },
    ],
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const { imageUrl } = await request.json();

      if (!imageUrl) {
        return new Response(
          JSON.stringify({ error: 'Image URL is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      let diagnosis;

      if (env.OPENAI_API_KEY) {
        try {
          diagnosis = await diagnosePlant(imageUrl, env.OPENAI_API_KEY);
        } catch (error) {
          console.error('OpenAI Vision failed, using mock:', error);
          diagnosis = await getMockDiagnosis();
        }
      } else {
        console.log('No OpenAI API key, using mock data');
        diagnosis = await getMockDiagnosis();
      }

      return new Response(JSON.stringify(diagnosis), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Failed to process image',
          message: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
