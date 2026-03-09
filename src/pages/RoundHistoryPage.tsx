import DashboardLayout from "@/components/layout/DashboardLayout";
import RoundHistoryTable from "@/components/dashboard/RoundHistoryTable";
import { MOCK_ROUND_HISTORY } from "@/lib/mock-data";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FORMAT_FILTERS = [
  { id: "all", label: "All Formats" },
  { id: "ld", label: "LD" },
  { id: "pf", label: "PF" },
  { id: "policy", label: "CX" },
];

const TYPE_FILTERS = [
  { id: "all", label: "All Types" },
  { id: "tournament", label: "Tournament" },
  { id: "practice", label: "Practice" },
];

export default function RoundHistoryPage() {
  const [formatFilter, setFormatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = MOCK_ROUND_HISTORY.filter((r) => {
    if (formatFilter !== "all" && r.format !== formatFilter) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    return true;
  });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Round History
          </h1>
          <p className="text-muted-foreground mt-1">
            All your tournament and practice rounds in one place.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-1.5">
            {FORMAT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormatFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                  formatFilter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                  typeFilter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <RoundHistoryTable rounds={filtered} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No rounds match your filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
