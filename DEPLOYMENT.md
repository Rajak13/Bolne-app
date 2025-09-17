# Deployment Guide

## Issue Identified

The deployed application at `https://bolne.sevalla.app` is trying to make requests to `http://localhost:5001/api`, which causes:

1. **Mixed Content Error**: HTTPS site trying to make HTTP requests
2. **Wrong API URL**: Using localhost instead of production backend URL

## Fixes Applied

### 1. Frontend Configuration
- Updated `httpClient.js` fallback URL from `localhost:5001` to `localhost:3000`
- Added production domain to backend CORS configuration

### 2. Backend Configuration
- Added production domain to CORS configuration: `https://bolne.sevalla.app`
- Backend environment variables properly configured on Sevalla

### 3. Security
- Removed `.env.production` files from git (they contained API keys)
- Updated `.gitignore` to prevent committing sensitive environment files

## Current Sevalla Environment Variables

**Backend (✅ Configured):**
```
CLIENT_URL=https://bolne.sevalla.app
EMAIL_FROM="onboarding@resend.dev"
EMAIL_FROM_NAME="Rajak"
JWT_SECRET=myjwtsecret
MONGO_URI=mongodb+srv://...
NODE_ENV=production
PORT=3000
RESEND_API_KEY=re_hGSQUTWY_2cX93Cp8y6it3N8C8tAEL4wU
```

**Frontend (❌ Missing):**
```
VITE_API_BASE_URL=https://bolne.sevalla.app/api
```

## Required Action

Add this environment variable to your Sevalla deployment:
```
VITE_API_BASE_URL=https://bolne.sevalla.app/api
```

## Build Commands

For production build:
```bash
npm run build:prod
```

For regular build:
```bash
npm run build
```

## Verification

After adding the missing environment variable and redeploying, the frontend should:
1. Make HTTPS requests to `https://bolne.sevalla.app/api`
2. No longer show mixed content warnings
3. Successfully connect to the backend API

## Architecture

```
Frontend (https://bolne.sevalla.app)
    ↓ HTTPS requests
Backend API (https://bolne.sevalla.app/api)
    ↓
MongoDB Atlas
```

The backend serves both the API endpoints and the static frontend files in production mode.

## Security Notes

- Never commit `.env.production` files to git
- All sensitive environment variables should be set directly in the deployment platform
- The `.gitignore` has been updated to prevent accidental commits of production environment files