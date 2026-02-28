import { motion, AnimatePresence } from "framer-motion";
import { Bot, CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import type { StepCompleteEvent } from "@/lib/api";

export type StepStatus = "waiting" | "running" | "completed" | "error";

interface Step {
  name: string;
  status: string;
  log?: StepCompleteEvent["log"];
}

const statusConfig: Record<string, { dot: string; label: string; icon: typeof CheckCircle2; color: string }> = {
  waiting: { dot: "bg-warning/60", label: "Queued", icon: Clock, color: "text-warning" },
  running: { dot: "bg-success animate-pulse", label: "Running", icon: Loader2, color: "text-success" },
  completed: { dot: "bg-primary", label: "Done", icon: CheckCircle2, color: "text-primary" },
  error: { dot: "bg-destructive", label: "Error", icon: AlertCircle, color: "text-destructive" },
};

const defaultStatus = { dot: "bg-muted-foreground/40", label: "Idle", icon: Clock, color: "text-muted-foreground" };

interface AgentWorkflowProps {
  steps: Step[];
  currentStepIndex: number;
  isRunning: boolean;
  isComplete: boolean;
}

export function AgentWorkflow({ steps, currentStepIndex, isRunning, isComplete }: AgentWorkflowProps) {
  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Live Agent Workflow</h2>
            <p className="text-xs text-muted-foreground">
              {isComplete
                ? "Pipeline complete"
                : isRunning
                ? `Running step ${currentStepIndex + 1}/${steps.length}`
                : steps.length === 0
                ? "Upload a CV to start the pipeline"
                : "Ready"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isRunning || isComplete) && steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Steps Done</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {completedCount}/{steps.length}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Status</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {isComplete ? "Done" : "Processing"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bot className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">Upload a CV to start the AI pipeline</p>
          </div>
        )}
        {steps.map((step, i) => {
          const cfg = statusConfig[step.status] || defaultStatus;
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={`${step.name}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`rounded-lg p-3 transition-all ${
                step.status === "running"
                  ? "bg-success/5 border border-success/20"
                  : step.status === "completed"
                  ? "bg-primary/5 border border-primary/20"
                  : step.status === "error"
                  ? "bg-destructive/5 border border-destructive/20"
                  : "bg-secondary/30 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {i < steps.length - 1 && (
                    <div className="absolute top-3 left-[3px] w-0.5 h-6 bg-border/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon
                      className={`h-3 w-3 ${cfg.color} ${step.status === "running" ? "animate-spin" : ""}`}
                    />
                    <span className="text-xs font-medium text-foreground">{step.name}</span>
                  </div>
                  <span className={`text-[10px] ${cfg.color}`}>{cfg.label}</span>
                </div>
                {step.log?.time && (
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-muted-foreground">{step.log.time}</p>
                  </div>
                )}
              </div>

              {step.status === "running" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-300 animate-pulse w-2/3" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
