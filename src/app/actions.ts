'use server';

import { generate } from 'genkit';
import { identifySkills } from '@/ai/flows/skill-identification';
import { analyzeBehavioralCues } from '@/ai/flows/behavioral-cue-analysis';
import { suggestResources } from '@/ai/flows/resource-suggestion';
import type { AnalyzeBehavioralCuesOutput } from '@/ai/flows/behavioral-cue-analysis';

export interface AnalysisData {
  candidateName: string;
  summary: string;
  requiredSkills: string[];
  mentionedSkills: string[];
  skillGaps: string[];
  behavioralAnalysis: AnalyzeBehavioralCuesOutput;
  suggestedResources: string[];
}

export async function getInterviewAnalysis(
  prevState: any,
  formData: FormData
): Promise<{ data: AnalysisData | null; error: string | null; }> {
  const candidateName = formData.get('candidateName') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const transcript = formData.get('transcript') as string;

  if (!candidateName || !jobDescription || !transcript) {
    return { data: null, error: 'Please fill out all fields.' };
  }

  try {
    const [requiredSkillsResult, mentionedSkillsResult, behavioralCuesResult] = await Promise.all([
      identifySkills({ jobDescription, transcript: jobDescription }),
      identifySkills({ jobDescription, transcript }),
      analyzeBehavioralCues({ transcript }),
    ]);

    const requiredSkills = [...new Set(requiredSkillsResult.skills)];
    const mentionedSkills = [...new Set(mentionedSkillsResult.skills)];

    const skillGaps = requiredSkills.filter(
      (skill) => !mentionedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
    );

    let suggestedResourcesResult = { suggestedResources: [] as string[] };
    if (skillGaps.length > 0) {
      suggestedResourcesResult = await suggestResources({ skillGaps });
    }

    // Construct a professional summary from the analysis results
    const summary = `During the interview, ${candidateName} demonstrated knowledge in areas such as ${mentionedSkills.join(', ')}. The analysis of their responses indicates a confidence level of '${behavioralCuesResult.confidenceLevel}' with '${behavioralCuesResult.hesitationFrequency}' hesitation. Their speech was generally '${behavioralCuesResult.clarityOfSpeech}'.

Key strengths include a solid foundation in the mentioned skills and a ${behavioralCuesResult.overallDemeanor.toLowerCase()} demeanor. 

To further enhance their profile for the role, which requires skills in ${requiredSkills.join(', ')}, focusing on the following areas would be beneficial: ${skillGaps.join(', ')}. The suggested resources can provide a good starting point for this development.`;

    const analysisData: AnalysisData = {
      candidateName,
      summary,
      requiredSkills,
      mentionedSkills,
      skillGaps,
      behavioralAnalysis: behavioralCuesResult,
      suggestedResources: suggestedResourcesResult.suggestedResources,
    };

    return { data: analysisData, error: null };
  } catch (error) {
    console.error("Error in getInterviewAnalysis:", error);
    return { data: null, error: 'An error occurred while analyzing the interview. Please check the server logs and try again.' };
  }
}
