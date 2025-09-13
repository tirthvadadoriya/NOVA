@echo off
echo ========================================
echo NOVA AI Chatbot - Environment Setup
echo ========================================
echo.
echo Please enter your API keys:
echo.

set /p GEMINI_KEY="Enter your Gemini API Key: "
set /p WEATHER_KEY="Enter your Weather API Key (optional, press Enter to skip): "
set /p GOOGLE_CLIENT="Enter your Google OAuth Client ID (optional, press Enter to skip): "

echo.
echo Creating .env file...

echo GEMINI_API_KEY=%GEMINI_KEY% > .env
echo WEATHER_API_KEY=%WEATHER_KEY% >> .env
echo PORT=3000 >> .env
echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT% >> .env

echo.
echo ✅ .env file created successfully!
echo.
echo 📝 Next steps:
echo 1. Restart the server: npm start
echo 2. Open: http://localhost:3000
echo.
echo ⚠️  For Google OAuth to work:
echo - Make sure your Google OAuth Client ID has these authorized origins:
echo   - http://localhost:3000
echo   - http://127.0.0.1:3000
echo.
pause

