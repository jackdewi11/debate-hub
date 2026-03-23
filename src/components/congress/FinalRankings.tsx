import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Crown, MessageSquare, Trophy } from "lucide-react";
import type { CongressSessionData, Legislation } from "./types";

interface Props {
  data: CongressSessionData;
  onChange: (data: CongressSessionData) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function FinalRankings({ data, onChange, onSubmit, onBack, submitting }: Props) {
  const namedStudents = data.students
    .map((s, i) => ({ ...s, originalIndex: i }))
    .filter((s) => s.name.trim());

  const speechCount = (idx: number) => data.speeches.filter((sp) => sp.studentIndex === idx).length;
  const avgScore = (idx: number) => {
    const speeches = data.speeches.filter((sp) => sp.studentIndex === idx && sp.speechScore);
    if (speeches.length === 0) return null;
    return (speeches.reduce((s, sp) => s + (sp.speechScore || 0), 0) / speeches.length).toFixed(1);
  };

  const setRank = (studentOriginalIndex: number, rank: number | null) => {
    const updated = [...data.students];
    updated[studentOriginalIndex] = { ...updated[studentOriginalIndex], finalRank: rank };
    onChange({ ...data, students: updated });
  };

  const updateVoteOutcome = (legIndex: number, outcome: string) => {
    const updated = [...data.legislation];
    updated[legIndex] = { ...updated[legIndex], voteOutcome: outcome };
    onChange({ ...data, legislation: updated });
  };

  const usedRanks = new Set(
    data.students.filter((s) => s.finalRank !== null).map((s) => s.finalRank)
  );

  const allRanked = namedStudents.every((s) => s.finalRank !== null && s.finalRank > 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" /> Final Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Rank all students holistically based on overall impact, not just speech count. 
            Every student must receive a unique rank before submitting.
          </p>
          <div className="space-y-3">
            {namedStudents.map((s) => {
              const count = speechCount(s.originalIndex);
              const avg = avgScore(s.originalIndex);
              return (
                <div
                  key={s.originalIndex}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Select
                    value={s.finalRank ? String(s.finalRank) : ""}
                    onValueChange={(v) => setRank(s.originalIndex, parseInt(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="#" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: namedStudents.length }, (_, i) => i + 1).map((r) => (
                        <SelectItem
                          key={r}
                          value={String(r)}
                          disabled={usedRanks.has(r) && data.students[s.originalIndex].finalRank !== r}
                        >
                          {r}{r === 1 ? "st" : r === 2 ? "nd" : r === 3 ? "rd" : "th"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{s.name}</span>
                      {s.isPresidingOfficer && <Crown className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.school || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />{count}
                    </Badge>
                    {avg && <Badge variant="outline" className="text-xs">Avg {avg}</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legislation outcomes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Legislation Outcomes (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.legislation.filter((l) => l.title.trim()).map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium min-w-0 flex-1 truncate">
                {l.legislationType === "bill" ? "Bill" : "Res."} #{i + 1}: {l.title}
              </span>
              <Select
                value={l.voteOutcome || ""}
                onValueChange={(v) => updateVoteOutcome(i, v)}
              >
                <SelectTrigger className="w-32"><SelectValue placeholder="Outcome" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="tabled">Tabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Session Notes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Session Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Overall session comments, observations on chamber quality…"
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pb-8">
        <Button variant="outline" onClick={onBack}>← Back to Speeches</Button>
        <Button
          onClick={onSubmit}
          disabled={!allRanked || submitting}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
        >
          <Trophy className="h-4 w-4" />
          {submitting ? "Submitting…" : "Submit Ballot"}
        </Button>
      </div>
      {!allRanked && (
        <p className="text-sm text-destructive text-right -mt-4">
          All students must be ranked before submitting.
        </p>
      )}
    </div>
  );
}
