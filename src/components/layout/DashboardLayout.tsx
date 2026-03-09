import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: string;
}

const NAV_ITEMS = {
  student: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Round History", path: "/dashboard/history", icon: ClipboardCheck },
    { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ],
  coach: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Students", path: "/dashboard/students", icon: Users },
    { label: "Practice", path: "/dashboard/practice", icon: GraduationCap },
    { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ],
  judge: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Assignments", path: "/dashboard/assignments", icon: ClipboardCheck },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Tournaments", path: "/dashboard/tournaments", icon: Trophy },
    { label: "Judges", path: "/dashboard/judges", icon: Users },
    { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ],
};

export default function DashboardLayout({ children, role = "student" }: DashboardLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = NAV_ITEMS[role as keyof typeof NAV_ITEMS] ?? NAV_ITEMS.student;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col gradient-navy">
        <div className="flex h-16 items-center gap-2 px-6">
          <Trophy className="h-6 w-6 text-gold" />
          <span className="font-display text-lg font-bold text-sidebar-foreground">DebateHub</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-gold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            <span className="font-display font-bold text-foreground">DebateHub</span>
          </div>
        </header>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 gradient-navy p-3 pt-16 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-gold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
