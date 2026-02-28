import { motion } from "framer-motion";
import { Target, MapPin, TrendingUp, Briefcase, User, Zap } from "lucide-react";
import type { UploadResponse } from "@/lib/api";

interface StrategyCardProps {
  profile: UploadResponse["profile"];
  detectedRole: { primary_role: string; seniority: string; location: string } | null;
  matchedJobCount: number;
  applicationCount: number;
}

export function StrategyCard({ profile, detectedRole, matchedJobCount, applicationCount }: StrategyCardProps) {
  const items = [
    { icon: User, label: "Name", value: profile.name || "Parsing...", color: "text-primary" },
    { icon: Target, label: "Detected Role", value: detectedRole?.primary_role || "Detecting...", color: "text-primary" },
    { icon: MapPin, label: "Location", value: detectedRole?.location || "Detecting...", color: "text-primary" },
    { icon: TrendingUp, label: "Seniority", value: detectedRole?.seniority || "Detecting...", color: "text-warning" },
    { icon: Zap, label: "Skills Found", value: `${profile.skill_count} skills`, color: "text-success" },
    { icon: Briefcase, label: "Matches / Apps", value: `${matchedJobCount} / ${applicationCount}`, color: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Strategy Overview</h2>
          <p className="text-xs text-muted-foreground">Parsed from your resume</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className={`h-3 w-3 ${item.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {profile.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 12).map((skill) => (
            <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] text-primary font-medium">
              {skill}
            </span>
          ))}
          {profile.skills.length > 12 && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] text-muted-foreground">
              +{profile.skills.length - 12} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
