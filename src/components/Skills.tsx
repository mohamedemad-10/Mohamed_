import React, { useState } from 'react';
import { Code, Palette, Smartphone, Globe, Plus, Edit, Trash2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillGroup {
  category: string;
  icon: React.ReactNode;
  items: Skill[];
}

export default function Skills() {
  const { t } = useLanguage();
  const { user, addActivity } = useAuth();
  const [skills, setSkills] = useState<SkillGroup[]>([
    {
      category: 'Languages',
      icon: <Code className="w-6 h-6 sm:w-8 sm:h-8" />,
      items: [
        { name: 'HTML5', level: 95, color: 'bg-orange-500' },
        { name: 'CSS3', level: 90, color: 'bg-blue-500' },
        { name: 'JavaScript', level: 85, color: 'bg-yellow-500' },
        { name: 'ECMAScript', level: 80, color: 'bg-green-500' }
      ]
    },
    {
      category: 'Frameworks',
      icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />,
      items: [
        { name: 'React.js', level: 80, color: 'bg-cyan-500' },
        { name: 'Bootstrap', level: 90, color: 'bg-purple-500' },
        { name: 'Tailwind CSS', level: 95, color: 'bg-teal-500' }
      ]
    },
    {
      category: 'Design',
      icon: <Palette className="w-6 h-6 sm:w-8 sm:h-8" />,
      items: [
        { name: 'Responsive Design', level: 90, color: 'bg-indigo-500' },
        { name: 'Color Theory', level: 80, color: 'bg-red-500' }
      ]
    },
    {
      category: 'Development',
      icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />,
      items: [
        { name: 'Mobile First', level: 85, color: 'bg-emerald-500' },
        { name: 'Cross-browser', level: 80, color: 'bg-amber-500' },
        { name: 'Performance', level: 75, color: 'bg-violet-500' }
      ]
    }
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingGroup, setEditingGroup] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    skillName: '',
    skillLevel: 50,
    skillColor: 'bg-blue-500'
  });

  const isOwner = user?.isOwner || user?.email === 'mohamedemad.front@gmail.com';

  const colorOptions = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500',
    'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-emerald-500'
  ];

  const saveSkills = (updatedSkills: SkillGroup[]) => {
    setSkills(updatedSkills);
    localStorage.setItem('skills', JSON.stringify(updatedSkills));
  };

  React.useEffect(() => {
    const storedSkills = localStorage.getItem('skills');
    if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
    }
  }, []);

  const handleAddSkillGroup = () => {
    if (!formData.category) return;

    const newGroup: SkillGroup = {
      category: formData.category,
      icon: <Code className="w-6 h-6 sm:w-8 sm:h-8" />,
      items: []
    };

    saveSkills([...skills, newGroup]);
    addActivity(`Added new skill category: ${formData.category}`);
    setFormData({ category: '', skillName: '', skillLevel: 50, skillColor: 'bg-blue-500' });
    setShowEditor(false);
  };

  const handleAddSkill = (groupIndex: number) => {
    if (!formData.skillName) return;

    const updatedSkills = [...skills];
    updatedSkills[groupIndex].items.push({
      name: formData.skillName,
      level: formData.skillLevel,
      color: formData.skillColor
    });

    saveSkills(updatedSkills);
    addActivity(`Added new skill: ${formData.skillName}`);
    setFormData({ category: '', skillName: '', skillLevel: 50, skillColor: 'bg-blue-500' });
    setEditingGroup(null);
  };

  const handleEditSkill = (groupIndex: number, skillIndex: number) => {
    const skill = skills[groupIndex].items[skillIndex];
    setFormData({
      category: '',
      skillName: skill.name,
      skillLevel: skill.level,
      skillColor: skill.color
    });
    setEditingGroup(groupIndex);
    setEditingSkill(skillIndex);
  };

  const handleUpdateSkill = () => {
    if (editingGroup === null || editingSkill === null) return;

    const updatedSkills = [...skills];
    updatedSkills[editingGroup].items[editingSkill] = {
      name: formData.skillName,
      level: formData.skillLevel,
      color: formData.skillColor
    };

    saveSkills(updatedSkills);
    addActivity(`Updated skill: ${formData.skillName}`);
    setFormData({ category: '', skillName: '', skillLevel: 50, skillColor: 'bg-blue-500' });
    setEditingGroup(null);
    setEditingSkill(null);
  };

  const handleDeleteSkill = (groupIndex: number, skillIndex: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = [...skills];
      const skillName = updatedSkills[groupIndex].items[skillIndex].name;
      updatedSkills[groupIndex].items.splice(skillIndex, 1);
      
      saveSkills(updatedSkills);
      addActivity(`Deleted skill: ${skillName}`);
    }
  };

  const handleDeleteGroup = (groupIndex: number) => {
    if (confirm('Are you sure you want to delete this entire skill category?')) {
      const updatedSkills = [...skills];
      const categoryName = updatedSkills[groupIndex].category;
      updatedSkills.splice(groupIndex, 1);
      
      saveSkills(updatedSkills);
      addActivity(`Deleted skill category: ${categoryName}`);
    }
  };

  return (
    <section id="skills" className="py-12 sm:py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              {t('skillsTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              {t('skillsDescription')}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Category</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          {skills.map((skillGroup, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative group"
            >
              {isOwner && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingGroup(groupIndex);
                      setFormData({ ...formData, skillName: '', skillLevel: 50, skillColor: 'bg-blue-500' });
                    }}
                    className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(groupIndex)}
                    className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center text-white mr-4">
                  {skillGroup.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                  {skillGroup.category}
                </h3>
              </div>

              <div className="space-y-4">
                {skillGroup.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2 relative group/skill">
                    {isOwner && (
                      <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditSkill(groupIndex, skillIndex)}
                          className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(groupIndex, skillIndex)}
                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: skill.level + '%',
                          animation: `fillBar 2s ease-out ${skillIndex * 0.2}s forwards`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}

                {editingGroup === groupIndex && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-blue-500">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
                      {editingSkill !== null ? 'Edit Skill' : 'Add New Skill'}
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.skillName}
                        onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                        placeholder="Skill name"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                      />
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Level: {formData.skillLevel}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.skillLevel}
                          onChange={(e) => setFormData({ ...formData, skillLevel: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Color:</label>
                        <div className="grid grid-cols-6 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setFormData({ ...formData, skillColor: color })}
                              className={`w-6 h-6 rounded-full ${color} ${
                                formData.skillColor === color ? 'ring-2 ring-gray-800 dark:ring-white' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={editingSkill !== null ? handleUpdateSkill : () => handleAddSkill(groupIndex)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          {editingSkill !== null ? 'Update' : 'Add'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingGroup(null);
                            setEditingSkill(null);
                            setFormData({ category: '', skillName: '', skillLevel: 50, skillColor: 'bg-blue-500' });
                          }}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Add Skill Category</h2>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Backend, Tools, etc."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSkillGroup}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Progress */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-600 to-red-600 p-6 sm:p-8 rounded-2xl text-white">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Learning Progress</h3>
            <p className="text-blue-100 text-sm sm:text-base">My continuous journey in mastering frontend technologies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold">Current Focus</h4>
              <div className="space-y-3">
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base">React Advanced Patterns</span>
                    <span className="text-sm sm:text-base">75%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base">Backend Integration</span>
                    <span className="text-sm sm:text-base">45%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold">Next Goals</h4>
              <div className="space-y-2">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-sm sm:text-base">TypeScript Mastery</span>
                </div>
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-sm sm:text-base">Node.js & Express</span>
                </div>
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-sm sm:text-base">MongoDB & Database Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}