import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Brain, 
  BarChart3, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import './Onboarding.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Bank Statements',
      description: 'Simply upload up to 5 PDF bank statements. We support all major Nigerian banks including Access, GTB, Zenith, First Bank, UBA, and more.',
      image: '📄',
      tips: [
        'Download statements from your bank\'s website or app',
        'PDF format only (max 10MB per file)',
        'You can upload statements from multiple banks',
      ],
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our intelligent system reads and categorizes your transactions automatically, identifying income patterns and potential tax implications.',
      image: '🤖',
      tips: [
        'Transactions are categorized automatically',
        'Personal and business income are identified',
        'Processing takes just a few minutes',
      ],
    },
    {
      icon: BarChart3,
      title: 'Get Your Tax Health Score',
      description: 'Receive a comprehensive Tax Health Score from 0-100, showing your current tax compliance status and areas that need attention.',
      image: '📊',
      tips: [
        'Score of 80+ means excellent tax health',
        'See detailed breakdown of income sources',
        'Identify potential tax obligations',
      ],
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Get personalized, legal strategies to optimize your tax position. Our AI explains complex tax concepts in simple, understandable language.',
      image: '💡',
      tips: [
        'Legal tax reduction strategies',
        'Easy-to-understand explanations',
        'Actionable insights you can implement',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/consent');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/consent');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="onboarding-page">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <span className="logo-icon">₦</span>
            <span className="logo-text">Payrite</span>
          </div>
          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>
        </div>

        <div className="onboarding-content animate-fade-in">
          <div className="welcome-message">
            <p>Welcome, {user?.full_name?.split(' ')[0] || 'there'}! 👋</p>
          </div>

          <div className="step-visual">
            <div className="step-icon-wrapper">
              <currentStepData.icon size={48} />
            </div>
            <span className="step-emoji">{currentStepData.image}</span>
          </div>

          <h1 className="step-title">{currentStepData.title}</h1>
          <p className="step-description">{currentStepData.description}</p>

          <div className="step-tips glass-card">
            {currentStepData.tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <CheckCircle size={18} className="text-success" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="step-indicators">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button className="btn btn-ghost" onClick={handlePrev}>
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
