import { motion } from "framer-motion";
import { Mail, Eye, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

const outreachData = [
  { company: "Stripe", hr: "sarah.chen@stripe.com", subject: "Senior Backend Engineer — Passionate About Payment Infra", preview: "Hi Sarah, I've been following Stripe's API evolution closely and believe my 5+ years in distributed systems...", followUp: "Feb 20", status: "opened", opens: 3 },
  { company: "Supabase", hr: "hiring@supabase.com", subject: "Platform Engineer — Open Source Advocate & Builder", preview: "Hello! As an active contributor to the Supabase ecosystem and experienced platform engineer...", followUp: "Feb 21", status: "sent", opens: 0 },
  { company: "Linear", hr: "talent@linear.app", subject: "Backend Engineer — Building Tools That Developers Love", preview: "Hi there, I'm deeply inspired by Linear's approach to product development. With my background in...", followUp: "Feb 19", status: "replied", opens: 5 },
  { company: "Vercel", hr: "jobs@vercel.com", subject: "Platform Engineer — Edge Computing & DX Enthusiast", preview: "Dear Vercel Team, Your work on edge functions has transformed how I think about deployment...", followUp: "Feb 22", status: "sent", opens: 0 },
];

const statusIcon: Record<string, { icon: typeof Send; color: string; label: string }> = {
  sent: { icon: Send, color: "text-primary", label: "Sent" },
  opened: { icon: Eye, color: "text-warning", label: "Opened" },
  replied: { icon: CheckCircle2, color: "text-success", label: "Replied" },
  bounced: { icon: AlertCircle, color: "text-destructive", label: "Bounced" },
};

const Outreach = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">Outreach Automation</h1>
      <p className="text-sm text-muted-foreground">AI-personalized email campaigns</p>
    </div>

    <div className="space-y-4">
      {outreachData.map((item, i) => {
        const st = statusIcon[item.status];
        const StIcon = st.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="glass rounded-xl p-5 hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.company}</h3>
                  <p className="text-[11px] font-mono text-muted-foreground">{item.hr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StIcon className={`h-3.5 w-3.5 ${st.color}`} />
                <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                {item.opens > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground">{item.opens} opens</span>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-3 mb-3">
              <p className="text-xs font-semibold text-foreground mb-1">{item.subject}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.preview}</p>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Follow-up scheduled: {item.followUp}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default Outreach;
