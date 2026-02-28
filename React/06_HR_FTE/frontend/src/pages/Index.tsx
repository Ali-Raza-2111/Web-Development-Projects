import { useState, useCallback, useRef, useEffect } from "react";
import { StrategyCard } from "@/components/dashboard/StrategyCard";
import { AgentWorkflow } from "@/components/dashboard/AgentWorkflow";
import { ActivityLogView } from "@/components/dashboard/ActivityLog";
import { CVUpload } from "@/components/dashboard/CVUpload";
import {
  uploadResume,
  connectPipelineStream,
  checkHealth,
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

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UploadResponse["profile"] | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineCompleteEvent | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<{ name: string; status: string; log?: StepCompleteEvent["log"] }[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  useEffect(() => {
    return () => { eventSourceRef.current?.close(); };
  }, []);

  const clearState = useCallback(() => {
    setLogs([]);
    setSteps([]);
    setCurrentStepIndex(-1);
    setPipelineResult(null);
    setError(null);
  }, []);

  const handleCVUploaded = useCallback(
    async (file: File) => {
      clearState();
      setIsProcessing(true);
      setError(null);

      try {
        const uploadResult = await uploadResume(file);
        setSessionId(uploadResult.session_id);
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

      {pipelineResult && pipelineResult.matched_jobs.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Matched Jobs ({pipelineResult.matched_jobs.length})
          </h2>
          <div className="space-y-3">
            {pipelineResult.matched_jobs.map((job, i) => (
              <div key={job.job_id || i} className="rounded-lg bg-secondary/30 p-4 border border-border/30 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{job.title}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    job.match_score >= 80 ? "bg-success/10 text-success"
                      : job.match_score >= 60 ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {job.match_score}% match
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                <div className="flex items-center justify-between mt-1">
                  {job.salary && <p className="text-xs text-primary/70">{job.salary}</p>}
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2"
                    >
                      View Source →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;
