# Firebase Search Implementation Guide

## Overview
This guide will help you set up and deploy the Firebase Cloud Functions search functionality for your Connectonic application.

## What's Been Implemented

### 1. Search Page Component (`src/pages/search.tsx`)
- Full-featured search interface with loading states
- Error handling and user feedback
- URL-based search queries
- Responsive design with Tailwind CSS

### 2. Firebase Cloud Function (`functions/src/search.ts`)
- Callable HTTPS function `mySearchEndpoint`
- Google Custom Search API integration
- Mock results fallback for testing
- No authentication required (configurable)

### 3. Homepage Integration (`src/pages/index.tsx`)
- Added "Advanced Search" button linking to `/search`
- Existing quick search functionality maintained

## Setup Instructions

### Option 1: Testing with Mock Data (Immediate - No API Required)

The implementation includes mock results that work immediately:

1. **Start the development server:**
   ```bash
   cd proffesional
   npm run dev
   ```

2. **Build and deploy Firebase Functions:**
   ```bash
   cd functions
   npm run build
   firebase deploy --only functions
   ```

3. **Test the search:**
   - Visit `http://localhost:3006/search`
   - Enter any search query
   - You'll see mock search results

### Option 2: Production Setup with Google Custom Search API

To get real search results, you need to configure Google Custom Search API:

#### Step 1: Enable Google Custom Search API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `connectonic-live`
3. Enable the **Custom Search API**:
   - Go to APIs & Services → Library
   - Search for "Custom Search API"
   - Click "Enable"

#### Step 2: Create API Key

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the API key (you'll need this later)
4. Restrict the key (recommended):
   - Click on the key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Custom Search API"
   - Save

#### Step 3: Create Custom Search Engine

1. Go to [Google Custom Search Engine](https://cse.google.com/cse/all)
2. Click "Add" to create a new search engine
3. Configure:
   - **Sites to search**: Enter `*` to search the entire web, or specific domains
   - **Name**: "Connectonic Search"
   - **Search engine keywords**: "music, artists, connectonic"
4. After creation, click "Control Panel"
5. Copy the **Search engine ID** (cx parameter)

#### Step 4: Configure Firebase Functions

1. **Set Firebase configuration:**
   ```bash
   cd proffesional
   firebase functions:config:set externalapi.key="YOUR_GOOGLE_API_KEY"
   firebase functions:config:set externalapi.cse_id="YOUR_SEARCH_ENGINE_ID"
   ```

2. **Verify configuration:**
   ```bash
   firebase functions:config:get
   ```

#### Step 5: Deploy

1. **Build the functions:**
   ```bash
   cd functions
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   cd ..
   firebase deploy --only functions
   ```

3. **Deploy the Next.js app (if needed):**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Testing

### Local Testing with Emulators (Optional)

1. **Start Firebase emulators:**
   ```bash
   firebase emulators:start
   ```

2. **Update your local environment:**
   - Functions will run on `http://localhost:5001`
   - Ensure your frontend connects to the emulator

### Production Testing

1. **Navigate to your deployed site:**
   ```
   https://connectonic-live.web.app/search
   ```

2. **Test search functionality:**
   - Enter a search query
   - Verify results appear
   - Check console for any errors

## Troubleshooting

### Error: "Authentication required"
- The function authentication check is commented out by default
- If you uncomment it, users must be signed in to search

### Error: "Search service error"
- Verify your API key is correctly set: `firebase functions:config:get`
- Check API key restrictions in Google Cloud Console
- Ensure Custom Search API is enabled
- Verify Search Engine ID is correct

### No Results / Mock Results Appearing
- Check if API keys are configured: `firebase functions:config:get`
- If keys are missing, you'll see mock results
- Run `firebase functions:config:set` commands to add keys

### Function Not Found
- Ensure functions are deployed: `firebase deploy --only functions`
- Check Firebase Console → Functions to verify deployment
- Verify function name matches in both frontend and backend: `mySearchEndpoint`

## Cost Considerations

### Google Custom Search API Pricing
- **Free tier**: 100 queries per day
- **Paid tier**: $5 per 1,000 queries (after free tier)
- [Pricing details](https://developers.google.com/custom-search/v1/overview#pricing)

### Firebase Cloud Functions Pricing
- **Free tier**: 2M invocations/month, 400K GB-seconds, 200K CPU-seconds
- [Pricing details](https://firebase.google.com/pricing)

## Security Best Practices

1. **API Key Security:**
   - Never commit API keys to version control
   - Use Firebase Functions config for secrets
   - Restrict API keys to specific APIs

2. **Enable Authentication (Optional):**
   - Uncomment authentication check in `functions/src/search.ts` (lines 14-16)
   - Requires users to sign in before searching

3. **Rate Limiting:**
   - Consider implementing rate limiting in the function
   - Use Firebase App Check to prevent abuse

## File Structure

```
proffesional/
├── src/
│   └── pages/
│       ├── index.tsx          # Homepage with search section
│       └── search.tsx         # Dedicated search page
├── functions/
│   └── src/
│       ├── index.ts           # Main functions entry
│       └── search.ts          # Search Cloud Function
├── lib/
│   └── firebase.ts            # Firebase configuration
└── .env.local                 # Environment variables
```

## Next Steps

1. ✅ Test with mock data locally
2. ⬜ Set up Google Custom Search API
3. ⬜ Configure Firebase Functions with API keys
4. ⬜ Deploy to production
5. ⬜ Test production search functionality
6. ⬜ Monitor usage and costs
7. ⬜ (Optional) Add authentication requirement
8. ⬜ (Optional) Implement rate limiting

## Support

For issues or questions:
- Check Firebase Console logs: `firebase functions:log`
- Review browser console for frontend errors
- Verify all environment variables are set correctly

---

**Last Updated:** December 4, 2024
**Project:** Connectonic Music Platform
**Firebase Project:** connectonic-live