import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './styles.css';

// --- THEME CONTEXT ---
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- HOOK: For Navbar Scroll Effect ---
const useScrollPosition = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

// --- HOOK: For Viewport Detection ---
const useOnScreen = (options = { threshold: 0.1, triggerOnce: true }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

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
const SimulatedChat = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.4, triggerOnce: true });
  return (
    <div ref={ref} className={`chat-interface-card ${isVisible ? 'is-visible' : ''}`}>
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
          ✨ Feedback logged to your dashboard!
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Theme Toggle Button ---
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

// --- COMPONENT: NavBar ---
const NavBar = () => {
  const isScrolled = useScrollPosition();
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
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
        <ThemeToggle />
        <button className="login-button">Login</button>
      </div>
    </header>
  );
};

// --- COMPONENT: Feature Card ---
const FeatureCard = ({ icon, title, description, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2, triggerOnce: true });
    return (
        <div ref={ref} className={`feature-card ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="card-icon">{icon}</div>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
        </div>
    );
};

// --- COMPONENT: Testimonial Card (New Feature) ---
const TestimonialCard = ({ name, role, feedback, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2, triggerOnce: true });
    return (
        <div ref={ref} className={`testimonial-card ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="quote-icon">“</div>
            <p className="testimonial-text">{feedback}</p>
            <div className="testimonial-author">
                <strong>{name}</strong>
                <span>{role}</span>
            </div>
        </div>
    );
};

// --- COMPONENT: Scroll to Top Button ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

// --- COMPONENT: Chatbot Modal (Enhanced) ---
const ChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Welcome to the Review Agent Pro demo! What product or service would you like to review today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    const conversationHistory = [...messages, userMessage];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const agentMessage = { role: 'agent', text: data.text };
      setMessages(prev => [...prev, agentMessage]);
      
    } catch (error) {
      console.error("Error communicating with agent:", error);
      let errorText = "Sorry, I'm having trouble connecting. Please try again.";
      
      if (error.name === 'AbortError') {
        errorText = "Request timed out. Please try again.";
      } else if (!navigator.onLine) {
        errorText = "No internet connection. Please check your network.";
      }
      
      const errorMessage = { role: 'agent', text: errorText };
      setMessages(prev => [...prev, errorMessage]);
      setError(errorText);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'agent', text: "Welcome to the Review Agent Pro demo! What product or service would you like to review today?" }
    ]);
    setError(null);
  };
  
  if (!isOpen) return null;

  return (
    <div className="chatbot-modal-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-header">
          <h3>
            <span className="chat-status-indicator"></span>
            Review Agent Demo
          </h3>
          <div className="chatbot-header-actions">
            <button 
              onClick={handleClearChat} 
              className="clear-chat-btn"
              title="Clear conversation"
              aria-label="Clear chat"
            >
              🗑️
            </button>
            <button onClick={onClose} className="close-btn" aria-label="Close chat">&times;</button>
          </div>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.role}-message`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chatbot-message agent-message typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          {error && (
            <div className="chatbot-error-banner">
              ⚠️ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message... (Press ESC to close)"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={isTyping || !inputValue.trim()}
            className={isTyping ? 'sending' : ''}
          >
            {isTyping ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
// --- MAIN PAGE COMPONENT ---
function LandingPage() {
  const heroTexts = ["Customer Reviews", "Sentiment Analysis", "Smart Insights", "Data Collection"];

  const features = [
    { icon: '💬', title: 'Interactive Chat', description: 'Guides users through a natural conversation to gather comprehensive, structured feedback effortlessly.' },
    { icon: '💾', title: 'Auto-Storage', description: 'Reviews are instantly validated, structured, and synced to your preferred database in real-time.' },
    { icon: '🧠', title: 'Sentiment AI', description: 'Advanced AI determines tone and emotion (Positive, Negative, Neutral) with remarkable accuracy.' },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Product Manager at TechFlow", feedback: "This agent completely transformed how we handle user feedback. The data quality has improved dramatically." },
    { name: "Mike Torres", role: "Founder, CloudStart", feedback: "Setup took just 5 minutes. The sentiment analysis is surprisingly accurate and saves us hours every week." },
  ];

  const [demoRef, demoVisible] = useOnScreen({ threshold: 0.3, triggerOnce: true });
  const [contactRef, contactVisible] = useOnScreen({ threshold: 0.3, triggerOnce: true });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <ThemeProvider>
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
            Engage users, collect high-quality structured data, and instantly analyze feedback with AI-powered intelligence. All through our smart chat agent.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={openChat}>✨ Try Demo</button>
            <button className="cta-button secondary">▶ Watch Video</button>
          </div>
        </div>
        
        <div className="hero-visual">
          <SimulatedChat />
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="logo-ticker-section">
        <p>TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
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
          {features.map((f, i) => <FeatureCard key={i} index={i} {...f} />)}
        </div>
      </section>

      {/* Live Demo / Call to Action Section */}
      <section id="demo" ref={demoRef} className={`demo-section ${demoVisible ? 'is-visible' : ''}`}>
        <div className="demo-container">
          <h2>Ready to clear the noise?</h2>
          <p>Experience the power of AI-driven feedback collection today.</p>
          <div className="demo-chat-placeholder">
             <button className="start-chat-btn" onClick={openChat}>✨ Initialize Agent</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-heading">What People Say</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => <TestimonialCard key={i} index={i} {...t} />)}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className={`contact-section ${contactVisible ? 'is-visible' : ''}`}>
        <div className="contact-container">
          <h2>Get In Touch</h2>
          <p className="hero-subtext" style={{margin: '0 auto', maxWidth: '500px'}}>Stay updated with the latest features and releases.</p>
          <form className="simple-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe ✨</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Review Agent Pro. Intelligent Feedback Collection.</p>
        <p style={{marginTop: '0.5rem', opacity: 0.7, fontSize: '0.85rem'}}>Built with 💜 for modern teams</p>
      </footer>

      <ChatbotModal isOpen={isChatOpen} onClose={closeChat} />
      <ScrollToTop />
    </div>
    </ThemeProvider>
  );
}

export default LandingPage;