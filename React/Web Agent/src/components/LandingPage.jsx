import React, { useState, useEffect } from 'react';
import './styles.css';

// --- HOOK: Infinite Typing Effect (Kept your original logic) ---
const useInfiniteTypingEffect = (texts, typingSpeed = 70, eraseSpeed = 30, delay = 1500) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = texts[textIndex % texts.length];
  const fullTextLength = currentText.length;

  useEffect(() => {
    let timer;
    if (!isDeleting && typedText.length < fullTextLength) {
      timer = setTimeout(() => setTypedText(currentText.slice(0, typedText.length + 1)), typingSpeed);
    } else if (!isDeleting && typedText.length === fullTextLength) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && typedText.length > 0) {
      timer = setTimeout(() => setTypedText(currentText.slice(0, typedText.length - 1)), eraseSpeed);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setTextIndex(prevIndex => prevIndex + 1);
    }
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentText, fullTextLength, textIndex, typingSpeed, eraseSpeed, delay]);

  return { typedText, isDeleting };
};

const TypingText = ({ texts, className }) => {
  const { typedText, isDeleting } = useInfiniteTypingEffect(texts);
  return (
    <span className={className}>
      {typedText}
      <span className={`typing-cursor ${isDeleting || typedText.length === 0 ? 'active' : 'paused'}`}>|</span>
    </span>
  );
};

// --- COMPONENT: Simulated Chat Interface (New Interactive Feature) ---
// This replaces the static image to show the agent in action
const SimulatedChat = () => {
  return (
    <div className="chat-interface-card">
      <div className="chat-header">
        <div className="dot red"></div>
        <div className="dot yellow"></div>
        <div className="dot green"></div>
        <span>Review Agent Pro</span>
      </div>
      <div className="chat-body">
        <div className="message user-msg slide-in-1">
          "The coffee was great, but the music was too loud."
        </div>
        <div className="message agent-msg slide-in-2">
          <strong>Analysis:</strong><br/>
          Sentiment: <span className="tag-neutral">Mixed</span><br/>
          Category: <span className="tag-service">Ambiance</span>
        </div>
        <div className="message agent-msg slide-in-3">
          I've logged this feedback in your dashboard.
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: NavBar ---
const NavBar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar-container">
      <div className="navbar-logo" onClick={() => window.scrollTo(0, 0)}>
        <span className="logo-icon">🤖</span>
        Review Agent Pro
      </div>
      <nav className="navbar-menu">
        <button onClick={() => scrollToSection('features')} className="navbar-link">Features</button>
        <button onClick={() => scrollToSection('integrations')} className="navbar-link">Integrations</button>
        <button onClick={() => scrollToSection('demo')} className="navbar-link">Live Demo</button>
        <button onClick={() => scrollToSection('contact')} className="navbar-link">Contact</button>
      </nav>
      <div className="navbar-actions">
        <button className="login-button">Login</button>
      </div>
    </header>
  );
};

// --- COMPONENT: Feature Card ---
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="card-icon">{icon}</div>
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
  </div>
);

// --- COMPONENT: Testimonial Card (New Feature) ---
const TestimonialCard = ({ name, role, feedback }) => (
  <div className="testimonial-card">
    <div className="quote-icon">“</div>
    <p className="testimonial-text">{feedback}</p>
    <div className="testimonial-author">
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
function LandingPage() {
  const heroTexts = ["Customer Reviews", "Sentiment Analysis", "Automated Support", "Data Collection"];

  const features = [
    { icon: '💬', title: 'Interactive Chat', description: 'Guides users through a natural conversation to gather comprehensive feedback.' },
    { icon: '💾', title: 'Auto-Storage', description: 'Reviews are instantly structured, validated, and pushed to your database.' },
    { icon: '📊', title: 'Sentiment AI', description: 'Automatically determines tone (Positive, Negative, Neutral) in real-time.' },
  ];

  const testimonials = [
    { name: "Sarah J.", role: "Product Manager", feedback: "This agent completely changed how we handle user feedback. The data is so much cleaner now." },
    { name: "Mike T.", role: "SaaS Founder", feedback: "Setting it up took 5 minutes. The sentiment analysis is surprisingly accurate." },
  ];

  return (
    <div className="App">
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Automate <br />
            <TypingText texts={heroTexts} className="highlight-text" />
          </h1>
          <p className="hero-subtext">
            Engage users, collect high-quality structured data, and instantly analyze feedback—all through our smart chat agent.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={() => document.getElementById('demo').scrollIntoView()}>Try Demo</button>
            <button className="cta-button secondary">Watch Video</button>
          </div>
        </div>
        
        {/* Replaced Static Image with Animated CSS Component */}
        <div className="hero-visual">
          <SimulatedChat />
        </div>
      </section>

      {/* Integrations Section (New) */}
      <section id="integrations" className="logo-ticker-section">
        <p>TRUSTED BY INNOVATIVE TEAMS</p>
        <div className="logo-ticker">
          <span>Notion</span>
          <span>•</span>
          <span>Slack</span>
          <span>•</span>
          <span>Zapier</span>
          <span>•</span>
          <span>Airtable</span>
          <span>•</span>
          <span>HubSpot</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-heading">Powering Your Feedback Loop</h2>
        <div className="feature-card-grid">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* Live Demo / Call to Action Section (New Interaction) */}
      <section id="demo" className="demo-section">
        <div className="demo-container">
          <h2>Ready to clear the noise?</h2>
          <p>Experience the difference of structured AI feedback today.</p>
          <div className="demo-chat-placeholder">
             {/* This would be where the actual iframe/widget goes */}
             <button className="start-chat-btn">Initialize Agent 🤖</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section (New) */}
      <section className="testimonials-section">
        <h2 className="section-heading">What People Say</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </section>

      {/* Contact Section (New) */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2>Get In Touch</h2>
          <form className="simple-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe for Updates</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        © 2025 Review Agent Pro. Intelligent Feedback Collection.
      </footer>
    </div>
  );
}

export default LandingPage;