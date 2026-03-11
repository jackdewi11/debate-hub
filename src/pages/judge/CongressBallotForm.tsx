import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Send } from "lucide-react";

interface CompetitorEntry {
  name: string;
  school: string;
  rank: string;
  score: string;
  feedback: string;
}

const emptyCompetitor = (): CompetitorEntry => ({
  name: "",
  school: "",
  rank: "",
  score: "",
  feedback: "",
});

export default function CongressBallotForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tournamentName, setTournamentName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [roundNumber, setRoundNumber] = useState("1");
  const [notes, setNotes] = useState("");
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([
    emptyCompetitor(),
    emptyCompetitor(),
    emptyCompetitor(),
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addCompetitor = () => setCompetitors([...competitors, emptyCompetitor()]);

  const removeCompetitor = (index: number) => {
    if (competitors.length <= 1) return;
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, field: keyof CompetitorEntry, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!user) return;

    // Validate: at least one competitor with a name
    const validCompetitors = competitors.filter((c) => c.name.trim());
    if (validCompetitors.length === 0) {
      toast({ title: "Add at least one competitor", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create ballot
      const { data: ballot, error: ballotError } = await supabase
        .from("ballots")
        .insert({
          judge_id: user.id,
          tournament_name: tournamentName || null,
          session_name: sessionName || null,
          round_number: parseInt(roundNumber) || 1,
          format: "congress",
          status: asDraft ? "draft" : "submitted",
          notes: notes || null,
          submitted_at: asDraft ? null : new Date().toISOString(),
        })
        .select()
        .single();

      if (ballotError) throw ballotError;

      // 2. Create competitors and ballot entries
      for (const comp of validCompetitors) {
        const { data: competitor, error: compError } = await supabase
          .from("competitors")
          .insert({
            name: comp.name.trim(),
            school: comp.school.trim() || null,
            is_guest: true,
          })
          .select()
          .single();

        if (compError) throw compError;

        const { error: entryError } = await supabase.from("ballot_entries").insert({
          ballot_id: ballot.id,
          competitor_id: competitor.id,
          rank: comp.rank ? parseInt(comp.rank) : null,
          score: comp.score ? parseFloat(comp.score) : null,
          feedback: comp.feedback.trim() || null,
        });

        if (entryError) throw entryError;
      }

      toast({
        title: asDraft ? "Ballot saved as draft" : "Ballot submitted!",
        description: `${validCompetitors.length} competitor(s) scored.`,
      });
      navigate("/judge");
    } catch (err: any) {
      toast({ title: "Error saving ballot", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="judge">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Congress Judging Ballot
          </h1>
          <p className="text-muted-foreground mt-1">
            Score competitors and provide feedback for this session.
          </p>
        </div>

        {/* Round Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Round Information</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tournament Name</Label>
              <Input
                placeholder="e.g. State Championship"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Chamber / Session</Label>
              <Input
                placeholder="e.g. Chamber A"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Round Number</Label>
              <Input
                type="number"
                min="1"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Competitors */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Competitors</CardTitle>
            <Button variant="outline" size="sm" onClick={addCompetitor} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {competitors.map((comp, index) => (
              <div
                key={index}
                className="rounded-lg border border-border p-4 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Competitor #{index + 1}
                  </span>
                  {competitors.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompetitor(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      placeholder="Type competitor name"
                      value={comp.name}
                      onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>School</Label>
                    <Input
                      placeholder="School / Team"
                      value={comp.school}
                      onChange={(e) => updateCompetitor(index, "school", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rank</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={comp.rank}
                      onChange={(e) => updateCompetitor(index, "rank", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Score</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g. 28"
                      value={comp.score}
                      onChange={(e) => updateCompetitor(index, "score", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Feedback</Label>
                  <Textarea
                    placeholder="Comments on this competitor's performance…"
                    value={comp.feedback}
                    onChange={(e) => updateCompetitor(index, "feedback", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* General Notes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">General Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Overall session notes, comments on legislation quality, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pb-8">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting…" : "Submit Ballot"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
