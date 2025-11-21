import React, { useState, useEffect } from 'react';
import { MOCK_TIMETABLE, MOCK_CLASSES, MOCK_SUBJECTS, MOCK_TEACHERS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Edit2, Save, Plus, X, Loader2, Trash2, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { TimetableItem } from '../types';

// --- SHARED CONSTANTS ---
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Generate time slots for the day (08:00 to 16:00)
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

// Helper to generate a friendly display string (e.g., "08:00 - 09:00")
const getSlotRange = (startTime: string) => {
  const [hour] = startTime.split(':').map(Number);
  const nextHour = hour + 1;
  return `${startTime} - ${nextHour.toString().padStart(2, '0')}:00`;
};

// --- STUDENT VIEW ---
const StudentTimetable = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
        <p className="text-gray-500 dark:text-gray-400">Class 10-A Weekly Schedule</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
            <thead>
                <tr>
                <th className="p-4 border-b border-r border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium w-32 text-center sticky left-0 z-10">Time</th>
                {DAYS.map(day => (
                    <th key={day} className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white font-bold min-w-[160px] text-center">
                    {day}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="text-sm">
                {TIME_SLOTS.slice(0, -1).map((time) => (
                <tr key={time}>
                    <td className="p-4 border-r border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm">
                    {getSlotRange(time)}
                    </td>
                    {DAYS.map(day => {
                    // Logic matches exact string "09:00 - 10:00" from MOCK data or start time logic
                    // For this demo, we check if the MOCK item's time string starts with our current slot time
                    const session = MOCK_TIMETABLE.find(t => t.day === day && t.time.startsWith(time) && t.grade === '10-A');
                    
                    return (
                        <td key={day} className="p-2 border-b border-r border-gray-100 dark:border-gray-700 last:border-r-0 h-28 align-top bg-white dark:bg-gray-900">
                        {session ? (
                            <div className="h-full bg-brand-50 dark:bg-brand-900/20 p-3 rounded-lg border-l-4 border-brand-500 text-left transition-all hover:shadow-md hover:scale-[1.02]">
                            <p className="font-bold text-brand-700 dark:text-brand-400 text-sm line-clamp-1">{session.subject}</p>
                            <p className="text-xs text-brand-600 dark:text-brand-300 mt-1 line-clamp-1">{session.teacher}</p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                Room {session.room}
                            </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-gray-200 dark:text-gray-800 text-2xl font-light">-</span>
                            </div>
                        )}
                        </td>
                    );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// --- TEACHER VIEW ---
const TeacherTimetable = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teaching Schedule</h1>
        <p className="text-gray-500 dark:text-gray-400">Your weekly class sessions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DAYS.map(day => (
              <div key={day} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                  <div className="bg-brand-50 dark:bg-brand-900/20 p-3 text-center border-b border-brand-100 dark:border-brand-900/30">
                      <h3 className="font-bold text-brand-700 dark:text-brand-400">{day}</h3>
                  </div>
                  <div className="p-3 space-y-3 flex-1">
                      {TIME_SLOTS.slice(0, -1).map(time => {
                           const session = MOCK_TIMETABLE.find(t => t.day === day && t.time.startsWith(time));
                           if (session) {
                               return (
                                   <div key={time} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/30 hover:border-brand-300 dark:hover:border-brand-500 transition-colors shadow-sm">
                                       <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{time}</span>
                                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{session.grade}</span>
                                       </div>
                                       <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{session.subject}</p>
                                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Room {session.room}</p>
                                   </div>
                               );
                           }
                           return null;
                      })}
                      {MOCK_TIMETABLE.filter(t => t.day === day).length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 opacity-50">
                              <Calendar size={24} className="mb-2" />
                              <span className="text-xs">No classes</span>
                          </div>
                      )}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

// --- ADMIN VIEW ---
const AdminTimetable = () => {
  // State
  // We extend the mock data with a 'startTime' property for easier logic if it was real data, 
  // but here we'll just use the 'time' string parsing or store separate fields.
  // Initial state maps MOCK_TIMETABLE to our local state format.
  const [timetable, setTimetable] = useState<TimetableItem[]>(MOCK_TIMETABLE);
  const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0]?.id || '');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    classId: '',
    subject: '',
    teacher: '',
    day: 'Monday',
    room: '',
    startTime: '08:00',
    endTime: '09:00'
  });

  // Derived class name for display/filtering
  const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
  const selectedClassLabel = selectedClass ? `${selectedClass.grade}-${selectedClass.section}` : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.subject || !formData.teacher || !formData.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get class details
    const cls = MOCK_CLASSES.find(c => c.id === formData.classId);
    const gradeLabel = cls ? `${cls.grade}-${cls.section}` : 'Unknown';
    
    const newItem: TimetableItem = {
      id: `tt-${Date.now()}`,
      day: formData.day as any,
      time: `${formData.startTime} - ${formData.endTime}`,
      subject: formData.subject,
      teacher: formData.teacher,
      grade: gradeLabel,
      room: formData.room
    };

    setTimetable(prev => [...prev, newItem]);
    
    // Feedback to user
    if (formData.classId === selectedClassId) {
        toast.success('Schedule added successfully');
    } else {
        toast.success(`Added to Class ${gradeLabel}`);
    }

    setIsSubmitting(false);
    setShowModal(false);
    
    // Reset form (keep class/day for convenience)
    setFormData(prev => ({
      ...prev,
      subject: '',
      teacher: '',
      room: ''
    }));
  };

  const handleDeleteEntry = (id: string) => {
    if(window.confirm('Are you sure you want to remove this schedule entry?')) {
      setTimetable(prev => prev.filter(t => t.id !== id));
      toast.success('Entry removed');
    }
  };

  // Filter timetable items for the current view
  // We check if the item.grade matches "10-A" for example
  const filteredItems = timetable.filter(item => item.grade === selectedClassLabel);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage class schedules and time slots</p>
        </div>
        
        <button 
          onClick={() => {
            setFormData(prev => ({ ...prev, classId: selectedClassId })); // Pre-select current view class
            setShowModal(true);
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg shadow-lg shadow-brand-200 dark:shadow-none flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} />
          Add Schedule
        </button>
      </div>

      {/* Class Selector Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-brand-50 dark:bg-brand-900/20 p-2.5 rounded-lg text-brand-600 dark:text-brand-400">
                <Filter size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Class Schedule:</span>
        </div>
        <div className="relative flex-1 w-full sm:max-w-xs">
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer shadow-sm font-medium"
            >
              {MOCK_CLASSES.map(c => (
                <option key={c.id} value={c.id}>Grade {c.grade}-{c.section}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
               <ChevronDown size={16} />
            </div>
        </div>
        {selectedClass && (
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
                <span>Room: <strong className="text-gray-800 dark:text-gray-200">{selectedClass.roomNumber}</strong></span>
                <span>Teacher: <strong className="text-gray-800 dark:text-gray-200">{selectedClass.classTeacher}</strong></span>
            </div>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1000px] border-collapse">
            <thead>
                <tr>
                <th className="p-5 border-b border-r border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-semibold w-32 text-center sticky left-0 z-10 backdrop-blur-sm">Time</th>
                {DAYS.map(day => (
                    <th key={day} className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 text-gray-800 dark:text-white font-bold min-w-[180px] text-center">
                    {day}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="text-sm">
                {TIME_SLOTS.slice(0, -1).map((time) => (
                <tr key={time} className="group">
                    {/* Time Column */}
                    <td className="p-4 border-r border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50 text-center whitespace-nowrap sticky left-0 z-10 backdrop-blur-sm group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                    {getSlotRange(time)}
                    </td>

                    {/* Day Columns */}
                    {DAYS.map(day => {
                    // Find session matching this day and starting at this time
                    // Using `startsWith` for simplicity with the string "09:00 - 10:00"
                    const session = filteredItems.find(t => t.day === day && t.time.startsWith(time));
                    
                    return (
                        <td key={day} className="p-2 border-b border-r border-gray-100 dark:border-gray-700 last:border-r-0 h-32 align-top bg-white dark:bg-gray-900 group-hover:bg-gray-50/30 dark:group-hover:bg-gray-800/30 transition-colors relative">
                        {session ? (
                            <div className="h-full bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all group/card relative flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-brand-700 dark:text-brand-400 line-clamp-1">{session.subject}</span>
                                </div>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span> {session.teacher}
                                </p>
                                <div className="mt-auto flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">Room {session.room}</span>
                                </div>
                                
                                <button 
                                    onClick={() => handleDeleteEntry(session.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-100 dark:border-gray-600 opacity-0 group-hover/card:opacity-100 transition-all shadow-sm transform scale-90 hover:scale-100"
                                    title="Remove Entry"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="h-full rounded-xl border-2 border-dashed border-transparent hover:border-gray-100 dark:hover:border-gray-800 flex items-center justify-center group/empty transition-all">
                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            classId: selectedClassId,
                                            day: day,
                                            startTime: time,
                                            endTime: TIME_SLOTS[TIME_SLOTS.indexOf(time) + 1]
                                        }));
                                        setShowModal(true);
                                    }}
                                    className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center justify-center opacity-0 group-hover/empty:opacity-100 hover:bg-brand-500 hover:text-white transition-all transform scale-90 group-hover/empty:scale-100"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                        </td>
                    );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] transform transition-all scale-100">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Schedule Entry</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create a new class session</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="scheduleForm" onSubmit={handleAddEntry} className="space-y-5">
                
                {/* Class Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Class</label>
                    <div className="relative">
                        <select 
                            name="classId"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                            value={formData.classId}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select Class</option>
                            {MOCK_CLASSES.map(c => (
                                <option key={c.id} value={c.id}>Grade {c.grade}-{c.section}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                        <div className="relative">
                            <select 
                                name="subject"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                                value={formData.subject}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Subject</option>
                                {MOCK_SUBJECTS.map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                    {/* Teacher */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teacher</label>
                        <div className="relative">
                            <select 
                                name="teacher"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                                value={formData.teacher}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="">Select Teacher</option>
                                {MOCK_TEACHERS.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Day */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Day</label>
                        <div className="relative">
                            <select 
                                name="day"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                                value={formData.day}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                    {/* Room */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Room Number</label>
                        <input 
                            type="text"
                            name="room"
                            required
                            placeholder="e.g. 101"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                            value={formData.room}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Start Time</label>
                        <div className="relative">
                            <select 
                                name="startTime"
                                required
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none text-sm"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                {TIME_SLOTS.slice(0, -1).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">End Time</label>
                        <div className="relative">
                            <select 
                                name="endTime"
                                required
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none text-sm"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                {TIME_SLOTS.slice(1).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>
                
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 flex gap-3">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="scheduleForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 font-medium transform active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DISPATCHER ---
const Timetable = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') return <StudentTimetable />;
  if (user?.role === 'teacher') return <TeacherTimetable />;
  return <AdminTimetable />;
};

export default Timetable;