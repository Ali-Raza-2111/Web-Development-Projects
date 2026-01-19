import { useEffect, useState } from 'react';
import { format, parseISO, getDay, subDays, startOfWeek } from 'date-fns';
import { useStats } from '../../hooks/useApi';
import { FiCalendar } from 'react-icons/fi';
import './Stats.css';

const StreakCalendar = () => {
  const { streakData, fetchAllStats, stats } = useStats();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  // Group data by weeks for GitHub-style grid
  const getCalendarData = () => {
    if (!streakData || streakData.length === 0) return [];

    const weeks = [];
    let currentWeek = [];
    
    // Get the day of week for the first date (0 = Sunday)
    const firstDate = parseISO(streakData[0].date);
    const startDay = getDay(firstDate);
    
    // Add empty cells for days before the first date
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }
    
    streakData.forEach((day) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const calendarData = getCalendarData();

  const levelColors = {
    dark: ['var(--input-bg)', '#333333', '#665c33', '#998633', '#d4af37'], /* Graphite to Gold */
    light: ['var(--input-bg)', '#e0e0e0', '#a0b0c0', '#507090', '#0a2342'], /* Silver to Navy */
  };

  // Get theme from document
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const colors = isDark ? levelColors.dark : levelColors.light;

  const handleMouseEnter = (e, day) => {
    if (!day) return;
    
    const rect = e.target.getBoundingClientRect();
    setTooltipData(day);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get month labels for the header
  const getMonthLabels = () => {
    if (!streakData || streakData.length === 0) return [];
    
    const labels = [];
    let currentMonth = -1;
    let weekIndex = 0;
    
    calendarData.forEach((week, index) => {
      const firstDayOfWeek = week.find(d => d !== null);
      if (firstDayOfWeek) {
        const month = parseISO(firstDayOfWeek.date).getMonth();
        if (month !== currentMonth) {
          labels.push({ month: months[month], position: index });
          currentMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="streak-container">
      <div className="streak-header">
        <div className="streak-title">
          <FiCalendar className="streak-icon" />
          <h3>Activity Calendar</h3>
        </div>
        <div className="streak-info">
          <span className="current-streak">
            🔥 {stats?.current_streak || 0} day streak
          </span>
          <span className="longest-streak">
            Best: {stats?.longest_streak || 0} days
          </span>
        </div>
      </div>

      <div className="calendar-wrapper">
        {/* Month labels */}
        <div className="month-labels">
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="month-label"
              style={{ left: `${(label.position * 14) + 30}px` }}
            >
              {label.month}
            </span>
          ))}
        </div>

        <div className="calendar-content">
          {/* Day labels */}
          <div className="day-labels">
            {days.map((day, i) => (
              <span key={i} className="day-label">
                {i % 2 === 1 ? day.charAt(0) : ''}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="calendar-grid">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`calendar-day ${day ? '' : 'empty'}`}
                    style={{
                      backgroundColor: day ? colors[day.level] : 'transparent',
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <span className="legend-text">Less</span>
        <div className="legend-squares">
          {colors.map((color, i) => (
            <div
              key={i}
              className="legend-square"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="legend-text">More</span>
      </div>

      {/* Tooltip */}
      {tooltipData && (
        <div
          className="calendar-tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <strong>{tooltipData.count} tasks</strong>
          <span>{format(parseISO(tooltipData.date), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default StreakCalendar;
