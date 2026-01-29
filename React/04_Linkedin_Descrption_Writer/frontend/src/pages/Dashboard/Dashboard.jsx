import { useNavigate } from 'react-router-dom';
import { PenTool, History, Star, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="welcome-banner glass-card">
                <div>
                    <h2>Ready to craft your next opportunity?</h2>
                    <p>Generate a professional description in seconds.</p>
                </div>
                <button onClick={() => navigate('/generate')} className="btn btn-primary">
                    <PenTool size={18} /> Create New
                </button>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-icon icon-blue"><History /></div>
                    <div className="stat-info">
                        <span className="stat-value">0</span>
                        <span className="stat-label">Generated</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon icon-purple"><Star /></div>
                    <div className="stat-info">
                        <span className="stat-value">0</span>
                        <span className="stat-label">Favorites</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon icon-teal"><TrendingUp /></div>
                    <div className="stat-info">
                        <span className="stat-value">N/A</span>
                        <span className="stat-label">Efficiency</span>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h3 className="section-title">Recent Activity</h3>
                <div className="glass-card activity-list">
                   <div className="empty-state">
                       <p>No descriptions generated yet.</p>
                       <button onClick={() => navigate('/generate')} className="btn btn-outline btn-sm">Start Generating</button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
