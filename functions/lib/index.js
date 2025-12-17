"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySearchEndpoint = exports.askQuestion = exports.recommendMusic = exports.generateSongLyrics = exports.menuSuggestion = void 0;
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const v2_1 = require("firebase-functions/v2");
const genkit_sample_1 = require("./genkit-sample");
Object.defineProperty(exports, "menuSuggestion", { enumerable: true, get: function () { return genkit_sample_1.menuSuggestion; } });
Object.defineProperty(exports, "generateSongLyrics", { enumerable: true, get: function () { return genkit_sample_1.generateSongLyrics; } });
Object.defineProperty(exports, "recommendMusic", { enumerable: true, get: function () { return genkit_sample_1.recommendMusic; } });
Object.defineProperty(exports, "askQuestion", { enumerable: true, get: function () { return genkit_sample_1.askQuestion; } });
const search_1 = require("./search");
Object.defineProperty(exports, "mySearchEndpoint", { enumerable: true, get: function () { return search_1.mySearchEndpoint; } });
// Set global options for all functions
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
//# sourceMappingURL=index.js.map