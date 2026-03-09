// Types for the Debate Tournament & Practice Hub

export type UserRole = "admin" | "coach" | "judge" | "student";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id?: string;
  avatar_url?: string;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface Tournament {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  status: "draft" | "active" | "completed" | "archived";
  created_by: string;
}

export interface Division {
  id: string;
  tournament_id: string;
  name: string;
  format_id: string; // references debate format config
}

export interface Round {
  id: string;
  division_id: string;
  round_number: number;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

export interface RoundAssignment {
  id: string;
  round_id: string;
  judge_id: string;
  aff_competitor_ids: string[];
  neg_competitor_ids: string[];
  room?: string;
}

export interface Ballot {
  id: string;
  round_assignment_id: string;
  judge_id: string;
  format_id: string;
  winner_side: "aff" | "neg";
  status: "draft" | "submitted" | "locked";
  submitted_at?: string;
  created_at: string;
}

export interface BallotScore {
  id: string;
  ballot_id: string;
  competitor_id: string;
  score_field_id: string;
  value: number;
}

export interface BallotFeedback {
  id: string;
  ballot_id: string;
  comment_field_id: string;
  content: string;
}

export interface PracticeRound {
  id: string;
  format_id: string;
  date: string;
  topic: string;
  coach_id: string;
  notes?: string;
  created_at: string;
}

export interface PerformanceSnapshot {
  id: string;
  competitor_id: string;
  format_id: string;
  period_start: string;
  period_end: string;
  total_rounds: number;
  wins: number;
  losses: number;
  avg_speaker_points: number;
}

// UI-specific types
export interface StatCardData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}

export interface RoundHistoryItem {
  id: string;
  date: string;
  format: string;
  type: "tournament" | "practice";
  opponent: string;
  result: "win" | "loss";
  speakerPoints?: number;
  judgeName: string;
  feedback?: string;
  tournamentName?: string;
}

export interface PerformanceDataPoint {
  date: string;
  speakerPoints: number;
  winRate: number;
}
