import { motion } from "framer-motion";
import { Brain, TrendingUp, Globe, Building2, DollarSign, Users } from "lucide-react";

const insights = [
  { title: "Backend roles trending up in Berlin", detail: "23% increase in Senior Backend postings this month. Go and Rust skills seeing highest demand growth.", icon: TrendingUp, tag: "Trend" },
  { title: "Stripe hiring surge detected", detail: "4 new backend positions posted in last 48 hours. Match score: 94%. Recommended: Apply immediately.", icon: Building2, tag: "Opportunity" },
  { title: "Salary benchmark update", detail: "Berlin Sr. Backend median increased to €102k (+4.1% YoY). Remote premiums averaging +12%.", icon: DollarSign, tag: "Market Data" },
  { title: "Competitor analysis: 847 applicants", detail: "Average competing candidate has 4.2 years experience. Your profile ranks in top 15% for target roles.", icon: Users, tag: "Competitive Intel" },
  { title: "Remote-first companies expanding", detail: "34 new remote-first companies added backend roles in DACH region. Filtered 12 high-match opportunities.", icon: Globe, tag: "Discovery" },
];

const JobIntelligence = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">Job Intelligence</h1>
      <p className="text-sm text-muted-foreground">AI-curated market insights & opportunities</p>
    </div>

    <div className="space-y-4">
      {insights.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className="glass rounded-xl p-5 hover:border-primary/20 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] text-primary font-medium">{item.tag}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default JobIntelligence;
