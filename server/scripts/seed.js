const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rolebasedapp');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Comment.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [
      {
        name: 'Admin Owner',
        email: 'owner@example.com',
        password: 'password123',
        role: 'owner',
        bio: 'System administrator and project owner',
        dateOfBirth: new Date('1990-01-01'),
        isEmailVerified: true
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Frontend developer passionate about React',
        dateOfBirth: new Date('1995-05-15'),
        isEmailVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        bio: 'UI/UX designer and developer',
        dateOfBirth: new Date('1992-08-20'),
        isEmailVerified: true
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Created users');

    // Create projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration.',
        image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        githubUrl: 'https://github.com/example/ecommerce',
        liveUrl: 'https://ecommerce-demo.com',
        createdBy: createdUsers[0]._id
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking.',
        image: 'https://images.pexels.com/photos/1226398/pexels-photo-1226398.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
        githubUrl: 'https://github.com/example/taskmanager',
        liveUrl: 'https://taskmanager-demo.com',
        createdBy: createdUsers[0]._id
      },
      {
        title: 'Weather Dashboard',
        description: 'A beautiful weather dashboard that displays current weather, forecasts, and weather maps for multiple locations.',
        image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['React', 'Weather API', 'Chart.js', 'CSS3'],
        githubUrl: 'https://github.com/example/weather',
        liveUrl: 'https://weather-demo.com',
        createdBy: createdUsers[0]._id
      },
      {
        title: 'Social Media Dashboard',
        description: 'A comprehensive social media management dashboard for scheduling posts, analyzing engagement, and managing multiple accounts.',
        image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['React', 'Redux', 'Node.js', 'Social APIs'],
        githubUrl: 'https://github.com/example/social-dashboard',
        createdBy: createdUsers[0]._id
      }
    ];

    const createdProjects = await Project.create(projects);
    console.log('Created projects');

    // Add some likes to projects
    createdProjects[0].likes.push({ user: createdUsers[1]._id });
    createdProjects[0].likes.push({ user: createdUsers[2]._id });
    createdProjects[1].likes.push({ user: createdUsers[1]._id });
    createdProjects[2].likes.push({ user: createdUsers[2]._id });

    await Promise.all(createdProjects.map(project => project.save()));
    console.log('Added likes to projects');

    // Create comments
    const comments = [
      {
        content: 'This is an amazing project! The UI is so clean and user-friendly.',
        user: createdUsers[1]._id,
        project: createdProjects[0]._id
      },
      {
        content: 'Great work on the authentication system. Very secure implementation.',
        user: createdUsers[2]._id,
        project: createdProjects[0]._id
      },
      {
        content: 'Love the real-time features! How did you implement the WebSocket connection?',
        user: createdUsers[1]._id,
        project: createdProjects[1]._id
      },
      {
        content: 'The weather data visualization is fantastic. Great use of Chart.js!',
        user: createdUsers[2]._id,
        project: createdProjects[2]._id
      }
    ];

    const createdComments = await Comment.create(comments);
    console.log('Created comments');

    // Create some activities
    const activities = [
      {
        user: createdUsers[1]._id,
        action: 'signup',
        metadata: { email: createdUsers[1].email }
      },
      {
        user: createdUsers[2]._id,
        action: 'signup',
        metadata: { email: createdUsers[2].email }
      },
      {
        user: createdUsers[1]._id,
        action: 'like',
        targetType: 'project',
        targetId: createdProjects[0]._id
      },
      {
        user: createdUsers[2]._id,
        action: 'like',
        targetType: 'project',
        targetId: createdProjects[0]._id
      },
      {
        user: createdUsers[1]._id,
        action: 'comment',
        targetType: 'project',
        targetId: createdProjects[0]._id,
        metadata: { commentId: createdComments[0]._id }
      }
    ];

    await Activity.create(activities);
    console.log('Created activities');

    console.log('Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Owner: owner@example.com / password123');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();