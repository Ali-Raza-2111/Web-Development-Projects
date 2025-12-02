import React, { useState, useEffect } from 'react';
import './styles.css';

// --- Reusable Infinite Typing Effect Hook ---
const useInfiniteTypingEffect = (texts, typingSpeed = 70, eraseSpeed = 30, delay = 1500) => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // The text currently being typed or deleted
  const currentText = texts[textIndex % texts.length];
  const fullTextLength = currentText.length;

  useEffect(() => {
    let timer;

    if (!isDeleting && typedText.length < fullTextLength) {
      // --- Typing Phase ---
      timer = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && typedText.length === fullTextLength) {
      // --- Wait at Full Text, then Start Deleting ---
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    } else if (isDeleting && typedText.length > 0) {
      // --- Deleting Phase ---
      timer = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length - 1));
      }, eraseSpeed);
    } else if (isDeleting && typedText.length === 0) {
      // --- Done Deleting, Move to Next Text ---
      setIsDeleting(false);
      setTextIndex(prevIndex => prevIndex + 1);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentText, fullTextLength, textIndex, typingSpeed, eraseSpeed, delay]);

  return { typedText, isDeleting };
};

// --- Component to display text with infinite typing loop and cursor ---
const TypingText = ({ texts, className, typingSpeed = 70, eraseSpeed = 30, delay = 1500 }) => {
  const { typedText, isDeleting } = useInfiniteTypingEffect(texts, typingSpeed, eraseSpeed, delay);

  return (
    <span className={className}>
      {typedText}
      {/* Cursor blinks faster while typing/deleting, slower/off while paused */}
      <span className={`typing-cursor ${isDeleting || typedText.length === 0 ? 'active' : 'paused'}`}>|</span>
    </span>
  );
};


// --- 1. NavBar Component (Unchanged) ---
const NavBar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-logo">
        <span className="logo-icon">🤖</span>
        **Review Agent Pro**
      </div>
      <nav className="navbar-menu">
        <a href="#features" className="navbar-link">Features</a>
        <a href="#demo" className="navbar-link">Try Agent</a>
        <a href="#contact" className="navbar-link">Contact</a>
      </nav>
      <div className="navbar-actions">
        <button className="login-button">Chat With Agent</button>
      </div>
    </header>
  );
};

// --- 2. Feature Card Component (Unchanged) ---
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">**{title}**</h3>
      <p className="card-description">{description}</p>
    </div>
  );
};

// Data for the three feature cards
const features = [
  { icon: '💬', title: 'Interactive Chat', description: 'Our AI agent guides users through a natural conversation to gather comprehensive feedback.' },
  { icon: '💾', title: 'Automatic Storage', description: 'Reviews are instantly structured, validated, and securely stored in your database.' },
  { icon: '📊', title: 'Sentiment Analysis', description: 'The agent automatically determines the user’s tone and overall sentiment (positive/negative).' },
];

// --- 3. LandingPage Component (Main Export) ---
function LandingPage() {
    // Array of key features to cycle through
    const heroTexts = [
        "Customer Reviews",
        "High-Quality Data",
        "Sentiment Analysis",
        "Automated Feedback "
    ];

  return (
    <div className="App">
      
      <NavBar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Automate{' '}
            {/* The Infinite Typing Effect is Applied Here */}
            <TypingText 
                texts={heroTexts} 
                className="highlight-text" 
                typingSpeed={70} 
                eraseSpeed={35} 
                delay={1800} 
            />
          </h1>
          <p className="hero-subtext">
            Engage users, collect high-quality data, and instantly analyze feedback—all through our smart chat agent.
          </p>
          <button className="cta-button">Start Chat Now →</button>
        </div>
        <div className="hero-image">
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToOPahaTJyVvukwPOKieK4sNxCfu1zTut-Zg&s' alt="AI Review Agent Interface"/>
        </div>
      </section>

      {/* Features Section with 3 Cards */}
      <section id="features" className="features-section">
        <h2 className="section-heading">How Our Agent Works</h2>
        <div className="feature-card-grid">
            {features.map((feature, index) => (
                <FeatureCard 
                    key={index} 
                    icon={feature.icon} 
                    title={feature.title} 
                    description={feature.description} 
                />
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2023 Review Agent Pro. Intelligent Feedback Collection.
      </footer>
    </div>
  );
}

export default LandingPage;