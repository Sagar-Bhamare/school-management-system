import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, X, Loader2, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_SUBJECTS, MOCK_TEACHERS } from '../constants';
import { Subject } from '../types';
import { useAuth } from '../context/AuthContext';

// --- STUDENT VIEW ---
const StudentSubjects = () => {
  // Mock: Show Grade 10 subjects
  const mySubjects = MOCK_SUBJECTS.filter(s => s.grade === '10' || s.grade === 'All');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Subjects</h1>
        <p className="text-gray-500 dark:text-gray-400">Subjects in your curriculum</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {mySubjects.map((subject) => {
            // Find teacher name from ID for display
            const teacher = MOCK_TEACHERS.find(t => t.id === subject.teacherId)?.name || 'Unknown';

            return (
               <div key={subject.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-all hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                     <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
                        <BookOpen size={24} />
                     </div>
                     <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        {subject.code}
                     </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Instructor: {teacher}</p>
                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                     <span className="flex items-center gap-1.5"><Clock size={14} /> {subject.sessionsPerWeek} Sessions/Wk</span>
                  </div>
               </div>
            )
         })}
      </div>
    </div>
  );
};

// --- TEACHER VIEW ---
const TeacherSubjects = () => {
  const { user } = useAuth();
  // Mock logic: Filter subjects by teacherId mock or simply show subjects that match user name (simplified for demo)
  // For this demo, we'll just show a few subjects if user is 'Sarah Teacher' or similar
  // In real app, filter by user.id
  const mySubjects = MOCK_SUBJECTS; // In a real app: MOCK_SUBJECTS.filter(s => s.teacherId === user?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Subjects</h1>
        <p className="text-gray-500 dark:text-gray-400">Subjects assigned to you</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
               <tr>
                  <th className="px-6 py-4">Subject Code</th>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Grade Level</th>
                  <th className="px-6 py-4">Weekly Sessions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
               {mySubjects.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                     <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{s.code}</td>
                     <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{s.name}</td>
                     <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Grade {s.grade}</td>
                     <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{s.sessionsPerWeek}</td>
                  </tr>
               ))}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN VIEW ---
const AdminSubjects = () => {
  // Initialize state from localStorage or fall back to constants
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('edu_subjects');
    return saved ? JSON.parse(saved) : MOCK_SUBJECTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    code: '',
    teacherId: '',
    grade: '',
    sessionsPerWeek: 4
  };

  const [formData, setFormData] = useState(initialFormState);

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem('edu_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentSubjectId(null);
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

  const handleEditClick = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      teacherId: subject.teacherId,
      grade: subject.grade,
      sessionsPerWeek: subject.sessionsPerWeek
    });
    setCurrentSubjectId(subject.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setSubjectToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (subjectToDelete) {
      setSubjects(prev => prev.filter(s => s.id !== subjectToDelete));
      toast.success('Subject deleted successfully');
      setShowDeleteModal(false);
      setSubjectToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.grade) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isEditing && currentSubjectId) {
        setSubjects(prev => prev.map(s => s.id === currentSubjectId ? {
          ...s,
          ...formData,
          sessionsPerWeek: Number(formData.sessionsPerWeek)
        } : s));
        toast.success('Subject updated successfully');
      } else {
        const newSubject: Subject = {
          id: `sub${Date.now()}`,
          ...formData,
          sessionsPerWeek: Number(formData.sessionsPerWeek)
        };
        setSubjects(prev => [...prev, newSubject]);
        toast.success('Subject added successfully');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
          <p className="text-gray-500 dark:text-gray-400">Curriculum and subject allocation</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full sm:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search subjects or codes..." 
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
                <th className="px-6 py-4">Subject Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Applicable Grade</th>
                <th className="px-6 py-4">Sessions/Week</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                        <BookOpen size={18} />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">{subject.code}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Grade {subject.grade}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{subject.sessionsPerWeek}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(subject)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(subject.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No subjects found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Subject' : 'Add Subject'}</h3>
              <button 
                onClick={handleCloseModal} 
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="subjectForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g. Advanced Mathematics"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Code</label>
                    <input 
                      type="text" 
                      name="code"
                      required
                      placeholder="e.g. MTH101"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.code}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sessions / Week</label>
                    <input 
                      type="number" 
                      name="sessionsPerWeek"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.sessionsPerWeek}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                    <select 
                      name="grade"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.grade}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select Grade</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                      <option value="All">All Grades</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lead Teacher</label>
                    <select 
                      name="teacherId"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                      value={formData.teacherId}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select Teacher</option>
                      {MOCK_TEACHERS.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
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
                form="subjectForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditing ? 'Update Subject' : 'Save Subject'
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Subject?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this subject? This action cannot be undone.
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
const Subjects = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') return <StudentSubjects />;
  if (user?.role === 'teacher') return <TeacherSubjects />;
  return <AdminSubjects />;
};

export default Subjects;
