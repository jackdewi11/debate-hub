import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Crown, MessageSquare, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CongressSessionData, Speech } from "./types";
import { SPEECH_SCORE_LABELS, RUBRIC_CATEGORIES } from "./types";
import ScoringRubric from "./ScoringRubric";

interface Props {
  data: CongressSessionData;
  onChange: (data: CongressSessionData) => void;
  onNext: () => void;
  onBack: () => void;
}

const emptySpeech = (order: number): Speech => ({
  studentIndex: -1,
  legislationIndex: null,
  side: "affirmative",
  speechScore: null,
  questioningScore: null,
  notes: "",
  speechOrder: order,
});

export default function SpeechTracker({ data, onChange, onNext, onBack }: Props) {
  const [showRubric, setShowRubric] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<Speech>(emptySpeech(data.speeches.length + 1));

  const namedStudents = data.students.filter((s) => s.name.trim());

  const speechCountByStudent = (index: number) =>
    data.speeches.filter((sp) => sp.studentIndex === index).length;

  const avgScoreByStudent = (index: number) => {
    const speeches = data.speeches.filter((sp) => sp.studentIndex === index && sp.speechScore);
    if (speeches.length === 0) return null;
    return (speeches.reduce((s, sp) => s + (sp.speechScore || 0), 0) / speeches.length).toFixed(1);
  };

  const addSpeech = () => {
    if (currentSpeech.studentIndex < 0 || currentSpeech.speechScore === null) return;
    onChange({
      ...data,
      speeches: [...data.speeches, { ...currentSpeech, speechOrder: data.speeches.length + 1 }],
    });
    setCurrentSpeech(emptySpeech(data.speeches.length + 2));
  };

  const removeSpeech = (i: number) => {
    onChange({ ...data, speeches: data.speeches.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Student Tracker Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="shadow-card sticky top-4">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Student Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
            {namedStudents.map((s, i) => {
              const realIndex = data.students.indexOf(s);
              const count = speechCountByStudent(realIndex);
              const avg = avgScoreByStudent(realIndex);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border p-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {s.isPresidingOfficer && (
                      <Crown className="h-3.5 w-3.5 text-accent shrink-0" />
                    )}
                    <span className="font-medium truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {count}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>Speeches given</TooltipContent>
                    </Tooltip>
                    {avg && (
                      <Badge variant="outline" className="text-xs">
                        Avg {avg}
                      </Badge>
                    )}
                    {count === 0 && !s.isPresidingOfficer && (
                      <Badge variant="destructive" className="text-xs">No speech</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Button variant="outline" size="sm" onClick={() => setShowRubric(!showRubric)} className="w-full">
          {showRubric ? "Hide" : "Show"} Scoring Rubric
        </Button>
        {showRubric && <ScoringRubric />}
      </div>

      {/* Right: Speech Entry + Log */}
      <div className="lg:col-span-2 space-y-6">
        {/* New Speech Entry */}
        <Card className="shadow-card border-2 border-accent/30">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" /> Record Speech
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student *</Label>
                <Select
                  value={currentSpeech.studentIndex >= 0 ? String(currentSpeech.studentIndex) : ""}
                  onValueChange={(v) => setCurrentSpeech({ ...currentSpeech, studentIndex: parseInt(v) })}
                >
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {namedStudents.map((s, i) => {
                      const realIndex = data.students.indexOf(s);
                      return (
                        <SelectItem key={realIndex} value={String(realIndex)}>
                          {s.name} {s.isPresidingOfficer ? "👑" : ""} ({speechCountByStudent(realIndex)} speeches)
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Legislation</Label>
                <Select
                  value={currentSpeech.legislationIndex !== null ? String(currentSpeech.legislationIndex) : ""}
                  onValueChange={(v) => setCurrentSpeech({ ...currentSpeech, legislationIndex: parseInt(v) })}
                >
                  <SelectTrigger><SelectValue placeholder="Select bill/resolution" /></SelectTrigger>
                  <SelectContent>
                    {data.legislation.filter((l) => l.title.trim()).map((l, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {l.legislationType === "bill" ? "Bill" : "Res."} #{i + 1}: {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Side</Label>
                <Select
                  value={currentSpeech.side}
                  onValueChange={(v: "affirmative" | "negative") =>
                    setCurrentSpeech({ ...currentSpeech, side: v })
                  }
                >
                  <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affirmative">Affirmative (Pro)</SelectItem>
                    <SelectItem value="negative">Negative (Con)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Speech Score (1–6) *</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <Tooltip key={n}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={currentSpeech.speechScore === n ? "default" : "outline"}
                            size="sm"
                            className={
                              currentSpeech.speechScore === n
                                ? "bg-accent text-accent-foreground"
                                : ""
                            }
                            onClick={() => setCurrentSpeech({ ...currentSpeech, speechScore: n })}
                          >
                            {n}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{SPEECH_SCORE_LABELS[n]}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Questioning (optional)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <Button
                        key={n}
                        variant={currentSpeech.questioningScore === n ? "default" : "outline"}
                        size="sm"
                        className={
                          currentSpeech.questioningScore === n
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                        onClick={() => setCurrentSpeech({ ...currentSpeech, questioningScore: n })}
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Comments on this speech…"
                value={currentSpeech.notes}
                onChange={(e) => setCurrentSpeech({ ...currentSpeech, notes: e.target.value })}
                rows={2}
              />
            </div>

            <Button
              onClick={addSpeech}
              disabled={currentSpeech.studentIndex < 0 || currentSpeech.speechScore === null}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <Plus className="h-4 w-4" /> Add Speech #{data.speeches.length + 1}
            </Button>
          </CardContent>
        </Card>

        {/* Speech Log */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Speech Log ({data.speeches.length} recorded)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.speeches.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No speeches recorded yet. Use the form above to log each speech.
              </p>
            ) : (
              <div className="space-y-2">
                {data.speeches.map((sp, i) => {
                  const student = data.students[sp.studentIndex];
                  const leg =
                    sp.legislationIndex !== null ? data.legislation[sp.legislationIndex] : null;
                  return (
                    <div
                      key={i}
                      className="flex items-start justify-between rounded-lg border border-border p-3 text-sm"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs shrink-0">#{sp.speechOrder}</Badge>
                          <span className="font-medium truncate">{student?.name || "?"}</span>
                          <Badge
                            className={
                              sp.side === "affirmative"
                                ? "bg-success/20 text-success border-success/30"
                                : "bg-destructive/20 text-destructive border-destructive/30"
                            }
                            variant="outline"
                          >
                            {sp.side === "affirmative" ? "AFF" : "NEG"}
                          </Badge>
                        </div>
                        {leg && (
                          <p className="text-xs text-muted-foreground">
                            On: {leg.legislationType === "bill" ? "Bill" : "Res."} — {leg.title}
                          </p>
                        )}
                        {sp.notes && (
                          <p className="text-xs text-muted-foreground italic">"{sp.notes}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary">Score: {sp.speechScore}</Badge>
                        {sp.questioningScore && (
                          <Badge variant="outline">Q: {sp.questioningScore}</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpeech(i)}
                          className="text-destructive h-7 w-7 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PO Scoring */}
        {data.students.some((s) => s.isPresidingOfficer) && (
          <Card className="shadow-card border-accent/30 border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" /> Presiding Officer Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.students
                .map((s, i) => ({ s, i }))
                .filter(({ s }) => s.isPresidingOfficer)
                .map(({ s, i }) => (
                  <div key={i} className="space-y-3">
                    <p className="font-medium">{s.name}</p>
                    <div className="space-y-2">
                      <Label>PO Score (2–6 pts per hour)</Label>
                      <div className="flex gap-1">
                        {[2, 3, 4, 5, 6].map((n) => (
                          <Tooltip key={n}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={s.poScore === n ? "default" : "outline"}
                                size="sm"
                                className={s.poScore === n ? "bg-accent text-accent-foreground" : ""}
                                onClick={() => {
                                  const updated = [...data.students];
                                  updated[i] = { ...updated[i], poScore: n };
                                  onChange({ ...data, students: updated });
                                }}
                              >
                                {n}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{n} points/hour</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>PO Comments</Label>
                      <Textarea
                        placeholder="Comments on parliamentarian performance, fairness, control of chamber…"
                        value={s.poComments}
                        onChange={(e) => {
                          const updated = [...data.students];
                          updated[i] = { ...updated[i], poComments: e.target.value };
                          onChange({ ...data, students: updated });
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pb-4">
          <Button variant="outline" onClick={onBack}>← Back to Setup</Button>
          <Button
            onClick={onNext}
            disabled={data.speeches.length === 0}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Proceed to Rankings →
          </Button>
        </div>
      </div>
    </div>
  );
}
