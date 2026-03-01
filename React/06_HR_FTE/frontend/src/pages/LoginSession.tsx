import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  LogIn,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Info,
  Chrome,
  Zap,
  AlertTriangle,
  Monitor,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  getLoginSites,
  getLoginStatus,
  getChromeInfo,
  launchChrome,
  startLoginSession,
  clearLoginSession,
  type LoginSite,
  type ChromeInfo,
} from "@/lib/api";

type LoginState = "idle" | "connecting" | "ready" | "complete" | "error";

const LoginSessionPage = () => {
  const [sites, setSites] = useState<LoginSite[]>([]);
  const [chromeInfo, setChromeInfo] = useState<ChromeInfo | null>(null);
  const [chromeDebugActive, setChromeDebugActive] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>("indeed");
  const [customUrl, setCustomUrl] = useState("");
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [launching, setLaunching] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const [sitesRes, statusRes, chromeRes] = await Promise.all([
        getLoginSites(),
        getLoginStatus(),
        getChromeInfo(),
      ]);
      setSites(sitesRes.sites);
      setChromeInfo(chromeRes);
      setChromeDebugActive(statusRes.chrome_debug_active ?? false);
    } catch {
      // backend might not be running
    }
  }

  async function handleLaunchChrome() {
    setLaunching(true);
    setLogs([]);
    try {
      const res = await launchChrome();
      setLogs((prev) => [...prev, res.message]);
      setChromeDebugActive(true);
    } catch (e) {
      setLogs((prev) => [...prev, `Error: ${e}`]);
    } finally {
      setLaunching(false);
    }
  }

  function handleStartLogin() {
    const site = selectedSite === "custom" ? customUrl : selectedSite;
    if (!site) return;

    setLoginState("connecting");
    setLogs([]);

    controllerRef.current = startLoginSession(site, 5, {
      onLoginStart: (data) => {
        setLogs((prev) => [...prev, `Opening Chrome for ${data.url}…`]);
      },
      onLoginReady: (data) => {
        setLoginState("ready");
        setLogs((prev) => [...prev, data.message]);
      },
      onLoginProgress: (data) => {
        setLogs((prev) => [...prev, data.message]);
      },
      onLoginComplete: (data) => {
        setLoginState("complete");
        setLogs((prev) => [...prev, data.message]);
        setChromeDebugActive(true);
      },
      onLoginError: (data) => {
        setLoginState("error");
        setLogs((prev) => [...prev, `Error: ${data.message}`]);
      },
    });
  }

  async function handleClearSession() {
    try {
      const res = await clearLoginSession();
      setLogs((prev) => [...prev, res.message]);
    } catch (e) {
      setLogs((prev) => [...prev, `${e}`]);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Chrome className="h-5 w-5 text-primary" />
          Browser Sessions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Uses your <strong>real Chrome browser</strong> — no bot detection, no CAPTCHAs.
          Your existing logins are automatically available.
        </p>
      </div>

      {/* Chrome Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Chrome Status</h2>
        </div>

        {chromeInfo ? (
          <div className="space-y-2">
            {/* Chrome found? */}
            <div className="flex items-center gap-2 text-sm">
              {chromeInfo.chrome_found ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              )}
              <span className={chromeInfo.chrome_found ? "text-foreground" : "text-destructive"}>
                {chromeInfo.chrome_found
                  ? `Chrome found: ${chromeInfo.chrome_path}`
                  : "Chrome not found — please install Google Chrome"}
              </span>
            </div>

            {/* Profile exists? */}
            {chromeInfo.profile_exists && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                Profile: {chromeInfo.profile_dir}
              </div>
            )}

            {/* Debug active? */}
            <div className="flex items-center gap-2 text-sm">
              {chromeDebugActive ? (
                <>
                  <Zap className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-500 font-medium">
                    Chrome debugging active on port {chromeInfo.debug_port} — ready for automation
                  </span>
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-yellow-500">
                    Chrome debugging not active — launch Chrome below to enable
                  </span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking Chrome status…
          </div>
        )}
      </motion.div>

      {/* Important notice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4"
      >
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-yellow-500">Important: Close Chrome First</p>
            <p>
              Before clicking "Launch Chrome" or "Open & Login", you must <strong>close all 
              existing Chrome windows</strong>. Chrome can only enable debugging when it starts 
              fresh. If Chrome is already running, the debugging port won't activate.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Launch Chrome */}
      {chromeInfo?.chrome_found && !chromeDebugActive && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Quick Start</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Launch your real Chrome with remote debugging. You can then browse normally —
            the app will connect to it when applying for jobs.
          </p>
          <button
            onClick={handleLaunchChrome}
            disabled={launching}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {launching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="h-4 w-4" />
            )}
            {launching ? "Launching…" : "Launch Chrome with Debugging"}
          </button>
        </motion.div>
      )}

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Open & Login to a Job Site</h2>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Select a site and click "Open & Login". Your <strong>real Chrome</strong> will open 
          at the login page. Log in normally — your session persists in Chrome's profile.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Job Site</label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              disabled={loginState === "connecting" || loginState === "ready"}
              className="w-full rounded-lg bg-secondary border border-border/50 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} — {site.url}
                </option>
              ))}
              <option value="custom">Custom URL…</option>
            </select>
          </div>

          <AnimatePresence>
            {selectedSite === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-xs text-muted-foreground mb-1.5 block">Custom URL</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://careers.example.com/login"
                  className="w-full rounded-lg bg-secondary border border-border/50 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleStartLogin}
              disabled={
                loginState === "connecting" ||
                loginState === "ready" ||
                (selectedSite === "custom" && !customUrl)
              }
              className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginState === "connecting" || loginState === "ready" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loginState === "ready"
                ? "Chrome Open — Log In Now"
                : loginState === "connecting"
                  ? "Launching Chrome…"
                  : "Open & Login"}
            </button>

            {loginState !== "idle" && loginState !== "connecting" && (
              <button
                onClick={() => {
                  controllerRef.current?.abort();
                  setLoginState("idle");
                  fetchStatus();
                }}
                className="rounded-lg border border-border/50 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Log output */}
      <AnimatePresence>
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass rounded-xl p-5"
          >
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Activity Log
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    log.startsWith("Error")
                      ? "text-destructive bg-destructive/5"
                      : log.includes("saved") || log.includes("Done") || log.includes("ready")
                        ? "text-green-500 bg-green-500/5"
                        : "text-muted-foreground bg-secondary/50"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            {loginState === "complete" && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-500 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Session ready — apply to jobs now!
              </div>
            )}

            {loginState === "error" && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive font-medium">
                <XCircle className="h-4 w-4" />
                Something went wrong. Close all Chrome windows and try again.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/30 bg-secondary/30 p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-2">How it works</h3>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            We launch <strong>your real Chrome</strong> (not a bot browser) with a debugging port.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            You log in normally to Indeed, LinkedIn, etc. — with your real extensions, history, and cookies.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            When you apply to jobs, the AI agent opens a <strong>new tab in your real Chrome</strong> and fills the form.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">4.</span>
            Sites see your real browser fingerprint — <strong>zero bot detection, zero CAPTCHAs</strong>.
          </li>
        </ul>
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-primary font-medium">
            Why this avoids detection
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Playwright's bundled Chromium has bot markers that sites detect (navigator.webdriver, 
            missing plugins, etc.). By connecting to your real Chrome via DevTools Protocol, 
            we bypass all of that — the browser IS real Chrome with your real profile.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSessionPage;
