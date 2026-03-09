import DashboardLayout from "@/components/layout/DashboardLayout";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import FormatBreakdown from "@/components/dashboard/FormatBreakdown";
import { MOCK_PERFORMANCE_DATA, MOCK_FORMAT_BREAKDOWN } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const monthlyData = [
  { month: "Oct", rounds: 6, wins: 4 },
  { month: "Nov", rounds: 8, wins: 5 },
  { month: "Dec", rounds: 5, wins: 3 },
  { month: "Jan", rounds: 10, wins: 7 },
  { month: "Feb", rounds: 9, wins: 6 },
  { month: "Mar", rounds: 9, wins: 7 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your debate performance.</p>
        </div>

        <PerformanceChart data={MOCK_PERFORMANCE_DATA} />

        <div className="grid lg:grid-cols-2 gap-6">
          <FormatBreakdown data={MOCK_FORMAT_BREAKDOWN} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              Monthly Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="rounds" name="Total Rounds" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wins" name="Wins" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
