const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Load environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB94sRfzTg6Bfo_04fj9A14usXKQ3WYrFw";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "your_actual_weather_api_key_here";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "58005689001-8gbri4rvbc2ho0snaolahd29ruqpm1e0.apps.googleusercontent.com";
const PORT = process.env.PORT || 3000;

// Warn if Google OAuth not set up
if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('your_google_client_id_here')) {
  console.warn('⚠️ No valid Google OAuth Client ID configured. OAuth will be disabled.');
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend from same directory

// -------------------- CONFIGURATION ENDPOINT --------------------
app.get('/api/config', (req, res) => {
  res.json({
    googleClientId: GOOGLE_CLIENT_ID || null,
    isGoogleAuthEnabled: !!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('your_google_client_id_here'),
    hasGeminiKey: !!GEMINI_API_KEY && !GEMINI_API_KEY.includes('your_gemini_api_key_here'),
    hasWeatherKey: !!WEATHER_API_KEY && !WEATHER_API_KEY.includes('your_weather_api_key_here')
  });
});

// -------------------- GEMINI API ENDPOINT --------------------
app.post('/api/gemini', async (req, res) => {
  const { contents } = req.body;

  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_gemini_api_key_here')) {
    return res.status(500).json({
      error: '⚠️ Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.'
    });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({
        error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}`
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
});

// -------------------- WEATHER API ENDPOINT --------------------
// app.post('/api/weather', async (req, res) => {
//   const { city } = req.body;

//   if (!WEATHER_API_KEY || WEATHER_API_KEY.includes('your_weather_api_key_here')) {
//     return res.status(500).json({
//       error: '⚠️ Weather API key not configured. Please set WEATHER_API_KEY in your .env file.'
//     });
//   }

//   const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

//   try {
//     const response = await fetch(API_URL);
//     if (!response.ok) {
//       const errorText = await response.text();
//       return res.status(response.status).json({ error: `Weather API error: ${errorText}` });
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Error calling Weather API:', error);
//     res.status(500).json({ error: 'Failed to call Weather API' });
//   }
// });

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

