import React, { useState, useEffect } from 'react';
import { X, User, Activity, Heart, MessageCircle, BarChart3, Edit, Save, Trash2, Shield, Users, Eye, Settings, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onClose: () => void;
}

interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  isActive: boolean;
  createdAt: string;
  loginCount: number;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const { user, updateProfile, token, activities } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
  });
  const [allUsers, setAllUsers] = useState<LocalUser[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalComments: 0,
    totalActivities: 0
  });

  if (!user) return null;

  const isOwner = user.isOwner || user.email === 'mohamedemad.front@gmail.com';

  useEffect(() => {
    if (isOwner) {
      loadAllUsers();
      loadStats();
    }
  }, [isOwner]);

  const loadAllUsers = () => {
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const ownerUser = {
      id: 'owner_id',
      name: 'Mohamed Emad',
      email: 'mohamedemad.front@gmail.com',
      role: 'owner' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      loginCount: 1
    };
    
    setAllUsers([ownerUser, ...localUsers]);
  };

  const loadStats = () => {
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    setStats({
      totalUsers: localUsers.length + 1, // +1 for owner
      totalProjects: projects.length,
      totalComments: blogPosts.reduce((acc: number, post: any) => acc + (post.comments?.length || 0), 0),
      totalActivities: activities.length
    });
  };

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

  const handleUserRoleChange = (userId: string, newRole: 'user' | 'owner') => {
    if (userId === 'owner_id') return; // Can't change owner role
    
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const userIndex = localUsers.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      localUsers[userIndex].role = newRole;
      localStorage.setItem('localUsers', JSON.stringify(localUsers));
      loadAllUsers();
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === 'owner_id') return; // Can't delete owner
    
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const filteredUsers = localUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem('localUsers', JSON.stringify(filteredUsers));
    loadAllUsers();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> },
    ...(isOwner ? [
      { id: 'users', label: 'Users', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> }
    ] : []),
  ];

  return (
    <div className="min-h-screen py-4 sm:py-20 px-2 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold backdrop-blur-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
                    <span>{user.name}</span>
                    {isOwner && <Crown className="w-5 h-5 text-yellow-300" />}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {isOwner && (
                      <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                        OWNER
                      </span>
                    )}
                    <span className="inline-block bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors self-end sm:self-auto"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r dark:border-gray-700">
              <nav className="space-y-1 sm:space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                    {isOwner ? 'Owner Dashboard' : 'User Dashboard'}
                  </h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium">Login Count</p>
                          <p className="text-lg sm:text-2xl font-bold text-blue-800 dark:text-blue-300">{user.loginCount || 1}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                          <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">Activities</p>
                          <p className="text-lg sm:text-2xl font-bold text-green-800 dark:text-green-300">{activities.length}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                          <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    {isOwner && (
                      <>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-medium">Total Users</p>
                              <p className="text-lg sm:text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.totalUsers}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium">Projects</p>
                              <p className="text-lg sm:text-2xl font-bold text-orange-800 dark:text-orange-300">{stats.totalProjects}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
                              <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium">Account Age</p>
                          <p className="text-lg sm:text-2xl font-bold text-red-800 dark:text-red-300">
                            {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                      >
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Edit Profile</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Update your personal information</p>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('activity')}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                      >
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mb-2" />
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">View Activity</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">See your recent activities</p>
                      </button>
                      
                      {isOwner && (
                        <button
                          onClick={() => setActiveTab('users')}
                          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all text-left"
                        >
                          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Manage Users</h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">View and manage all users</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Activity Log</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 dark:text-white text-sm sm:text-base break-words">
                                {activity.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {new Date(activity.timestamp).toLocaleString()}
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

              {activeTab === 'users' && isOwner && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b dark:border-gray-700">
                            <th className="text-left p-2 sm:p-4 text-sm sm:text-base">User</th>
                            <th className="text-left p-2 sm:p-4 text-sm sm:text-base">Role</th>
                            <th className="text-left p-2 sm:p-4 text-sm sm:text-base">Status</th>
                            <th className="text-left p-2 sm:p-4 text-sm sm:text-base">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allUsers.map((userData) => (
                            <tr key={userData.id} className="border-b dark:border-gray-700">
                              <td className="p-2 sm:p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {userData.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
                                      {userData.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                      {userData.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 sm:p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  userData.role === 'owner' 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {userData.role.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-2 sm:p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  userData.isActive 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {userData.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                              <td className="p-2 sm:p-4">
                                <div className="flex items-center space-x-2">
                                  {userData.id !== 'owner_id' && (
                                    <>
                                      <button
                                        onClick={() => handleUserRoleChange(userData.id, userData.role === 'user' ? 'owner' : 'user')}
                                        className="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                        title={userData.role === 'user' ? 'Make Owner' : 'Make User'}
                                      >
                                        <Shield className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(userData.id)}
                                        className="p-1 sm:p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                        title="Delete User"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && isOwner && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Analytics Overview</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Total Users</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalUsers}</p>
                      <p className="text-blue-100 text-xs sm:text-sm">Registered accounts</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-xl text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Projects</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalProjects}</p>
                      <p className="text-green-100 text-xs sm:text-sm">Portfolio items</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 rounded-xl text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Comments</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalComments}</p>
                      <p className="text-purple-100 text-xs sm:text-sm">User interactions</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 rounded-xl text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Activities</h3>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalActivities}</p>
                      <p className="text-orange-100 text-xs sm:text-sm">Total actions</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {activities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-white truncate">{activity.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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