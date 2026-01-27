import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  FileText,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { getInitials } from '../../utils/formatters';
import './AppLayout.css';

const AppLayout = ({ children, title }) => {
  const { user, logout, isPremium, subscriptionType } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'New Analysis' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <header className="app-header hide-desktop">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="header-title">{title || 'Payrite'}</h1>
        <div className="header-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.full_name} />
          ) : (
            <span>{getInitials(user?.full_name)}</span>
          )}
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">₦</span>
            <span className="logo-text">Payrite</span>
          </div>
          <button className="sidebar-close hide-desktop" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.full_name} />
            ) : (
              <span>{getInitials(user?.full_name)}</span>
            )}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.full_name || 'User'}</p>
            <span className={`user-badge badge badge-${isPremium ? 'success' : 'info'}`}>
              {subscriptionType === 'lifetime' ? 'Premium' : subscriptionType === 'one_time' ? 'Basic' : 'Free'}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isPremium && (
            <NavLink to="/payment" className="upgrade-banner" onClick={closeSidebar}>
              <CreditCard size={20} />
              <div className="upgrade-text">
                <span className="upgrade-title">Upgrade to Premium</span>
                <span className="upgrade-subtitle">Unlock all features</span>
              </div>
            </NavLink>
          )}
          
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <div className="main-header hide-mobile">
          <h1 className="page-title">{title}</h1>
          <div className="header-actions">
            <NavLink to="/profile" className="header-user">
              <span className="user-greeting">Hello, {user?.full_name?.split(' ')[0] || 'User'}</span>
              <div className="user-avatar-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.full_name} />
                ) : (
                  <span>{getInitials(user?.full_name)}</span>
                )}
              </div>
            </NavLink>
          </div>
        </div>
        
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
