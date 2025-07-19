'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering technical queries using multiple AI models.
 *
 * - answerTechnicalQuery - A function that accepts a technical query and returns a concise answer.
 * - AnswerTechnicalQueryInput - The input type for the answerTechnicalQuery function.
 * - AnswerTechnicalQueryOutput - The return type for the answerTechnicalQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerTechnicalQueryInputSchema = z.object({
  query: z.string().describe('The technical query in natural language.'),
  expertiseLevel: z.enum(['novice', 'expert']).default('novice').describe('The expertise level of the user.'),
  uploadedDocuments: z.array(z.string()).optional().describe('Array of URLs for uploaded documents.'),
});
export type AnswerTechnicalQueryInput = z.infer<typeof AnswerTechnicalQueryInputSchema>;

const AnswerTechnicalQueryOutputSchema = z.object({
  answer: z.string().describe('The concise and accurate answer to the technical query.'),
});
export type AnswerTechnicalQueryOutput = z.infer<typeof AnswerTechnicalQueryOutputSchema>;

export async function answerTechnicalQuery(input: AnswerTechnicalQueryInput): Promise<AnswerTechnicalQueryOutput> {
  return answerTechnicalQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerTechnicalQueryPrompt',
  input: {schema: AnswerTechnicalQueryInputSchema},
  output: {schema: AnswerTechnicalQueryOutputSchema},
  prompt: `You are a unified tech AI assistant. Your goal is to answer technical questions accurately and concisely using your access to multiple specialized AI models.

The user's expertise level is: {{{expertiseLevel}}}.

User Query: {{{query}}}

{{#if uploadedDocuments}}
You have access to the following uploaded documents:
{{#each uploadedDocuments}}
- {{{this}}}
{{/each}}

Use these documents to enhance your answer.
{{/if}}

Provide a concise and accurate answer to the technical query, tailoring the response to the user's expertise level.`,}
);

const answerTechnicalQueryFlow = ai.defineFlow(
  {
    name: 'answerTechnicalQueryFlow',
    inputSchema: AnswerTechnicalQueryInputSchema,
    outputSchema: AnswerTechnicalQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
