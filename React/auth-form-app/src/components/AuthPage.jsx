import React, { useState } from "react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardMsg, setDashboardMsg] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function signup() {
    const payload = { name, email, password };
    const res = await fetch(`${API_BASE}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch { body = { detail: await res.text() }; }
      throw new Error(body?.detail || body?.message || res.statusText || "Signup failed");
    }
    return res.json();
  }

  // This calls the common OAuth2 token endpoint used in FastAPI examples (/token).
  // It sends form-urlencoded body (username + password) and expects { access_token, token_type }.
  async function loginAndGetToken() {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await fetch(`${API_BASE}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch { body = { detail: await res.text() }; }
      throw new Error(body?.detail || body?.message || res.statusText || "Login failed");
    }

    const data = await res.json();
    if (!data.access_token) throw new Error("No access token returned");
    // simple storage - for production consider secure httpOnly cookie or better strategies
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  }

  async function fetchDashboardWithToken(token) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch { body = { detail: await res.text() }; }
      throw new Error(body?.detail || body?.message || res.statusText || "Dashboard fetch failed");
    }
    return res.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setDashboardMsg(null);

    try {
      if (isSignup) {
        await signup();
        // optional: auto-login after signup
        const token = await loginAndGetToken();
        const dashboard = await fetchDashboardWithToken(token);
        setDashboardMsg(dashboard.message || "Signed up and logged in");
        // clear fields and switch to login view if you want:
        setName("");
        setEmail("");
        setPassword("");
        setIsSignup(false);
        alert("Account created and logged in. Dashboard message shown.");
      } else {
        // login flow
        const token = await loginAndGetToken();
        const dashboard = await fetchDashboardWithToken(token);
        setDashboardMsg(dashboard.message || "Logged in");
        alert(`Logged in: ${dashboard.message || email}`);
      }
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // UI below is same as your current UI; omitted styling comments for brevity
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center p-12">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            {isSignup ? "Join our community" : "Welcome back to LearnFlow"}
          </h1>
          <p className="text-indigo-100">
            {isSignup ? "Create an account to access courses." : "Log in to continue."}
          </p>
          <img src="https://illustrations.popsy.co/gray/studying.svg" alt="Auth" className="w-64 mx-auto mt-8" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-11/12 max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isSignup ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-gray-600 font-medium mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
            )}

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button type="submit" disabled={loading} className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg ${loading ? 'opacity-60' : 'hover:bg-indigo-700'}`}>
              {loading ? (isSignup ? "Processing..." : "Signing in...") : (isSignup ? "Sign Up" : "Log In")}
            </button>
          </form>

          {dashboardMsg && <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">{dashboardMsg}</div>}

          <p className="text-center text-gray-600 text-sm mt-5">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <button onClick={() => { setIsSignup(!isSignup); setError(null); }} className="text-indigo-600 hover:underline font-medium">
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
