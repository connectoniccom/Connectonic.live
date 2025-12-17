"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySearchEndpoint = void 0;
const functions = __importStar(require("firebase-functions"));
const app_1 = require("firebase-admin/app");
// --- For External Web Search (e.g., Google Custom Search API) ---
// You would install a client library for your chosen API, e.g., googleapis
// import { google } from 'googleapis';
// const customsearch = google.customsearch('v1');
(0, app_1.initializeApp)(); // Initializes Firebase Admin SDK
exports.mySearchEndpoint = functions.https.onCall(async (data, context) => {
    // Note: Authentication check is commented out for testing
    // Uncomment the following lines if you want to require authentication:
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', 'Authentication required for this search.');
    // }
    var _a, _b;
    const searchQuery = data.searchQuery;
    if (!searchQuery || searchQuery.trim() === '') {
        throw new functions.https.HttpsError('invalid-argument', 'Search query cannot be empty.');
    }
    console.log('Search query received:', searchQuery);
    let results = [];
    // === OPTION B: External Web Search API (e.g., Google Custom Search API) ===
    // This is for searching the broader web or specific external sites.
    // Requires:
    //   1. Enabling Google Custom Search API in Google Cloud Console
    //   2. Creating a Custom Search Engine (CSE) and getting its `cx` ID
    //   3. Setting your API Key as an environment variable (e.g., functions.config().externalapi.key)
    // Check if API keys are configured
    const EXTERNAL_SEARCH_API_KEY = (_a = functions.config().externalapi) === null || _a === void 0 ? void 0 : _a.key;
    const CUSTOM_SEARCH_ENGINE_ID = (_b = functions.config().externalapi) === null || _b === void 0 ? void 0 : _b.cse_id;
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
    }
    else {
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
//# sourceMappingURL=search.js.map