// Debate format configuration system
// Add new formats by defining a new DebateFormatConfig object

export interface ScoreFieldConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  required: boolean;
  perSpeaker: boolean; // true = one score per speaker, false = one per team/side
  description?: string;
}

export interface CommentFieldConfig {
  id: string;
  label: string;
  required: boolean;
  placeholder: string;
  maxLength: number;
}

export interface SideConfig {
  label: string; // e.g. "Affirmative", "Pro"
  speakerCount: number;
  speakerLabels?: string[]; // e.g. ["1st Speaker", "2nd Speaker"]
}

export interface DebateFormatConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  sides: {
    aff: SideConfig;
    neg: SideConfig;
  };
  scoreFields: ScoreFieldConfig[];
  commentFields: CommentFieldConfig[];
  requireWinnerSelection: boolean;
  winnerSelectionLabel: string;
  displayOrder: number;
}

export const DEBATE_FORMATS: Record<string, DebateFormatConfig> = {
  ld: {
    id: "ld",
    name: "Lincoln-Douglas",
    shortName: "LD",
    description: "1v1 value debate format focusing on philosophical frameworks",
    sides: {
      aff: { label: "Affirmative", speakerCount: 1 },
      neg: { label: "Negative", speakerCount: 1 },
    },
    scoreFields: [
      {
        id: "speaker_points",
        label: "Speaker Points",
        min: 25,
        max: 30,
        step: 0.5,
        required: true,
        perSpeaker: true,
        description: "Rate each speaker's individual performance",
      },
    ],
    commentFields: [
      {
        id: "rfd",
        label: "Reason for Decision",
        required: true,
        placeholder: "Explain why you voted for the winning side...",
        maxLength: 3000,
      },
      {
        id: "feedback",
        label: "Speaker Feedback",
        required: false,
        placeholder: "Provide constructive feedback for each debater...",
        maxLength: 2000,
      },
    ],
    requireWinnerSelection: true,
    winnerSelectionLabel: "Select the winning debater",
    displayOrder: 1,
  },
  pf: {
    id: "pf",
    name: "Public Forum",
    shortName: "PF",
    description: "2v2 format accessible to general audiences with real-world topics",
    sides: {
      aff: {
        label: "Pro",
        speakerCount: 2,
        speakerLabels: ["1st Speaker", "2nd Speaker"],
      },
      neg: {
        label: "Con",
        speakerCount: 2,
        speakerLabels: ["1st Speaker", "2nd Speaker"],
      },
    },
    scoreFields: [
      {
        id: "speaker_points",
        label: "Speaker Points",
        min: 25,
        max: 30,
        step: 0.5,
        required: false,
        perSpeaker: true,
        description: "Optional individual speaker scores",
      },
    ],
    commentFields: [
      {
        id: "rfd",
        label: "Reason for Decision",
        required: true,
        placeholder: "Explain why you voted for the winning team...",
        maxLength: 3000,
      },
      {
        id: "feedback",
        label: "Team Feedback",
        required: false,
        placeholder: "Provide feedback for both teams...",
        maxLength: 2000,
      },
    ],
    requireWinnerSelection: true,
    winnerSelectionLabel: "Select the winning team",
    displayOrder: 2,
  },
  policy: {
    id: "policy",
    name: "Policy Debate",
    shortName: "CX",
    description: "2v2 evidence-heavy format focusing on government policy proposals",
    sides: {
      aff: {
        label: "Affirmative",
        speakerCount: 2,
        speakerLabels: ["1A", "2A"],
      },
      neg: {
        label: "Negative",
        speakerCount: 2,
        speakerLabels: ["1N", "2N"],
      },
    },
    scoreFields: [
      {
        id: "speaker_points",
        label: "Speaker Points",
        min: 25,
        max: 30,
        step: 0.5,
        required: true,
        perSpeaker: true,
        description: "Rate each speaker's performance",
      },
    ],
    commentFields: [
      {
        id: "rfd",
        label: "Reason for Decision",
        required: true,
        placeholder: "Detail your reason for decision...",
        maxLength: 4000,
      },
      {
        id: "comments",
        label: "Additional Comments",
        required: false,
        placeholder: "Notes on argument quality, evidence usage, etc...",
        maxLength: 3000,
      },
    ],
    requireWinnerSelection: true,
    winnerSelectionLabel: "Select the winning team",
    displayOrder: 3,
  },
};

export function getFormatConfig(formatId: string): DebateFormatConfig | undefined {
  return DEBATE_FORMATS[formatId];
}

export function getAllFormats(): DebateFormatConfig[] {
  return Object.values(DEBATE_FORMATS).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getFormatLabel(formatId: string): string {
  return DEBATE_FORMATS[formatId]?.name ?? formatId;
}

export function getFormatShortName(formatId: string): string {
  return DEBATE_FORMATS[formatId]?.shortName ?? formatId.toUpperCase();
}
