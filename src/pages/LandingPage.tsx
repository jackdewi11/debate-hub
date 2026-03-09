import { Link } from "react-router-dom";
import { Trophy, BarChart3, ClipboardCheck, Users, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: ClipboardCheck,
    title: "Format-Specific Ballots",
    description: "LD, Public Forum, and Policy ballots with proper scoring fields and validation.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track speaker points, win rates, and improvement trends over time.",
  },
  {
    icon: Trophy,
    title: "Tournament Management",
    description: "Organize rounds, assign judges, and manage results effortlessly.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Coaches, judges, and students connected in one unified platform.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-gold" />
            <span className="font-display text-xl font-bold text-foreground">DebateHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-navy opacity-[0.03]" />
        <div className="container py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Zap className="h-3.5 w-3.5 text-gold" />
              Built for competitive debate programs
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              The complete hub for{" "}
              <span className="text-gradient-gold">debate tournaments</span>{" "}
              & practice
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Submit format-specific ballots, track student performance over time, and manage
              tournaments — all in one polished platform for coaches, judges, and students.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-20 lg:py-28">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Everything your program needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Purpose-built for LD, Public Forum, and Policy debate.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2.5 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <span className="font-display text-sm font-semibold text-foreground">DebateHub</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DebateHub. Built for academic debate programs.
          </p>
        </div>
      </footer>
    </div>
  );
}
