import { useState, useCallback, useRef, useEffect } from "react";
import { StrategyCard } from "@/components/dashboard/StrategyCard";
import { AgentWorkflow } from "@/components/dashboard/AgentWorkflow";
import { ActivityLogView } from "@/components/dashboard/ActivityLog";
import { CVUpload } from "@/components/dashboard/CVUpload";
import { CommandBar } from "@/components/CommandBar";
import {
  uploadResume,
  connectPipelineStream,
  connectApplyStream,
  checkHealth,
  getLatestSession,
  getSessionStatus,
  type UploadResponse,
  type StepCompleteEvent,
  type PipelineCompleteEvent,
} from "@/lib/api";

export interface LogEntry {
  agent: string;
  task: string;
  reasoning: string;
  tools: string[];
  confidence: number;
  nextAction: string;
  time: string;
}

type ApplyStatus = "idle" | "applying" | "done" | "error";

interface ApplyState {
  jobIndex: number;
  title: string;
  company: string;
  status: ApplyStatus;
  logs: string[];
  result?: string;
}

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    // Restore session ID from localStorage on mount
    return localStorage.getItem("careeros_session_id");
  });
  const [profile, setProfile] = useState<UploadResponse["profile"] | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineCompleteEvent | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<{ name: string; status: string; log?: StepCompleteEvent["log"] }[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Job selection & auto-apply
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set());
  const [applyQueue, setApplyQueue] = useState<ApplyState[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const applyEsRef = useRef<EventSource | null>(null);
  const applyLogsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  // ── Restore session from backend on mount / page refresh ──
  useEffect(() => {
    const restoreSession = async () => {
      // Try localStorage session ID first, then fall back to latest
      const storedId = localStorage.getItem("careeros_session_id");
      let data = storedId ? await getSessionStatus(storedId) : null;
      if (!data) {
        data = await getLatestSession();
      }
      if (data && data.session_id) {
        setSessionId(data.session_id);
        localStorage.setItem("careeros_session_id", data.session_id);
        if (data.profile) setProfile(data.profile);
        if (data.result) {
          setPipelineResult(data.result);
          // Mark steps as completed so the UI shows the finished state
          const stepNames = ["Resume Parser", "Role Detector", "Job Intelligence", "Matching Engine", "Application Generator"];
          setSteps(stepNames.map((name) => ({ name, status: "completed" })));
          setCurrentStepIndex(stepNames.length - 1);
        }
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
      applyEsRef.current?.close();
    };
  }, []);

  // Auto-scroll apply logs
  useEffect(() => {
    applyLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [applyQueue]);

  const clearState = useCallback(() => {
    setLogs([]);
    setSteps([]);
    setCurrentStepIndex(-1);
    setPipelineResult(null);
    setError(null);
    setSelectedJobs(new Set());
    setApplyQueue([]);
  }, []);

  const toggleJobSelection = (index: number) => {
    setSelectedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAllJobs = () => {
    if (!pipelineResult) return;
    const allWithUrl = pipelineResult.matched_jobs
      .map((j, i) => (j.url ? i : -1))
      .filter((i) => i >= 0);
    setSelectedJobs(new Set(allWithUrl));
  };

  const deselectAllJobs = () => setSelectedJobs(new Set());

  // ── Sequential auto-apply for selected jobs ──
  const startAutoApply = useCallback(async () => {
    if (!sessionId || !pipelineResult || selectedJobs.size === 0) return;

    setIsApplying(true);
    const indices = Array.from(selectedJobs).sort((a, b) => a - b);
    const queue: ApplyState[] = indices.map((idx) => {
      const job = pipelineResult.matched_jobs[idx];
      return {
        jobIndex: idx,
        title: job.title,
        company: job.company,
        status: "idle" as ApplyStatus,
        logs: [],
      };
    });
    setApplyQueue(queue);

    for (let qi = 0; qi < queue.length; qi++) {
      // Mark current as applying
      setApplyQueue((prev) =>
        prev.map((item, i) =>
          i === qi ? { ...item, status: "applying" } : item
        )
      );

      await new Promise<void>((resolve) => {
        const es = connectApplyStream(sessionId, queue[qi].jobIndex, {
          onApplyStart: (data) => {
            setApplyQueue((prev) =>
              prev.map((item, i) =>
                i === qi
                  ? { ...item, logs: [...item.logs, `🚀 Starting: ${data.job_title} at ${data.company}`] }
                  : item
              )
            );
          },
          onApplyProgress: (data) => {
            setApplyQueue((prev) =>
              prev.map((item, i) =>
                i === qi ? { ...item, logs: [...item.logs, data.message] } : item
              )
            );
          },
          onApplyComplete: (data) => {
            setApplyQueue((prev) =>
              prev.map((item, i) =>
                i === qi
                  ? { ...item, status: "done", result: data.message, logs: [...item.logs, `✅ ${data.message}`] }
                  : item
              )
            );
            resolve();
          },
          onApplyError: (data) => {
            setApplyQueue((prev) =>
              prev.map((item, i) =>
                i === qi
                  ? { ...item, status: "error", result: data.message, logs: [...item.logs, `❌ ${data.message}`] }
                  : item
              )
            );
            resolve();
          },
        });
        applyEsRef.current = es;
      });
    }

    setIsApplying(false);
  }, [sessionId, pipelineResult, selectedJobs]);

  const handleCVUploaded = useCallback(
    async (file: File) => {
      clearState();
      setIsProcessing(true);
      setError(null);

      try {
        const uploadResult = await uploadResume(file);
        setSessionId(uploadResult.session_id);
        localStorage.setItem("careeros_session_id", uploadResult.session_id);
        setProfile(uploadResult.profile);

        const es = connectPipelineStream(uploadResult.session_id, {
          onPipelineStart: (data) => {
            setSteps(data.steps.map((s) => ({ name: s.name, status: "waiting" })));
          },
          onStepStart: (data) => {
            setCurrentStepIndex(data.step_index);
            setSteps((prev) =>
              prev.map((s, i) =>
                i === data.step_index ? { ...s, status: "running" } : s
              )
            );
          },
          onStepComplete: (data) => {
            setSteps((prev) =>
              prev.map((s, i) =>
                i === data.step_index ? { ...s, status: data.status, log: data.log } : s
              )
            );
            if (data.log) {
              setLogs((prev) => [{
                agent: data.log!.agent,
                task: data.log!.task,
                reasoning: data.log!.reasoning,
                tools: data.log!.tools,
                confidence: data.log!.confidence,
                nextAction: data.log!.nextAction,
                time: data.log!.time,
              }, ...prev]);
            }
          },
          onPipelineComplete: (data) => {
            setPipelineResult(data);
            setIsProcessing(false);
          },
          onPipelineError: (data) => {
            setError(data.error);
            setIsProcessing(false);
          },
        });
        eventSourceRef.current = es;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setIsProcessing(false);
      }
    },
    [clearState]
  );

  const jobsWithUrl = pipelineResult?.matched_jobs.filter((j) => j.url) ?? [];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">AI-powered job acquisition command center</p>
        {backendOnline === false && (
          <div className="mt-2 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2 text-sm text-destructive">
            Backend is offline. Run: <code className="font-mono bg-destructive/10 px-1 rounded">cd backend && python app.py</code>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <CVUpload onCVUploaded={handleCVUploaded} isProcessing={isProcessing} />

      {profile && (
        <StrategyCard
          profile={profile}
          detectedRole={pipelineResult?.detected_role ?? null}
          matchedJobCount={pipelineResult?.matched_jobs?.length ?? 0}
          applicationCount={pipelineResult?.applications?.length ?? 0}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentWorkflow
          steps={steps}
          currentStepIndex={currentStepIndex}
          isRunning={isProcessing}
          isComplete={!!pipelineResult}
        />
        <ActivityLogView logs={logs} />
      </div>

      {/* ── Matched Jobs with Selection ── */}
      {pipelineResult && pipelineResult.matched_jobs.length > 0 && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Matched Jobs ({pipelineResult.matched_jobs.length})
            </h2>
            <div className="flex items-center gap-2">
              {jobsWithUrl.length > 0 && (
                <>
                  <button
                    onClick={selectedJobs.size === jobsWithUrl.length ? deselectAllJobs : selectAllJobs}
                    className="text-[11px] text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    {selectedJobs.size === jobsWithUrl.length ? "Deselect All" : "Select All"}
                  </button>
                  {selectedJobs.size > 0 && (
                    <button
                      onClick={startAutoApply}
                      disabled={isApplying}
                      className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplying ? (
                        <>
                          <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          Applying…
                        </>
                      ) : (
                        <>
                          🚀 Auto-Apply ({selectedJobs.size})
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {pipelineResult.matched_jobs.map((job, i) => (
              <div
                key={job.job_id || i}
                className={`rounded-lg p-4 border transition-colors cursor-pointer ${
                  selectedJobs.has(i)
                    ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
                    : "bg-secondary/30 border-border/30 hover:border-primary/20"
                }`}
                onClick={() => job.url && toggleJobSelection(i)}
              >
                <div className="flex items-center gap-3 mb-1">
                  {job.url && (
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(i)}
                      onChange={() => toggleJobSelection(i)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground flex-1">{job.title}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    job.match_score >= 80 ? "bg-success/10 text-success"
                      : job.match_score >= 60 ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {job.match_score}% match
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-7">{job.company} • {job.location}</p>
                <div className="flex items-center justify-between mt-1 ml-7">
                  {job.salary && <p className="text-xs text-primary/70">{job.salary}</p>}
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                    >
                      View Source →
                    </a>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/60 italic">No apply URL</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Auto-Apply Progress Panel ── */}
      {applyQueue.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Auto-Apply Progress
          </h2>
          <div className="space-y-4">
            {applyQueue.map((item, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  {item.status === "idle" && <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />}
                  {item.status === "applying" && <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />}
                  {item.status === "done" && <span className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                  {item.status === "error" && <span className="h-2.5 w-2.5 rounded-full bg-destructive" />}
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <span className="text-xs text-muted-foreground">at {item.company}</span>
                  <span className={`ml-auto text-[10px] font-mono uppercase tracking-wider ${
                    item.status === "done" ? "text-green-500" :
                    item.status === "error" ? "text-destructive" :
                    item.status === "applying" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {item.status === "idle" ? "Queued" : item.status === "applying" ? "In Progress" : item.status}
                  </span>
                </div>
                {item.logs.length > 0 && (
                  <details open={item.status === "applying"} className="mt-2">
                    <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                      Logs ({item.logs.length})
                    </summary>
                    <div className="mt-1 max-h-40 overflow-y-auto space-y-0.5 font-mono text-[10px] text-muted-foreground bg-background/50 rounded-md p-2">
                      {item.logs.map((log, li) => (
                        <div key={li}>{log}</div>
                      ))}
                    </div>
                  </details>
                )}
                {item.result && (
                  <p className={`text-xs mt-2 ${item.status === "done" ? "text-green-500" : "text-destructive"}`}>
                    {item.result}
                  </p>
                )}
              </div>
            ))}
            <div ref={applyLogsEndRef} />
          </div>
        </div>
      )}

      {/* ── Generated Applications (Cover Letters) ── */}
      {pipelineResult && pipelineResult.applications.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Generated Applications ({pipelineResult.applications.length})
          </h2>
          <div className="space-y-4">
            {pipelineResult.applications.map((app, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-4 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{app.title} at {app.company}</span>
                  <div className="flex items-center gap-2">
                    {app.url && (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                      >
                        View Job →
                      </a>
                    )}
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">{app.match_score}% match</span>
                  </div>
                </div>
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer text-primary hover:underline">View Cover Letter</summary>
                  <pre className="mt-2 whitespace-pre-wrap bg-background/50 rounded-md p-3 text-[11px] leading-relaxed">{app.cover_letter}</pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CommandBar — wired with session + matched jobs for @ picker apply */}
      <CommandBar
        sessionId={sessionId}
        matchedJobs={pipelineResult?.matched_jobs ?? []}
      />
    </div>
  );
};

export default Dashboard;
