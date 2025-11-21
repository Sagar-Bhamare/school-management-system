import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Users, FileText, Clock, ClipboardCheck } from 'lucide-react';
import { MOCK_TIMETABLE } from '../constants';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: 'My Classes',
      value: '4',
      icon: School,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-900/20',
    },
    {
      title: 'Total Students',
      value: '124',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Assignments',
      value: '12',
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Hours Today',
      value: '5h',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your classes, attendance and assignments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center">
             <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                <stat.icon size={24} strokeWidth={2} />
             </div>
             <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
            <span className="text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-1 rounded">Monday</span>
          </div>
          <div className="space-y-4">
            {MOCK_TIMETABLE.filter(t => t.day === 'Monday').map((slot, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-16 text-center">
                   <p className="text-sm font-bold text-gray-900 dark:text-white">{slot.time.split('-')[0]}</p>
                   <p className="text-xs text-gray-500">{slot.time.split('-')[1]}</p>
                </div>
                <div className="w-1 h-10 bg-brand-200 dark:bg-brand-800 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{slot.subject}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Class {slot.grade} • Room {slot.room}</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors">
                   Start Class
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button onClick={() => navigate('/attendance')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group text-left">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400">Mark Attendance</p>
                            <p className="text-xs text-gray-500">For Class 10-A</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/assignments')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group text-left">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400">Create Assignment</p>
                            <p className="text-xs text-gray-500">Homework & Projects</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
