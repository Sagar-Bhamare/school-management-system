import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, 
  School, Clock, Briefcase, GraduationCap 
} from 'lucide-react';
import { MOCK_TEACHERS, MOCK_CLASSES, MOCK_SUBJECTS, MOCK_TIMETABLE } from '../constants';
import { Teacher } from '../types';

const TeacherDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Helper to get teachers (including local storage updates)
  const getTeachers = (): Teacher[] => {
    const saved = localStorage.getItem('edu_teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  };
  
  const teacher = getTeachers().find(t => t.id === id);

  if (!teacher) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase size={24} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Teacher not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The teacher record you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/teachers')} 
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  // Find related data
  // 1. Classes where they are the Class Teacher
  const classesManaged = MOCK_CLASSES.filter(c => c.classTeacher === teacher.name);
  
  // 2. Subjects they teach
  const subjectsTaught = MOCK_SUBJECTS.filter(s => s.teacherId === teacher.id);

  // 3. Timetable entries (Fuzzy match on name)
  // Extract last name for better matching against timetable (e.g. "Anderson" from "Mr. Robert Anderson")
  const lastName = teacher.name.split(' ').pop() || '';
  const schedule = MOCK_TIMETABLE.filter(t => 
    t.teacher === teacher.name || 
    (lastName && t.teacher.includes(lastName))
  );

  return (
    <div className="space-y-6 animate-fade-in mx-auto">
      <button 
        onClick={() => navigate('/teachers')}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors mb-2 font-medium"
      >
        <ArrowLeft size={18} />
        <span>Back to Teachers</span>
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-teal-500 relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mx-auto md:mx-0 text-center sm:text-left">
              <div className="w-24 h-24 rounded-xl bg-white dark:bg-gray-800 p-1.5 shadow-lg">
                <div className="w-full h-full rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center text-3xl font-bold">
                  {teacher.name.charAt(0)}
                </div>
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{teacher.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-1">
                   <div className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium">Faculty</div>
                   <span>•</span>
                   <span>{teacher.subject} Department</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto justify-center">
               <button 
                 onClick={() => window.location.href = `mailto:${teacher.email}`}
                 className="px-4 py-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-sm font-medium border border-brand-100 dark:border-brand-900/30 flex items-center gap-2 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
               >
                  <Mail size={16} /> Email
               </button>
               <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Phone size={16} /> Call
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                   <Mail size={18} />
                </div>
                <div className="min-w-0">
                   <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                   <p className="font-medium text-sm truncate">{teacher.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                   <Phone size={18} />
                </div>
                <div>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                   <p className="font-medium text-sm">{teacher.phone}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                   <Calendar size={18} />
                </div>
                <div>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Hire Date</p>
                   <p className="font-medium text-sm">{teacher.hireDate || 'N/A'}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                   <MapPin size={18} />
                </div>
                <div className="min-w-0">
                   <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                   <p className="font-medium text-sm truncate">{teacher.address || 'N/A'}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
           {/* Subjects Taught */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <BookOpen size={20} className="text-brand-500" /> Subjects Taught
              </h3>
              {subjectsTaught.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subjectsTaught.map(subject => (
                    <div key={subject.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all flex flex-col gap-2">
                       <div className="flex justify-between items-start">
                          <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{subject.code}</span>
                          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">Grade {subject.grade}</span>
                       </div>
                       <h4 className="font-bold text-gray-900 dark:text-white">{subject.name}</h4>
                       <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
                          <Clock size={14} /> {subject.sessionsPerWeek} Sessions/Week
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No subjects currently assigned.</p>
                </div>
              )}
           </div>

           {/* Weekly Schedule Preview */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Clock size={20} className="text-brand-500" /> Weekly Schedule
              </h3>
              {schedule.length > 0 ? (
                 <div className="space-y-3">
                    {schedule.map((item, idx) => (
                       <div key={idx} className="flex items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <div className="w-24 font-bold text-gray-900 dark:text-white">{item.day}</div>
                          <div className="w-32 text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-center">{item.time}</div>
                          <div className="flex-1 px-4">
                             <p className="font-medium text-gray-900 dark:text-white">{item.subject}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                               <School size={12} /> Room {item.room}
                             </p>
                          </div>
                          <div className="text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">
                             {item.grade}
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="p-8 text-center bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No schedule entries found for this week.</p>
                 </div>
              )}
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           {/* Status Card */}
           <div className="bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-800 dark:to-brand-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><GraduationCap size={20} /> Faculty Status</h3>
                <p className="text-brand-100 text-sm mb-4">This teacher is active and currently handling {classesManaged.length} classes and {subjectsTaught.length} subjects.</p>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 backdrop-blur-md inline-flex border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                   <span className="font-medium text-sm">Active Status</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 text-white/10 transform rotate-12">
                  <Briefcase size={100} />
              </div>
           </div>

           {/* Classes Managed */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <School size={20} className="text-brand-500" /> Classes Managed
              </h3>
              {classesManaged.length > 0 ? (
                <div className="space-y-4">
                   {classesManaged.map(cls => (
                      <div key={cls.id} className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xl font-bold text-brand-700 dark:text-brand-400">{cls.grade}-{cls.section}</span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">Class Teacher</span>
                         </div>
                         <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                            <div className="flex justify-between text-sm">
                               <span className="text-gray-500 dark:text-gray-400">Room</span>
                               <span className="font-medium text-gray-900 dark:text-white">{cls.roomNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                               <span className="text-gray-500 dark:text-gray-400">Students</span>
                               <span className="font-medium text-gray-900 dark:text-white">{cls.studentCount}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              ) : (
                 <div className="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Not assigned as Class Teacher.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
