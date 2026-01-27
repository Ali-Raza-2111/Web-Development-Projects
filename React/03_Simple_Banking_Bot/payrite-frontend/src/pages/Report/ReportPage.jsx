import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  ArrowLeft,
  Brain,
  FileText,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useUpload } from '../../context/uploadContext';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './Report.css';

const SCORE_THRESHOLDS = {
  excellent: { min: 80, color: 'success', label: 'Excellent' },
  good: { min: 60, color: 'success', label: 'Good' },
  fair: { min: 40, color: 'warning', label: 'Fair' },
  poor: { min: 0, color: 'danger', label: 'Needs Attention' },
};

function getScoreInfo(score) {
  if (score >= 80) return SCORE_THRESHOLDS.excellent;
  if (score >= 60) return SCORE_THRESHOLDS.good;
  if (score >= 40) return SCORE_THRESHOLDS.fair;
  return SCORE_THRESHOLDS.poor;
}

export default function ReportPage() {
  const navigate = useNavigate();
  const { analysisResult, analysisStatus } = useUpload();
  const [expandedSections, setExpandedSections] = useState({
    income: true,
    expenses: false,
    recommendations: true,
  });

  useEffect(() => {
    if (!analysisResult && analysisStatus !== 'completed') {
      navigate('/dashboard');
    }
  }, [analysisResult, analysisStatus, navigate]);

  if (!analysisResult) {
    return <LoadingSpinner message="Loading report..." />;
  }

  const {
    taxHealthScore = 72,
    period = 'Jan 2024 - Dec 2024',
    summary = {
        totalCredits: 2000000,
        totalDebits: 1500000,
        netFlow: 500000
    },
    taxLiability = {
        total: 157500,
        breakdown: {
            pit: 45000,
            cit: 0,
            vat: 90000,
            wht: 22500,
            cgt: 0
        }
    },
    classificationGroups = {
        group1: { label: "Taxable Income", amount: 1200000, items: [] },
        group2: { label: "Non-Taxable Capital", amount: 800000, items: [] },
        group3: { label: "Reimbursements", amount: 50000, items: [] },
        group4: { label: "Deductible Expenses", amount: 900000, items: [] },
        group5: { label: "Non-Deductible Expenses", amount: 600000, items: [] },
        group6: { label: "Asset Transactions", amount: 0, items: [] },
    },
    vatAnalysis = {
        outputVat: 120000, 
        inputVat: 30000, 
        payable: 90000
    },
    whtCredits = {
        total: 25000,
        pending: 5000
    },
    recommendations = [],
    issues = []
  } = analysisResult;

  const scoreInfo = getScoreInfo(taxHealthScore);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDownload = () => {
    // In real app, would generate PDF
    alert('PDF download would be triggered here');
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  return (
    <div className="report-page">
      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="header-actions">
            <button className="btn btn-secondary btn-icon" onClick={handleDownload}>
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="report-card score-section">
          <div className="score-display-v2">
            <div className="score-ring-container">
               <svg viewBox="0 0 120 120" style={{transform: 'rotate(-90deg)', width: '100%', height: '100%'}}>
                 <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
                 <circle cx="60" cy="60" r="54" fill="none" stroke={scoreInfo.color === 'success' ? '#34d399' : scoreInfo.color === 'warning' ? '#fbbf24' : '#f87171'} strokeWidth="8"
                   strokeDasharray="339.292" strokeDashoffset={339.292 - (339.292 * taxHealthScore) / 100} strokeLinecap="round" />
               </svg>
               <div className="score-value-v2">
                  <span className="score-val-big">{taxHealthScore}</span>
                  <span className="score-label-small">/ 100</span>
               </div>
            </div>
            
            <div className="score-details-v2">
              <h2>{scoreInfo.label}</h2>
              <p>{taxHealthScore >= 60 ? 'Healthy tax profile' : 'Optimization needed'}</p>
            </div>
          </div>
          
          <div className="report-meta">
            <div className="meta-row">
              <Brain size={16} />
              <span>AI Analysis</span>
            </div>
            <div className="meta-row">
              <span>Period: {period}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">Total Credits</div>
            <div className="metric-value">{formatCurrency(summary.totalCredits)}</div>
          </div>
          <div className="metric-item">
             <div className="metric-label">Total Debits</div>
             <div className="metric-value">{formatCurrency(summary.totalDebits)}</div>
          </div>
          <div className="metric-item">
             <div className="metric-label">Net Flow</div>
             <div className={`metric-value ${summary.netFlow >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(summary.netFlow)}</div>
          </div>
           <div className="metric-item">
             <div className="metric-label">Total Tax Liability</div>
              <div className="metric-value text-primary">{formatCurrency(taxLiability.total)}</div>
          </div>
        </div>
        
        {/* Detailed Tax Breakdown */}
        <div className="report-card">
            <h3 className="section-title-sm">Tax Liability Breakdown</h3>
            <div className="tax-breakdown-grid">
                <div className="tax-item">
                    <span className="tax-label">Personal Income Tax (PIT)</span>
                    <span className="tax-amount">{formatCurrency(taxLiability.breakdown.pit)}</span>
                </div>
                <div className="tax-item">
                    <span className="tax-label">Company Income Tax (CIT)</span>
                    <span className="tax-amount">{formatCurrency(taxLiability.breakdown.cit)}</span>
                </div>
                <div className="tax-item">
                    <span className="tax-label">VAT Payable</span>
                    <span className="tax-amount">{formatCurrency(taxLiability.breakdown.vat)}</span>
                </div>
                <div className="tax-item">
                     <span className="tax-label">Withholding Tax (WHT)</span>
                     <span className="tax-amount">{formatCurrency(taxLiability.breakdown.wht)}</span>
                </div>
                <div className="tax-item">
                     <span className="tax-label">Capital Gains Tax (CGT)</span>
                     <span className="tax-amount">{formatCurrency(taxLiability.breakdown.cgt)}</span>
                </div>
            </div>
        </div>

         {/* 6 Classification Groups */}
         <div className="report-card">
             <h3 className="section-title-sm">Transaction Classification Analysis</h3>
             <div className="classification-grid">
                 {/* Group 1: Taxable Income */}
                 <div className="class-group group-1">
                     <div className="group-header">
                         <span className="group-badge">Group 1</span>
                         <h4>Taxable Income</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group1.amount)}</p>
                     <p className="group-desc">Earned income subject to PIT/CIT/VAT</p>
                 </div>
                 
                 {/* Group 2: Non-Taxable Capital */}
                 <div className="class-group group-2">
                     <div className="group-header">
                         <span className="group-badge">Group 2</span>
                         <h4>Non-Taxable Capital</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group2.amount)}</p>
                     <p className="group-desc">Loans, capital injections, grants</p>
                 </div>

                 {/* Group 3: Reimbursements */}
                 <div className="class-group group-3">
                     <div className="group-header">
                         <span className="group-badge">Group 3</span>
                         <h4>Reimbursements</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group3.amount)}</p>
                     <p className="group-desc">Refunds and reversed transactions</p>
                 </div>

                 {/* Group 4: Deductible Expenses */}
                 <div className="class-group group-4">
                     <div className="group-header">
                         <span className="group-badge">Group 4</span>
                         <h4>Deductible Expenses</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group4.amount)}</p>
                     <p className="group-desc">Business operating costs</p>
                 </div>

                 {/* Group 5: Non-Deductible */}
                 <div className="class-group group-5">
                     <div className="group-header">
                         <span className="group-badge">Group 5</span>
                         <h4>Personal Expenses</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group5.amount)}</p>
                     <p className="group-desc">Non-deductible personal spending</p>
                 </div>

                 {/* Group 6: Asset Transactions */}
                 <div className="class-group group-6">
                     <div className="group-header">
                         <span className="group-badge">Group 6</span>
                         <h4>Asset Transactions</h4>
                     </div>
                     <p className="group-amount">{formatCurrency(classificationGroups.group6.amount)}</p>
                     <p className="group-desc">Capital assets purchase/sale</p>
                 </div>
             </div>
         </div>

        {/* VAT & WHT Analysis */}
        <div className="analysis-split-grid">
            {/* VAT Analysis */}
            <div className="report-card">
                 <h3 className="section-title-sm">VAT Analysis</h3>
                 <div className="vat-calc-box">
                     <div className="vat-row">
                         <span>Output VAT (Sales)</span>
                         <span className="text-danger">+ {formatCurrency(vatAnalysis.outputVat)}</span>
                     </div>
                     <div className="vat-row">
                         <span>Input VAT (Purchases)</span>
                         <span className="text-success">- {formatCurrency(vatAnalysis.inputVat)}</span>
                     </div>
                     <div className="vat-divider"></div>
                     <div className="vat-row total">
                         <span>Net VAT Payable</span>
                         <span className="text-primary">{formatCurrency(vatAnalysis.payable)}</span>
                     </div>
                 </div>
            </div>

            {/* WHT Credits */}
            <div className="report-card">
                <h3 className="section-title-sm">WHT Credit Status</h3>
                <div className="wht-content">
                    <div className="wht-stat">
                        <span className="label">Total WHT Credits</span>
                        <span className="value">{formatCurrency(whtCredits.total)}</span>
                    </div>
                     <div className="wht-stat">
                        <span className="label">Pending Claims</span>
                        <span className="value text-warning">{formatCurrency(whtCredits.pending)}</span>
                    </div>
                    <p className="wht-note">
                        <CheckCircle size={14} />
                        Ensure you collect credit notes from vendors
                    </p>
                </div>
            </div>
        </div>

        {/* Issues Alert */}
        {issues.length > 0 && (
          <div className="report-card warning" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
            <h3 className="section-label" style={{color: '#fca5a5'}}>
              <AlertTriangle size={24} />
              <span>Attn: Issues Found ({issues.length})</span>
            </h3>
            <ul className="issues-list" style={{listStyle: 'none', padding: 0}}>
              {issues.map((issue, index) => (
                <li key={index} className={`issue-item ${issue.severity}`} style={{padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  {issue.severity === 'high' ? (
                    <XCircle size={20} className="text-danger" />
                  ) : (
                    <AlertTriangle size={20} className="text-warning" />
                  )}
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Income Breakdown - HIDDEN FOR V2 REDESIGN - Using Classification Groups Instead */}
        {/* 
        <div className="report-card">
          <button
            className="section-header"
            onClick={() => toggleSection('income')}
            style={{width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', cursor: 'pointer', padding: 0}}
          >
            <h3 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <TrendingUp size={24} className="text-success" />
              <span>Income Breakdown</span>
            </h3>
            {expandedSections.income ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.income && (
            <div className="breakdown-content">
                ...
            </div>
          )}
        </div> 
        */}

        {/* AI Recommendations */}
        <div className="report-card">
          <button
            className="section-header"
            onClick={() => toggleSection('recommendations')}
            style={{width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', cursor: 'pointer', padding: 0}}
          >
            <h3 style={{fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <Lightbulb size={24} className="text-warning" />
              <span>AI Recommendations</span>
            </h3>
            {expandedSections.recommendations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.recommendations && (
            <div className="ai-recommendations" style={{marginTop: '1.5rem'}}>
              {recommendations.length > 0 ? (
                <>
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-card ${rec.type === 'warning' ? 'warning' : ''}`}>
                      <div className="rec-icon-wrapper">
                        <CheckCircle size={24} />
                      </div>
                      <div className="rec-content">
                        <h4>{rec.title}</h4>
                        <p>{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-recommendations" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
                  <CheckCircle size={48} style={{opacity: 0.5, marginBottom: '1rem'}} />
                  <p>Great job! No specific recommendations at this time.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="report-card" style={{background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(30, 41, 59, 0.4))', borderColor: 'var(--cyan-400)'}}>
          <div className="cta-content" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)'}}>Get Your Full Report</h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Unlock detailed insights, personalized tax planning tips, and export your complete analysis.
            </p>
          </div>
          <button className="btn btn-primary btn-icon" onClick={handlePayment} style={{width: '100%', justifyContent: 'center'}}>
            <CreditCard size={20} />
            <span>Unlock Full Report</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="report-disclaimer">
          <AlertTriangle size={16} />
          <p>
            This report is for educational purposes only and does not constitute professional tax advice.
            Please consult a certified tax professional for official guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
