import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, Trophy, MinusCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<{ id: string; name: string } | null>(null);
  const { data: ballots = [] } = useQuery({
    queryKey: ["admin-ballots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ballots")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const submittedBallots = ballots.filter((b: any) => b.status === "submitted");

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}. Manage tournament data.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <ClipboardCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{submittedBallots.length}</p>
                  <p className="text-sm text-muted-foreground">Submitted Ballots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card col-span-2 lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Trophy className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{ballots.length}</p>
                  <p className="text-sm text-muted-foreground">Total Ballots</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Ballots */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">All Submitted Ballots</CardTitle>
          </CardHeader>
          <CardContent>
            {submittedBallots.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No ballots submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {submittedBallots.map((ballot: any) => (
                  <div
                    key={ballot.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {ballot.tournament_name || "Untitled"} — {ballot.session_name || "Session"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Round {ballot.round_number} · {ballot.format?.toUpperCase()} ·{" "}
                        {ballot.submitted_at
                          ? format(new Date(ballot.submitted_at), "MMM d, yyyy h:mm a")
                          : "—"}
                      </p>
                    </div>
                    <Badge className="bg-success text-success-foreground">submitted</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No users yet.</p>
            ) : (
              <div className="space-y-2">
                {profiles.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{p.full_name || "—"}</p>
                      <p className="text-sm text-muted-foreground">{p.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.school || "—"}</p>
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
