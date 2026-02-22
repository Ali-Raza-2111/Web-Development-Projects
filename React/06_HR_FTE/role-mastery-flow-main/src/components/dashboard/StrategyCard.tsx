import { motion } from "framer-motion";
import { Target, MapPin, TrendingUp, Percent, Calendar, Zap } from "lucide-react";

export function StrategyCard() {
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
          <p className="text-xs text-muted-foreground">Current job search configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { icon: Target, label: "Target Role", value: "Senior Backend Engineer", color: "text-primary" },
          { icon: MapPin, label: "Location", value: "Berlin, Germany", color: "text-primary" },
          { icon: Calendar, label: "Weekly Target", value: "25 applications", color: "text-primary" },
          { icon: Percent, label: "Match Confidence", value: "87%", color: "text-success" },
          { icon: TrendingUp, label: "Interview Probability", value: "34%", color: "text-warning" },
          { icon: Zap, label: "Strategy", value: "Aggressive", color: "text-primary" },
        ].map((item, i) => (
          <div key={i} className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className={`h-3 w-3 ${item.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
