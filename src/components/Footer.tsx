import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'skills', href: '#skills' },
    { key: 'projects', href: '#projects' },
    { key: 'certificates', href: '#certificates' },
    { key: 'blog', href: '#blog' },
    { key: 'contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: '⚡', href: 'https://github.com/mohamedemad-10' },
    { name: 'Email', icon: '📧', href: 'mailto:mohamedemad.front@gmail.com' },
  ];

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                ME
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Mohamed Emad</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Frontend Developer</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              15-year-old passionate developer from Egypt, creating beautiful web experiences 
              and dreaming of becoming a professional engineer.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {t(link.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4">Technologies</h4>
            <div className="space-y-2 text-gray-400 text-sm sm:text-base">
              <div>HTML5 & CSS3</div>
              <div>JavaScript & ES6+</div>
              <div>React.js</div>
              <div>Tailwind CSS</div>
              <div>Bootstrap</div>
              <div>Responsive Design</div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-4">
              <div className="text-gray-400 text-sm sm:text-base">
                <div>Qwesna, Ibnahs, Egypt</div>
                <div className="break-all">mohamedemad.front@gmail.com</div>
                <div>+20 1558042651</div>
              </div>
              <div className="flex justify-center sm:justify-start space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.name === 'GitHub' ? '_blank' : undefined}
                    rel={social.name === 'GitHub' ? 'noopener noreferrer' : undefined}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all transform hover:scale-110"
                    title={social.name}
                  >
                    <span className="text-base sm:text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm sm:text-base">
            <span>© 2025 Mohamed Emad. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and React.js</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">⚽</span>
              <span className="text-sm sm:text-base">FC Barcelona Fan</span>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 hover:text-white transition-colors text-sm sm:text-base"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Barcelona Colors Bar */}
        <div className="mt-6 sm:mt-8 h-1 bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 rounded-full"></div>
      </div>
    </footer>
  );
}