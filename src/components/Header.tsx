import React, { useState } from 'react';
import { Menu, Sun, Moon, Globe, User, LogOut, Settings, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import OrbitingFootball from './OrbitingFootball';

interface HeaderProps {
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onLogoClick: () => void;
}

export default function Header({ onAuthClick, onDashboardClick, onLogoClick }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'skills', href: '#skills' },
    { key: 'projects', href: '#projects' },
    { key: 'certificates', href: '#certificates' },
    { key: 'blog', href: '#blog' },
    { key: 'contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with Orbiting Football */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group relative"
              onClick={onLogoClick}
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg group-hover:shadow-xl transition-all">
                  ME
                </div>
                <OrbitingFootball />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  Mohamed Emad
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Frontend Developer
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm xl:text-base"
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                title="Toggle language"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">
                  {language === 'en' ? 'ع' : 'EN'}
                </span>
              </button>

              {/* User Controls */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onDashboardClick}
                    className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    title={t('dashboard')}
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    title={t('logout')}
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                  </button>
                  <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-red-100 dark:from-blue-900 dark:to-red-900 px-3 py-1 rounded-full">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium truncate max-w-20">{user.name}</span>
                    {(user.isOwner || user.email === 'mohamedemad.front@gmail.com') && (
                      <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                        OWNER
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-3 sm:px-4 py-2 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 font-medium text-xs sm:text-sm"
                >
                  {t('signIn')}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300">
            <div className="p-6 pt-20">
              {/* User Info in Mobile Menu */}
              {user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-900/20 dark:to-red-900/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      {(user.isOwner || user.email === 'mohamedemad.front@gmail.com') && (
                        <span className="inline-block mt-1 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                          OWNER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    {t(item.key)}
                  </a>
                ))}
              </nav>

              {/* Mobile Menu Actions */}
              {user && (
                <div className="mt-8 pt-6 border-t dark:border-gray-700 space-y-3">
                  <button
                    onClick={() => {
                      onDashboardClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 py-3 px-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>{t('dashboard')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}