import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Award, Trophy, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user, profile } = useAuth();

  // Fetch ballot entries for this student via competitors linked to their user_id
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["student-results", user?.id],
    queryFn: async () => {
      // Get competitors linked to this user
      const { data: competitors } = await supabase
        .from("competitors")
        .select("id")
        .eq("user_id", user!.id);

      if (!competitors || competitors.length === 0) return [];

      const competitorIds = competitors.map((c: any) => c.id);

      // Get ballot entries for these competitors
      const { data: entries, error } = await supabase
        .from("ballot_entries")
        .select("*, ballots(*)")
        .in("competitor_id", competitorIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return entries || [];
    },
    enabled: !!user,
  });

  const totalRounds = results.length;
  const avgScore = totalRounds > 0
    ? (results.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / totalRounds).toFixed(1)
    : "—";
  const avgRank = totalRounds > 0
    ? (results.reduce((sum: number, r: any) => sum + (r.rank || 0), 0) / totalRounds).toFixed(1)
    : "—";

  const recentFeedback = results
    .filter((r: any) => r.feedback)
    .slice(0, 5);

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
                  <p className="text-2xl font-bold text-foreground">{totalRounds}</p>
                  <p className="text-sm text-muted-foreground">Rounds</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Award className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgRank}</p>
                  <p className="text-sm text-muted-foreground">Avg Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <MessageSquare className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{recentFeedback.length}</p>
                  <p className="text-sm text-muted-foreground">Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Round History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Round History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : results.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No rounds recorded yet. Your results will appear here after judges submit ballots.
              </p>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 15).map((entry: any) => {
                  const ballot = entry.ballots;
                  return (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-border p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">
                          {ballot?.tournament_name || "—"} — {ballot?.session_name || "—"}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {ballot?.submitted_at
                            ? format(new Date(ballot.submitted_at), "MMM d, yyyy")
                            : "—"}
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
            )}
          </CardContent>
        </Card>

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
