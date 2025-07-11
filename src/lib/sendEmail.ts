import emailjs from "emailjs-com";

export function sendInterviewEmail({
  user_email,
  candidate_name,
  summary,
  confidence_level,
  hesitation_frequency,
  clarity_of_speech,
  demeanor,
  resources
}: {
  user_email: string;
  candidate_name: string;
  summary: string;
  confidence_level: string;
  hesitation_frequency: string;
  clarity_of_speech: string;
  demeanor: string;
  resources: string;
}) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      user_email,
      candidate_name,
      summary,
      confidence_level,
      hesitation_frequency,
      clarity_of_speech,
      demeanor,
      resources,
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}
