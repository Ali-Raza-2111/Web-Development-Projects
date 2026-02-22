import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, CheckCircle2, Clock, Loader2, Play, RotateCcw, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type AgentStatus = "idle" | "running" | "completed" | "waiting";

export interface AgentNode {
  name: string;
  status: AgentStatus;
  tokens: number;
  time: number; // seconds
  progress: number; // 0-100
  duration: number; // total expected seconds
}

const AGENT_DEFINITIONS = [
  { name: "Profile Analyzer", duration: 4 },
  { name: "Job Intelligence", duration: 6 },
  { name: "Matching Engine", duration: 5 },
  { name: "Personalization Agent", duration: 7 },
  { name: "Outreach Agent", duration: 4 },
  { name: "Interview Prep Agent", duration: 3 },
];

const statusConfig: Record<AgentStatus, { dot: string; label: string; icon: typeof CheckCircle2; color: string }> = {
  idle: { dot: "bg-muted-foreground/40", label: "Idle", icon: Clock, color: "text-muted-foreground" },
  running: { dot: "bg-success animate-pulse", label: "Running", icon: Loader2, color: "text-success" },
  waiting: { dot: "bg-warning", label: "Queued", icon: Clock, color: "text-warning" },
  completed: { dot: "bg-primary", label: "Completed", icon: CheckCircle2, color: "text-primary" },
};

function createInitialAgents(): AgentNode[] {
  return AGENT_DEFINITIONS.map((def) => ({
    name: def.name,
    status: "idle" as AgentStatus,
    tokens: 0,
    time: 0,
    progress: 0,
    duration: def.duration,
  }));
}

interface AgentWorkflowProps {
  onAgentComplete?: (agentIndex: number, agent: AgentNode) => void;
  onWorkflowStart?: () => void;
  onWorkflowComplete?: () => void;
  autoStart?: boolean;
}

export function AgentWorkflow({ onAgentComplete, onWorkflowStart, onWorkflowComplete, autoStart }: AgentWorkflowProps) {
  const [agents, setAgents] = useState<AgentNode[]>(createInitialAgents());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const totalTokens = agents.reduce((sum, a) => sum + a.tokens, 0);
  const totalTime = agents.reduce((sum, a) => sum + a.time, 0);

  const handleStart = useCallback(() => {
    const freshAgents = createInitialAgents();
    freshAgents[0].status = "running";
    for (let i = 1; i < freshAgents.length; i++) {
      freshAgents[i].status = "waiting";
    }
    setAgents(freshAgents);
    setCurrentAgent(0);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    onWorkflowStart?.();
  }, [onWorkflowStart]);

  // Auto-start when triggered by CV upload
  useEffect(() => {
    if (autoStart && !isRunning) {
      handleStart();
    }
  }, [autoStart, isRunning, handleStart]);

  // Simulate agent processing
  useEffect(() => {
    if (!isRunning || isPaused || currentAgent < 0 || currentAgent >= agents.length) return;

    const agent = agents[currentAgent];
    if (agent.status === "completed") {
      // Move to next agent
      if (currentAgent + 1 < agents.length) {
        setCurrentAgent((prev) => prev + 1);
        setAgents((prev) =>
          prev.map((a, i) =>
            i === currentAgent + 1 ? { ...a, status: "running" } : a
          )
        );
      } else {
        setIsRunning(false);
        setIsComplete(true);
        onWorkflowComplete?.();
      }
      return;
    }

    const interval = setInterval(() => {
      setAgents((prev) => {
        const updated = [...prev];
        const current = { ...updated[currentAgent] };
        const step = 100 / (current.duration * 10); // 100ms interval
        current.progress = Math.min(current.progress + step, 100);
        current.time = parseFloat(((current.progress / 100) * current.duration).toFixed(1));
        current.tokens = Math.round((current.progress / 100) * (1500 + Math.random() * 8000));

        if (current.progress >= 100) {
          current.status = "completed";
          current.progress = 100;
          current.time = current.duration;
          current.tokens = Math.round(1500 + Math.random() * 8000);

          // Mark next as running
          if (currentAgent + 1 < updated.length) {
            updated[currentAgent + 1] = { ...updated[currentAgent + 1], status: "running" };
          }

          // Fire completion callback
          setTimeout(() => {
            onAgentComplete?.(currentAgent, current);
            if (currentAgent + 1 < prev.length) {
              setCurrentAgent((c) => c + 1);
            } else {
              setIsRunning(false);
              setIsComplete(true);
              onWorkflowComplete?.();
            }
          }, 0);
        }

        updated[currentAgent] = current;
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, currentAgent, agents, onAgentComplete, onWorkflowComplete]);


  const handlePause = () => setIsPaused((p) => !p);

  const handleReset = useCallback(() => {
    setAgents(createInitialAgents());
    setIsRunning(false);
    setIsPaused(false);
    setCurrentAgent(-1);
    setIsComplete(false);
  }, []);

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
                ? isPaused
                  ? "Paused"
                  : `Running agent ${currentAgent + 1}/${agents.length}`
                : "Ready to start"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isRunning && !isComplete && (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Play className="h-3 w-3" /> Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 rounded-lg bg-secondary text-foreground px-3 py-1.5 text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
          {(isRunning || isComplete) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg bg-secondary text-muted-foreground px-3 py-1.5 text-xs font-medium hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <AnimatePresence>
        {(isRunning || isComplete) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 gap-2 mb-4"
          >
            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Agents Done</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {agents.filter((a) => a.status === "completed").length}/{agents.length}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Tokens</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Time</p>
              <p className="text-sm font-mono font-bold text-foreground">{totalTime.toFixed(1)}s</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {agents.map((agent, i) => {
          const cfg = statusConfig[agent.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`rounded-lg p-3 transition-all ${
                agent.status === "running"
                  ? "bg-success/5 border border-success/20"
                  : agent.status === "completed"
                  ? "bg-primary/5 border border-primary/20"
                  : "bg-secondary/30 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {i < agents.length - 1 && (
                    <div className="absolute top-3 left-[3px] w-0.5 h-6 bg-border/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon
                      className={`h-3 w-3 ${cfg.color} ${agent.status === "running" ? "animate-spin" : ""}`}
                    />
                    <span className="text-xs font-medium text-foreground">{agent.name}</span>
                  </div>
                  <span className={`text-[10px] ${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {agent.tokens > 0
                      ? `${agent.tokens > 1000 ? (agent.tokens / 1000).toFixed(1) + "k" : agent.tokens} tokens`
                      : "— tokens"}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {agent.time > 0 ? `${agent.time}s` : "—"}
                  </p>
                </div>
              </div>

              {/* Progress bar for running agent */}
              {agent.status === "running" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <Progress value={agent.progress} className="h-1" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
