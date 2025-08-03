import React from 'react';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '+201558042651';
    const message = 'Hello Mohamed! I saw your portfolio and would like to discuss a project.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="py-12 sm:py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            {t('contactTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
                Contact Information
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Phone</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">+20 1558042651</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Email</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base break-all">mohamedemad.front@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Location</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Qwesna, Ibnahs, Egypt</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 font-semibold text-base sm:text-lg shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>{t('messageMe')}</span>
                </button>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 sm:p-8 rounded-2xl text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-xl sm:text-2xl font-bold">🚀</div>
                  <div className="text-xs sm:text-sm">Fast Response</div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-xl sm:text-2xl font-bold">⚽</div>
                  <div className="text-xs sm:text-sm">Barcelona Fan</div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-xl sm:text-2xl font-bold">📱</div>
                  <div className="text-xs sm:text-sm">Mobile First</div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm text-center">
                  <div className="text-xl sm:text-2xl font-bold">🎯</div>
                  <div className="text-xs sm:text-sm">Goal Oriented</div>
                </div>
              </div>
            </div>
          </div>

          {/* FC Barcelona Fan Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-800 to-red-800 p-6 sm:p-8 rounded-2xl text-white shadow-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-6xl sm:text-8xl mb-4">⚽</div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">FC Barcelona Fan</h3>
                <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
                  Passionate supporter of Barcelona's philosophy of beautiful football. 
                  Just like Barça's tiki-taka, I believe in creating elegant, 
                  well-structured code that flows seamlessly.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">Favorite Player</span>
                    <span className="text-yellow-300 text-sm sm:text-base">Lionel Messi 🐐</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">Dream</span>
                    <span className="text-yellow-300 text-sm sm:text-base">Visit Camp Nou 🏟️</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">Motto</span>
                    <span className="text-yellow-300 text-sm sm:text-base">Més que un club 💙❤️</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 text-center">
                <div className="text-xs sm:text-sm text-blue-100">
                  "Football is like coding - it's about passion, precision, and teamwork"
                </div>
                <div className="text-xs text-blue-200 mt-2">- Mohamed Emad</div>
              </div>
            </div>

            {/* Floating Football */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-xl sm:text-2xl">⚽</span>
            </div>
          </div>
        </div>

        {/* Follow Me Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white">Follow Me</h3>
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <a
              href="https://github.com/mohamedemad-10"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors transform hover:scale-110"
              title="GitHub"
            >
              <span className="text-lg sm:text-xl">⚡</span>
            </a>
            <a
              href="mailto:mohamedemad.front@gmail.com"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors transform hover:scale-110"
              title="Email"
            >
             <span className="text-lg sm:text-xl">📧</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}