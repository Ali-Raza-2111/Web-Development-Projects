import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="orb orb-error"></div>
            <div className="error-content glass-card">
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    <Home size={18} /> Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
