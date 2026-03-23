import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Crown, UserPlus } from "lucide-react";
import type { CongressSessionData, SessionStudent, Legislation } from "./types";

interface Props {
  data: CongressSessionData;
  onChange: (data: CongressSessionData) => void;
  onNext: () => void;
}

const emptyStudent = (): SessionStudent => ({
  name: "",
  school: "",
  isPresidingOfficer: false,
  poScore: null,
  poComments: "",
  finalRank: null,
});

const emptyLegislation = (order: number): Legislation => ({
  title: "",
  legislationType: "bill",
  voteOutcome: "",
  sortOrder: order,
});

export default function SessionSetup({ data, onChange, onNext }: Props) {
  const update = (partial: Partial<CongressSessionData>) => onChange({ ...data, ...partial });

  const addStudent = () => update({ students: [...data.students, emptyStudent()] });
  const removeStudent = (i: number) => {
    if (data.students.length <= 1) return;
    update({ students: data.students.filter((_, idx) => idx !== i) });
  };
  const updateStudent = (i: number, field: keyof SessionStudent, value: any) => {
    const updated = [...data.students];
    if (field === "isPresidingOfficer" && value === true) {
      updated.forEach((s, idx) => { updated[idx] = { ...s, isPresidingOfficer: idx === i }; });
    } else {
      updated[i] = { ...updated[i], [field]: value };
    }
    update({ students: updated });
  };

  const addLegislation = () =>
    update({ legislation: [...data.legislation, emptyLegislation(data.legislation.length)] });
  const removeLegislation = (i: number) =>
    update({ legislation: data.legislation.filter((_, idx) => idx !== i) });
  const updateLegislation = (i: number, field: keyof Legislation, value: any) => {
    const updated = [...data.legislation];
    updated[i] = { ...updated[i], [field]: value };
    update({ legislation: updated });
  };

  const canProceed =
    data.students.filter((s) => s.name.trim()).length >= 2 &&
    data.legislation.filter((l) => l.title.trim()).length >= 1;

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Session Information</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tournament Name</Label>
            <Input
              placeholder="e.g. State Championship"
              value={data.tournamentName}
              onChange={(e) => update({ tournamentName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Chamber Number</Label>
            <Input
              placeholder="e.g. Chamber 1"
              value={data.chamberNumber}
              onChange={(e) => update({ chamberNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Session Name</Label>
            <Input
              placeholder="e.g. Preliminary Session A"
              value={data.sessionName}
              onChange={(e) => update({ sessionName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Round Number</Label>
            <Input
              type="number"
              min="1"
              value={data.roundNumber}
              onChange={(e) => update({ roundNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Speaking Order</Label>
            <Select
              value={data.speakingOrderMethod}
              onValueChange={(v) => update({ speakingOrderMethod: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="volunteer">Volunteer Recognition</SelectItem>
                <SelectItem value="rotation">Rotation</SelectItem>
                <SelectItem value="precedence">Precedence-based</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Questioning Format</Label>
            <Select
              value={data.questioningFormat}
              onValueChange={(v) => update({ questioningFormat: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Questioning</SelectItem>
                <SelectItem value="indirect">Indirect Questioning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Legislation */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Legislation Docket</CardTitle>
          <Button variant="outline" size="sm" onClick={addLegislation} className="gap-1">
            <Plus className="h-4 w-4" /> Add Bill
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.legislation.map((leg, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-8 shrink-0">
                #{i + 1}
              </span>
              <Input
                placeholder="Bill/Resolution title"
                value={leg.title}
                onChange={(e) => updateLegislation(i, "title", e.target.value)}
                className="flex-1"
              />
              <Select
                value={leg.legislationType}
                onValueChange={(v) => updateLegislation(i, "legislationType", v)}
              >
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bill">Bill</SelectItem>
                  <SelectItem value="resolution">Resolution</SelectItem>
                </SelectContent>
              </Select>
              {data.legislation.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeLegislation(i)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Students */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Competitors</CardTitle>
          <Button variant="outline" size="sm" onClick={addStudent} className="gap-1">
            <UserPlus className="h-4 w-4" /> Add Student
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.students.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6 shrink-0">
                {i + 1}
              </span>
              <Input
                placeholder="Student name"
                value={s.name}
                onChange={(e) => updateStudent(i, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="School"
                value={s.school}
                onChange={(e) => updateStudent(i, "school", e.target.value)}
                className="w-36"
              />
              <Button
                variant={s.isPresidingOfficer ? "default" : "outline"}
                size="sm"
                onClick={() => updateStudent(i, "isPresidingOfficer", !s.isPresidingOfficer)}
                className={s.isPresidingOfficer ? "bg-accent text-accent-foreground" : ""}
                title="Mark as Presiding Officer"
              >
                <Crown className="h-4 w-4" />
              </Button>
              {data.students.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeStudent(i)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2">
            Type student names manually — they don't need existing accounts. Click the crown to designate the Presiding Officer.
          </p>
        </CardContent>
      </Card>

      {/* Next */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Begin Judging Session →
        </Button>
      </div>
      {!canProceed && (
        <p className="text-sm text-muted-foreground text-right">
          Add at least 2 students and 1 piece of legislation to proceed.
        </p>
      )}
    </div>
  );
}
