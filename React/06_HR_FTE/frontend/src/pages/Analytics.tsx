import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Send, MessageSquare, CheckCircle2, DollarSign, Bot } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, Area, AreaChart } from "recharts";

const weeklyData = [
  { day: "Mon", sent: 8, interviews: 1 },
  { day: "Tue", sent: 12, interviews: 2 },
  { day: "Wed", sent: 6, interviews: 1 },
  { day: "Thu", sent: 15, interviews: 3 },
  { day: "Fri", sent: 10, interviews: 2 },
  { day: "Sat", sent: 3, interviews: 0 },
  { day: "Sun", sent: 1, interviews: 0 },
];

const conversionData = [
  { week: "W1", rate: 12 },
  { week: "W2", rate: 18 },
  { week: "W3", rate: 15 },
  { week: "W4", rate: 24 },
  { week: "W5", rate: 22 },
  { week: "W6", rate: 31 },
];

const stats = [
  { icon: Send, label: "Applications Sent", value: "142", change: "+23 this week", color: "text-primary" },
  { icon: MessageSquare, label: "Interviews Received", value: "18", change: "+5 this week", color: "text-success" },
  { icon: TrendingUp, label: "Response Rate", value: "34%", change: "+8% vs last week", color: "text-warning" },
  { icon: CheckCircle2, label: "Conversion Rate", value: "12.7%", change: "+2.1%", color: "text-success" },
  { icon: BarChart3, label: "Avg Match Score", value: "87%", change: "Stable", color: "text-primary" },
  { icon: DollarSign, label: "Cost per Interview", value: "$2.40", change: "-$0.80", color: "text-success" },
];

const agentPerf = [
  { name: "Profile Analyzer", tasks: 48, successRate: 98, avgTime: "8s" },
  { name: "Job Intelligence", tasks: 312, successRate: 94, avgTime: "34s" },
  { name: "Matching Engine", tasks: 284, successRate: 96, avgTime: "12s" },
  { name: "Personalization", tasks: 142, successRate: 91, avgTime: "45s" },
  { name: "Outreach Agent", tasks: 142, successRate: 88, avgTime: "22s" },
];

const Analytics = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">Analytics</h1>
      <p className="text-sm text-muted-foreground">Performance metrics & agent insights</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
          className="glass rounded-xl p-4">
          <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
          <p className="text-xl font-bold font-mono text-foreground">{s.value}</p>
          <p className={`text-[10px] mt-1 ${s.color}`}>{s.change}</p>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Applications vs Interviews</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
            <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 50%)", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 50%)", fontSize: 11 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 16%)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="sent" fill="hsl(190 95% 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interviews" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Conversion Rate Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={conversionData}>
            <defs>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(190 95% 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(190 95% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
            <XAxis dataKey="week" tick={{ fill: "hsl(215 20% 50%)", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 50%)", fontSize: 11 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 30% 16%)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="rate" stroke="hsl(190 95% 55%)" fill="url(#convGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Agent Performance Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Agent", "Tasks Completed", "Success Rate", "Avg Time"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agentPerf.map((a, i) => (
              <tr key={i} className="border-b border-border/20">
                <td className="px-4 py-2.5 text-sm font-medium text-foreground">{a.name}</td>
                <td className="px-4 py-2.5 text-sm font-mono text-muted-foreground">{a.tasks}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-sm font-mono ${a.successRate >= 95 ? "text-success" : a.successRate >= 90 ? "text-warning" : "text-destructive"}`}>
                    {a.successRate}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm font-mono text-muted-foreground">{a.avgTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default Analytics;
