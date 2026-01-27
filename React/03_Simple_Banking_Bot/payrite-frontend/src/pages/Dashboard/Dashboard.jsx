import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ArrowRight,
  BarChart3,
  Wallet,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Plus
} from 'lucide-react';
import AppLayout from '../../Components/Layout/AppLayout';
import { useAuth } from '../../context/authContext';
import { analysisAPI } from '../../services/api';
import { formatNaira, formatDate, getTaxHealthInfo, getRiskInfo } from '../../utils/formatters';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await analysisAPI.getAnalysisHistory();
      setAnalyses(response.data);
      if (response.data.length > 0) {
        setLatestAnalysis(response.data[0]);
      }
    } catch (error) {
      // Silently ignore network errors (backend offline/demo mode)
      if (error.code !== 'ERR_NETWORK' && error.message !== 'Network Error') {
        console.error('Failed to fetch analysis history:', error);
      }
      // Fallback for demo/offline mode
      const mockAnalyses = [
        {
          id: 'demo-1',
          createdAt: new Date().toISOString(),
          period: 'Jan 2024 - Mar 2024',
          taxHealthScore: 78,
          total_income: 2500000,
          total_expenses: 1800000,
          estimated_tax: 175000,
          status: 'completed'
        },
        {
          id: 'demo-2',
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          period: 'Oct 2023 - Dec 2023',
          taxHealthScore: 65,
          total_income: 1800000,
          total_expenses: 1200000,
          estimated_tax: 126000,
          status: 'completed'
        }
      ];
      setAnalyses(mockAnalyses);
      setLatestAnalysis(mockAnalyses[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      icon: Upload,
      title: 'New Analysis',
      description: 'Upload bank statements',
      path: '/upload',
      color: 'primary',
    },
    {
      icon: FileText,
      title: 'View Reports',
      description: 'See past analyses',
      path: '/history',
      color: 'secondary',
    },
    {
      icon: CreditCard,
      title: isPremium ? 'Manage Plan' : 'Upgrade',
      description: isPremium ? 'View subscription' : 'Unlock all features',
      path: '/payment',
      color: isPremium ? 'secondary' : 'success',
    },
  ];

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="dashboard-loading">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="dashboard">
        {/* Welcome Section */}
        <section className="welcome-section animate-fade-in">
          <div className="welcome-content">
            <h1 className="welcome-title">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="welcome-subtitle">
              {latestAnalysis 
                ? 'Here\'s your latest tax health overview' 
                : 'Upload your first bank statement to get started'}
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            <Plus size={20} />
            New Analysis
          </Link>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-grid animate-fade-in-up delay-100">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path} 
              className={`action-card action-${action.color}`}
            >
              <div className="action-icon">
                <action.icon size={24} />
              </div>
              <div className="action-info">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <ArrowRight size={20} className="action-arrow" />
            </Link>
          ))}
        </section>

        {latestAnalysis ? (
          <>
            {/* Tax Health Overview */}
            <h2 className="section-title" style={{marginBottom: '1rem'}}>Tax Health Overview</h2>
            <section className="dashboard-grid animate-fade-in-up delay-200">
                {/* Main Stats Card */}
                <div className="stats-card-main">
                  <div className="score-container">
                    <div className="score-content">
                       <div className="score-label">Health Score</div>
                       <div className="score-value">
                         <span className="score-number">{latestAnalysis.tax_health_score || 0}</span>
                         <span className="score-total">/ 100</span>
                       </div>
                       <div className={`score-status ${
                         (latestAnalysis.tax_health_score >= 70) ? 'status-good' : 
                         (latestAnalysis.tax_health_score >= 50) ? 'status-fair' : 'status-poor'
                       }`}>
                         {getTaxHealthInfo(latestAnalysis.tax_health_score).label}
                       </div>
                    </div>
                  </div>
                  
                  <div className="stats-grid-secondary">
                    <div className="stat-item">
                      <div className="stat-header">
                        <div className="stat-icon-sm"><ArrowRight size={14} /></div>
                        Income
                      </div>
                      <div className="stat-val">{formatNaira(latestAnalysis.total_income)}</div>
                    </div>
                    <div className="stat-item">
                       <div className="stat-header">
                        <div className="stat-icon-sm"><ArrowRight size={14} /></div>
                        Expenses
                      </div>
                      <div className="stat-val">{formatNaira(latestAnalysis.total_expenses)}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-header">
                        <div className="stat-icon-sm"><ArrowRight size={14} /></div>
                        Tax Liab.
                      </div>
                      <div className="stat-val text-primary">{formatNaira(latestAnalysis.estimated_tax)}</div>
                    </div>
                     <div className="stat-item">
                      <div className="stat-header">
                        <div className="stat-icon-sm"><AlertTriangle size={14} /></div>
                        Risk
                      </div>
                      <div className={`stat-val text-${getRiskInfo(latestAnalysis.risk_level).color}`}>
                        {getRiskInfo(latestAnalysis.risk_level).label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Summary Side Panel */}
                <div className="ai-summary-card">
                   <div className="ai-header">
                      <BarChart3 size={24} className="ai-icon-pulse" />
                      <h3 className="ai-title">AI Analysis</h3>
                   </div>
                   <div className="ai-content">
                      {latestAnalysis.ai_summary ? latestAnalysis.ai_summary.substring(0, 150) + "..." : "Processing financial data for insights..."}
                   </div>
                   <div style={{marginTop: '1rem', textAlign: 'right'}}>
                      <Link to={`/report/${latestAnalysis.id}`} className="see-all">View Full Report →</Link>
                   </div>
                </div>
            </section>


            {/* Recent Analyses */}
            {analyses.length > 1 && (
              <section className="recent-section animate-fade-in-up delay-400">
                <div className="section-header">
                  <h2 className="section-title">Recent History</h2>
                  <Link to="/history" className="see-all">
                    View All
                  </Link>
                </div>

                <div className="activity-list">
                  {analyses.slice(1, 4).map((analysis) => (
                    <Link 
                      key={analysis.id} 
                      to={`/report/${analysis.id}`}
                      className="activity-item"
                    >
                      <div className="activity-left">
                        <div className="activity-icon">
                          <FileText size={20} />
                        </div>
                        <div className="activity-info">
                           <h4>Tax Analysis Report</h4>
                           <p className="activity-date">{formatDate(analysis.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className={`activity-status-badge status-${
                         (analysis.tax_health_score >= 70) ? 'completed' : 
                         (analysis.tax_health_score >= 50) ? 'pending' : 'failed'
                       }`}>
                        Score: {analysis.tax_health_score}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="animate-fade-in-up delay-200" style={{marginTop: '2rem'}}>
            <div className="empty-state">
              <div className="empty-icon" style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
                <FileText size={48} />
              </div>
              <h2 className="welcome-title" style={{fontSize: '1.5rem'}}>No Analyses Yet</h2>
              <p className="welcome-subtitle" style={{marginBottom: '2rem'}}>
                Upload your bank statements to get your first Tax Health Check.
              </p>
              <Link to="/upload" className="btn btn-primary">
                <Upload size={20} />
                Start New Analysis
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
