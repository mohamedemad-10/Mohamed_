import React from 'react';
import { ArrowDown, Github, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const handleViewWork = () => {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent animate-gradient leading-tight">
                {t('welcomeMessage')}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                {t('heroSubtitle')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
                {t('heroDescription')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">15</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Years Old</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-600">6+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Technologies</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">8+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">4+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Certificates</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button 
                onClick={handleViewWork}
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 font-semibold text-base sm:text-lg shadow-lg"
              >
                {t('viewMyWork')}
              </button>
              <div className="flex items-center justify-center space-x-4">
                <a 
                  href="https://github.com/mohamedemad-10" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                </a>
                <a 
                  href="mailto:mohamedemad.front@gmail.com" 
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
              {/* Animated Background Circles */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-red-400 opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-red-400 to-blue-400 opacity-30 animate-pulse-slow"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500 to-red-500 opacity-40 animate-spin-slow"></div>
              
              {/* Profile Image Placeholder */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center shadow-2xl">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                    ME
                  </div>
                </div>
              </div>

              {/* Floating Tech Icons */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg animate-float">
                <span className="text-lg sm:text-2xl">⚛️</span>
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg animate-float-delayed">
                <span className="text-lg sm:text-2xl">🌐</span>
              </div>
              <div className="absolute top-1/2 -left-6 sm:-left-8 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-lg sm:text-2xl">📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400" />
        </div>
      </div>
    </section>
  );
}