import React, { useState } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Notification } from '../types';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle size={20} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Stay updated with latest school announcements</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1"
          >
            <Check size={16} /> Mark all read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex gap-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button 
             onClick={() => setFilter('unread')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'unread' 
                ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Unread
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex gap-4 ${!notif.read ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-bold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                      {notif.title}
                      {!notif.read && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                      <Clock size={12} /> {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <Bell size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;