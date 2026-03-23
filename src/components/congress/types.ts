export interface SessionStudent {
  id?: string; // congress_session_students id (set after DB insert)
  competitorId?: string;
  name: string;
  school: string;
  isPresidingOfficer: boolean;
  poScore: number | null;
  poComments: string;
  finalRank: number | null;
}

export interface Legislation {
  id?: string;
  title: string;
  legislationType: "bill" | "resolution";
  voteOutcome: string;
  sortOrder: number;
}

export interface Speech {
  id?: string;
  studentIndex: number; // index into students array
  legislationIndex: number | null;
  side: "affirmative" | "negative";
  speechScore: number | null;
  questioningScore: number | null;
  notes: string;
  speechOrder: number;
}

export interface CongressSessionData {
  tournamentName: string;
  chamberNumber: string;
  sessionName: string;
  roundNumber: string;
  speakingOrderMethod: string;
  questioningFormat: string;
  notes: string;
  students: SessionStudent[];
  legislation: Legislation[];
  speeches: Speech[];
}

export type SessionStep = "setup" | "speeches" | "rankings" | "review";

export const SPEECH_SCORE_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Excellent",
  6: "Outstanding",
};

export const RUBRIC_CATEGORIES = [
  {
    name: "Argumentation",
    description: "Quality and depth of reasoning, use of logic and evidence to support claims.",
  },
  {
    name: "Research & Evidence",
    description: "Use of specific, credible sources and data to back up arguments.",
  },
  {
    name: "Organization",
    description: "Clear structure with introduction, body, and conclusion. Logical flow of ideas.",
  },
  {
    name: "Delivery",
    description: "Eye contact, vocal variety, poise, confidence, and appropriate use of gestures.",
  },
  {
    name: "Questioning",
    description: "Quality of questions asked during cross-examination. Ability to respond under pressure.",
  },
  {
    name: "Refutation",
    description: "Directly addressing and dismantling opposing arguments with evidence and reasoning.",
  },
  {
    name: "Engagement",
    description: "Active participation in the session, attentiveness, and collaboration with peers.",
  },
];
