import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RoundHistoryTable from "@/components/dashboard/RoundHistoryTable";
import FormatBreakdown from "@/components/dashboard/FormatBreakdown";
import RecentFeedback from "@/components/dashboard/RecentFeedback";
import {
  MOCK_STUDENT_STATS,
  MOCK_ROUND_HISTORY,
  MOCK_PERFORMANCE_DATA,
  MOCK_FORMAT_BREAKDOWN,
  MOCK_RECENT_FEEDBACK,
} from "@/lib/mock-data";
import { Target, Trophy, TrendingUp, Award } from "lucide-react";

const STAT_ICONS = [
  <Target className="h-4 w-4" />,
  <TrendingUp className="h-4 w-4" />,
  <Award className="h-4 w-4" />,
  <Trophy className="h-4 w-4" />,
];

export default function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, Alex
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your performance overview for this season.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STUDENT_STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} icon={STAT_ICONS[i]} index={i} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart data={MOCK_PERFORMANCE_DATA} />
          </div>
          <FormatBreakdown data={MOCK_FORMAT_BREAKDOWN} />
        </div>

        {/* Feedback + History */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentFeedback feedback={MOCK_RECENT_FEEDBACK} />
          <RoundHistoryTable rounds={MOCK_ROUND_HISTORY.slice(0, 5)} />
        </div>
      </div>
    </DashboardLayout>
  );
}
