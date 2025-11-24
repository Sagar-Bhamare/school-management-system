import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Teachers from './pages/Teachers';
import TeacherDetails from './pages/TeacherDetails';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Exams from './pages/Exams';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Assignments from './pages/Assignments';
import Notifications from './pages/Notifications';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      
      {/* Main content with margin-top to account for fixed header */}
      <main className="flex-1 mt-16 p-4 md:p-8 md:ml-64 transition-all duration-300">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />

        <Route path="/teachers" element={
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        } />

        <Route path="/teachers/:id" element={
          <ProtectedRoute>
            <TeacherDetails />
          </ProtectedRoute>
        } />

        <Route path="/classes" element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } />

        <Route path="/subjects" element={
          <ProtectedRoute>
            <Subjects />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } />

        <Route path="/exams" element={
          <ProtectedRoute>
            <Exams />
          </ProtectedRoute>
        } />

        <Route path="/timetable" element={
          <ProtectedRoute>
            <Timetable />
          </ProtectedRoute>
        } />

        <Route path="/fees" element={
          <ProtectedRoute>
            <Fees />
          </ProtectedRoute>
        } />

        <Route path="/assignments" element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          <ProtectedRoute>
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400">404</h2>
              <p className="text-gray-500">Page not found.</p>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
