import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface FormatBreakdownProps {
  data: { format: string; wins: number; losses: number; avgPoints: number }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export default function FormatBreakdown({ data }: FormatBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
        Format Breakdown
      </h3>
      <div className="space-y-4">
        {data.map((item, i) => {
          const total = item.wins + item.losses;
          const winPct = total > 0 ? Math.round((item.wins / total) * 100) : 0;
          return (
            <div key={item.format} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-card-foreground">{item.format}</span>
                <span className="text-muted-foreground">
                  {item.wins}W-{item.losses}L · {item.avgPoints} avg pts
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${winPct}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{winPct}% win rate</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
