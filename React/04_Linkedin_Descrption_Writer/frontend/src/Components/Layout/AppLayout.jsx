import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { PenTool, LayoutDashboard, Home } from 'lucide-react';
import './AppLayout.css';

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/generate', label: 'Generator', icon: PenTool },
    ];

    return (
        <div className="app-layout-v2">
            <nav className="top-navbar glass-card">
                <div className="container">
                    <div className="nav-brand" onClick={() => navigate('/')}>
                        LinkedIn<span className="text-glow">Gen</span>
                    </div>
                    
                    <div className="nav-menu">
                        {navItems.map((item) => (
                            <button 
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="main-content-v2">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
