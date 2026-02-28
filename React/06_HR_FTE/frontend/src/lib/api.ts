/**
 * CareerOS API Client — communicates with the FastAPI backend.
 */

const API_BASE = "http://localhost:8000";

/**
 * Upload a resume file and get a session ID + parsed profile.
 */
export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

/**
 * Connect to the pipeline SSE stream.
 * Returns an EventSource that emits these events:
 *   - pipeline_start
 *   - step_start
 *   - step_complete
 *   - pipeline_complete
 *   - pipeline_error
 */
export function connectPipelineStream(
  sessionId: string,
  handlers: PipelineHandlers
): EventSource {
  const es = new EventSource(`${API_BASE}/api/pipeline/${sessionId}`);

  es.addEventListener("pipeline_start", (e) => {
    handlers.onPipelineStart?.(JSON.parse(e.data));
  });

  es.addEventListener("step_start", (e) => {
    handlers.onStepStart?.(JSON.parse(e.data));
  });

  es.addEventListener("step_complete", (e) => {
    handlers.onStepComplete?.(JSON.parse(e.data));
  });

  es.addEventListener("pipeline_complete", (e) => {
    handlers.onPipelineComplete?.(JSON.parse(e.data));
    es.close();
  });

  es.addEventListener("pipeline_error", (e) => {
    handlers.onPipelineError?.(JSON.parse(e.data));
    es.close();
  });

  es.onerror = () => {
    handlers.onPipelineError?.({ error: "Connection lost" });
    es.close();
  };

  return es;
}

/**
 * Check backend health.
 */
export async function checkHealth(): Promise<{ status: string; demo_mode: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface UploadResponse {
  session_id: string;
  filename: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    skill_count: number;
  };
}

export interface StepStartEvent {
  step_index: number;
  step_name: string;
  description: string;
}

export interface StepCompleteEvent {
  step_index: number;
  step_name: string;
  status: "completed" | "error";
  data?: Record<string, unknown>;
  log?: {
    agent: string;
    task: string;
    reasoning: string;
    tools: string[];
    confidence: number;
    nextAction: string;
    time: string;
  };
  error?: string;
}

export interface PipelineCompleteEvent {
  profile: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
  };
  detected_role: {
    primary_role: string;
    secondary_roles: string[];
    seniority: string;
    location: string;
  };
  matched_jobs: {
    job_id: string;
    title: string;
    company: string;
    location: string;
    match_score: number;
    url: string;
    salary: string;
  }[];
  applications: {
    title: string;
    company: string;
    match_score: number;
    cover_letter: string;
    status: string;
    url: string;
  }[];
  logs: unknown[];
}

export interface PipelineHandlers {
  onPipelineStart?: (data: { total_steps: number; steps: { name: string; status: string }[] }) => void;
  onStepStart?: (data: StepStartEvent) => void;
  onStepComplete?: (data: StepCompleteEvent) => void;
  onPipelineComplete?: (data: PipelineCompleteEvent) => void;
  onPipelineError?: (data: { error: string }) => void;
}
