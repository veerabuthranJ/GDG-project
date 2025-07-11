// src/ai/flows/behavioral-cue-analysis.ts
'use server';

/**
 * @fileOverview Analyzes the candidate's speech patterns to detect confidence levels, hesitation, and clarity.
 *
 * - analyzeBehavioralCues - A function that analyzes behavioral cues from the interview transcript.
 * - AnalyzeBehavioralCuesInput - The input type for the analyzeBehavioralCues function.
 * - AnalyzeBehavioralCuesOutput - The return type for the analyzeBehavioralCues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBehavioralCuesInputSchema = z.object({
  transcript: z.string().describe('The transcript of the interview.'),
});
export type AnalyzeBehavioralCuesInput = z.infer<typeof AnalyzeBehavioralCuesInputSchema>;

const AnalyzeBehavioralCuesOutputSchema = z.object({
  confidenceLevel: z
    .string()
    .describe('The overall confidence level of the candidate (e.g., high, medium, low).'),
  hesitationFrequency: z
    .string()
    .describe('The frequency of hesitations in the candidate’s speech (e.g., frequent, occasional, rare).'),
  clarityOfSpeech: z
    .string()
    .describe('The clarity and coherence of the candidate’s speech (e.g., clear, somewhat unclear, unclear).'),
  overallDemeanor: z
    .string()
    .describe('A summary of the candidate’s overall demeanor based on their speech patterns.'),
});
export type AnalyzeBehavioralCuesOutput = z.infer<typeof AnalyzeBehavioralCuesOutputSchema>;

export async function analyzeBehavioralCues(input: AnalyzeBehavioralCuesInput): Promise<AnalyzeBehavioralCuesOutput> {
  return analyzeBehavioralCuesFlow(input);
}

const analyzeBehavioralCuesPrompt = ai.definePrompt({
  name: 'analyzeBehavioralCuesPrompt',
  input: {schema: AnalyzeBehavioralCuesInputSchema},
  output: {schema: AnalyzeBehavioralCuesOutputSchema},
  prompt: `You are an AI interview analyst tasked with analyzing a candidate's speech patterns to detect confidence levels, hesitation, and clarity.

  Based on the interview transcript provided below, assess the candidate's:
  - Confidence Level: Provide an overall assessment of the candidate's confidence level based on their speech.
  - Hesitation Frequency: Determine how often the candidate hesitates during their speech.
  - Clarity of Speech: Evaluate the clarity and coherence of the candidate's speech.
  - Overall Demeanor: Provide a summary of the candidate's overall demeanor based on their speech patterns.

  Interview Transcript:
  {{transcript}}

  Format your analysis in the following JSON format:
  { 
    "confidenceLevel": "",
    "hesitationFrequency": "",
    "clarityOfSpeech": "",
    "overallDemeanor": ""
  }
  `,
});

const analyzeBehavioralCuesFlow = ai.defineFlow(
  {
    name: 'analyzeBehavioralCuesFlow',
    inputSchema: AnalyzeBehavioralCuesInputSchema,
    outputSchema: AnalyzeBehavioralCuesOutputSchema,
  },
  async input => {
    const {output} = await analyzeBehavioralCuesPrompt(input);
    return output!;
  }
);
