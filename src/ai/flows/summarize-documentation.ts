// Summarizes uploaded documentation or extracts key information from it.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentationInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to summarize or extract information from.'),
  query: z.string().describe('The specific information to extract or summarize.'),
  expertiseLevel: z
    .enum(['expert', 'novice'])
    .describe('The user expertise level for tailoring the response.'),
});

export type SummarizeDocumentationInput = z.infer<
  typeof SummarizeDocumentationInputSchema
>;

const SummarizeDocumentationOutputSchema = z.object({
  summary: z.string().describe('The summary or extracted information from the document.'),
});

export type SummarizeDocumentationOutput = z.infer<
  typeof SummarizeDocumentationOutputSchema
>;

export async function summarizeDocumentation(
  input: SummarizeDocumentationInput
): Promise<SummarizeDocumentationOutput> {
  return summarizeDocumentationFlow(input);
}

const summarizeDocumentationPrompt = ai.definePrompt({
  name: 'summarizeDocumentationPrompt',
  input: {schema: SummarizeDocumentationInputSchema},
  output: {schema: SummarizeDocumentationOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing technical documentation based on user queries and expertise levels.

  Document Content: {{{documentContent}}}
  User Query: {{{query}}}
  Expertise Level: {{{expertiseLevel}}}

  Based on the document content, user query, and expertise level, provide a concise and relevant summary or extract key information. Tailor the response based on the expertise level, offering more detailed information for experts and simplified explanations for novices.
  `,
});

const summarizeDocumentationFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentationFlow',
    inputSchema: SummarizeDocumentationInputSchema,
    outputSchema: SummarizeDocumentationOutputSchema,
  },
  async input => {
    const {output} = await summarizeDocumentationPrompt(input);
    return output!;
  }
);
