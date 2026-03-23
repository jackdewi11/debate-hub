import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RUBRIC_CATEGORIES } from "./types";
import { BookOpen } from "lucide-react";

export default function ScoringRubric() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Scoring Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {RUBRIC_CATEGORIES.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <p className="text-sm font-medium text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
          </div>
        ))}
        <div className="mt-4 rounded-lg bg-muted/50 p-3 space-y-1">
          <p className="text-xs font-medium text-foreground">Score Scale (1–6)</p>
          <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
            <span>1 = Poor</span>
            <span>2 = Below Avg</span>
            <span>3 = Average</span>
            <span>4 = Good</span>
            <span>5 = Excellent</span>
            <span>6 = Outstanding</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
