import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, FileText, Lock, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './Consent.css';

const ConsentPage = () => {
  const navigate = useNavigate();
  const { updateConsent } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [consents, setConsents] = useState({
    dataProcessing: false,
    privacyPolicy: false,
    educationalPurpose: false,
  });

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleConsentChange = (key) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!allConsentsGiven) {
      setError('Please agree to all terms to continue');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await updateConsent(true);
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Failed to save consent. Please try again.');
    }

    setIsLoading(false);
  };

  const consentItems = [
    {
      key: 'dataProcessing',
      icon: FileText,
      title: 'Data Processing',
      description: 'I consent to Payrite processing my uploaded bank statements to extract transaction data for tax analysis purposes. My files will be temporarily stored and automatically deleted within 24 hours.',
    },
    {
      key: 'privacyPolicy',
      icon: Lock,
      title: 'Privacy & Security',
      description: 'I understand that my data is encrypted both at rest and in transit. Payrite will never request my bank login credentials or share my personal data with third parties without my explicit consent.',
    },
    {
      key: 'educationalPurpose',
      icon: Shield,
      title: 'Educational Purpose Only',
      description: 'I understand that Payrite provides educational tax information only. It does not file taxes, provide legal or financial advice, or submit any information to government agencies.',
    },
  ];

  return (
    <div className="consent-page">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="consent-container">
        <div className="consent-header animate-fade-in">
          <div className="consent-icon-wrapper">
            <Shield size={32} />
          </div>
          <h1 className="consent-title">Your Privacy Matters</h1>
          <p className="consent-subtitle">
            Before we proceed, please review and accept our data handling practices
          </p>
        </div>

        <div className="consent-content">
          {consentItems.map((item, index) => (
            <div 
              key={item.key} 
              className={`consent-item glass-card animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="consent-item-header">
                <div className="consent-item-icon">
                  <item.icon size={20} />
                </div>
                <h3 className="consent-item-title">{item.title}</h3>
              </div>
              <p className="consent-item-description">{item.description}</p>
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  checked={consents[item.key]}
                  onChange={() => handleConsentChange(item.key)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom">
                  {consents[item.key] && <CheckCircle size={16} />}
                </span>
                <span className="checkbox-label">I understand and agree</span>
              </label>
            </div>
          ))}
        </div>

        {error && (
          <div className="consent-error animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="consent-footer animate-fade-in-up delay-300">
          <div className="data-promise glass-card">
            <Trash2 size={20} />
            <div>
              <strong>Our Data Promise</strong>
              <p>Your uploaded files are automatically deleted within 24 hours. We never store your bank credentials.</p>
            </div>
          </div>

          <button
            className={`btn btn-primary btn-full btn-lg ${!allConsentsGiven ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || !allConsentsGiven}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <CheckCircle size={20} />
                Accept & Continue
              </>
            )}
          </button>

          <p className="consent-note">
            By continuing, you confirm that you are at least 18 years old and have read our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentPage;
