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
 * Parse a natural-language command and get back a structured execution plan.
 */
export async function parseCommand(
  command: string,
  sessionId?: string | null
): Promise<CommandPlan> {
  const res = await fetch(`${API_BASE}/api/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, session_id: sessionId ?? null }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Command failed" }));
    throw new Error(err.detail || "Command failed");
  }

  return res.json();
}

/**
 * Connect to the apply SSE stream.
 * Streams real-time Playwright automation progress for applying to a job.
 */
export function connectApplyStream(
  sessionId: string,
  jobIndex: number,
  handlers: ApplyHandlers
): EventSource {
  const es = new EventSource(`${API_BASE}/api/apply/${sessionId}/${jobIndex}`);

  es.addEventListener("apply_start", (e) => {
    handlers.onApplyStart?.(JSON.parse(e.data));
  });

  es.addEventListener("apply_progress", (e) => {
    handlers.onApplyProgress?.(JSON.parse(e.data));
  });

  es.addEventListener("apply_complete", (e) => {
    handlers.onApplyComplete?.(JSON.parse(e.data));
    es.close();
  });

  es.addEventListener("apply_error", (e) => {
    handlers.onApplyError?.(JSON.parse(e.data));
    es.close();
  });

  es.onerror = () => {
    handlers.onApplyError?.({ success: false, message: "Connection lost" });
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

/**
 * Restore the latest session from the backend (survives refresh + server restart).
 * Returns session data if one exists within the 24 h window, or null.
 */
export async function getLatestSession(): Promise<SessionRestoreData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sessions/latest`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Get session status and full result by ID.
 */
export async function getSessionStatus(sessionId: string): Promise<SessionRestoreData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/status/${sessionId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}


// ── Login Session API ────────────────────────────────────────────────────────

/**
 * Get list of supported job sites and session status.
 */
export async function getLoginSites(): Promise<LoginSitesResponse> {
  const res = await fetch(`${API_BASE}/api/login/sites`);
  return res.json();
}

/**
 * Check current login session status.
 */
export async function getLoginStatus(): Promise<LoginStatusResponse> {
  const res = await fetch(`${API_BASE}/api/login/status`);
  return res.json();
}

/**
 * Start a login browser session for a specific site.
 * Returns an EventSource that streams login progress via SSE.
 */
export function startLoginSession(
  site: string,
  timeoutMinutes: number,
  handlers: LoginHandlers
): AbortController {
  const controller = new AbortController();

  fetch(`${API_BASE}/api/login/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ site, timeout_minutes: timeoutMinutes }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Login failed" }));
        handlers.onLoginError?.({ success: false, message: err.detail || "Login failed" });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6).trim();
          } else if (line === "" && eventType && eventData) {
            try {
              const data = JSON.parse(eventData);
              switch (eventType) {
                case "login_start":
                  handlers.onLoginStart?.(data);
                  break;
                case "login_ready":
                  handlers.onLoginReady?.(data);
                  break;
                case "login_progress":
                  handlers.onLoginProgress?.(data);
                  break;
                case "login_complete":
                  handlers.onLoginComplete?.(data);
                  break;
                case "login_error":
                  handlers.onLoginError?.(data);
                  break;
              }
            } catch {
              // ignore parse errors
            }
            eventType = "";
            eventData = "";
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        handlers.onLoginError?.({ success: false, message: String(err) });
      }
    });

  return controller;
}

/**
 * Clear saved browser session data.
 */
export async function clearLoginSession(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/login/clear`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to clear" }));
    throw new Error(err.detail || "Failed to clear session");
  }
  return res.json();
}

/**
 * Get Chrome installation and debugging info.
 */
export async function getChromeInfo(): Promise<ChromeInfo> {
  const res = await fetch(`${API_BASE}/api/login/chrome-info`);
  return res.json();
}

/**
 * Manually launch Chrome with remote debugging enabled.
 */
export async function launchChrome(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/login/launch-chrome`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to launch Chrome" }));
    throw new Error(err.detail || "Failed to launch Chrome");
  }
  return res.json();
}

/**
 * Stop Chrome debugging process.
 */
export async function stopChrome(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/login/stop-chrome`, { method: "POST" });
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

export interface CommandPlan {
  action: "apply" | "unknown";
  message?: string;
  job_title?: string;
  company?: string;
  job_url?: string;
  job_index?: number | null;
  match_score?: number;
  session_id?: string | null;
  steps?: { agent: string; task: string; time: string }[];
  estimated_time?: string;
  risk?: string;
  plan?: unknown[];
}

export interface ApplyHandlers {
  onApplyStart?: (data: { job_title: string; company: string; url: string }) => void;
  onApplyProgress?: (data: { message: string; step: string }) => void;
  onApplyComplete?: (data: { success: boolean; message: string }) => void;
  onApplyError?: (data: { success: boolean; message: string }) => void;
}

export interface SessionRestoreData {
  session_id: string;
  status: string;
  profile: UploadResponse["profile"] | null;
  result: PipelineCompleteEvent | null;
}

// ── Login Session Types ──────────────────────────────────────────────────────

export interface LoginSite {
  id: string;
  name: string;
  url: string;
}

export interface LoginSitesResponse {
  sites: LoginSite[];
  has_session: boolean;
  login_active: boolean;
  chrome_info?: ChromeInfo;
}

export interface LoginStatusResponse {
  has_session: boolean;
  login_active: boolean;
  saved_sites: string[];
  chrome_debug_active?: boolean;
}

export interface ChromeInfo {
  chrome_found: boolean;
  chrome_path: string;
  profile_dir: string;
  profile_exists: boolean;
  debug_port: number;
  debug_active: boolean;
  has_cookies: boolean;
}

export interface LoginHandlers {
  onLoginStart?: (data: { site: string; url: string }) => void;
  onLoginReady?: (data: { message: string }) => void;
  onLoginProgress?: (data: { message: string; step: string }) => void;
  onLoginComplete?: (data: { success: boolean; message: string }) => void;
  onLoginError?: (data: { success: boolean; message: string }) => void;
}
