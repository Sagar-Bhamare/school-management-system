import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  BookOpen, 
  ClipboardCheck, 
  BarChart, 
  Calendar, 
  CreditCard, 
  Settings,
  LogOut,
  X,
  FileQuestion
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Define menu items with allowed roles
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', allowedRoles: ['admin', 'teacher', 'student'] as Role[] },
    { icon: Users, label: 'Students', path: '/students', allowedRoles: ['admin', 'teacher'] as Role[] },
    { icon: GraduationCap, label: 'Teachers', path: '/teachers', allowedRoles: ['admin'] as Role[] },
    { icon: School, label: 'Classes', path: '/classes', allowedRoles: ['admin', 'teacher'] as Role[] },
    { icon: BookOpen, label: 'Subjects', path: '/subjects', allowedRoles: ['admin', 'teacher', 'student'] as Role[] },
    { icon: ClipboardCheck, label: 'Attendance', path: '/attendance', allowedRoles: ['admin', 'teacher'] as Role[] },
    { icon: FileQuestion, label: 'Assignments', path: '/assignments', allowedRoles: ['teacher', 'student'] as Role[] },
    { icon: BarChart, label: 'Exams', path: '/exams', allowedRoles: ['admin', 'teacher', 'student'] as Role[] },
    { icon: Calendar, label: 'Timetable', path: '/timetable', allowedRoles: ['admin', 'teacher', 'student'] as Role[] },
    { icon: CreditCard, label: 'Fee Management', path: '/fees', allowedRoles: ['admin', 'student'] as Role[] },
    { icon: Settings, label: 'Settings', path: '/settings', allowedRoles: ['admin', 'teacher', 'student'] as Role[] },
  ];

  // Filter items based on user role
  const menuItems = allMenuItems.filter(item => 
    user?.role && item.allowedRoles.includes(user.role)
  );

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col z-40 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 p-1.5 rounded-lg">
              <School size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-brand-800 dark:text-brand-400 leading-tight">EduTrack Pro</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">School Management</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Navigation - flex-1 ensures it takes remaining space, pushing footer down */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar min-h-0">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile when link is clicked
                if (window.innerWidth < 768) onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon size={18} className={isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer / Sign Out - Pinned to bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;