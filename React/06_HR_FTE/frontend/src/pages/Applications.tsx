import { motion } from "framer-motion";
import { Briefcase, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface Application {
  company: string;
  role: string;
  matchScore: number;
  cvVersion: string;
  status: "sent" | "interview" | "rejected" | "follow-up";
  lastContact: string;
  confidence: number;
}

const data: Application[] = [
  { company: "Stripe", role: "Senior Backend Engineer", matchScore: 94, cvVersion: "v3.2-stripe", status: "interview", lastContact: "2 days ago", confidence: 91 },
  { company: "Vercel", role: "Platform Engineer", matchScore: 89, cvVersion: "v3.1-vercel", status: "sent", lastContact: "1 day ago", confidence: 87 },
  { company: "Linear", role: "Backend Engineer", matchScore: 92, cvVersion: "v3.3-linear", status: "interview", lastContact: "3 days ago", confidence: 93 },
  { company: "Figma", role: "Infrastructure Engineer", matchScore: 78, cvVersion: "v2.8-figma", status: "follow-up", lastContact: "5 days ago", confidence: 72 },
  { company: "Notion", role: "Senior Software Engineer", matchScore: 85, cvVersion: "v3.0-notion", status: "sent", lastContact: "Today", confidence: 84 },
  { company: "Datadog", role: "Backend Developer", matchScore: 82, cvVersion: "v2.9-datadog", status: "rejected", lastContact: "1 week ago", confidence: 79 },
  { company: "Supabase", role: "Platform Engineer", matchScore: 96, cvVersion: "v3.4-supa", status: "interview", lastContact: "Today", confidence: 95 },
  { company: "Cloudflare", role: "Systems Engineer", matchScore: 76, cvVersion: "v2.7-cf", status: "sent", lastContact: "4 days ago", confidence: 71 },
];

const statusColors: Record<string, string> = {
  sent: "bg-primary/10 text-primary",
  interview: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  "follow-up": "bg-warning/10 text-warning",
};

const Applications = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? data : data.filter((d) => d.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Applications</h1>
          <p className="text-sm text-muted-foreground">{data.length} active applications tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 glass rounded-lg px-3 py-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer">
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Company", "Role", "Match", "CV Version", "Status", "Last Contact", "Confidence"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      {h} <ArrowUpDown className="h-2.5 w-2.5" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{app.role}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-primary">{app.matchScore}%</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{app.cvVersion}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{app.lastContact}</td>
                  <td className="px-4 py-3 text-sm font-mono text-success">{app.confidence}%</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Applications;
