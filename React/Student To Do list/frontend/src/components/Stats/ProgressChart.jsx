import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useStats } from '../../hooks/useApi';
import { FiTrendingUp, FiTarget, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import './Stats.css';

const ProgressChart = () => {
  const { 
    stats, 
    weeklyData, 
    monthlyData, 
    priorityData, 
    loading, 
    fetchAllStats 
  } = useStats();

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  // Format weekly data for chart
  const formattedWeeklyData = weeklyData.map(item => ({
    ...item,
    day: format(parseISO(item.date), 'EEE'),
    date: format(parseISO(item.date), 'MMM d'),
  }));

  // Format monthly data for chart
  const formattedMonthlyData = monthlyData.map(item => ({
    ...item,
    day: format(parseISO(item.date), 'd'),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].value} tasks completed
          </p>
        </div>
      );
    }
    return null;
  };

  const priorityColors = {
    High: '#8B0000',   /* var(--danger) */
    Medium: '#CD853F', /* var(--warning) */
    Low: '#6B8E23'     /* var(--success) */
  };

  if (loading) {
    return <div className="stats-loading">Loading stats...</div>;
  }

  return (
    <div className="stats-container">
      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiTarget />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total_tasks || 0}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.completed_tasks || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate">
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.completion_rate || 0}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.current_streak || 0}</span>
            <span className="stat-label">Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Weekly Bar Chart */}
        <div className="chart-card">
          <h3>Weekly Progress</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formattedWeeklyData}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Montserrat' }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--hover-bg)' }} />
                <Bar 
                  dataKey="tasks_completed" 
                  fill="var(--accent)" 
                  radius={[0, 0, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Line Chart */}
        <div className="chart-card">
          <h3>Monthly Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formattedMonthlyData}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Montserrat' }}
                  interval={4}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="tasks_completed" 
                  stroke="var(--accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--card-bg)', stroke: 'var(--accent)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--accent)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="chart-card priority-chart">
          <h3>Priority Distribution</h3>
          <div className="chart-wrapper pie-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {priorityData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ background: priorityColors[entry.name] }}
                  />
                  <span className="legend-label">{entry.name}</span>
                  <span className="legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
