// Sends end-of-assessment feedback to a Google Apps Script web app that appends
// a row to a Google Sheet. Setup: docs/feedback-setup.md

export const FEEDBACK_ENDPOINT = import.meta.env.VITE_FEEDBACK_ENDPOINT?.trim() || "";
export const FEEDBACK_VERSION = "2026-10";

export interface FeedbackPayload {
  submittedAt: string;
  version: string;
  role: string | null;
  scores: Record<string, number | undefined>;
  notSure: string[];
  composite: number;
  level: number;
  archetype: string;
  priorityGap: string;
  accuracy: number;
  comments: string;
}

export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  if (!FEEDBACK_ENDPOINT) throw new Error("Feedback endpoint is not configured");
  // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
  // The response is opaque in no-cors mode; a network failure still rejects.
  await fetch(FEEDBACK_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
