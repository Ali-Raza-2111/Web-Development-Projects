import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  X,
  Play,
  AlertTriangle,
  Clock,
  Cpu,
  Loader2,
  CheckCircle2,
  XCircle,
  Bot,
  Globe,
  Briefcase,
  AtSign,
  ChevronRight,
} from "lucide-react";
import { connectApplyStream } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Job {
  title: string;
  company: string;
  url: string;
  match_score: number;
}

interface ApplyLog {
  message: string;
  step: string;
}

interface CommandBarProps {
  sessionId?: string | null;
  matchedJobs?: Job[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract the query after the last '@' token in a string. Returns null if no '@'. */
function getAtQuery(text: string): string | null {
  const idx = text.lastIndexOf("@");
  if (idx === -1) return null;
  return text.slice(idx + 1);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CommandBar({ sessionId, matchedJobs = [] }: CommandBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  // Job picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerIndex, setPickerIndex] = useState(0);

  // Selected job (set explicitly via @ picker)
  const [selectedJob, setSelectedJob] = useState<(Job & { index: number }) | null>(null);

  // Apply flow: idle → applying → done | error
  const [phase, setPhase] = useState<"idle" | "applying" | "done" | "error">("idle");
  const [applyLogs, setApplyLogs] = useState<ApplyLog[]>([]);
  const [applyResult, setApplyResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtered jobs for picker
  const filteredJobs = matchedJobs.filter((j) => {
    const q = pickerQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q)
    );
  });

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [applyLogs]);

  // Cleanup on close
  const handleClose = useCallback(() => {
    esRef.current?.close();
    setIsOpen(false);
    setPhase("idle");
    setInputText("");
    setSelectedJob(null);
    setPickerOpen(false);
    setPickerQuery("");
    setPickerIndex(0);
    setApplyLogs([]);
    setApplyResult(null);
    setErrorMsg(null);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Handle input changes — detect @ mention
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    const query = getAtQuery(val);
    if (query !== null) {
      setPickerQuery(query);
      setPickerOpen(true);
      setPickerIndex(0);
    } else {
      setPickerOpen(false);
      setPickerQuery("");
    }
  };

  // Select a job from the picker
  const selectJob = useCallback(
    (job: Job, idx: number) => {
      // Replace everything from the last '@' onward with a clean label
      const atIdx = inputText.lastIndexOf("@");
      const before = atIdx >= 0 ? inputText.slice(0, atIdx) : inputText;
      const label = `@${job.title} at ${job.company}`;
      setInputText(before + label + " ");
      setSelectedJob({ ...job, index: idx });
      setPickerOpen(false);
      setPickerQuery("");
      inputRef.current?.focus();
    },
    [inputText]
  );

  // Keyboard navigation inside the picker
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!pickerOpen || filteredJobs.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPickerIndex((i) => Math.min(i + 1, filteredJobs.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setPickerIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const job = filteredJobs[pickerIndex];
      if (job) selectJob(job, matchedJobs.indexOf(job));
    } else if (e.key === "Escape") {
      setPickerOpen(false);
    }
  };

  // Start applying to the selected job
  const handleApply = () => {
    if (!selectedJob) {
      setErrorMsg("Please type @ and select a job first.");
      setPhase("error");
      return;
    }
    if (!sessionId) {
      setErrorMsg("No active session — please upload a resume first.");
      setPhase("error");
      return;
    }

    setPhase("applying");
    setApplyLogs([]);

    const es = connectApplyStream(sessionId, selectedJob.index, {
      onApplyStart: (data) => {
        setApplyLogs((prev) => [
          ...prev,
          {
            message: `🚀 Starting apply for "${data.job_title}" at ${data.company}`,
            step: "start",
          },
        ]);
      },
      onApplyProgress: (data) => {
        setApplyLogs((prev) => [
          ...prev,
          { message: data.message, step: data.step },
        ]);
      },
      onApplyComplete: (data) => {
        setApplyResult(data);
        setPhase("done");
      },
      onApplyError: (data) => {
        setApplyResult(data);
        setPhase("error");
      },
    });

    esRef.current = es;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating trigger */}
      <button
        id="command-bar-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ml-[110px] flex items-center gap-2 rounded-full glass-strong px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-all hover:glow-sm cursor-pointer"
      >
        <Terminal className="h-4 w-4 text-primary" />
        <span>Command AI…</span>
        <kbd className="ml-2 rounded bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center pb-8 bg-background/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl ml-[220px]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">

                {/* ── APPLYING / DONE CARD ── */}
                {(phase === "applying" || phase === "done") && selectedJob && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-3 glass-strong rounded-xl p-5"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {phase === "applying" ? (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        )}
                        <h3 className="text-sm font-semibold text-foreground">
                          {phase === "applying" ? "Applying…" : "Complete"}
                        </h3>
                      </div>
                      <button onClick={handleClose}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>

                    {/* Job banner */}
                    <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedJob.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedJob.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                          {selectedJob.match_score}% match
                        </span>
                        {selectedJob.url && (
                          <a
                            href={selectedJob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" /> View
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Logs */}
                    {phase === "applying" && (
                      <div className="mb-4 max-h-52 overflow-y-auto space-y-1 font-mono text-[11px]">
                        {applyLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 px-2 py-1 rounded ${log.step === "start"
                                ? "text-primary"
                                : log.step === "warning"
                                  ? "text-yellow-400"
                                  : log.step === "error"
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                              }`}
                          >
                            <Bot className="h-3 w-3 mt-0.5 shrink-0" />
                            <span>{log.message}</span>
                          </div>
                        ))}
                        <div ref={logsEndRef} />
                      </div>
                    )}

                    {/* Done result */}
                    {phase === "done" && applyResult && (
                      <div
                        className={`mb-4 rounded-lg p-4 flex items-center gap-3 ${applyResult.success
                            ? "bg-green-500/10 border border-green-500/30"
                            : "bg-destructive/10 border border-destructive/30"
                          }`}
                      >
                        {applyResult.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive shrink-0" />
                        )}
                        <p className="text-sm text-foreground">
                          {applyResult.message}
                        </p>
                      </div>
                    )}

                    {/* Meta */}
                    {phase === "applying" && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> ~2 min
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> Playwright Automation
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> May require CAPTCHA
                        </span>
                      </div>
                    )}

                    {phase === "done" && (
                      <button
                        onClick={handleClose}
                        className="w-full rounded-lg bg-secondary text-foreground py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </motion.div>
                )}

                {/* ── ERROR CARD ── */}
                {phase === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 glass-strong rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Failed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {errorMsg || applyResult?.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPhase("idle");
                        setErrorMsg(null);
                        setApplyResult(null);
                      }}
                      className="w-full rounded-lg bg-secondary text-foreground py-2 text-sm hover:bg-secondary/80 transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── INPUT BAR ── */}
              {(phase === "idle" || phase === "error") && (
                <div className="glass-strong rounded-xl p-2 relative">

                  {/* @ Job Picker dropdown */}
                  <AnimatePresence>
                    {pickerOpen && filteredJobs.length > 0 && (
                      <motion.div
                        key="picker"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute bottom-full left-0 right-0 mb-2 glass-strong rounded-xl overflow-hidden shadow-2xl border border-border/60"
                      >
                        {/* Picker header */}
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40">
                          <AtSign className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            Select a job to apply to
                          </span>
                        </div>

                        {/* Job list */}
                        <ul className="max-h-64 overflow-y-auto py-1">
                          {filteredJobs.map((job, i) => {
                            const realIdx = matchedJobs.indexOf(job);
                            const isActive = i === pickerIndex;
                            return (
                              <li key={realIdx}>
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault(); // keep input focused
                                    selectJob(job, realIdx);
                                  }}
                                  onMouseEnter={() => setPickerIndex(i)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive
                                      ? "bg-primary/10 text-foreground"
                                      : "text-foreground hover:bg-secondary/60"
                                    }`}
                                >
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${isActive
                                        ? "bg-primary/20"
                                        : "bg-secondary/60"
                                      }`}
                                  >
                                    <Briefcase
                                      className={`h-4 w-4 ${isActive
                                          ? "text-primary"
                                          : "text-muted-foreground"
                                        }`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {job.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {job.company}
                                    </p>
                                  </div>
                                  <span className="text-xs font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full shrink-0">
                                    {job.match_score}%
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Hint */}
                        <div className="flex items-center gap-3 px-4 py-2 border-t border-border/40 text-[10px] text-muted-foreground">
                          <span>↑↓ navigate</span>
                          <span>↵ select</span>
                          <span>Esc cancel</span>
                        </div>
                      </motion.div>
                    )}

                    {/* No results */}
                    {pickerOpen && matchedJobs.length > 0 && filteredJobs.length === 0 && (
                      <motion.div
                        key="no-results"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute bottom-full left-0 right-0 mb-2 glass-strong rounded-xl px-4 py-3 text-xs text-muted-foreground shadow-2xl"
                      >
                        No jobs match "<span className="text-foreground">{pickerQuery}</span>"
                      </motion.div>
                    )}

                    {/* No jobs loaded */}
                    {pickerOpen && matchedJobs.length === 0 && (
                      <motion.div
                        key="no-jobs"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute bottom-full left-0 right-0 mb-2 glass-strong rounded-xl px-4 py-3 text-xs text-muted-foreground shadow-2xl"
                      >
                        No jobs loaded yet — run the pipeline first.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected job chip */}
                  {selectedJob && (
                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium">
                        <Briefcase className="h-3 w-3" />
                        {selectedJob.title} @ {selectedJob.company}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedJob(null);
                            setInputText("");
                            inputRef.current?.focus();
                          }}
                          className="ml-1 hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </div>
                  )}

                  {/* Input row */}
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary ml-3 shrink-0" />
                    <input
                      ref={inputRef}
                      autoFocus
                      id="command-bar-input"
                      value={inputText}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        matchedJobs.length > 0
                          ? "Type @ to pick a job and apply…"
                          : "Run the pipeline first, then type @ to select a job…"
                      }
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-3"
                    />
                    <button
                      type="button"
                      disabled={!selectedJob}
                      onClick={handleApply}
                      className="rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Apply</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
