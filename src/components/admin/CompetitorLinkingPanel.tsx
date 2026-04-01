import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link2, Check } from "lucide-react";

export default function CompetitorLinkingPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [linking, setLinking] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Record<string, string>>({});

  // Fetch unlinked guest competitors
  const { data: unlinked = [], isLoading } = useQuery({
    queryKey: ["unlinked-competitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .is("user_id", null)
        .eq("is_guest", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch student profiles
  const { data: students = [] } = useQuery({
    queryKey: ["student-profiles-for-linking"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email");
      if (!profiles) return [];
      // Filter to students only
      const result = [];
      for (const p of profiles) {
        const { data: role } = await supabase.rpc("get_user_role", { _user_id: p.id });
        if (role === "student") result.push(p);
      }
      return result;
    },
  });

  const handleLink = async (competitorId: string) => {
    const userId = selectedUser[competitorId];
    if (!userId) return;
    setLinking(competitorId);
    
    const { error } = await supabase
      .from("competitors")
      .update({ user_id: userId, is_guest: false })
      .eq("id", competitorId);

    if (error) {
      toast({ title: "Error linking", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Student linked successfully" });
      queryClient.invalidateQueries({ queryKey: ["unlinked-competitors"] });
    }
    setLinking(null);
  };

  if (unlinked.length === 0 && !isLoading) return null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Link2 className="h-5 w-5" /> Link Guest Competitors to Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              These competitors were entered by judges but aren't linked to any student account. Link them so students can see their results.
            </p>
            {unlinked.map((comp: any) => (
              <div key={comp.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{comp.name}</p>
                  {comp.school && <p className="text-xs text-muted-foreground">{comp.school}</p>}
                </div>
                <Select
                  value={selectedUser[comp.id] || ""}
                  onValueChange={(v) => setSelectedUser((prev) => ({ ...prev, [comp.id]: v }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select student…" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.full_name || s.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  disabled={!selectedUser[comp.id] || linking === comp.id}
                  onClick={() => handleLink(comp.id)}
                  className="gap-1"
                >
                  <Check className="h-4 w-4" /> Link
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
