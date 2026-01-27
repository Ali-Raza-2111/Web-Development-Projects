import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Brain, Calculator, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useUpload } from '../../context/uploadContext';
import './Processing.css';

const ANALYSIS_STEPS = [
  {
    id: 'extracting',
    title: 'Extracting Data',
    description: 'Reading your bank statements and extracting transaction data...',
    icon: FileSearch,
  },
  {
    id: 'categorizing',
    title: 'Categorizing Transactions',
    description: 'Classifying your income and expense transactions...',
    icon: Brain,
  },
  {
    id: 'calculating',
    title: 'Calculating Tax Obligations',
    description: 'Computing your tax liabilities based on FIRS guidelines...',
    icon: Calculator,
  },
  {
    id: 'generating',
    title: 'Generating Report',
    description: 'Creating your personalized tax health report...',
    icon: Shield,
  },
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { analysisStatus, analysisResult, analysisError, resetUpload } = useUpload();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  // Simulate step progression based on status
  useEffect(() => {
    if (analysisStatus === 'processing') {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < ANALYSIS_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3000);

      const progressInterval = setInterval(() => {
        setStepProgress((prev) => {
          if (prev < 100) {
            return prev + Math.random() * 5;
          }
          return prev;
        });
      }, 200);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [analysisStatus]);

  // Navigate to report when complete
  useEffect(() => {
    if (analysisStatus === 'completed' && analysisResult) {
      const timer = setTimeout(() => {
        navigate('/report');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [analysisStatus, analysisResult, navigate]);

  const handleRetry = () => {
    resetUpload();
    navigate('/upload');
  };

  const handleGoBack = () => {
    resetUpload();
    navigate('/dashboard');
  };

  if (analysisStatus === 'error') {
    return (
      <div className="processing-page">
        <div className="processing-container">
          <div className="processing-error glass-card">
            <div className="error-icon-wrapper">
              <AlertCircle size={48} />
            </div>
            <h2>Analysis Failed</h2>
            <p>{analysisError || 'Something went wrong while processing your documents.'}</p>
            <div className="error-actions">
              <button className="btn btn-secondary" onClick={handleGoBack}>
                Go to Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisStatus === 'completed') {
    return (
      <div className="processing-page">
        <div className="processing-container">
          <div className="processing-complete glass-card">
            <div className="complete-icon-wrapper">
              <CheckCircle size={64} />
            </div>
            <h2>Analysis Complete!</h2>
            <p>Your tax health report is ready. Redirecting...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="processing-page">
      <div className="processing-container">
        <div className="processing-header">
          <h1 className="processing-title">Analyzing Your Documents</h1>
          <p className="processing-subtitle">
            Our AI is reviewing your bank statements. This usually takes 1-2 minutes.
          </p>
        </div>

        <div className="processing-visual glass-card">
          <div className="brain-animation">
            <Brain className="brain-icon" size={80} />
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        </div>

        <div className="processing-steps glass-card">
          {ANALYSIS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={step.id}
                className={`step-item ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-indicator">
                  {isComplete ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  {isCurrent && <p>{step.description}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="processing-progress glass-card">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span>{Math.min(Math.round(stepProgress), 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill animated" 
              style={{ width: `${Math.min(stepProgress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="processing-tips glass-card">
          <h4>Did you know?</h4>
          <p>
            In Nigeria, individuals and businesses are required to file annual tax returns 
            with the Federal Inland Revenue Service (FIRS) or their respective State Internal 
            Revenue Service (SIRS).
          </p>
        </div>
      </div>
    </div>
  );
}
