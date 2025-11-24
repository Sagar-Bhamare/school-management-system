import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, Moon, Sun, LogOut, Settings, User, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Use refs to detect clicks outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-20 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
        >
          <Menu size={24} className="dark:text-gray-300" />
        </button>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white truncate">
          {user?.role === 'admin' ? 'Admin Dashboard' : `Welcome, ${user?.name.split(' ')[0]}`}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-gray-200 w-48 lg:w-64 transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-[-60px] sm:right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                <Link 
                  to="/notifications" 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.slice(0, 5).map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex gap-3 cursor-pointer ${!notif.read ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-gray-400 mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                   <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                     No notifications
                   </div>
                )}
              </div>
              <Link 
                to="/notifications" 
                onClick={() => setShowNotifications(false)}
                className="block p-3 text-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 group outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200 flex items-center justify-center font-bold border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden transition-transform group-hover:scale-105">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0)
              )}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              
              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <User size={16} />
                View Profile
              </Link>
              
              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <Settings size={16} />
                Settings
              </Link>

              <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
