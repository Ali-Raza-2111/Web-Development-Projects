import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2, BarChart3 } from "lucide-react";

const cvVersions = [
  { id: "original", name: "Master CV", target: "Base Template", atsScore: 72, skillAlign: 100, date: "Jan 15" },
  { id: "v3.4-supa", name: "Supabase — Platform Eng.", target: "Supabase", atsScore: 96, skillAlign: 94, date: "Today" },
  { id: "v3.2-stripe", name: "Stripe — Sr. Backend", target: "Stripe", atsScore: 91, skillAlign: 89, date: "Feb 12" },
  { id: "v3.3-linear", name: "Linear — Backend Eng.", target: "Linear", atsScore: 93, skillAlign: 91, date: "Feb 14" },
  { id: "v3.1-vercel", name: "Vercel — Platform Eng.", target: "Vercel", atsScore: 88, skillAlign: 85, date: "Feb 11" },
  { id: "v3.0-notion", name: "Notion — Sr. SWE", target: "Notion", atsScore: 84, skillAlign: 82, date: "Feb 10" },
];

const CVVersions = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">CV Versions</h1>
      <p className="text-sm text-muted-foreground">{cvVersions.length} versions managed by AI</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cvVersions.map((cv, i) => (
        <motion.div
          key={cv.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className={`glass rounded-xl p-5 hover:border-primary/30 transition-all ${cv.id === "original" ? "border-primary/20 glow-sm" : ""}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{cv.name}</h3>
                <p className="text-[10px] text-muted-foreground">{cv.target} • {cv.date}</p>
              </div>
            </div>
            {cv.id === "original" && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] text-primary font-medium">Master</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-secondary/50 p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">ATS Score</span>
              </div>
              <span className="text-lg font-bold font-mono text-success">{cv.atsScore}%</span>
            </div>
            <div className="rounded-lg bg-secondary/50 p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <BarChart3 className="h-3 w-3 text-primary" />
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Skill Fit</span>
              </div>
              <span className="text-lg font-bold font-mono text-primary">{cv.skillAlign}%</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3 w-3" /> Download PDF
          </button>
        </motion.div>
      ))}
    </div>
  </div>
);

export default CVVersions;
