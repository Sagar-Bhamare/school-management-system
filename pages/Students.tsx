import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, Phone, Calendar, MapPin, Hash, Mail, User, Shield, GraduationCap, Download, School, Eye, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MOCK_STUDENTS, MOCK_CLASSES } from '../constants';
import { Student } from '../types';
import { useAuth } from '../context/AuthContext';

// --- STUDENT VIEW: MY PROFILE ---
const StudentProfile = () => {
  const { user } = useAuth();
  // Mock: Find student record matching user, or default to first one for demo
  const student = MOCK_STUDENTS.find(s => s.name === user?.name) || MOCK_STUDENTS[0];
  
  // Find class teacher based on student grade/section
  const studentClass = MOCK_CLASSES.find(c => c.grade === student.grade && c.section === student.section);
  const classTeacher = studentClass?.classTeacher || "Not Assigned";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Image */}
        <div className="h-40 bg-gradient-to-r from-brand-600 to-teal-500"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-6 gap-4">
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center text-4xl font-bold">
                    {student.name.charAt(0)}
                    </div>
                </div>
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><User size={16} /> Student ID: {student.rollNumber}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Class {student.grade}-{student.section}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto mb-2">
                <button className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} /> ID Card
                </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Left Column: Personal Info */}
            <div className="lg:col-span-2 space-y-8">
                {/* Academic Details Card */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <GraduationCap size={20} className="text-brand-500" /> Academic Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Current Class</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">Grade {student.grade} - Section {student.section}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Roll Number</p>
                            <p className="text-base font-mono font-medium text-gray-900 dark:text-white mt-1">{student.rollNumber}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Attendance</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500" style={{ width: `${student.attendance}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{student.attendance}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {student.status}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Personal Contact Card */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-brand-500" /> Personal Details
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.email}</p>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Parent Contact</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.parentContact}</p>
                                </div>
                            </div>

                             <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.dob}</p>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Residential Address</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Quick Stats or Teacher */}
            <div className="space-y-6">
                <div className="bg-brand-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">Student Status</h3>
                        <p className="text-brand-100 text-sm mb-4">Academic Year 2024-2025</p>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-sm font-medium">Active Enrollment</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-brand-500 opacity-50">
                        <School size={120} />
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Class Teacher</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                            {classTeacher.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{classTeacher}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Class {student.grade}-{student.section}</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Message Teacher
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TEACHER VIEW: READ ONLY LIST ---
const TeacherView = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Identify Teacher's Classes
  const teacherNamePart = user?.name?.split(' ')[0] || '';
  const myClasses = MOCK_CLASSES.filter(c => 
    c.classTeacher.toLowerCase().includes(teacherNamePart.toLowerCase())
  );

  // Filter Students belonging to those classes
  const myStudents = MOCK_STUDENTS.filter(s => 
    myClasses.some(c => c.grade === s.grade && c.section === s.section)
  );
  
  // Apply Search
  const filteredStudents = myStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student List</h1>
        <p className="text-gray-500 dark:text-gray-400">View details of students in your assigned classes</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full sm:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, roll no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white w-full transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{student.email}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium border border-gray-200 dark:border-gray-600">
                        {student.grade}-{student.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">{student.rollNumber}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{student.parentContact}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-brand-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{student.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No students found in your assigned classes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                
                {/* Header with Gradient and Profile Info */}
                <div className="relative bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 shrink-0">
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl shrink-0">
                            <div className="w-full h-full rounded-full bg-brand-50 flex items-center justify-center text-3xl font-bold text-brand-600">
                                {selectedStudent.name.charAt(0)}
                            </div>
                        </div>
                        <div className="text-center sm:text-left text-white">
                            <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-brand-50 mt-2 text-sm font-medium">
                                <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                                    <Hash size={14} /> ID: {selectedStudent.rollNumber}
                                </span>
                                <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                                    <School size={14} /> Class {selectedStudent.grade}-{selectedStudent.section}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex flex-col items-center sm:items-start">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Attendance</p>
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${selectedStudent.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${selectedStudent.attendance}%`}}></div>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">{selectedStudent.attendance}%</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex flex-col items-center sm:items-start">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium ${selectedStudent.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${selectedStudent.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {selectedStudent.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <section className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                                <User size={18} className="text-brand-500" /> Personal Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><Mail size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedStudent.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><Calendar size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedStudent.dob || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><MapPin size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{selectedStudent.address || 'No address on file'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Guardian & Emergency */}
                        <section className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                                <Shield size={18} className="text-brand-500" /> Guardian Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><User size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Parent/Guardian</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Mr./Mrs. Guardian</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><Phone size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact Number</p>
                                        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{selectedStudent.parentContact || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2">
                        <Mail size={16} /> Message Parent
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- ADMIN VIEW: FULL CRUD ---
const AdminStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize state from localStorage or fall back to constants
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('edu_students');
    return savedStudents ? JSON.parse(savedStudents) : MOCK_STUDENTS;
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem('edu_students', JSON.stringify(students));
  }, [students]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: '',
    parentContact: '',
    address: '',
    grade: '',
    section: '',
    rollNumber: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Check for URL action parameter to open modal automatically
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      resetForm();
      setShowModal(true);
    }
  }, [location]);

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentStudentId(null);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
    resetForm();
    navigate('/students', { replace: true });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Student deleted successfully');
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      firstName: student.firstName || student.name.split(' ')[0] || '',
      lastName: student.lastName || student.name.split(' ').slice(1).join(' ') || '',
      email: student.email,
      dob: student.dob || '',
      gender: student.gender || '',
      parentContact: student.parentContact || '',
      address: student.address || '',
      grade: student.grade,
      section: student.section,
      rollNumber: student.rollNumber
    });
    setCurrentStudentId(student.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      if (isEditing && currentStudentId) {
        setStudents(prev => prev.map(s => s.id === currentStudentId ? {
          ...s,
          name: fullName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          grade: formData.grade,
          section: formData.section,
          rollNumber: formData.rollNumber || s.rollNumber,
          dob: formData.dob,
          gender: formData.gender,
          parentContact: formData.parentContact,
          address: formData.address,
        } : s));
        toast.success('Student updated successfully');
      } else {
        const newStudent: Student = {
          id: `s${Date.now()}`,
          name: fullName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          grade: formData.grade,
          section: formData.section,
          rollNumber: formData.rollNumber || String(Math.floor(Math.random() * 9000) + 1000),
          attendance: 0,
          status: 'Active',
          dob: formData.dob,
          gender: formData.gender,
          parentContact: formData.parentContact,
          address: formData.address,
        };
        setStudents(prev => [...prev, newStudent]);
        toast.success('New student added successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage student records and enrollments</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full sm:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, roll no..." 
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white w-full transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="w-full sm:w-auto border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors">
              <option>All Grades</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium border border-gray-200 dark:border-gray-600">
                      {student.grade}-{student.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">{student.rollNumber}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{student.parentContact || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-brand-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(student)} className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(student.id)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={handleCloseModal} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50">&times;</button>
            </div>
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="studentForm" onSubmit={handleSaveStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" name="firstName" required placeholder="Enter First Name" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.firstName} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input type="text" name="lastName" required placeholder="Enter Last Name" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.lastName} onChange={handleInputChange} disabled={isSubmitting} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" name="email" required placeholder="Enter Email Address" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="tel" name="parentContact" placeholder="Enter Parent Contact Number" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.parentContact} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" name="dob" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.dob} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select name="gender" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.gender} onChange={handleInputChange} disabled={isSubmitting}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <textarea name="address" rows={2} placeholder="Enter Full Residential Address" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none resize-none" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                     <select name="grade" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.grade} onChange={handleInputChange} disabled={isSubmitting}>
                        <option value="">Select</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                     <select name="section" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.section} onChange={handleInputChange} disabled={isSubmitting}>
                        <option value="">Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                     </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll No.</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" name="rollNumber" placeholder="Enter Roll Number" className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none" value={formData.rollNumber} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 flex gap-3">
              <button type="button" onClick={handleCloseModal} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">Cancel</button>
              <button type="submit" form="studentForm" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> {isEditing ? 'Updating...' : 'Saving...'}</> : isEditing ? 'Update Student' : 'Save Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DISPATCHER ---
const Students = () => {
  const { user } = useAuth();

  if (user?.role === 'student') return <StudentProfile />;
  if (user?.role === 'teacher') return <TeacherView />;
  return <AdminStudents />;
};

export default Students;