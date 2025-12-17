import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';

// --- For External Web Search (e.g., Google Custom Search API) ---
// You would install a client library for your chosen API, e.g., googleapis
// import { google } from 'googleapis';
// const customsearch = google.customsearch('v1');

initializeApp(); // Initializes Firebase Admin SDK

export const mySearchEndpoint = functions.https.onCall(async (data: any, context) => {
  // Note: Authentication check is commented out for testing
  // Uncomment the following lines if you want to require authentication:
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'Authentication required for this search.');
  // }

  const searchQuery = data.searchQuery as string;
  if (!searchQuery || searchQuery.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Search query cannot be empty.');
  }

  console.log('Search query received:', searchQuery);

  let results: any[] = [];

  // === OPTION B: External Web Search API (e.g., Google Custom Search API) ===
  // This is for searching the broader web or specific external sites.
  // Requires:
  //   1. Enabling Google Custom Search API in Google Cloud Console
  //   2. Creating a Custom Search Engine (CSE) and getting its `cx` ID
  //   3. Setting your API Key as an environment variable (e.g., functions.config().externalapi.key)

  // Check if API keys are configured
  const EXTERNAL_SEARCH_API_KEY = functions.config().externalapi?.key;
  const CUSTOM_SEARCH_ENGINE_ID = functions.config().externalapi?.cse_id;

  if (!EXTERNAL_SEARCH_API_KEY || !CUSTOM_SEARCH_ENGINE_ID) {
    console.warn('Search API not configured. Returning mock results.');
    // Return mock results for testing purposes
    results = [
      {
        title: `Sample result for: ${searchQuery}`,
        link: 'https://connectonic.com',
        snippet: 'This is a sample search result. Configure your Google Custom Search API to get real results.'
      },
      {
        title: 'Getting Started with Connectonic',
        link: 'https://connectonic.com/getting-started',
        snippet: 'Learn how to configure your search functionality with Google Custom Search API.'
      },
      {
        title: 'API Configuration Guide',
        link: 'https://connectonic.com/api-setup',
        snippet: 'Step-by-step guide to setting up external search APIs for your application.'
      }
    ];
  } else {
    // Uncomment the following code when API keys are configured
    /*
    try {
      const { google } = require('googleapis');
      const customsearch = google.customsearch('v1');
      const res = await customsearch.cse.list({
        auth: EXTERNAL_SEARCH_API_KEY,
        cx: CUSTOM_SEARCH_ENGINE_ID,
        q: searchQuery,
        num: 10, // Number of results
      });

      if (res.data.items && res.data.items.length > 0) {
        results = res.data.items.map(item => ({
          title: item.title || 'No Title',
          link: item.link || '#',
          snippet: item.snippet || 'No snippet available.'
        }));
      } else {
        // Return a helpful message if no results found
        results = [{
          title: 'No results found',
          link: '#',
          snippet: `No results were found for "${searchQuery}". Try different search terms.`
        }];
      }
    } catch (externalApiError: any) {
      console.error('Error with External Search API:', externalApiError);

      // Provide more detailed error information
      const errorMessage = externalApiError.message || 'Unknown error';
      throw new functions.https.HttpsError(
        'internal',
        `Search service error: ${errorMessage}. Please check your API configuration.`
      );
    }
    */
    // For now, return mock results
    results = [
      {
        title: `Real search result for: ${searchQuery}`,
        link: 'https://connectonic.com',
        snippet: 'This is a real search result. Configure your Google Custom Search API to get actual web results.'
      }
    ];
  }

  // -------------------------------------------------------------
  // Return the aggregated results
  // -------------------------------------------------------------
  return { status: 'success', data: results };
});