# Google OAuth Setup Guide

## Quick Fix for OAuth Origin Mismatch Error

The current OAuth client ID doesn't have `localhost:3000` configured as an authorized origin. Here's how to fix it:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "NOVA AI Chatbot" (or any name you prefer)
4. Click "Create"

### Step 2: Enable Google+ API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name it "NOVA AI Local Development"

### Step 4: Configure Authorized Origins

In the "Authorized JavaScript origins" section, add:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

In the "Authorized redirect URIs" section, add:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Step 5: Get Your Client ID

1. Click "Create"
2. Copy the "Client ID" (not the Client Secret)
3. Add it to your `.env` file:

```
GOOGLE_CLIENT_ID=your_new_client_id_here
```

### Step 6: Restart Your Server

```bash
npm start
```

## Alternative: Use Demo Mode (No OAuth)

If you don't want to set up OAuth, you can disable it by modifying the code to skip Google sign-in entirely.
