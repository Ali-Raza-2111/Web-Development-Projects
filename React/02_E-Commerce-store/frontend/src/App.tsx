import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar, Footer } from './components/layout';
import { CartDrawer } from './components/cart';
import { AIAssistant } from './components/home';
import { SmoothScroll, OrbBackground } from './components/effects';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  
  return (
    <SmoothScroll>
      {/* Global Background Orbs */}
      <OrbBackground count={3} />
      
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <CartDrawer />
        <AIAssistant />
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
              <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </div>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
