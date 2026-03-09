// Mock data for the student tracking dashboard

import type { RoundHistoryItem, PerformanceDataPoint, StatCardData } from "@/types";

export const MOCK_STUDENT_STATS: StatCardData[] = [
  { label: "Total Rounds", value: 47, change: 5, changeLabel: "this month" },
  { label: "Win Rate", value: "68%", change: 4, changeLabel: "vs last month" },
  { label: "Avg Speaker Pts", value: 28.3, change: 0.4, changeLabel: "improvement" },
  { label: "Tournament Wins", value: 12, change: 2, changeLabel: "this season" },
];

export const MOCK_ROUND_HISTORY: RoundHistoryItem[] = [
  {
    id: "1",
    date: "2026-03-08",
    format: "ld",
    type: "tournament",
    opponent: "Maya Chen",
    result: "win",
    speakerPoints: 29.0,
    judgeName: "Prof. Williams",
    feedback: "Excellent framework analysis. Consider strengthening your rebuttal transitions.",
    tournamentName: "State Qualifiers",
  },
  {
    id: "2",
    date: "2026-03-06",
    format: "pf",
    type: "tournament",
    opponent: "Lincoln HS Team B",
    result: "win",
    speakerPoints: 28.5,
    judgeName: "Judge Martinez",
    feedback: "Strong evidence presentation. Work on time allocation in summary speech.",
    tournamentName: "State Qualifiers",
  },
  {
    id: "3",
    date: "2026-03-04",
    format: "ld",
    type: "practice",
    opponent: "Jordan Blake",
    result: "loss",
    speakerPoints: 27.5,
    judgeName: "Coach Thompson",
    feedback: "Good value clash but lost the criterial debate. Focus on linking your value to real-world impacts.",
  },
  {
    id: "4",
    date: "2026-03-01",
    format: "policy",
    type: "tournament",
    opponent: "Roosevelt HS",
    result: "win",
    speakerPoints: 28.8,
    judgeName: "Dr. Patel",
    feedback: "Outstanding cross-examination. Your 2AR was one of the best I've seen this season.",
    tournamentName: "Metro Invitational",
  },
  {
    id: "5",
    date: "2026-02-27",
    format: "ld",
    type: "practice",
    opponent: "Alexis Morgan",
    result: "win",
    speakerPoints: 29.2,
    judgeName: "Coach Thompson",
    feedback: "Dominant performance. Your philosophical framework was unassailable.",
  },
  {
    id: "6",
    date: "2026-02-24",
    format: "pf",
    type: "tournament",
    opponent: "Jefferson Team A",
    result: "loss",
    speakerPoints: 27.0,
    judgeName: "Judge Kim",
    feedback: "Struggled with the crossfire. Need to be more assertive and direct with questioning.",
    tournamentName: "District Championship",
  },
  {
    id: "7",
    date: "2026-02-20",
    format: "ld",
    type: "tournament",
    opponent: "Sam Rivera",
    result: "win",
    speakerPoints: 28.7,
    judgeName: "Prof. Anderson",
    tournamentName: "District Championship",
  },
  {
    id: "8",
    date: "2026-02-17",
    format: "policy",
    type: "practice",
    opponent: "Practice Squad A",
    result: "win",
    speakerPoints: 28.0,
    judgeName: "Coach Thompson",
    feedback: "Solid practice. Work on your evidence extensions in the rebuttals.",
  },
];

export const MOCK_PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { date: "Jan W1", speakerPoints: 27.2, winRate: 60 },
  { date: "Jan W2", speakerPoints: 27.5, winRate: 55 },
  { date: "Jan W3", speakerPoints: 27.8, winRate: 62 },
  { date: "Jan W4", speakerPoints: 28.0, winRate: 65 },
  { date: "Feb W1", speakerPoints: 27.6, winRate: 58 },
  { date: "Feb W2", speakerPoints: 28.2, winRate: 70 },
  { date: "Feb W3", speakerPoints: 28.5, winRate: 72 },
  { date: "Feb W4", speakerPoints: 28.1, winRate: 68 },
  { date: "Mar W1", speakerPoints: 28.7, winRate: 75 },
  { date: "Mar W2", speakerPoints: 28.3, winRate: 68 },
];

export const MOCK_FORMAT_BREAKDOWN = [
  { format: "LD", wins: 18, losses: 7, avgPoints: 28.5 },
  { format: "PF", wins: 8, losses: 5, avgPoints: 27.8 },
  { format: "CX", wins: 6, losses: 3, avgPoints: 28.2 },
];

export const MOCK_RECENT_FEEDBACK = [
  {
    id: "1",
    judge: "Prof. Williams",
    date: "2026-03-08",
    summary: "Excellent framework analysis. Consider strengthening your rebuttal transitions.",
    format: "LD",
  },
  {
    id: "2",
    judge: "Judge Martinez",
    date: "2026-03-06",
    summary: "Strong evidence presentation. Work on time allocation in summary speech.",
    format: "PF",
  },
  {
    id: "3",
    judge: "Dr. Patel",
    date: "2026-03-01",
    summary: "Outstanding cross-examination. Your 2AR was one of the best I've seen this season.",
    format: "CX",
  },
];
