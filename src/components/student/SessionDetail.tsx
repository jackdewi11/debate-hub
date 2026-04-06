import { useState } from "react";
import { ChevronDown, ChevronUp, Mic, Crown } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  entry: any;
  speeches: any[];
}

export default function SessionDetail({ entry, speeches }: Props) {
  const [open, setOpen] = useState(false);
  const session = entry.congress_sessions;
  const studentSpeeches = speeches
    .filter((s: any) => s.student_id === entry.id)
    .sort((a: any, b: any) => (a.speech_order || 0) - (b.speech_order || 0));

  // Fetch legislation titles for speech detail
  const legislationIds = [...new Set(studentSpeeches.map((s: any) => s.legislation_id).filter(Boolean))];
  const { data: legislation = [] } = useQuery({
    queryKey: ["legislation-titles", legislationIds],
    queryFn: async () => {
      if (legislationIds.length === 0) return [];
      const { data } = await supabase
        .from("congress_legislation")
        .select("id, title")
        .in("id", legislationIds);
      return data || [];
    },
    enabled: open && legislationIds.length > 0,
  });

  const legMap: Record<string, string> = {};
  legislation.forEach((l: any) => { legMap[l.id] = l.title; });

  const avgScore = studentSpeeches.length > 0
    ? (studentSpeeches.reduce((s: number, sp: any) => s + (sp.speech_score || 0), 0) / studentSpeeches.length).toFixed(1)
    : null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">
            {session?.tournament_name || "—"} — {session?.session_name || "Session"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {session?.submitted_at
                ? format(new Date(session.submitted_at), "MMM d, yyyy")
                : "—"}
            </span>
            {open ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
          <span>Round {session?.round_number}</span>
          {entry.final_rank && <span>Rank: #{entry.final_rank}</span>}
          <span>{studentSpeeches.length} speech{studentSpeeches.length !== 1 ? "es" : ""}</span>
          {avgScore && <span>Avg: {avgScore}</span>}
          {entry.is_presiding_officer && (
            <span className="text-accent font-medium flex items-center gap-1">
              <Crown className="h-3 w-3" /> PO
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/10">
          {/* PO Info */}
          {entry.is_presiding_officer && (
            <div className="rounded-md bg-accent/10 p-3">
              <p className="text-sm font-medium text-accent flex items-center gap-1">
                <Crown className="h-4 w-4" /> Presiding Officer
              </p>
              {entry.po_score && (
                <p className="text-sm text-foreground mt-1">PO Score: {entry.po_score}/6</p>
              )}
              {entry.po_comments && (
                <p className="text-sm text-muted-foreground mt-1 italic">"{entry.po_comments}"</p>
              )}
            </div>
          )}

          {/* Speech Breakdown */}
          {studentSpeeches.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Speech Breakdown</p>
              <div className="space-y-2">
                {studentSpeeches.map((sp: any, i: number) => (
                  <div key={sp.id} className="rounded-md border border-border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Mic className="h-3 w-3" />
                        Speech #{sp.speech_order ?? i + 1}
                        {sp.side && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${sp.side === "AFF" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                            {sp.side}
                          </span>
                        )}
                      </p>
                      <div className="flex gap-3 text-sm">
                        <span className="text-foreground font-medium">{sp.speech_score}/6</span>
                        {sp.questioning_score != null && (
                          <span className="text-muted-foreground">Q: {sp.questioning_score}/6</span>
                        )}
                      </div>
                    </div>
                    {sp.legislation_id && legMap[sp.legislation_id] && (
                      <p className="text-xs text-muted-foreground">
                        On: {legMap[sp.legislation_id]}
                      </p>
                    )}
                    {sp.notes && (
                      <p className="text-sm text-muted-foreground italic mt-1">"{sp.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No speeches recorded for this session.</p>
          )}
        </div>
      )}
    </div>
  );
}
