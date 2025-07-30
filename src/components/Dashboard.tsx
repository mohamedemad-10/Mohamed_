import React, { useState } from 'react';
import { X, User, Activity, Heart, MessageCircle, BarChart3, Edit, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onClose: () => void;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const { user, updateProfile, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
  });
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalComments: 0,
    totalActivities: 0
  });

  if (!user) return null;

  const handleProfileUpdate = async () => {
    setLoading(true);
    const success = await updateProfile({
      name: profileData.name,
      bio: profileData.bio,
      dateOfBirth: profileData.dateOfBirth
    });
    
    if (success) {
      setIsEditingProfile(false);
    }
    setLoading(false);
  };

  const fetchUserActivities = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/activities/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchStats = async () => {
    if (!token || user.role !== 'owner') return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/activities/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Process stats data
        console.log('Stats:', data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  React.useEffect(() => {
    fetchUserActivities();
    if (user.role === 'owner') {
      fetchStats();
    }
  }, [token, user.role]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-5 h-5" /> },
    ...(user.role === 'owner' ? [{ id: 'users', label: 'Users', icon: <User className="w-5 h-5" /> }] : []),
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  {user.role === 'owner' && (
                    <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                      OWNER
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 p-6 border-r dark:border-gray-700">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Login Count</p>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{user.loginCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                          <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">Activities</p>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-300">{activities.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                          <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Account Age</p>
                          <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                            {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                      >
                        <User className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold text-gray-800 dark:text-white">Edit Profile</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal information</p>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('activity')}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                      >
                        <Activity className="w-8 h-8 text-red-600 mb-2" />
                        <h4 className="font-semibold text-gray-800 dark:text-white">View Activity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">See your recent activities</p>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('activity')}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                      >
                        <Activity className="w-8 h-8 text-green-600 mb-2" />
                        <h4 className="font-semibold text-gray-800 dark:text-white">Profile Settings</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update your profile information</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-white dark:bg-gray-800 rounded-lg">{user.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <p className="p-3 bg-white dark:bg-gray-800 rounded-lg text-gray-500">{user.email} (cannot be changed)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        {isEditingProfile ? (
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            placeholder="Tell us about yourself"
                            rows={3}
                          />
                        ) : (
                          <p className="p-3 bg-white dark:bg-gray-800 rounded-lg">{user.bio || 'Not specified'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            {user.age && ` (${user.age} years old)`}
                          </p>
                        )}
                      </div>

                      {isEditingProfile && (
                        <button
                          onClick={handleProfileUpdate}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activity Log</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.map((activity: any, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-gray-800 dark:text-white capitalize">
                                {activity.action.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(activity.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                          No activities yet. Start interacting with the site to see your activity log!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && user.role === 'owner' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      User management features will be implemented here.
                      This includes viewing all users, managing roles, and viewing user activities.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}