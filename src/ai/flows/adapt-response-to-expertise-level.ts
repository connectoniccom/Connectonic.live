'use server';
/**
 * @fileOverview Adapts AI responses based on the user's expertise level.
 *
 * - adaptResponseToExpertiseLevel - A function that tailors AI responses to the user's knowledge level.
 * - AdaptResponseToExpertiseLevelInput - The input type for the adaptResponseToExpertiseLevel function.
 * - AdaptResponseToExpertiseLevelOutput - The return type for the adaptResponseToExpertiseLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptResponseToExpertiseLevelInputSchema = z.object({
  query: z.string().describe('The technical query from the user.'),
  response: z.string().describe('The initial AI response to the query.'),
  expertiseLevel: z
    .enum(['novice', 'intermediate', 'expert'])
    .describe('The user\'s level of technical expertise.'),
});
export type AdaptResponseToExpertiseLevelInput = z.infer<
  typeof AdaptResponseToExpertiseLevelInputSchema
>;

const AdaptResponseToExpertiseLevelOutputSchema = z.object({
  adaptedResponse: z
    .string()
    .describe('The AI response adapted to the user\'s expertise level.'),
});
export type AdaptResponseToExpertiseLevelOutput = z.infer<
  typeof AdaptResponseToExpertiseLevelOutputSchema
>;

export async function adaptResponseToExpertiseLevel(
  input: AdaptResponseToExpertiseLevelInput
): Promise<AdaptResponseToExpertiseLevelOutput> {
  return adaptResponseToExpertiseLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptResponseToExpertiseLevelPrompt',
  input: {schema: AdaptResponseToExpertiseLevelInputSchema},
  output: {schema: AdaptResponseToExpertiseLevelOutputSchema},
  prompt: `You are an AI expert in tailoring responses based on a user's technical expertise.

  A user has asked the following query: {{{query}}}

  The initial response was:
  {{response}}

  The user's expertise level is: {{{expertiseLevel}}}

  Adapt the initial response to be appropriate for the user's expertise level. Provide more detailed information for experts and simplified explanations for novices.
  Return the adapted response.
  `,
});

const adaptResponseToExpertiseLevelFlow = ai.defineFlow(
  {
    name: 'adaptResponseToExpertiseLevelFlow',
    inputSchema: AdaptResponseToExpertiseLevelInputSchema,
    outputSchema: AdaptResponseToExpertiseLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
