'use server';

import { answerTechnicalQuery, type AnswerTechnicalQueryInput, type AnswerTechnicalQueryOutput } from '@/ai/flows/answer-technical-query';

export async function submitQuery(input: AnswerTechnicalQueryInput): Promise<AnswerTechnicalQueryOutput> {
  // In a real app, this would involve reading file content and passing it to the AI.
  // For this implementation, we are passing file names as context, as supported by the flow.
  try {
    const response = await answerTechnicalQuery(input);
    if (!response || !response.answer) {
      throw new Error("AI did not return a valid response.");
    }
    return response;
  } catch (error) {
    console.error('Error in submitQuery:', error);
    throw new Error('Failed to process the query with AI.');
  }
}
