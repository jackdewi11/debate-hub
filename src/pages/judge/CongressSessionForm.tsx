import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import SessionSetup from "@/components/congress/SessionSetup";
import SpeechTracker from "@/components/congress/SpeechTracker";
import FinalRankings from "@/components/congress/FinalRankings";
import type { CongressSessionData, SessionStep, SessionStudent } from "@/components/congress/types";

const initialData = (): CongressSessionData => ({
  tournamentName: "",
  chamberNumber: "",
  sessionName: "",
  roundNumber: "1",
  speakingOrderMethod: "volunteer",
  questioningFormat: "direct",
  notes: "",
  students: Array.from({ length: 6 }, () => ({
    name: "",
    school: "",
    isPresidingOfficer: false,
    poScore: null,
    poComments: "",
    finalRank: null,
  })),
  legislation: [
    { title: "", legislationType: "bill", voteOutcome: "", sortOrder: 0 },
    { title: "", legislationType: "bill", voteOutcome: "", sortOrder: 1 },
  ],
  speeches: [],
});

const STEPS: { key: SessionStep; label: string }[] = [
  { key: "setup", label: "1. Setup" },
  { key: "speeches", label: "2. Speeches" },
  { key: "rankings", label: "3. Rankings" },
];

export default function CongressSessionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<SessionStep>("setup");
  const [data, setData] = useState<CongressSessionData>(initialData());
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      // 1. Create congress session
      const { data: session, error: sessionError } = await supabase
        .from("congress_sessions")
        .insert({
          judge_id: user.id,
          tournament_name: data.tournamentName || null,
          chamber_number: data.chamberNumber || null,
          session_name: data.sessionName || null,
          round_number: parseInt(data.roundNumber) || 1,
          status: "submitted",
          speaking_order_method: data.speakingOrderMethod,
          questioning_format: data.questioningFormat,
          notes: data.notes || null,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // 2. Create legislation items
      const legislationMap: Record<number, string> = {};
      for (let i = 0; i < data.legislation.length; i++) {
        const leg = data.legislation[i];
        if (!leg.title.trim()) continue;
        const { data: legRow, error: legError } = await supabase
          .from("congress_legislation")
          .insert({
            session_id: session.id,
            title: leg.title.trim(),
            legislation_type: leg.legislationType,
            vote_outcome: leg.voteOutcome || null,
            sort_order: i,
          })
          .select()
          .single();
        if (legError) throw legError;
        legislationMap[i] = legRow.id;
      }

      // 3. Create competitors and session students
      const studentMap: Record<number, string> = {}; // index -> session_student id
      const namedStudents = data.students
        .map((s, i) => ({ ...s, originalIndex: i }))
        .filter((s) => s.name.trim());

      for (const s of namedStudents) {
        // Create competitor (guest)
        const { data: comp, error: compErr } = await supabase
          .from("competitors")
          .insert({ name: s.name.trim(), school: s.school.trim() || null, is_guest: !s.userId, user_id: s.userId || null })
          .select()
          .single();
        if (compErr) throw compErr;

        // Create session student
        const { data: ss, error: ssErr } = await supabase
          .from("congress_session_students")
          .insert({
            session_id: session.id,
            competitor_id: comp.id,
            is_presiding_officer: s.isPresidingOfficer,
            po_score: s.poScore,
            po_comments: s.poComments || null,
            final_rank: s.finalRank,
          })
          .select()
          .single();
        if (ssErr) throw ssErr;
        studentMap[s.originalIndex] = ss.id;
      }

      // 4. Create speeches
      for (const sp of data.speeches) {
        const sessionStudentId = studentMap[sp.studentIndex];
        if (!sessionStudentId) continue;

        const { error: spErr } = await supabase.from("congress_speeches").insert({
          session_id: session.id,
          student_id: sessionStudentId,
          legislation_id: sp.legislationIndex !== null ? legislationMap[sp.legislationIndex] || null : null,
          side: sp.side,
          speech_score: sp.speechScore,
          questioning_score: sp.questioningScore,
          notes: sp.notes || null,
          speech_order: sp.speechOrder,
        });
        if (spErr) throw spErr;
      }

      toast({
        title: "Ballot submitted!",
        description: `${namedStudents.length} students ranked, ${data.speeches.length} speeches recorded.`,
      });
      navigate("/judge");
    } catch (err: any) {
      toast({ title: "Error submitting ballot", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="judge">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Congress Session Ballot
          </h1>
          <p className="text-muted-foreground mt-1">
            Judge a full Congressional Debate session — track speeches, evaluate the PO, and rank all competitors.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <Badge
              key={s.key}
              variant={step === s.key ? "default" : "outline"}
              className={
                step === s.key
                  ? "bg-accent text-accent-foreground"
                  : "cursor-default"
              }
            >
              {s.label}
            </Badge>
          ))}
        </div>

        {/* Steps */}
        {step === "setup" && (
          <SessionSetup data={data} onChange={setData} onNext={() => setStep("speeches")} />
        )}
        {step === "speeches" && (
          <SpeechTracker
            data={data}
            onChange={setData}
            onNext={() => setStep("rankings")}
            onBack={() => setStep("setup")}
          />
        )}
        {step === "rankings" && (
          <FinalRankings
            data={data}
            onChange={setData}
            onSubmit={handleSubmit}
            onBack={() => setStep("speeches")}
            submitting={submitting}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
