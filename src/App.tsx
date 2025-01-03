import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Navbar from './components/Navbar';
    import Hero from './components/Hero';
    import Stats from './components/Stats';
    import Features from './components/sections/Features';
    import Analysis from './components/sections/Analysis';
    import Reports from './components/sections/Reports';
    import Playbooks from './components/sections/Playbooks';
    import Backtesting from './components/Backtesting';
    import Newsletter from './components/Newsletter';
    import Footer from './components/footer/Footer';
    import AboutPage from './pages/AboutPage';
    import CareersPage from './pages/CareersPage';
    import PressPage from './pages/PressPage';
    import BlogPage from './pages/BlogPage';
    import ContactPage from './pages/ContactPage';
    import FAQPage from './pages/FAQPage';
    import HelpPage from './pages/HelpPage';
    import ReturnsPage from './pages/ReturnsPage';
    import TermsPage from './pages/TermsPage';
    import PrivacyPage from './pages/PrivacyPage';
    import CookiesPage from './pages/CookiesPage';
    import AccessibilityPage from './pages/AccessibilityPage';
    import CommunityPage from './pages/CommunityPage';
    import PartnersPage from './pages/PartnersPage';
    import StoresPage from './pages/StoresPage';
    import GiftCardsPage from './pages/GiftCardsPage';
    
    function App() {
      return (
        <Router>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Stats />
                  <Features />
                  <Analysis />
                  <Reports />
                  <Playbooks />
                  <Backtesting />
                  <Newsletter />
                </>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/gift-cards" element={<GiftCardsPage />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      );
    }
    
    export default App;
