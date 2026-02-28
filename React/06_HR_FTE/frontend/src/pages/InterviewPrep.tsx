import { motion } from "framer-motion";
import { GraduationCap, Building2, Brain, Code2, Star, DollarSign } from "lucide-react";

const sections = [
  {
    icon: Building2,
    title: "Company-Specific Questions",
    description: "AI-generated questions based on company culture, tech stack, and recent news",
    items: [
      "How does Stripe handle backward compatibility in their API versioning?",
      "Describe a scenario where you'd use Stripe's idempotency keys",
      "How would you approach building a real-time payment notification system?",
    ],
    status: "12 questions prepared",
  },
  {
    icon: Brain,
    title: "Behavioral Practice",
    description: "STAR-method scenarios tailored to target companies",
    items: [
      "Tell me about a time you resolved a critical production incident",
      "Describe a project where you had to make trade-offs between speed and quality",
      "How do you handle disagreements about technical architecture?",
    ],
    status: "8 scenarios ready",
  },
  {
    icon: Code2,
    title: "Technical Simulation",
    description: "Live coding challenges matched to role requirements",
    items: [
      "Design a rate limiter for a distributed API gateway",
      "Implement a task queue with priority scheduling",
      "Build a real-time event streaming pipeline",
    ],
    status: "6 challenges queued",
  },
  {
    icon: Star,
    title: "STAR Response Optimizer",
    description: "AI-refined answers using the Situation-Task-Action-Result framework",
    items: [
      "Optimized response for 'leadership under pressure' — Score: 94/100",
      "Refined 'cross-team collaboration' narrative — Score: 89/100",
      "Enhanced 'technical mentorship' story — Score: 91/100",
    ],
    status: "5 responses polished",
  },
  {
    icon: DollarSign,
    title: "Negotiation Strategy",
    description: "Market data and negotiation playbook for your target roles",
    items: [
      "Berlin Sr. Backend: €85k-€120k range, median €98k",
      "Equity negotiation framework for Series B-D companies",
      "Counter-offer strategy based on competing offers analysis",
    ],
    status: "Strategy generated",
  },
];

const InterviewPrep = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">Interview Prep</h1>
      <p className="text-sm text-muted-foreground">AI-powered preparation across all interview dimensions</p>
    </div>

    <div className="space-y-4">
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className="glass rounded-xl p-5 hover:border-primary/20 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <p className="text-[11px] text-muted-foreground">{section.description}</p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] text-primary font-medium whitespace-nowrap">
              {section.status}
            </span>
          </div>

          <div className="space-y-2">
            {section.items.map((item, j) => (
              <div key={j} className="flex items-start gap-2 rounded-lg bg-secondary/30 p-3">
                <GraduationCap className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground/80">{item}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full rounded-lg bg-secondary hover:bg-secondary/80 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Start Practice Session →
          </button>
        </motion.div>
      ))}
    </div>
  </div>
);

export default InterviewPrep;
