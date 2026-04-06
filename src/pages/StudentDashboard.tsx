import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Award, Mic } from "lucide-react";
import SessionDetail from "@/components/student/SessionDetail";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user, profile } = useAuth();

  // Fetch competitors linked to this user
  const { data: competitors = [] } = useQuery({
    queryKey: ["student-competitors", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("competitors")
        .select("id")
        .eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const competitorIds = competitors.map((c: any) => c.id);

  // Fetch ballot entries (non-congress results)
  const { data: ballotResults = [], isLoading: loadingBallots } = useQuery({
    queryKey: ["student-ballot-results", competitorIds],
    queryFn: async () => {
      if (competitorIds.length === 0) return [];
      const { data, error } = await supabase
        .from("ballot_entries")
        .select("*, ballots(*)")
        .in("competitor_id", competitorIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: competitorIds.length > 0,
  });

  // Fetch congress session results
  const { data: congressResults = [], isLoading: loadingCongress } = useQuery({
    queryKey: ["student-congress-results", competitorIds],
    queryFn: async () => {
      if (competitorIds.length === 0) return [];
      const { data: sessionStudents, error } = await supabase
        .from("congress_session_students")
        .select("*, congress_sessions(*)")
        .in("competitor_id", competitorIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return sessionStudents || [];
    },
    enabled: competitorIds.length > 0,
  });

  // Fetch speeches for these session students
  const sessionStudentIds = congressResults.map((r: any) => r.id);
  const { data: speeches = [] } = useQuery({
    queryKey: ["student-speeches", sessionStudentIds],
    queryFn: async () => {
      if (sessionStudentIds.length === 0) return [];
      const { data } = await supabase
        .from("congress_speeches")
        .select("*")
        .in("student_id", sessionStudentIds);
      return data || [];
    },
    enabled: sessionStudentIds.length > 0,
  });

  const isLoading = loadingBallots || loadingCongress;
  const totalSessions = congressResults.length + ballotResults.length;
  const totalSpeeches = speeches.length;
  const avgSpeechScore = totalSpeeches > 0
    ? (speeches.reduce((sum: number, s: any) => sum + (s.speech_score || 0), 0) / totalSpeeches).toFixed(1)
    : "—";
  const avgRank = congressResults.length > 0
    ? (congressResults.filter((r: any) => r.final_rank).reduce((sum: number, r: any) => sum + r.final_rank, 0) / congressResults.filter((r: any) => r.final_rank).length).toFixed(1)
    : "—";

  const recentFeedback = ballotResults.filter((r: any) => r.feedback).slice(0, 5);
  const hasNoData = competitorIds.length === 0;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your performance overview and judging history.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalSpeeches}</p>
                  <p className="text-sm text-muted-foreground">Speeches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgSpeechScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Speech</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Award className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgRank}</p>
                  <p className="text-sm text-muted-foreground">Avg Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {hasNoData && !isLoading && (
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No results yet. Your performance data will appear here once a judge submits a ballot with your name linked to your account.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Congress Session History */}
        {congressResults.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Congress Session History</CardTitle>
            </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {congressResults.map((entry: any) => (
                   <SessionDetail key={entry.id} entry={entry} speeches={speeches} />
                 ))}
               </div>
             </CardContent>
          </Card>
        )}

        {/* Ballot History (non-congress) */}
        {ballotResults.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Ballot History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ballotResults.slice(0, 15).map((entry: any) => {
                  const ballot = entry.ballots;
                  return (
                    <div key={entry.id} className="rounded-lg border border-border p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">
                          {ballot?.tournament_name || "—"} — {ballot?.session_name || "—"}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {ballot?.submitted_at ? format(new Date(ballot.submitted_at), "MMM d, yyyy") : "—"}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Round {ballot?.round_number}</span>
                        {entry.rank && <span>Rank: #{entry.rank}</span>}
                        {entry.score && <span>Score: {entry.score}</span>}
                      </div>
                      {entry.feedback && (
                        <p className="text-sm text-foreground/80 mt-1 italic">"{entry.feedback}"</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Feedback */}
        {recentFeedback.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentFeedback.map((entry: any) => (
                <div key={entry.id} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-foreground">{entry.feedback}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.ballots?.tournament_name} · Round {entry.ballots?.round_number}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
