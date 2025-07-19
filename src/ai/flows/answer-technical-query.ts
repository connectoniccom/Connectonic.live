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
  expertiseLevel: z
    .enum(['novice', 'expert'])
    .default('novice')
    .describe('The expertise level of the user.'),
  uploadedDocuments: z
    .array(z.string())
    .optional()
    .describe('Array of URLs for uploaded documents.'),
});
export type AnswerTechnicalQueryInput = z.infer<
  typeof AnswerTechnicalQueryInputSchema
>;

const CodeExampleSchema = z.object({
  language: z.string().describe('The programming language of the code snippet.'),
  code: z.string().describe('The code snippet.'),
});

const AnswerTechnicalQueryOutputSchema = z.object({
  answer: z
    .string()
    .describe('The concise and accurate answer to the technical query.'),
  codeExamples: z
    .array(CodeExampleSchema)
    .optional()
    .describe(
      'An array of relevant code examples to support the answer. Only include if the query asks for code.'
    ),
  diagram: z
    .string()
    .optional()
    .describe(
      'A MermaidJS graph definition for a technical diagram if the query involves system design or architecture. Only include if relevant.'
    ),
});
export type AnswerTechnicalQueryOutput = z.infer<
  typeof AnswerTechnicalQueryOutputSchema
>;

export async function answerTechnicalQuery(
  input: AnswerTechnicalQueryInput
): Promise<AnswerTechnicalQueryOutput> {
  return answerTechnicalQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerTechnicalQueryPrompt',
  input: {schema: AnswerTechnicalQueryInputSchema},
  output: {schema: AnswerTechnicalQueryOutputSchema},
  prompt: `You are a unified tech AI assistant. Your goal is to answer technical questions accurately and in detail.

The user's expertise level is: {{{expertiseLevel}}}.

User Query: {{{query}}}

{{#if uploadedDocuments}}
You have access to the following uploaded documents:
{{#each uploadedDocuments}}
- {{{this}}}
{{/each}}

Use these documents to enhance your answer.
{{/if}}

Provide a detailed and accurate answer.
- If the query asks for code, provide relevant code snippets in the 'codeExamples' field.
- If the query is about system design or architecture, provide a MermaidJS diagram definition in the 'diagram' field.
- Tailor the response to the user's expertise level. For experts, provide more technical depth, architectural considerations, and trade-offs. For novices, use simpler language and analogies.`,
});

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
