# N.O.V.A - AI Assistant

N.O.V.A is a modern, voice-enabled AI chatbot with a premium, Material 3-inspired design. It provides a seamless and interactive user experience, allowing users to communicate with the Gemini AI model through text and voice.

## Features

*   **Real-time AI Chat:** Engage in natural conversations with the powerful Gemini AI model.
*   **Voice Interaction:** Use your voice to ask questions (Speech-to-Text) and hear the AI's responses (Text-to-Speech).
*   **Multi-language Support:** Communicate in English, Hindi, or Gujarati, with automatic translation.
*   **Image Uploads:** Upload images for the AI to analyze and discuss.
*   **Function Calling:** Get real-time weather information by asking the AI for the weather in a specific city.
*   **Sentiment Analysis:** The AI can detect the user's mood and respond accordingly.
*   **Google Sign-In:** Securely log in with your Google account.
*   **Admin Dashboard:** A password-protected admin dashboard to view and manage chat logs.
*   **Light & Dark Themes:** Switch between light and dark modes for a comfortable viewing experience.
*   **Secure API Key Handling:** All API keys are securely handled on the server-side, not exposed to the client.

## Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Backend:** Node.js, Express.js
*   **AI:** Google Gemini API
*   **Authentication:** Google Identity Services
*   **APIs:**
    *   OpenWeatherMap API (for weather)
    *   LibreTranslate API (for translation)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)
*   A modern web browser that supports the Web Speech API (e.g., Google Chrome).

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/nova-ai-chatbot.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd nova-ai-chatbot
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Run the setup script to configure your API keys:
    ```sh
    npm run setup
    ```

### Configuration

To use the full functionality of the application, you need to configure your secret API keys in a `.env` file.

1.  Create a `.env` file in the root of the project:
    ```sh
    # Create .env file with the following content:
    ```
2.  Add your API keys to the `.env` file:
    ```
    # Gemini API Key - Get from https://makersuite.google.com/app/apikey
    GEMINI_API_KEY=your_actual_gemini_api_key_here
    
    # Weather API Key - Get from https://openweathermap.org/api
    WEATHER_API_KEY=your_actual_weather_api_key_here
    
    # Server Configuration
    PORT=3000
    
    # Google OAuth Configuration (Optional - for custom OAuth setup)
    GOOGLE_CLIENT_ID=your_google_client_id_here
    ```

#### Getting API Keys:

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and add it to your `.env` file

**Weather API Key:**
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key and add it to your `.env` file

**Google OAuth (Optional):**
If you want to use your own Google OAuth client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000` to authorized origins
6. Copy the client ID to your `.env` file

## Running the Application

1.  Start the server:
    ```sh
    npm start
    ```
2.  Open your browser and navigate to `http://localhost:3000` to use the application.

### Admin Dashboard

*   Access the admin dashboard by navigating to `http://localhost:3000/admin.html`.
*   Log in with the following credentials:
    *   **Username:** `admin`
    *   **Password:** `admin123`

## Troubleshooting

### Common Issues:

**1. "No reply from model" error:**
- Make sure you have set the `GEMINI_API_KEY` in your `.env` file
- Verify your API key is valid and has proper permissions
- Check the server console for detailed error messages

**2. Google OAuth "origin_mismatch" error:**
- The default OAuth client ID should work for localhost:3000
- If you're using a custom domain, create your own OAuth credentials
- Make sure to add your domain to authorized origins in Google Cloud Console

**3. Weather queries not working:**
- Ensure you have set the `WEATHER_API_KEY` in your `.env` file
- Verify your OpenWeatherMap API key is active
- Check if you've exceeded the API rate limits

**4. Voice features not working:**
- Make sure you're using a modern browser (Chrome, Edge, Safari)
- Check that your microphone permissions are enabled
- Ensure you're using HTTPS in production (required for speech recognition)

### Development Tips:

- Check the browser console for JavaScript errors
- Monitor the server console for API errors
- Use the admin dashboard to view chat logs and debug issues
- Test API endpoints directly using tools like Postman

---