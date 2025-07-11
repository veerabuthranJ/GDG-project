"use client";
import React from "react";
import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BrainCircuit,
  AlertCircle,
  BookOpen,
  ClipboardCheck,
  Lightbulb,
  ThumbsUp,
  UserCheck,
  BarChart3,
  List,
} from "lucide-react";
import { getInterviewAnalysis } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { EngagementChart } from "@/components/engagement-chart";
import type { AnalysisData } from "@/app/actions";
import EyeTracker from "@/components/EyeTracker";


const initialState: {
  data: AnalysisData | null;
  error: string | null;
} = {
  data: null,
  error: null,
};

type EyeTrackerProps = {
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InterviewPage() {
  const [state, formAction] = React.useActionState(getInterviewAnalysis, initialState);
  const [flag, setFlag] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Interview Analysis
        </h1>
        <p className="text-muted-foreground text-lg">
          Leverage AI to gain deep insights into candidate performance.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Start New Analysis</CardTitle>
          <CardDescription>
            Provide the required information below to analyze an interview.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                name="candidateName"
                placeholder="e.g., Jane Doe"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the full job description including required skills..."
                  className="min-h-[200px] lg:min-h-[300px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transcript">Interview Transcript</Label>
                <Textarea
                  id="transcript"
                  name="transcript"
                  placeholder="Paste the full interview transcript here..."
                  className="min-h-[200px] lg:min-h-[300px]"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {!state.data && !state.error && <AnalysisSkeleton />}

      {state.data && (
  <>
    <AnalysisResults data={state.data} />

    {flag ? (
      <Card className="bg-green-50 border border-green-400">
        <CardHeader>
          <CardTitle className="text-green-800">✅ Eye Movement Detected</CardTitle>
          <CardDescription>
            Eye tracking showed movement during the interview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-900">
            This indicates the candidate was responsive and attentive.
          </p>
        </CardContent>
      </Card>
    ) : (
      <Card className="bg-yellow-50 border border-yellow-400">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ No Eye Movement Detected</CardTitle>
          <CardDescription>
            Eye tracking did not detect significant eye movement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-900">
            This could be due to technical issues or prolonged focus in one direction.
          </p>
        </CardContent>
      </Card>
    )}
  </>
)}
      <EyeTracker 
        flag={flag} 
        setFlag={setFlag} 
      />
 {/* ✅ Eye tracking camera feed floating in corner */}
    </div>
  );
}

function AnalysisSkeleton() {
    const [, , isPending] = useFormState(getInterviewAnalysis, initialState);
    if (!isPending) return null;  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
      </div>
    </div>
  )
}


function AnalysisResults({ data }: { data: AnalysisData }) {
  return (
    <div className="space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <BrainCircuit className="w-6 h-6 text-accent" />
            Analysis Summary for {data.candidateName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-card-foreground/90 whitespace-pre-wrap">{data.summary}</p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-accent" />
              Skill Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Required Skills</h4>
              <SkillBadgeList skills={data.requiredSkills} />
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Mentioned Skills</h4>
              <SkillBadgeList skills={data.mentionedSkills} variant="secondary"/>
            </div>
             <Separator />
            <div>
              <h4 className="font-semibold mb-2">Skill Gaps</h4>
              <SkillBadgeList skills={data.skillGaps} variant="destructive"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-accent" />
              Behavioral Cues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="font-medium text-muted-foreground">Confidence Level</span>
                <span className="font-semibold">{data.behavioralAnalysis.confidenceLevel}</span>
              </li>
               <li className="flex justify-between">
                <span className="font-medium text-muted-foreground">Hesitation Frequency</span>
                <span className="font-semibold">{data.behavioralAnalysis.hesitationFrequency}</span>
              </li>
               <li className="flex justify-between">
                <span className="font-medium text-muted-foreground">Clarity of Speech</span>
                <span className="font-semibold">{data.behavioralAnalysis.clarityOfSpeech}</span>
              </li>
            </ul>
             <Separator />
             <div>
                <h4 className="font-medium text-muted-foreground mb-1">Overall Demeanor</h4>
                <p className="text-sm">{data.behavioralAnalysis.overallDemeanor}</p>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Engagement & Attentiveness
              </CardTitle>
              <CardDescription>
                Visual representation of candidate engagement over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <EngagementChart />
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Recommended Resources
            </CardTitle>
             <CardDescription>
                Personalized resources to help bridge skill gaps.
              </CardDescription>
          </CardHeader>
          <CardContent>
            {data.suggestedResources.length > 0 ? (
              <ul className="space-y-2">
                {data.suggestedResources.map((resource, index) => (
                  <li key={index}>
                    <Link href={resource} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-foreground/90 hover:text-accent-foreground underline underline-offset-4 flex items-center gap-2">
                       <BookOpen className="w-4 h-4" />
                       {resource}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <ThumbsUp className="w-8 h-8 mx-auto mb-2" />
                <p>No specific skill gaps identified. Great job!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SkillBadgeList({ skills, variant }: { skills: string[], variant?: "default" | "secondary" | "destructive" | "outline" | null | undefined }) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">None identified.</p>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill} variant={variant ?? "default"}>{skill}</Badge>
      ))}
    </div>
  )
}