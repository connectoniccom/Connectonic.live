/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {setGlobalOptions} from "firebase-functions/v2";

import { menuSuggestion, generateSongLyrics, recommendMusic, askQuestion } from './genkit-sample';
import { mySearchEndpoint } from './search';

export { menuSuggestion, generateSongLyrics, recommendMusic, askQuestion, mySearchEndpoint };


// Set global options for all functions
setGlobalOptions({maxInstances: 10});
