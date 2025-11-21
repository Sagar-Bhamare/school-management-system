import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'teacher') {
    return <TeacherDashboard />;
  }
  
  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  // Default to Admin
  return <AdminDashboard />;
};

export default Dashboard;
