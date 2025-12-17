"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = exports.recommendMusic = exports.generateSongLyrics = exports.menuSuggestion = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const googleai_2 = require("@genkit-ai/googleai");
const https_1 = require("firebase-functions/https");
const params_1 = require("firebase-functions/params");
const firebase_1 = require("@genkit-ai/firebase");
(0, firebase_1.enableFirebaseTelemetry)();
const ai = (0, genkit_1.genkit)({
    plugins: [
        (0, googleai_1.googleAI)(),
    ],
});
// Define a simple flow that prompts an LLM to generate menu suggestions.
const menuSuggestionFlow = ai.defineFlow({
    name: 'menuSuggestionFlow',
    inputSchema: genkit_1.z.string().describe('A restaurant theme').default('seafood'),
    outputSchema: genkit_1.z.string(),
    streamSchema: genkit_1.z.string(),
}, async (subject, { sendChunk }) => {
    var _a, e_1, _b, _c;
    // Construct a request and send it to the model API.
    const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
    const { response, stream } = ai.generateStream({
        model: googleai_2.gemini20Flash,
        prompt: prompt,
        config: {
            temperature: 1,
        },
    });
    try {
        for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
            _c = stream_1_1.value;
            _d = false;
            const chunk = _c;
            sendChunk(chunk.text);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_1.return)) await _b.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return (await response).text;
});
exports.menuSuggestion = (0, https_1.onCallGenkit)({
    // Uncomment to enable AppCheck. This can reduce costs by ensuring only your Verified
    // app users can use your API. Read more at https://firebase.google.com/docs/app-check/cloud-functions
    // enforceAppCheck: true,
    // authPolicy can be any callback that accepts an AuthData (a uid and tokens dictionary) and the
    // request data. The isSignedIn() and hasClaim() helpers can be used to simplify. The following
    // will require the user to have the email_verified claim, for example.
    // authPolicy: hasClaim("email_verified"),
    // Grant access to the API key to this function:
    secrets: [(0, params_1.defineSecret)('GOOGLE_GENAI_API_KEY')],
}, menuSuggestionFlow);
// Define a flow for generating song lyrics
const songLyricsFlow = ai.defineFlow({
    name: 'songLyricsFlow',
    inputSchema: genkit_1.z.object({
        theme: genkit_1.z.string().describe('The theme or topic of the song'),
        genre: genkit_1.z.string().describe('The music genre').default('pop'),
    }),
    outputSchema: genkit_1.z.string(),
}, async ({ theme, genre }, { sendChunk }) => {
    var _a, e_2, _b, _c;
    const prompt = `Write original song lyrics about "${theme}" in the ${genre} genre. Include verses, chorus, and bridge. Make it creative and engaging.`;
    const { response, stream } = ai.generateStream({
        model: googleai_2.gemini20Flash,
        prompt: prompt,
        config: {
            temperature: 0.8,
        },
    });
    try {
        for (var _d = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = await stream_2.next(), _a = stream_2_1.done, !_a; _d = true) {
            _c = stream_2_1.value;
            _d = false;
            const chunk = _c;
            sendChunk(chunk.text);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_2.return)) await _b.call(stream_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return (await response).text;
});
exports.generateSongLyrics = (0, https_1.onCallGenkit)({
    secrets: [(0, params_1.defineSecret)('GOOGLE_GENAI_API_KEY')],
}, songLyricsFlow);
// Define a flow for music recommendations
const musicRecommendationFlow = ai.defineFlow({
    name: 'musicRecommendationFlow',
    inputSchema: genkit_1.z.object({
        mood: genkit_1.z.string().describe('The current mood or feeling'),
        genre: genkit_1.z.string().describe('Preferred genre').optional(),
    }),
    outputSchema: genkit_1.z.string(),
}, async ({ mood, genre }, { sendChunk }) => {
    var _a, e_3, _b, _c;
    const genreText = genre ? ` in the ${genre} genre` : '';
    const prompt = `Recommend 5 songs that match the mood "${mood}"${genreText}. For each song, include the artist, song title, and a brief reason why it fits the mood.`;
    const { response, stream } = ai.generateStream({
        model: googleai_2.gemini20Flash,
        prompt: prompt,
        config: {
            temperature: 0.7,
        },
    });
    try {
        for (var _d = true, stream_3 = __asyncValues(stream), stream_3_1; stream_3_1 = await stream_3.next(), _a = stream_3_1.done, !_a; _d = true) {
            _c = stream_3_1.value;
            _d = false;
            const chunk = _c;
            sendChunk(chunk.text);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_3.return)) await _b.call(stream_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return (await response).text;
});
exports.recommendMusic = (0, https_1.onCallGenkit)({
    secrets: [(0, params_1.defineSecret)('GOOGLE_GENAI_API_KEY')],
}, musicRecommendationFlow);
// Define a flow for general Q&A
const qaFlow = ai.defineFlow({
    name: 'qaFlow',
    inputSchema: genkit_1.z.string().describe('The question to answer'),
    outputSchema: genkit_1.z.string(),
}, async (question, { sendChunk }) => {
    var _a, e_4, _b, _c;
    const prompt = `Answer the following question comprehensively and helpfully: ${question}`;
    const { response, stream } = ai.generateStream({
        model: googleai_2.gemini20Flash,
        prompt: prompt,
        config: {
            temperature: 0.3,
        },
    });
    try {
        for (var _d = true, stream_4 = __asyncValues(stream), stream_4_1; stream_4_1 = await stream_4.next(), _a = stream_4_1.done, !_a; _d = true) {
            _c = stream_4_1.value;
            _d = false;
            const chunk = _c;
            sendChunk(chunk.text);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_4.return)) await _b.call(stream_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return (await response).text;
});
exports.askQuestion = (0, https_1.onCallGenkit)({
    secrets: [(0, params_1.defineSecret)('GOOGLE_GENAI_API_KEY')],
}, qaFlow);
//# sourceMappingURL=genkit-sample.js.map