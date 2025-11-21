
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BookOpen, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { MOCK_TIMETABLE, MOCK_ASSIGNMENTS, MOCK_EXAMS, MOCK_STUDENTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Assignment } from '../types';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Identify current student profile
  const studentProfile = user?.role === 'student' 
    ? (MOCK_STUDENTS.find(s => s.email === user.email || s.name === user.name) || MOCK_STUDENTS[0])
    : null;
  
  const studentClass = studentProfile ? `${studentProfile.grade}-${studentProfile.section}` : '';

  // Load assignments from localStorage
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
      const saved = localStorage.getItem('edu_assignments');
      return saved ? JSON.parse(saved) : MOCK_ASSIGNMENTS;
  });

  // Filter assignments for this student that are pending or active
  const dueSoonAssignments = assignments
    .filter(a => a.grade === studentClass && a.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const stats = [
    {
      title: 'My Attendance',
      value: `${studentProfile?.attendance || 92}%`,
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Pending Homework',
      value: dueSoonAssignments.length.toString(),
      icon: BookOpen,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Next Exam',
      value: 'Mar 15',
      icon: CalendarIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Fees Due',
      value: '$0',
      icon: AlertCircle,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name.split(' ')[0]}! Here's your learning summary for Class {studentClass}.
        </p>
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
        {/* My Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Timetable</h3>
            <span className="text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-1 rounded">Monday</span>
          </div>
          <div className="space-y-0">
            {MOCK_TIMETABLE.filter(t => t.day === 'Monday').map((slot, idx) => (
               <div key={idx} className="relative pl-8 pb-8 border-l border-gray-200 dark:border-gray-700 last:pb-0 last:border-l-0">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-gray-800"></div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                     <div className="flex justify-between mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{slot.subject}</span>
                        <span className="text-xs font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded">{slot.time}</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{slot.teacher}</span>
                        <span>Room {slot.room}</span>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* Due Soon */}
        <div className="space-y-6">
            {/* Assignments Widget */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Due Soon</h3>
                    <button onClick={() => navigate('/assignments')} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                    {dueSoonAssignments.length > 0 ? (
                        dueSoonAssignments.map((assign) => (
                            <div key={assign.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => navigate('/assignments')}>
                                <div className={`mt-1 w-2 h-2 rounded-full ${assign.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{assign.title}</p>
                                    <p className="text-xs text-gray-500">{assign.subject} • Due {assign.dueDate}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No pending assignments.</p>
                    )}
                </div>
            </div>

            {/* Upcoming Exam Widget */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-xl shadow-md text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CalendarIcon size={20} /> Upcoming Exam
                </h3>
                {MOCK_EXAMS.slice(0, 1).map((exam) => (
                    <div key={exam.id}>
                        <div className="text-3xl font-bold mb-1">{exam.date.split('-')[2]} Mar</div>
                        <div className="text-brand-200 text-sm mb-4">{exam.startTime} • {exam.duration}</div>
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <p className="font-bold text-lg">{exam.subject}</p>
                            <p className="text-sm text-brand-100">Chapter 4 - 9</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
