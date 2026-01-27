import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Upload,
  BarChart3,
  Lightbulb,
  Users,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import './LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Upload,
      title: 'Upload Bank Statements',
      description: 'Simply upload up to 5 PDF bank statements. We support all major Nigerian banks.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our intelligent system extracts and analyzes your transaction data automatically.',
    },
    {
      icon: BarChart3,
      title: 'Tax Health Score',
      description: 'Get a clear 0-100 score showing your tax compliance status and exposure.',
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'Receive personalized, legal strategies to optimize your tax position.',
    },
  ];

  const steps = [
    { number: '01', title: 'Upload', description: 'Upload your bank statement PDFs securely' },
    { number: '02', title: 'Analyze', description: 'AI processes and categorizes your transactions' },
    { number: '03', title: 'Review', description: 'Get your Tax Health Score and detailed report' },
    { number: '04', title: 'Optimize', description: 'Follow personalized recommendations' },
  ];

  const testimonials = [
    {
      name: 'Adaeze Okafor',
      role: 'Small Business Owner',
      content: 'Payrite helped me understand my tax obligations for the first time. The explanations are so clear!',
      rating: 5,
    },
    {
      name: 'Emeka Nwankwo',
      role: 'Freelance Consultant',
      content: 'I had no idea I was missing deductions. This app saved me from potential penalties.',
      rating: 5,
    },
    {
      name: 'Fatima Ibrahim',
      role: 'SME Director',
      content: 'The Tax Health Score is brilliant. Now I can track my compliance quarterly.',
      rating: 5,
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Users Trust Us' },
    { value: '₦2B+', label: 'Transactions Analyzed' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <div className="landing-page">
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">₦</span>
            <span className="logo-text">Payrite</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>

          <button 
            className="mobile-menu-btn hide-desktop" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Shield size={16} />
            <span>Trusted by 10,000+ Nigerians</span>
          </div>
          
          <h1 className="hero-title animate-fade-in-up">
            Know Your <span className="text-gradient">Tax Health</span> in Minutes
          </h1>
          
          <p className="hero-subtitle animate-fade-in-up delay-100">
            Upload your bank statements and get an AI-powered Tax Health Check. 
            Understand your tax exposure and discover legal ways to reduce it.
          </p>
          
          <div className="hero-cta animate-fade-in-up delay-200">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Analysis
              <ArrowRight size={20} />
            </Link>
            <Link to="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
          
          <div className="hero-trust animate-fade-in-up delay-300">
            <div className="trust-item">
              <CheckCircle size={16} className="text-success" />
              <span>No tax filing required</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} className="text-success" />
              <span>Bank-level security</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} className="text-success" />
              <span>Results in minutes</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-fade-in delay-200">
          <div className="visual-stack">
            <div className="card-layer layer-1"></div>
            <div className="card-layer layer-2">
              <div className="mock-header">
                <span className="logo-text">Payrite Analysis</span>
                <span className="hero-badge" style={{marginBottom: 0}}>Pro</span>
              </div>
              <div className="mock-score">
                 <div className="score-circle">
                    <span className="score-val">84</span>
                    <span className="score-max">/ 100</span>
                 </div>
                 <h4>Tax Health Score</h4>
                 <p className="text-secondary">Excellent Standing</p>
              </div>
              <div className="hero-card-stats" style={{display: 'flex', gap: '2rem', justifyContent: 'center'}}>
                <div>
                  <p className="text-muted text-sm">Est. Tax</p>
                  <h4 className="text-primary">₦145,000</h4>
                </div>
                <div>
                  <p className="text-muted text-sm">Savings</p>
                  <h4 className="text-success">₦32,500</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything You Need to <span className="text-gradient">Understand Your Taxes</span>
            </h2>
            <p className="section-subtitle">
              Payrite combines advanced AI with Nigerian tax expertise to give you actionable insights.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card glass-card glass-card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              Get Your Tax Health Check in <span className="gradient-text">4 Simple Steps</span>
            </h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <span className="step-number">{step.number}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="step-arrow hide-mobile" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">Nigerian Entrepreneurs</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card glass-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--accent-warning)" color="var(--accent-warning)" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.name}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="section-subtitle">
              Choose the plan that works best for you. No hidden fees.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Free Preview</h3>
                <div className="pricing-amount">
                  <span className="amount">₦0</span>
                </div>
                <p className="pricing-description">See your Tax Health Score</p>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} /> Upload up to 5 PDFs</li>
                <li><CheckCircle size={16} /> View Tax Health Score</li>
                <li><CheckCircle size={16} /> Basic income summary</li>
                <li className="disabled"><X size={16} /> Full detailed report</li>
                <li className="disabled"><X size={16} /> AI recommendations</li>
              </ul>
              <Link to="/signup" className="btn btn-secondary btn-full">
                Get Started
              </Link>
            </div>

            <div className="pricing-card glass-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Single Report</h3>
                <div className="pricing-amount">
                  <span className="amount">₦1,500</span>
                  <span className="period">one-time</span>
                </div>
                <p className="pricing-description">Complete tax analysis</p>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} /> Everything in Free</li>
                <li><CheckCircle size={16} /> Full detailed report</li>
                <li><CheckCircle size={16} /> AI-powered explanations</li>
                <li><CheckCircle size={16} /> Tax reduction tips</li>
                <li><CheckCircle size={16} /> Download PDF report</li>
              </ul>
              <Link to="/signup" className="btn btn-primary btn-full">
                Unlock Report
              </Link>
            </div>

            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Lifetime Access</h3>
                <div className="pricing-amount">
                  <span className="amount">₦10,000</span>
                  <span className="period">forever</span>
                </div>
                <p className="pricing-description">Unlimited tax analyses</p>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} /> Everything in Single</li>
                <li><CheckCircle size={16} /> Unlimited analyses</li>
                <li><CheckCircle size={16} /> Historical tracking</li>
                <li><CheckCircle size={16} /> Priority support</li>
                <li><CheckCircle size={16} /> Early access to features</li>
              </ul>
              <Link to="/signup" className="btn btn-success btn-full">
                Go Lifetime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container glass-card">
          <h2 className="cta-title">
            Ready to Understand Your Tax Position?
          </h2>
          <p className="cta-subtitle">
            Join thousands of Nigerians who've taken control of their tax health.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Your Free Analysis
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">₦</span>
              <span className="logo-text">Payrite</span>
            </div>
            <p className="footer-tagline">
              AI-powered Tax Health Check for Nigeria
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Disclaimer</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Payrite. All rights reserved.</p>
          <p className="disclaimer">
            Payrite provides educational tax information only. We do not file taxes or provide legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
