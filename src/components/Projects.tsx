import React, { useState, useEffect } from 'react';
import { Heart, Eye, Github, ExternalLink, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  likes: string[];
  views: number;
  githubUrl?: string;
  liveUrl?: string;
}

export default function Projects() {
  const { t } = useLanguage();
  const { user, addActivity } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: ''
  });

  const isOwner = user?.isOwner || user?.email === 'mohamedemad.front@gmail.com';

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      const defaultProjects: Project[] = [
        {
          id: '1',
          title: 'E-Commerce Website',
          description: 'Modern e-commerce platform with React and responsive design',
          image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['React', 'CSS3', 'JavaScript'],
          likes: [],
          views: 0,
          githubUrl: 'https://github.com/mohamedemad-10',
          liveUrl: 'https://example.com'
        },
        {
          id: '2',
          title: 'Portfolio Website',
          description: 'Personal portfolio showcasing modern web design principles',
          image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['HTML5', 'CSS3', 'JavaScript'],
          likes: [],
          views: 0
        },
        {
          id: '3',
          title: 'Landing Page',
          description: 'High-converting landing page with modern animations',
          image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['HTML5', 'Tailwind', 'JavaScript'],
          likes: [],
          views: 0
        },
        {
          id: '4',
          title: 'Dashboard App',
          description: 'Modern admin dashboard with data visualization',
          image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['React', 'Bootstrap', 'Chart.js'],
          likes: [],
          views: 0
        },
        {
          id: '5',
          title: 'Todo App',
          description: 'Feature-rich task management application',
          image: 'https://images.pexels.com/photos/1226398/pexels-photo-1226398.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['React', 'CSS3', 'LocalStorage'],
          likes: [],
          views: 0
        },
        {
          id: '6',
          title: 'Weather App',
          description: 'Beautiful weather application with API integration',
          image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
          technologies: ['JavaScript', 'CSS3', 'Weather API'],
          likes: [],
          views: 0
        }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('projects', JSON.stringify(defaultProjects));
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleLike = (projectId: string) => {
    if (!user) return;

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const isLiked = project.likes.includes(user.id || user._id);
        const newLikes = isLiked 
          ? project.likes.filter(id => id !== (user.id || user._id))
          : [...project.likes, user.id || user._id];
        
        addActivity(isLiked ? `Unliked project: ${project.title}` : `Liked project: ${project.title}`);
        
        return { ...project, likes: newLikes };
      }
      return project;
    });

    saveProjects(updatedProjects);
  };

  const incrementViews = (projectId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return { ...project, views: project.views + 1 };
      }
      return project;
    });

    saveProjects(updatedProjects);
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

  const handleSaveProject = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert('Please fill in all required fields');
      return;
    }

    const technologies = formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map(project =>
        project.id === editingProject.id
          ? {
              ...project,
              title: formData.title,
              description: formData.description,
              image: formData.image,
              technologies,
              githubUrl: formData.githubUrl,
              liveUrl: formData.liveUrl
            }
          : project
      );
      saveProjects(updatedProjects);
      addActivity(`Updated project: ${formData.title}`);
    } else {
      // Create new project
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        technologies,
        likes: [],
        views: 0,
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl
      };
      saveProjects([...projects, newProject]);
      addActivity(`Created new project: ${formData.title}`);
    }

    setShowEditor(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: '',
      githubUrl: '',
      liveUrl: ''
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || ''
    });
    setShowEditor(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      saveProjects(updatedProjects);
      addActivity('Deleted a project');
    }
  };

  if (showEditor) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingProject(null);
                  setFormData({
                    title: '',
                    description: '',
                    image: '',
                    technologies: '',
                    githubUrl: '',
                    liveUrl: ''
                  });
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Image *
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
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technologies (comma separated) *
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="React, CSS3, JavaScript"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingProject(null);
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all"
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="projects" className="py-12 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              {t('projectsTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              {t('projectsDescription')}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <button
                      onClick={() => incrementViews(project.id)}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner Controls */}
                {isOwner && (
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Stats and Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {project.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className={`w-4 h-4 mr-1 ${project.likes.length > 0 ? 'text-red-500' : ''}`} />
                      {project.likes.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLike(project.id)}
                    disabled={!user}
                    className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                      user && project.likes.includes(user.id || user._id)
                        ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400'
                    } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${user && project.likes.includes(user.id || user._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 sm:p-8 rounded-2xl text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Like what you see?</h3>
            <p className="text-blue-100 mb-6 text-sm sm:text-base">
              Let's work together to bring your ideas to life with modern web technologies
            </p>
            <a
              href="#contact"
              className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block text-sm sm:text-base"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}