import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  bio?: string;
  age?: number;
  dateOfBirth?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  loginCount: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
}

interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: { name?: string; bio?: string; dateOfBirth?: string }) => Promise<boolean>;
  loading: boolean;
  activities: Activity[];
  addActivity: (description: string) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        // Verify token is still valid
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const userData = JSON.parse(storedUser);
          userData.isOwner = userData.email === 'mohamedemad.front@gmail.com';
          setToken(storedToken);
          setUser(userData);
          loadActivities(userData.id);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Fallback to stored data for offline functionality
        const userData = JSON.parse(storedUser);
        userData.isOwner = userData.email === 'mohamedemad.front@gmail.com';
        setToken(storedToken);
        setUser(userData);
        loadActivities(userData.id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const loadActivities = (userId: string) => {
    const storedActivities = localStorage.getItem(`activities_${userId}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  };

  const addActivity = (description: string) => {
    if (!user) return;
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      action: 'user_action',
      description,
      timestamp: new Date().toISOString(),
      userId: user.id
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 50); // Keep last 50 activities
    setActivities(updatedActivities);
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(updatedActivities));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check for owner credentials
      if (email === 'mohamedemad.front@gmail.com' && password === 'Mes@2010225') {
        const ownerUser: User = {
          _id: 'owner_id',
          id: 'owner_id',
          name: 'Mohamed Emad',
          email: 'mohamedemad.front@gmail.com',
          role: 'owner',
          bio: 'Frontend Developer & Portfolio Owner',
          isActive: true,
          isEmailVerified: true,
          loginCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isOwner: true
        };

        const ownerToken = 'owner_token_' + Date.now();
        
        setToken(ownerToken);
        setUser(ownerUser);
        localStorage.setItem('token', ownerToken);
        localStorage.setItem('user', JSON.stringify(ownerUser));
        loadActivities(ownerUser.id);
        addActivity('Logged in as owner');
        return true;
      }

      // For other users, try API or create local account
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          data.user.isOwner = false;
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          loadActivities(data.user.id);
          addActivity('Logged in');
          return true;
        }
      } catch (apiError) {
        console.log('API not available, checking local storage');
      }

      // Check local users
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const localUser = localUsers.find((u: any) => u.email === email && u.password === password);
      
      if (localUser) {
        const { password: _, ...userWithoutPassword } = localUser;
        userWithoutPassword.isOwner = false;
        const userToken = 'local_token_' + Date.now();
        
        setToken(userToken);
        setUser(userWithoutPassword);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        loadActivities(userWithoutPassword.id);
        addActivity('Logged in');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Try API first
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          data.user.isOwner = false;
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          loadActivities(data.user.id);
          addActivity('Signed up');
          return true;
        }
      } catch (apiError) {
        console.log('API not available, creating local account');
      }

      // Create local account
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      
      // Check if user already exists
      if (localUsers.some((u: any) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        loginCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOwner: false
      };

      localUsers.push(newUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));

      const { password: _, ...userWithoutPassword } = newUser;
      const userToken = 'local_token_' + Date.now();
      
      setToken(userToken);
      setUser(userWithoutPassword);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      loadActivities(userWithoutPassword.id);
      addActivity('Signed up');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      addActivity('Logged out');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setActivities([]);
  };

  const updateProfile = async (updates: { name?: string; bio?: string; dateOfBirth?: string }): Promise<boolean> => {
    if (!user || !token) return false;

    try {
      setLoading(true);
      
      // Try API first
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (response.ok) {
          data.user.isOwner = user.isOwner;
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          addActivity('Updated profile');
          return true;
        }
      } catch (apiError) {
        console.log('API not available, updating locally');
      }

      // Update locally
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in local users if exists
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const userIndex = localUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        localUsers[userIndex] = { ...localUsers[userIndex], ...updates };
        localStorage.setItem('localUsers', JSON.stringify(localUsers));
      }
      
      addActivity('Updated profile');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      updateProfile,
      loading,
      activities,
      addActivity,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}