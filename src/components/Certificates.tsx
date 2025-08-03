import React, { useState } from 'react';
import { Award, Calendar, ExternalLink, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  color: string;
  icon: string;
  verified: boolean;
  image?: string;
  url?: string;
}

export default function Certificates() {
  const { t } = useLanguage();
  const { user, addActivity } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      issuer: 'FreeCodeCamp',
      date: '2024',
      description: 'Comprehensive course covering HTML5 and CSS3 fundamentals',
      color: 'from-orange-500 to-red-500',
      icon: '🏆',
      verified: true
    },
    {
      id: '2',
      title: 'JavaScript Algorithms',
      issuer: 'Coursera',
      date: '2024',
      description: 'Advanced JavaScript programming and algorithm design',
      color: 'from-yellow-500 to-orange-500',
      icon: '⭐',
      verified: true
    },
    {
      id: '3',
      title: 'React Development',
      issuer: 'Udemy',
      date: '2024',
      description: 'Modern React development with hooks and context',
      color: 'from-blue-500 to-cyan-500',
      icon: '🎯',
      verified: true
    },
    {
      id: '4',
      title: 'Frontend Web Development',
      issuer: 'edX',
      date: '2024',
      description: 'Complete frontend development specialization',
      color: 'from-purple-500 to-pink-500',
      icon: '🚀',
      verified: true
    }
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    color: 'from-blue-500 to-cyan-500',
    icon: '🏆',
    verified: true,
    image: '',
    url: ''
  });

  const isOwner = user?.isOwner || user?.email === 'mohamedemad.front@gmail.com';

  const colorOptions = [
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-gray-500 to-gray-600'
  ];

  const iconOptions = ['🏆', '⭐', '🎯', '🚀', '💎', '🔥', '⚡', '🎖️', '🥇', '🎨'];

  React.useEffect(() => {
    const storedCerts = localStorage.getItem('certificates');
    if (storedCerts) {
      setCertificates(JSON.parse(storedCerts));
    }
  }, []);

  const saveCertificates = (updatedCerts: Certificate[]) => {
    setCertificates(updatedCerts);
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCertificate = () => {
    if (!formData.title || !formData.issuer || !formData.date || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCert) {
      // Update existing certificate
      const updatedCerts = certificates.map(cert =>
        cert.id === editingCert.id
          ? { ...cert, ...formData }
          : cert
      );
      saveCertificates(updatedCerts);
      addActivity(`Updated certificate: ${formData.title}`);
    } else {
      // Create new certificate
      const newCert: Certificate = {
        id: Date.now().toString(),
        ...formData
      };
      saveCertificates([...certificates, newCert]);
      addActivity(`Added new certificate: ${formData.title}`);
    }

    setShowEditor(false);
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      description: '',
      color: 'from-blue-500 to-cyan-500',
      icon: '🏆',
      verified: true,
      image: '',
      url: ''
    });
  };

  const handleEditCertificate = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      description: cert.description,
      color: cert.color,
      icon: cert.icon,
      verified: cert.verified,
      image: cert.image || '',
      url: cert.url || ''
    });
    setShowEditor(true);
  };

  const handleDeleteCertificate = (certId: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      const updatedCerts = certificates.filter(cert => cert.id !== certId);
      saveCertificates(updatedCerts);
      addActivity('Deleted a certificate');
    }
  };

  if (showEditor) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingCert(null);
                  setFormData({
                    title: '',
                    issuer: '',
                    date: '',
                    description: '',
                    color: 'from-blue-500 to-cyan-500',
                    icon: '🏆',
                    verified: true,
                    image: '',
                    url: ''
                  });
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Enter certificate title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="e.g., FreeCodeCamp, Coursera"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter certificate description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="e.g., 2024, Jan 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="https://certificate-url.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificate Image
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <div className="text-center text-gray-500 dark:text-gray-400">OR</div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Enter image URL"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-8 rounded-lg bg-gradient-to-r ${color} ${
                        formData.color === color ? 'ring-2 ring-gray-800 dark:ring-white' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-lg ${
                        formData.icon === icon 
                          ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="verified" className="text-sm text-gray-700 dark:text-gray-300">
                Verified Certificate
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingCert(null);
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertificate}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all"
              >
                {editingCert ? 'Update Certificate' : 'Add Certificate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="certificates" className="py-12 sm:py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              {t('certificatesTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              {t('certificatesDescription')}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Certificate</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden relative group"
            >
              {isOwner && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEditCertificate(cert)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCertificate(cert.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className={`bg-gradient-to-r ${cert.color} p-4 sm:p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl sm:text-4xl">{cert.icon}</div>
                  {cert.verified && (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{cert.title}</h3>
                <div className="flex items-center text-white/80">
                  <Award className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">{cert.issuer}</span>
                </div>
              </div>

              {cert.image && (
                <div className="h-32 sm:h-40 overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 sm:p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                  {cert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{cert.date}</span>
                  </div>
                  
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm sm:text-base"
                    >
                      <span className="mr-2">View Certificate</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm sm:text-base">
                      <span className="mr-2">View Certificate</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Progress */}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 sm:p-8 rounded-2xl text-white">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Learning Progress</h3>
            <p className="text-blue-100 text-sm sm:text-base">Tracking my continuous learning journey in web development</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">HTML5</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">Advanced</div>
            </div>
            
            <div className="bg-white/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">CSS3</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">Advanced</div>
            </div>
            
            <div className="bg-white/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">JavaScript</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">Intermediate+</div>
            </div>
            
            <div className="bg-white/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">React</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">Intermediate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}