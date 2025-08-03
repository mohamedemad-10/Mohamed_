import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import LogoDialog from './components/LogoDialog';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLogoDialog, setShowLogoDialog] = useState(false);
  const { user, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
      <Header 
        onAuthClick={() => setShowAuth(true)}
        onDashboardClick={() => setShowDashboard(true)}
        onLogoClick={() => setShowLogoDialog(true)}
      />
      
      {showDashboard ? (
        <Dashboard onClose={() => setShowDashboard(false)} />
      ) : (
        <>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Certificates />
          <Blog />
          <Contact />
        </>
      )}
      
      <Footer />
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showLogoDialog && <LogoDialog onClose={() => setShowLogoDialog(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;