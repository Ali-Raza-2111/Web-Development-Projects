import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { analysisAPI } from '../../services/api';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './History.css';

function getScoreColor(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'good';
  if (score >= 40) return 'warning';
  return 'danger';
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await analysisAPI.getHistory();
      setAnalyses(response.data || []);
    } catch (err) {
      setError('Failed to load analysis history');
      // Mock data for demo
      setAnalyses([
        {
          id: '1',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          period: 'Jan 2024 - Mar 2024',
          taxHealthScore: 78,
          totalIncome: 2500000,
          estimatedTax: 175000,
          filesCount: 3,
        },
        {
          id: '2',
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          period: 'Oct 2023 - Dec 2023',
          taxHealthScore: 65,
          totalIncome: 1800000,
          estimatedTax: 126000,
          filesCount: 2,
        },
        {
          id: '3',
          createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
          period: 'Jul 2023 - Sep 2023',
          taxHealthScore: 42,
          totalIncome: 1200000,
          estimatedTax: 84000,
          filesCount: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await analysisAPI.delete(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
  };

  const filteredAnalyses = analyses
    .filter((a) => a.period.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'score-desc':
          return b.taxHealthScore - a.taxHealthScore;
        case 'score-asc':
          return a.taxHealthScore - b.taxHealthScore;
        default: // date-desc
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading) {
    return <LoadingSpinner message="Loading history..." />;
  }

  return (
    <div className="history-page">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <div className="header-info">
            <h1>Analysis History</h1>
            <p>View and manage your past tax analyses</p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            New Analysis
          </Link>
        </div>

        {/* Filters */}
        <div className="history-filters glass-card">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-dropdown">
            <button
              className="filter-btn"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} />
              <span>Sort by</span>
              <ChevronDown size={16} />
            </button>
            {filterOpen && (
              <div className="filter-menu">
                <button
                  className={sortBy === 'date-desc' ? 'active' : ''}
                  onClick={() => { setSortBy('date-desc'); setFilterOpen(false); }}
                >
                  Newest First
                </button>
                <button
                  className={sortBy === 'date-asc' ? 'active' : ''}
                  onClick={() => { setSortBy('date-asc'); setFilterOpen(false); }}
                >
                  Oldest First
                </button>
                <button
                  className={sortBy === 'score-desc' ? 'active' : ''}
                  onClick={() => { setSortBy('score-desc'); setFilterOpen(false); }}
                >
                  Highest Score
                </button>
                <button
                  className={sortBy === 'score-asc' ? 'active' : ''}
                  onClick={() => { setSortBy('score-asc'); setFilterOpen(false); }}
                >
                  Lowest Score
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="history-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Analyses List */}
        {filteredAnalyses.length > 0 ? (
          <div className="analyses-list">
            {filteredAnalyses.map((analysis) => (
              <div key={analysis.id} className="analysis-card glass-card">
                <div className="analysis-main">
                  <div className={`score-badge ${getScoreColor(analysis.taxHealthScore)}`}>
                    <TrendingUp size={16} />
                    <span>{analysis.taxHealthScore}</span>
                  </div>
                  <div className="analysis-info">
                    <h3 className="analysis-period">{analysis.period}</h3>
                    <div className="analysis-meta">
                      <span>
                        <Calendar size={14} />
                        {formatRelativeTime(analysis.createdAt)}
                      </span>
                      <span>
                        <FileText size={14} />
                        {analysis.filesCount} file{analysis.filesCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="analysis-stats">
                  <div className="stat">
                    <span className="stat-label">Income</span>
                    <span className="stat-value">{formatCurrency(analysis.totalIncome)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Est. Tax</span>
                    <span className="stat-value">{formatCurrency(analysis.estimatedTax)}</span>
                  </div>
                </div>
                <div className="analysis-actions">
                  <Link to={`/report/${analysis.id}`} className="action-btn view">
                    <Eye size={18} />
                    <span>View</span>
                  </Link>
                  <button className="action-btn download">
                    <Download size={18} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(analysis.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history glass-card">
            <FileText size={48} className="empty-icon" />
            <h3>No analyses found</h3>
            <p>
              {searchQuery
                ? 'Try adjusting your search criteria'
                : "You haven't run any tax analyses yet"}
            </p>
            {!searchQuery && (
              <Link to="/upload" className="btn btn-primary">
                Start Your First Analysis
              </Link>
            )}
          </div>
        )}

        {/* Stats Summary */}
        {analyses.length > 0 && (
          <div className="history-summary glass-card">
            <div className="summary-stat">
              <span className="summary-value">{analyses.length}</span>
              <span className="summary-label">Total Analyses</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value">
                {Math.round(analyses.reduce((sum, a) => sum + a.taxHealthScore, 0) / analyses.length)}
              </span>
              <span className="summary-label">Avg. Score</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value">
                {formatCurrency(analyses.reduce((sum, a) => sum + a.totalIncome, 0))}
              </span>
              <span className="summary-label">Total Income Analyzed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
