/**
 * Local Mock AI Server for Development
 *
 * This is a simple Express server that mimics the Cloudflare Worker
 * for local development. Run this instead of deploying to Cloudflare
 * during development.
 *
 * Usage: node local-ai-server.js
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock AI diagnosis function
function diagnosePlant() {
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

  // Return a random mock diagnosis
  return mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
}

app.post('/', (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  // Simulate processing delay
  setTimeout(() => {
    const diagnosis = diagnosePlant();
    res.json(diagnosis);
  }, 1500);
});

const PORT = 8787;
app.listen(PORT, () => {
  console.log(`🌱 Mock AI Server running on http://localhost:${PORT}`);
  console.log('Ready to diagnose plants!');
});
