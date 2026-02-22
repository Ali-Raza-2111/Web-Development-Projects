import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Brain,
  Mail,
  GraduationCap,
  BarChart3,
  Radio,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/applications", icon: Briefcase, label: "Applications" },
  { to: "/cv-versions", icon: FileText, label: "CV Versions" },
  { to: "/job-intelligence", icon: Brain, label: "Job Intelligence" },
  { to: "/outreach", icon: Mail, label: "Outreach" },
  { to: "/interview-prep", icon: GraduationCap, label: "Interview Prep" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/control-tower", icon: Radio, label: "Control Tower" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] border-r border-border/50 bg-sidebar flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-sm">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <span className="text-base font-bold text-gradient">CareerOS</span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary glow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">API Budget</span>
            <span className="text-primary font-mono">$12.40</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-primary to-cyan-300" />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">62% of $20.00 daily limit</p>
        </div>
      </div>
    </aside>
  );
}
