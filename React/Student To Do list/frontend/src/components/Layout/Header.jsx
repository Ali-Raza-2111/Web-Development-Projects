import { FiActivity } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Header = ({ theme, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FiActivity className="logo-icon" />
          <h1>Scholar</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
};

export default Header;
