import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bot, Wrench, Brain, ChevronRight } from "lucide-react";
import type { AgentNode } from "./AgentWorkflow";

interface LogEntry {
  agent: string;
  task: string;
  reasoning: string;
  tools: string[];
  confidence: number;
  nextAction: string;
  time: string;
}

const AGENT_LOG_TEMPLATES: Record<string, Omit<LogEntry, "agent" | "time">> = {
  "Profile Analyzer": {
    task: "Updated skill matrix from latest CV upload",
    reasoning: "Detected 2 new certifications, adjusted competency scores for cloud infrastructure",
    tools: ["CV Parser", "Skill Taxonomy"],
    confidence: 96,
    nextAction: "Re-calibrate matching weights",
  },
  "Job Intelligence": {
    task: "Scanning LinkedIn & Indeed for Senior Backend roles in Berlin",
    reasoning: "Filtering by 3+ years Python/Go experience, remote-first companies with >50 employees",
    tools: ["LinkedIn API", "Indeed Scraper", "Company DB"],
    confidence: 92,
    nextAction: "Pass 47 filtered listings to Matching Engine",
  },
  "Matching Engine": {
    task: "Scored 23 new positions against profile",
    reasoning: "Applied ATS keyword optimization, weighted location preference and salary range",
    tools: ["Scoring Algorithm", "ATS Simulator"],
    confidence: 91,
    nextAction: "Queue top 8 for personalization",
  },
  "Personalization Agent": {
    task: "Generated 8 tailored CVs and cover letters",
    reasoning: "Matched keywords per job description, adjusted tone for company culture fit",
    tools: ["CV Generator", "Tone Analyzer", "Keyword Injector"],
    confidence: 89,
    nextAction: "Send to Outreach Agent for delivery",
  },
  "Outreach Agent": {
    task: "Sent personalized emails to 8 HR contacts",
    reasoning: "High match scores (>88%), warm intro possible via 3 mutual connections",
    tools: ["Email Composer", "Contact Finder", "Gmail API"],
    confidence: 88,
    nextAction: "Schedule follow-ups in 3 days",
  },
  "Interview Prep Agent": {
    task: "Generated company-specific interview prep kits",
    reasoning: "Analyzed Glassdoor reviews and recent blog posts for question pattern prediction",
    tools: ["Glassdoor Scraper", "Question Generator", "STAR Formatter"],
    confidence: 94,
    nextAction: "Notify user — prep materials ready",
  },
};

export function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (agentIndex: number, agent: AgentNode) => {
    const template = AGENT_LOG_TEMPLATES[agent.name];
    if (!template) return;

    const entry: LogEntry = {
      agent: agent.name,
      ...template,
      time: "just now",
    };

    setLogs((prev) => {
      // Update old timestamps
      const updated = prev.map((l, i) => ({
        ...l,
        time: i === 0 ? `${agent.duration}s ago` : l.time,
      }));
      return [entry, ...updated];
    });
  };

  const clearLogs = () => setLogs([]);

  // Expose methods via a ref-like pattern using window events
  // Parent will call these through props
  return (
    <ActivityLogView
      logs={logs}
      addLog={addLog}
      clearLogs={clearLogs}
    />
  );
}

// We export this separately so the parent can control it
export function useActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (agentIndex: number, agent: AgentNode) => {
    const template = AGENT_LOG_TEMPLATES[agent.name];
    if (!template) return;

    const entry: LogEntry = {
      agent: agent.name,
      ...template,
      time: "just now",
    };

    setLogs((prev) => {
      const updated = prev.map((l) => ({
        ...l,
        time: l.time === "just now" ? `${Math.round(agent.duration)}s ago` : l.time,
      }));
      return [entry, ...updated];
    });
  };

  const clearLogs = () => setLogs([]);

  return { logs, addLog, clearLogs };
}

interface ActivityLogViewProps {
  logs: LogEntry[];
  addLog?: (agentIndex: number, agent: AgentNode) => void;
  clearLogs?: () => void;
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
