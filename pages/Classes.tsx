import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, X, Loader2, AlertTriangle, School, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_CLASSES, MOCK_TEACHERS, MOCK_SUBJECTS } from '../constants';
import { Class } from '../types';
import { useAuth } from '../context/AuthContext';

// --- STUDENT VIEW ---
const StudentClass = () => {
  // Mock data: Student assumes they are in Grade 10-A for this demo
  const myClass = MOCK_CLASSES.find(c => c.grade === '10' && c.section === 'A') || MOCK_CLASSES[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Class</h1>
        <p className="text-gray-500 dark:text-gray-400">Class details and subject information</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-brand-600 p-6 text-white">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-brand-100 font-medium mb-1">Class {myClass.grade}-{myClass.section}</p>
                <h2 className="text-3xl font-bold">{myClass.studentCount} Students</h2>
             </div>
             <div className="bg-white/20 p-3 rounded-lg">
                <School size={32} />
             </div>
          </div>
          <div className="mt-6 flex items-center gap-6">
             <div>
                <p className="text-brand-200 text-xs uppercase tracking-wider">Class Teacher</p>
                <p className="font-semibold">{myClass.classTeacher}</p>
             </div>
             <div>
                <p className="text-brand-200 text-xs uppercase tracking-wider">Room</p>
                <p className="font-semibold">{myClass.roomNumber}</p>
             </div>
          </div>
        </div>

        <div className="p-6">
           <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-brand-500" /> Subjects Taught
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myClass.subjects?.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                          {sub.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{sub}</span>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- TEACHER VIEW ---
const TeacherClasses = () => {
  const { user } = useAuth();
  // Mock: Show classes where teacher name matches or just all classes for demo if name doesn't match exact
  const myClasses = MOCK_CLASSES.filter(c => c.classTeacher === user?.name || c.grade === '10');

  return (
     <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h1>
        <p className="text-gray-500 dark:text-gray-400">Classes you are responsible for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map(cls => (
           <div key={cls.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xl">
                       {cls.grade}{cls.section}
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded">
                       Room {cls.roomNumber}
                    </span>
                 </div>
                 <h3 className="font-bold text-gray-900 dark:text-white">Grade {cls.grade} - Section {cls.section}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cls.studentCount} Students</p>
              </div>
              <div className="p-4 bg-gray-50/50 dark:bg-gray-900/20">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                     {cls.subjects?.slice(0,3).map((s, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300">
                           {s}
                        </span>
                     ))}
                     {(cls.subjects?.length || 0) > 3 && (
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">+{cls.subjects!.length - 3}</span>
                     )}
                  </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

// --- ADMIN VIEW ---
const AdminClasses = () => {
  // Initialize state
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('edu_classes');
    return saved ? JSON.parse(saved) : MOCK_CLASSES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    grade: '',
    section: '',
    classTeacher: '',
    roomNumber: '',
    capacity: 30,
    subjects: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('edu_classes', JSON.stringify(classes));
  }, [classes]);

  const filteredClasses = classes.filter(cls => 
    `${cls.grade}-${cls.section}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentClassId(null);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
    resetForm();
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (cls: Class) => {
    setFormData({
      grade: cls.grade,
      section: cls.section,
      classTeacher: cls.classTeacher,
      roomNumber: cls.roomNumber,
      capacity: cls.capacity || 30,
      subjects: cls.subjects || []
    });
    setCurrentClassId(cls.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setClassToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (classToDelete) {
      setClasses(prev => prev.filter(c => c.id !== classToDelete));
      toast.success('Class deleted successfully');
      setShowDeleteModal(false);
      setClassToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subjectName: string) => {
    setFormData(prev => {
      const currentSubjects = prev.subjects;
      if (currentSubjects.includes(subjectName)) {
        return { ...prev, subjects: currentSubjects.filter(s => s !== subjectName) };
      } else {
        return { ...prev, subjects: [...currentSubjects, subjectName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.grade || !formData.section || !formData.classTeacher || !formData.roomNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isEditing && currentClassId) {
        setClasses(prev => prev.map(c => c.id === currentClassId ? {
          ...c,
          ...formData,
          capacity: Number(formData.capacity)
        } : c));
        toast.success('Class updated successfully');
      } else {
        const newClass: Class = {
          id: `c${Date.now()}`,
          studentCount: 0, // New classes start with 0 students
          ...formData,
          capacity: Number(formData.capacity)
        };
        setClasses(prev => [...prev, newClass]);
        toast.success('New class added successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage class sections, teachers and capacities</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Class
        </button>
      </div>

      {/* Table View */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search class, teacher or room..." 
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
                <th className="px-6 py-4">Class Name</th>
                <th className="px-6 py-4">Class Teacher</th>
                <th className="px-6 py-4">Room No.</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Subjects</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-md border border-brand-100 dark:border-brand-800">
                        {cls.grade}-{cls.section}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {cls.classTeacher}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      {cls.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {cls.capacity || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cls.subjects && cls.subjects.length > 0 ? (
                        <>
                          {cls.subjects.slice(0, 2).map((sub, idx) => (
                            <span key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                              {sub}
                            </span>
                          ))}
                          {cls.subjects.length > 2 && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                              +{cls.subjects.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Users size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cls.studentCount}</span>
                      {cls.capacity && (
                        <span className="text-gray-400">/ {cls.capacity}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(cls)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(cls.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No classes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Class' : 'Add Class'}</h3>
              <button 
                onClick={handleCloseModal} 
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="classForm" onSubmit={handleSubmit} className="space-y-5">
                {/* Class Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Name (Grade)</label>
                    <input 
                      type="text" 
                      name="grade"
                      required
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.grade}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                    <input 
                      type="text" 
                      name="section"
                      required
                      placeholder="e.g. A"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.section}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Teacher & Room */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Teacher</label>
                    <select 
                      name="classTeacher"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.classTeacher}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select Teacher</option>
                      {MOCK_TEACHERS.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                    <input 
                      type="text" 
                      name="roomNumber"
                      required
                      placeholder="e.g. 101"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Max Students)</label>
                  <input 
                    type="number" 
                    name="capacity"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Subjects Checkbox */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjects Taught</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/30 max-h-40 overflow-y-auto custom-scrollbar">
                    {MOCK_SUBJECTS.map((subject) => (
                      <label key={subject.id} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.subjects.includes(subject.name)}
                            onChange={() => handleSubjectChange(subject.name)}
                            disabled={isSubmitting}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:border-brand-500 checked:bg-brand-500 transition-all"
                          />
                          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{subject.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 flex gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="classForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditing ? 'Update Class' : 'Add Class'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Class?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this class? This will remove all associated data and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DISPATCHER ---
const Classes = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') return <StudentClass />;
  if (user?.role === 'teacher') return <TeacherClasses />;
  return <AdminClasses />;
};

export default Classes;
