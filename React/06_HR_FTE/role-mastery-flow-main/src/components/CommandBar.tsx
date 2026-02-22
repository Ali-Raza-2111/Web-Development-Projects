import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, X, Play, AlertTriangle, Clock, Cpu, ChevronRight } from "lucide-react";

const examplePlan = {
  command: "Apply to 15 backend roles in Germany with high personalization",
  steps: [
    { agent: "Job Intelligence", task: "Scan 200+ listings matching criteria", time: "~2 min" },
    { agent: "Matching Engine", task: "Score & rank top 15 positions", time: "~1 min" },
    { agent: "Personalization Agent", task: "Generate 15 tailored CVs & cover letters", time: "~8 min" },
    { agent: "Outreach Agent", task: "Compose & send personalized emails", time: "~3 min" },
  ],
  estimatedCost: "$4.20",
  riskScore: "Low",
  totalTime: "~14 min",
};

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) setShowPlan(true);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ml-[110px] flex items-center gap-2 rounded-full glass-strong px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-all hover:glow-sm cursor-pointer"
      >
        <Terminal className="h-4 w-4 text-primary" />
        <span>Command AI...</span>
        <kbd className="ml-2 rounded bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center pb-8 bg-background/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setShowPlan(false); setCommand(""); }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl ml-[220px]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence>
                {showPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-3 glass-strong rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Execution Plan</h3>
                      </div>
                      <button onClick={() => setShowPlan(false)}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {examplePlan.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{step.task}</p>
                            <p className="text-[10px] text-muted-foreground">{step.agent}</p>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{step.time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{examplePlan.totalTime}</span>
                      <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{examplePlan.estimatedCost}</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Risk: {examplePlan.riskScore}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                        <Play className="h-3.5 w-3.5" /> Approve & Execute
                      </button>
                      <button className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        Modify
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="glass-strong rounded-xl p-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary ml-3" />
                <input
                  autoFocus
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type a command... e.g. 'Apply to 15 backend roles in Germany'"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  Execute <ChevronRight className="h-3 w-3" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
