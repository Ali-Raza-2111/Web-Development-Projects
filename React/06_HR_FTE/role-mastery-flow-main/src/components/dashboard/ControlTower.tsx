import { motion } from "framer-motion";
import { SlidersHorizontal, Shield, Gauge, DollarSign, Mail, Cpu } from "lucide-react";
import { useState } from "react";

export function ControlTower() {
  const [budget, setBudget] = useState(20);
  const [emailLimit, setEmailLimit] = useState(15);
  const [personalization, setPersonalization] = useState<"low" | "medium" | "high">("high");
  const [atsLevel, setAtsLevel] = useState(70);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [risk, setRisk] = useState<"safe" | "balanced" | "aggressive">("balanced");

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Control Tower</h2>
          <p className="text-xs text-muted-foreground">System parameters</p>
        </div>
      </div>

      {/* Budget */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />API Budget Limit</label>
          <span className="text-xs font-mono text-primary">${budget}</span>
        </div>
        <input type="range" min={5} max={100} value={budget} onChange={(e) => setBudget(+e.target.value)}
          className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
      </div>

      {/* Email Limit */}
      <div>
        <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Mail className="h-3 w-3" />Daily Email Limit</label>
        <input type="number" value={emailLimit} onChange={(e) => setEmailLimit(+e.target.value)}
          className="w-full rounded-lg bg-secondary border border-border/50 px-3 py-2 text-sm font-mono text-foreground outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {/* Personalization */}
      <div>
        <label className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Cpu className="h-3 w-3" />Personalization Depth</label>
        <div className="grid grid-cols-3 gap-1">
          {(["low", "medium", "high"] as const).map((v) => (
            <button key={v} onClick={() => setPersonalization(v)}
              className={`rounded-md py-1.5 text-xs font-medium transition-all capitalize ${
                personalization === v ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ATS Strictness */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" />ATS Strictness</label>
          <span className="text-xs font-mono text-primary">{atsLevel}%</span>
        </div>
        <input type="range" min={0} max={100} value={atsLevel} onChange={(e) => setAtsLevel(+e.target.value)}
          className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
      </div>

      {/* Human Approval */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" />Human Approval Required</label>
        <button onClick={() => setApprovalRequired(!approvalRequired)}
          className={`w-10 h-5 rounded-full transition-colors relative ${approvalRequired ? "bg-primary" : "bg-secondary"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${approvalRequired ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>

      {/* Risk Tolerance */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Risk Tolerance</label>
        <div className="grid grid-cols-3 gap-1">
          {(["safe", "balanced", "aggressive"] as const).map((v) => (
            <button key={v} onClick={() => setRisk(v)}
              className={`rounded-md py-1.5 text-xs font-medium transition-all capitalize ${
                risk === v ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Tracking */}
      <div className="rounded-lg bg-secondary/50 p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Real-time Cost</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-gradient">$12.40</span>
          <span className="text-xs text-muted-foreground">today</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Tokens: 142.3k</span>
          <span>Calls: 89</span>
        </div>
      </div>
    </motion.div>
  );
}
