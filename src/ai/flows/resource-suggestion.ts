'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting learning resources
 * tailored to the skill gaps identified during an interview analysis.
 *
 * - suggestResources - A function that suggests learning resources based on identified skill gaps.
 * - SuggestResourcesInput - The input type for the suggestResources function.
 * - SuggestResourcesOutput - The return type for the suggestResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResourcesInputSchema = z.object({
  skillGaps: z
    .array(z.string())
    .describe('An array of skill gaps identified during the interview.'),
});
export type SuggestResourcesInput = z.infer<typeof SuggestResourcesInputSchema>;

const SuggestResourcesOutputSchema = z.object({
  suggestedResources: z.array(z.string()).describe('A list of suggested learning resources (e.g., links to tutorials, articles, courses).'),
});
export type SuggestResourcesOutput = z.infer<typeof SuggestResourcesOutputSchema>;

export async function suggestResources(input: SuggestResourcesInput): Promise<SuggestResourcesOutput> {
  return suggestResourcesFlow(input);
}

const resourceSuggestionPrompt = ai.definePrompt({
  name: 'resourceSuggestionPrompt',
  input: {schema: SuggestResourcesInputSchema},
  output: {schema: SuggestResourcesOutputSchema},
  prompt: `You are an AI career coach. A candidate is looking to improve their skills in the following areas:

  {{#each skillGaps}}
  - {{{this}}}
  {{/each}}

  Suggest relevant online resources (e.g., tutorials, articles, courses) that would help them improve in these areas. Provide only a list of links.
  `,
});

const suggestResourcesFlow = ai.defineFlow(
  {
    name: 'suggestResourcesFlow',
    inputSchema: SuggestResourcesInputSchema,
    outputSchema: SuggestResourcesOutputSchema,
  },
  async input => {
    const {output} = await resourceSuggestionPrompt(input);
    return output!;
  }
);
