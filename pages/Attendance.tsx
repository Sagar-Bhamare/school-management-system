
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Save, 
  Users, 
  TrendingUp, 
  ClipboardList, 
  Check,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_STUDENTS, MOCK_CLASSES } from '../constants';
import { useAuth } from '../context/AuthContext';

// --- STUDENT VIEW COMPONENT ---
const StudentAttendance = () => {
    return (
      <div className="space-y-8 animate-fade-in mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your attendance record</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Overall Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-brand-500 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</p>
                    <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">92%</h3>
                    <p className="text-xs text-green-500 mt-1 font-medium">Good Standing</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-brand-100 dark:border-gray-700 flex items-center justify-center">
                    <PieChart className="text-brand-600 dark:text-brand-400" size={28} />
                </div>
            </div>

            {/* Card 2: Days Present */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Present</p>
                    <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">145</h3>
                    <p className="text-xs text-gray-400 mt-1">This Academic Year</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                    <Check size={24} />
                </div>
            </div>

            {/* Card 3: Days Absent */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-red-500 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Absent</p>
                    <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">12</h3>
                    <p className="text-xs text-gray-400 mt-1">Medical / Personal</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    <Activity size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-brand-500" /> Recent History
             </h3>
             <div className="space-y-0 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
                {[
                    { date: 'Mar 15, 2024', status: 'Present', day: 'Friday' },
                    { date: 'Mar 14, 2024', status: 'Present', day: 'Thursday' },
                    { date: 'Mar 13, 2024', status: 'Absent', day: 'Wednesday' },
                    { date: 'Mar 12, 2024', status: 'Present', day: 'Tuesday' },
                    { date: 'Mar 11, 2024', status: 'Present', day: 'Monday' },
                ].map((record, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{record.date}</p>
                            <p className="text-xs text-gray-500">{record.day}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Present' 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                            {record.status}
                        </span>
                    </div>
                ))}
             </div>
        </div>
      </div>
    );
};

// --- ADMIN / TEACHER VIEW COMPONENT ---
const AttendanceMarking = () => {
  // State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0]?.id || '');
  
  // Filter students by class
  const currentClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
  
  const studentsInClass = MOCK_STUDENTS.filter(s => {
    if (!currentClass) return true;
    return s.grade === currentClass.grade && s.section === currentClass.section;
  });

  // Initialize attendance state: Record<StudentId, isAbsent>
  // true = Absent, false = Present
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({}); 

  // Initialize state when students change
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    studentsInClass.forEach(s => initial[s.id] = false); // Default Present (unchecked)
    setAttendanceState(initial);
  }, [selectedClassId]);

  const handleToggleAbsent = (studentId: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAll = (isAbsent: boolean) => {
    const newState: Record<string, boolean> = {};
    studentsInClass.forEach(s => newState[s.id] = isAbsent);
    setAttendanceState(newState);
    toast.success(isAbsent ? 'Marked all as Absent' : 'Marked all as Present');
  };

  const saveAttendance = () => {
    const presentCount = Object.values(attendanceState).filter(isAbsent => !isAbsent).length;
    const absentCount = studentsInClass.length - presentCount;
    
    // Simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Saving attendance...',
        success: `Saved: ${presentCount} Present, ${absentCount} Absent`,
        error: 'Could not save',
      }
    );
  };

  // Stats Calculation
  const totalStudents = studentsInClass.length;
  const presentCount = Object.values(attendanceState).filter(isAbsent => !isAbsent).length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage student attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Class Students */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-brand-500 flex items-start justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Class Students</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalStudents}</h3>
            <p className="text-xs text-gray-400 mt-1">In selected class</p>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-blue-500 flex items-start justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{attendanceRate}%</h3>
            <p className="text-xs text-gray-400 mt-1">Overall class average</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Card 3: Total Records */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-green-500 flex items-start justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</h3>
            <p className="text-xs text-gray-400 mt-1">Attendance entries</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
            <ClipboardList size={24} />
          </div>
        </div>
      </div>

      {/* Mark Attendance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header & Filters */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className="text-brand-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mark Attendance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
              <div className="relative">
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {MOCK_CLASSES.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      Grade {cls.grade}{cls.section} - Room {cls.roomNumber}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
              <div className="relative">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Students ({totalStudents})</h3>
          <div className="flex gap-3">
            <button 
              onClick={() => markAll(false)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              Mark All Present
            </button>
            <button 
              onClick={() => markAll(true)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {studentsInClass.length > 0 ? (
            studentsInClass.map((student) => {
              const isAbsent = attendanceState[student.id];
              return (
                <div key={student.id} className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isAbsent 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                    }`}>
                      {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  
                  {/* Right: Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <span className={`text-sm font-medium transition-colors ${isAbsent ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {isAbsent ? 'Absent' : 'Present'}
                    </span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isAbsent || false}
                        onChange={() => handleToggleAbsent(student.id)}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                        <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transform scale-50 peer-checked:scale-100 transition-all" />
                      </div>
                    </div>
                  </label>
                </div>
              );
            })
          ) : (
             <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No students found in the selected class.
             </div>
          )}
        </div>
        
        {/* Footer Save Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-end">
           <button 
             onClick={saveAttendance}
             className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
           >
             <Save size={18} />
             Save Attendance
           </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DISPATCHER ---
const Attendance = () => {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentAttendance />;
  }

  // Default to Admin/Teacher View
  return <AttendanceMarking />;
};

export default Attendance;
