import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

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
          I've logged this feedback in your dashboard.
        </div>
      </div>
    </div>
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

// --- COMPONENT: Chatbot Modal (NEW) ---
const ChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Welcome to the Review Agent Pro demo! What product or service would you like to review today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponses = [
        "Great! On a scale of 1 to 5, how would you rate it?",
        "Thanks for sharing. What's one thing you'd improve?",
        "Understood. Could you tell me a bit more about that?",
        "Processing that... What was the most memorable part of your experience?"
      ];
      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      
      const agentMessage = { role: 'agent', text: randomResponse };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  if (!isOpen) return null;

  return (
    <div className="chatbot-modal-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-header">
          <h3>Review Agent Demo</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
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
          <div ref={messagesEndRef} />
        </div>
        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};


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

  const [demoRef, demoVisible] = useOnScreen({ threshold: 0.3, triggerOnce: true });
  const [contactRef, contactVisible] = useOnScreen({ threshold: 0.3, triggerOnce: true });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

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
            <button className="cta-button primary" onClick={openChat}>Try Demo</button>
            <button className="cta-button secondary">Watch Video</button>
          </div>
        </div>
        
        <div className="hero-visual">
          <SimulatedChat />
        </div>
      </section>

      {/* Integrations Section */}
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
          {features.map((f, i) => <FeatureCard key={i} index={i} {...f} />)}
        </div>
      </section>

      {/* Live Demo / Call to Action Section */}
      <section id="demo" ref={demoRef} className={`demo-section ${demoVisible ? 'is-visible' : ''}`}>
        <div className="demo-container">
          <h2>Ready to clear the noise?</h2>
          <p>Experience the difference of structured AI feedback today.</p>
          <div className="demo-chat-placeholder">
             <button className="start-chat-btn" onClick={openChat}>Initialize Agent 🤖</button>
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
          <form className="simple-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe for Updates</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        © 2025 Review Agent Pro. Intelligent Feedback Collection.
      </footer>

      <ChatbotModal isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}

export default LandingPage;