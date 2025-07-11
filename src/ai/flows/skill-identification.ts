'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying skills mentioned in an interview transcript.
 *
 * - identifySkills - A function that takes an interview transcript and job description as input and returns a list of skills identified in the transcript.
 * - SkillIdentificationInput - The input type for the identifySkills function.
 * - SkillIdentificationOutput - The return type for the identifySkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillIdentificationInputSchema = z.object({
  transcript: z.string().describe('The transcript of the interview.'),
  jobDescription: z.string().describe('The job description for the role.'),
});
export type SkillIdentificationInput = z.infer<typeof SkillIdentificationInputSchema>;

const SkillIdentificationOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of skills identified in the transcript.'),
});
export type SkillIdentificationOutput = z.infer<typeof SkillIdentificationOutputSchema>;

export async function identifySkills(input: SkillIdentificationInput): Promise<SkillIdentificationOutput> {
  return identifySkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillIdentificationPrompt',
  input: {schema: SkillIdentificationInputSchema},
  output: {schema: SkillIdentificationOutputSchema},
  prompt: `You are an AI assistant. Your task is to extract a list of skills from the provided text.

Job Description Context (for relevance):
{{{jobDescription}}}

Text to analyze for skills:
{{{transcript}}}

Based on the "Text to analyze", identify and list the skills mentioned. The "Job Description Context" is for you to understand what skills might be relevant, but you should only extract skills explicitly or strongly implicitly present in the "Text to analyze". Return a list of skills.
Skills:`,
});

const identifySkillsFlow = ai.defineFlow(
  {
    name: 'identifySkillsFlow',
    inputSchema: SkillIdentificationInputSchema,
    outputSchema: SkillIdentificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
