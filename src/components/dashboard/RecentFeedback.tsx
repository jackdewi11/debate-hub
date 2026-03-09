import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeedbackItem {
  id: string;
  judge: string;
  date: string;
  summary: string;
  format: string;
}

interface RecentFeedbackProps {
  feedback: FeedbackItem[];
}

export default function RecentFeedback({ feedback }: RecentFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4 text-gold" />
        <h3 className="font-display text-lg font-semibold text-card-foreground">
          Recent Feedback
        </h3>
      </div>
      <div className="space-y-3">
        {feedback.map((item) => (
          <div key={item.id} className="rounded-lg bg-muted/40 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-card-foreground">{item.judge}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {item.format}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
