import { cn } from "@/lib/utils";
import { getFormatShortName } from "@/lib/format-config";
import type { RoundHistoryItem } from "@/types";
import { motion } from "framer-motion";
import { Trophy, BookOpen, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface RoundHistoryTableProps {
  rounds: RoundHistoryItem[];
}

export default function RoundHistoryTable({ rounds }: RoundHistoryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
    >
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-lg font-semibold text-card-foreground">Round History</h3>
      </div>
      <div className="divide-y divide-border">
        {rounds.map((round) => (
          <div key={round.id}>
            <button
              onClick={() => setExpandedId(expandedId === round.id ? null : round.id)}
              className="w-full px-5 py-3.5 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                {round.type === "tournament" ? (
                  <Trophy className="h-4 w-4 text-gold" />
                ) : (
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-card-foreground truncate">
                    vs {round.opponent}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs font-mono"
                  >
                    {getFormatShortName(round.format)}
                  </Badge>
                  {round.tournamentName && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {round.tournamentName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(round.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · Judge: {round.judgeName}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {round.speakerPoints && (
                  <span className="text-sm font-mono font-medium text-card-foreground">
                    {round.speakerPoints}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                    round.result === "win"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {round.result}
                </span>
                {round.feedback && (
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            </button>
            {expandedId === round.id && round.feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 pb-4 pl-14"
              >
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Judge Feedback</p>
                  <p className="text-sm text-card-foreground">{round.feedback}</p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
