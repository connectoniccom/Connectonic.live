import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { gemini20Flash } from '@genkit-ai/googleai';
import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
const menuSuggestionFlow = ai.defineFlow({
  name: 'menuSuggestionFlow',
  inputSchema: z.string().describe('A restaurant theme').default('seafood'),
  outputSchema: z.string(),
  streamSchema: z.string(),
}, async (subject, { sendChunk }) => {
  // Construct a request and send it to the model API.
  const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
  const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    prompt: prompt,
    config: {
      temperature: 1,
    },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  // Handle the response from the model API. In this sample, we just
  // convert it to a string, but more complicated flows might coerce the
  // response into structured output or chain the response into another
  // LLM call, etc.
  return (await response).text;
});

export const menuSuggestion = onCallGenkit({
  // Uncomment to enable AppCheck. This can reduce costs by ensuring only your Verified
  // app users can use your API. Read more at https://firebase.google.com/docs/app-check/cloud-functions
  // enforceAppCheck: true,
  // authPolicy can be any callback that accepts an AuthData (a uid and tokens dictionary) and the
  // request data. The isSignedIn() and hasClaim() helpers can be used to simplify. The following
  // will require the user to have the email_verified claim, for example.
  // authPolicy: hasClaim("email_verified"),
  // Grant access to the API key to this function:
  secrets: [defineSecret('GOOGLE_GENAI_API_KEY')],
}, menuSuggestionFlow);

// Define a flow for generating song lyrics
const songLyricsFlow = ai.defineFlow({
  name: 'songLyricsFlow',
  inputSchema: z.object({
    theme: z.string().describe('The theme or topic of the song'),
    genre: z.string().describe('The music genre').default('pop'),
  }),
  outputSchema: z.string(),
}, async ({ theme, genre }, { sendChunk }) => {
  const prompt = `Write original song lyrics about "${theme}" in the ${genre} genre. Include verses, chorus, and bridge. Make it creative and engaging.`;
  const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    prompt: prompt,
    config: {
      temperature: 0.8,
    },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  return (await response).text;
});

export const generateSongLyrics = onCallGenkit({
  secrets: [defineSecret('GOOGLE_GENAI_API_KEY')],
}, songLyricsFlow);

// Define a flow for music recommendations
const musicRecommendationFlow = ai.defineFlow({
  name: 'musicRecommendationFlow',
  inputSchema: z.object({
    mood: z.string().describe('The current mood or feeling'),
    genre: z.string().describe('Preferred genre').optional(),
  }),
  outputSchema: z.string(),
}, async ({ mood, genre }, { sendChunk }) => {
  const genreText = genre ? ` in the ${genre} genre` : '';
  const prompt = `Recommend 5 songs that match the mood "${mood}"${genreText}. For each song, include the artist, song title, and a brief reason why it fits the mood.`;
  const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    prompt: prompt,
    config: {
      temperature: 0.7,
    },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  return (await response).text;
});

export const recommendMusic = onCallGenkit({
  secrets: [defineSecret('GOOGLE_GENAI_API_KEY')],
}, musicRecommendationFlow);

// Define a flow for general Q&A
const qaFlow = ai.defineFlow({
  name: 'qaFlow',
  inputSchema: z.string().describe('The question to answer'),
  outputSchema: z.string(),
}, async (question, { sendChunk }) => {
  const prompt = `Answer the following question comprehensively and helpfully: ${question}`;
  const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    prompt: prompt,
    config: {
      temperature: 0.3,
    },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  return (await response).text;
});

export const askQuestion = onCallGenkit({
  secrets: [defineSecret('GOOGLE_GENAI_API_KEY')],
}, qaFlow);