import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bot, Wrench, Brain, ChevronRight } from "lucide-react";
import type { LogEntry } from "@/pages/Index";

interface ActivityLogViewProps {
  logs: LogEntry[];
}

export function ActivityLogView({ logs }: ActivityLogViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Real-Time Agent Activity</h2>
          <p className="text-xs text-muted-foreground">
            {logs.length === 0 ? "Waiting for agents to start..." : `${logs.length} events logged`}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Activity className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">Start the workflow to see live agent activity</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={`${log.agent}-${i}`}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="rounded-lg bg-secondary/30 p-4 border border-border/30 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{log.agent}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{log.time}</span>
              </div>

              <p className="text-xs text-foreground/90 mb-2">{log.task}</p>

              <div className="rounded-md bg-background/50 p-2.5 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Brain className="h-3 w-3 text-primary/70" />
                  <span className="text-[10px] text-primary/70 font-medium uppercase tracking-wider">Reasoning</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{log.reasoning}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wrench className="h-3 w-3 text-muted-foreground" />
                  {log.tools.map((tool) => (
                    <span key={tool} className="rounded-full bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-success">{log.confidence}%</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[10px] text-primary/60">
                <ChevronRight className="h-3 w-3" />
                <span>{log.nextAction}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
