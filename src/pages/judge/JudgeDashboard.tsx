import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Clock, Users } from "lucide-react";
import { format } from "date-fns";

export default function JudgeDashboard() {
  const { user, profile } = useAuth();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["judge-congress-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("congress_sessions")
        .select("*")
        .eq("judge_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitted = sessions.filter((s: any) => s.status === "submitted");
  const inProgress = sessions.filter((s: any) => s.status !== "submitted");

  return (
    <DashboardLayout role="judge">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Judge Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}. Ready to judge.
            </p>
          </div>
          <Link to="/judge/congress/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Plus className="h-4 w-4" />
              New Congress Ballot
            </Button>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <ClipboardCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{submitted.length}</p>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{inProgress.length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card col-span-2 lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Recent Congress Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No sessions yet.</p>
                <Link to="/judge/congress/new">
                  <Button variant="outline" className="mt-3">Submit your first ballot</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 10).map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {session.tournament_name || "Untitled"} — {session.chamber_number || session.session_name || "Session"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Round {session.round_number} · Congress ·{" "}
                        {format(new Date(session.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant={session.status === "submitted" ? "default" : "secondary"}
                      className={
                        session.status === "submitted"
                          ? "bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
