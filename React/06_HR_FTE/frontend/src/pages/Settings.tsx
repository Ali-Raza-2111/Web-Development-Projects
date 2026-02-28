import { motion } from "framer-motion";
import { Settings as SettingsIcon, Key, Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface CredField {
  label: string;
  placeholder: string;
  value: string;
}

const credentials: CredField[] = [
  { label: "LinkedIn API Key", placeholder: "li_api_••••••••••••", value: "li_api_k8f2m" },
  { label: "Job Board API Key", placeholder: "jb_••••••••••••", value: "jb_x9d4p" },
  { label: "Gmail API Credentials", placeholder: "gmail_oauth_••••••", value: "gmail_oa_h7" },
  { label: "LLM API Key", placeholder: "sk-••••••••••••", value: "sk-proj-a" },
  { label: "Email Finder API Key", placeholder: "ef_••••••••••••", value: "ef_m2k8v" },
];

const SettingsPage = () => {
  const [visibility, setVisibility] = useState<Record<number, boolean>>({});

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">API credentials & system configuration</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">API Credentials</h2>
        </div>

        <div className="space-y-4">
          {credentials.map((cred, i) => (
            <div key={i}>
              <label className="text-xs text-muted-foreground mb-1.5 block">{cred.label}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <input
                  type={visibility[i] ? "text" : "password"}
                  defaultValue={cred.value}
                  placeholder={cred.placeholder}
                  className="w-full rounded-lg bg-secondary border border-border/50 pl-9 pr-10 py-2.5 text-sm font-mono text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => setVisibility((v) => ({ ...v, [i]: !v[i] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {visibility[i] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
          Save Credentials
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
