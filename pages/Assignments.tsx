import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, CheckCircle, Clock, MoreVertical, Search, Filter, X, Loader2, Edit2, Trash2, Save, AlertCircle, Eye, Paperclip, User, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ASSIGNMENTS, MOCK_STUDENTS, MOCK_CLASSES } from '../constants';
import { Assignment } from '../types';
import toast from 'react-hot-toast';

const Assignments = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Identify current student profile if user is a student
  // Fallback to first student if email/name doesn't match (for demo purposes)
  const studentProfile = user?.role === 'student' 
    ? (MOCK_STUDENTS.find(s => s.email === user.email || s.name === user.name) || MOCK_STUDENTS[0])
    : null;

  const studentClass = studentProfile ? `${studentProfile.grade}-${studentProfile.section}` : '';

  // State for assignments with local persistence
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('edu_assignments');
    return saved ? JSON.parse(saved) : MOCK_ASSIGNMENTS;
  });

  useEffect(() => {
    localStorage.setItem('edu_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Details Modal State
  const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null);

  const initialForm = {
    title: '',
    subject: '',
    grade: '',
    dueDate: '',
    status: 'Active' as 'Pending' | 'Active' | 'Completed',
    total: 30,
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handlers
  const handleMenuClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setShowModal(true);
    setActiveMenuId(null);
  };

  const openEditModal = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      grade: assignment.grade,
      dueDate: assignment.dueDate,
      status: assignment.status,
      total: assignment.total,
      description: assignment.description || ''
    });
    setIsEditing(true);
    setCurrentId(assignment.id);
    setShowModal(true);
    setActiveMenuId(null);
  };

  const openViewModal = (assignment: Assignment) => {
    setViewAssignment(assignment);
    setActiveMenuId(null);
  };

  const handleDelete = (id: number) => {
    if(window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      toast.success('Assignment deleted');
    }
    setActiveMenuId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.title || !formData.subject || !formData.grade || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (isEditing && currentId) {
      setAssignments(prev => prev.map(a => a.id === currentId ? {
        ...a,
        ...formData,
        submissions: a.submissions // Preserve existing count
      } : a));
      toast.success('Assignment updated successfully');
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        ...formData,
        submissions: 0
      };
      setAssignments(prev => [newAssignment, ...prev]);
      toast.success('Assignment created successfully');
    }

    setIsSubmitting(false);
    setShowModal(false);
  };

  // Filtering
  const filteredAssignments = assignments.filter(a => {
    // Role Filter: Students only see their class assignments
    if (user?.role === 'student') {
      if (a.grade !== studentClass) return false;
    }

    // Standard Filters
    const matchesFilter = filter === 'All' || a.status === filter;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.role === 'student' 
              ? `Homework for Class ${studentClass}` 
              : 'Manage homework and submissions'}
          </p>
        </div>
        {user?.role === 'teacher' && (
          <button 
            onClick={openCreateModal}
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={18} />
            Create Assignment
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search assignments..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white transition-colors" 
            />
        </div>
        <div className="flex gap-2 flex-wrap">
            {['All', 'Active', 'Completed', 'Pending'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assign) => (
              <div key={assign.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-6 flex flex-col relative">
                  <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                          <FileText size={24} />
                      </div>
                      
                      {user?.role === 'teacher' && (
                          <div className="relative">
                              <button 
                                  onClick={(e) => handleMenuClick(e, assign.id)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                  <MoreVertical size={20} />
                              </button>
                              
                              {activeMenuId === assign.id && (
                                  <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); openViewModal(assign); }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                                      >
                                          <Eye size={16} /> View Details
                                      </button>
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); openEditModal(assign); }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                                      >
                                          <Edit2 size={16} /> Edit Details
                                      </button>
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); handleDelete(assign.id); }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                      >
                                          <Trash2 size={16} /> Delete Assignment
                                      </button>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{assign.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{assign.subject} • {assign.grade}</p>
                  
                  <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar size={16} /> Due: {assign.dueDate}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              assign.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
                              assign.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                              'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                          }`}>
                              {assign.status}
                          </span>
                      </div>
                      {user?.role === 'teacher' && (
                          <div>
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Submissions</span>
                                  <span>{assign.submissions}/{assign.total}</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: `${(assign.submissions / assign.total) * 100}%` }}></div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          ))
        ) : (
             <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
                    <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No assignments found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {user?.role === 'student' 
                      ? `No pending work for Class ${studentClass}.` 
                      : 'Try adjusting your search or filters.'}
                </p>
             </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{isEditing ? 'Edit Assignment' : 'Create Assignment'}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Set details for student coursework</p>
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
              <form id="assignmentForm" onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                    <input 
                        type="text"
                        name="title"
                        required
                        placeholder="e.g. Physics Lab Report"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                        value={formData.title}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                        <input 
                            type="text"
                            name="subject"
                            required
                            placeholder="e.g. Physics"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                            value={formData.subject}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Grade/Class</label>
                        <div className="relative">
                          <select 
                            name="grade"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                            value={formData.grade}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          >
                            <option value="">Select Class</option>
                            {MOCK_CLASSES.map(c => (
                              <option key={c.id} value={`${c.grade}-${c.section}`}>{c.grade}-{c.section}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                        <div className="relative">
                            <input 
                                type="date"
                                name="dueDate"
                                required
                                className="w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                        <select 
                            name="status"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea 
                    name="description"
                    rows={4}
                    placeholder="Enter assignment instructions, requirements, etc."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
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
                form="assignmentForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 font-medium transform active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save size={18} /> {isEditing ? 'Update Assignment' : 'Create Assignment'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Assignment Details Modal */}
      {viewAssignment && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-800 shrink-0">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{viewAssignment.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                             viewAssignment.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400' : 
                             viewAssignment.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400' :
                             'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          {viewAssignment.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{viewAssignment.subject} • {viewAssignment.grade}</p>
                 </div>
                 <button 
                    onClick={() => setViewAssignment(null)} 
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                 >
                    <X size={20} />
                 </button>
              </div>

              <div className="overflow-y-auto p-6 custom-scrollbar space-y-6">
                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                      <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Due Date</p>
                          <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                              <Calendar size={16} className="text-brand-500" /> {viewAssignment.dueDate}
                          </p>
                      </div>
                      <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Submissions</p>
                          <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                              <CheckCircle size={16} className="text-brand-500" /> {viewAssignment.submissions} / {viewAssignment.total}
                          </p>
                      </div>
                  </div>

                  {/* Description */}
                  <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <FileText size={18} className="text-gray-400" /> Description
                      </h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {viewAssignment.description || "No description provided."}
                      </div>
                  </div>

                  {/* Attachments (Mock) */}
                  <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Paperclip size={18} className="text-gray-400" /> Attached Files
                      </h4>
                      <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                                      <FileText size={16} />
                                  </div>
                                  <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Assignment_Guidelines.pdf</p>
                                      <p className="text-xs text-gray-500">245 KB</p>
                                  </div>
                              </div>
                              <button className="text-brand-600 dark:text-brand-400 hover:underline text-xs font-medium">Download</button>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                                      <FileText size={16} />
                                  </div>
                                  <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Reference_Material.docx</p>
                                      <p className="text-xs text-gray-500">1.2 MB</p>
                                  </div>
                              </div>
                              <button className="text-brand-600 dark:text-brand-400 hover:underline text-xs font-medium">Download</button>
                          </div>
                      </div>
                  </div>

                   {/* Submission List */}
                   <div>
                      <div className="flex items-center justify-between mb-2">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User size={18} className="text-gray-400" /> Student Submissions
                         </h4>
                         <button className="text-xs text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
                            <Download size={12} /> Export All
                         </button>
                      </div>
                      <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700 flex">
                              <div className="flex-1">Student</div>
                              <div className="w-32">Status</div>
                              <div className="w-32 text-right">Action</div>
                          </div>
                          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto custom-scrollbar">
                              {MOCK_STUDENTS.filter(s => `${s.grade}-${s.section}` === viewAssignment.grade).length > 0 ? (
                                  MOCK_STUDENTS.filter(s => `${s.grade}-${s.section}` === viewAssignment.grade).map((student, index) => {
                                      // Mock statuses randomly
                                      const statuses = ['Submitted', 'Pending', 'Late'];
                                      // Deterministic mock status based on name length
                                      const status = statuses[student.name.length % 3]; 

                                      return (
                                          <div key={student.id} className="px-4 py-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                              <div className="flex-1 flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                                                      {student.name.charAt(0)}
                                                  </div>
                                                  <div>
                                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                                                      <p className="text-xs text-gray-500">{student.rollNumber}</p>
                                                  </div>
                                              </div>
                                              <div className="w-32">
                                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                      status === 'Submitted' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                                      status === 'Late' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                                                      'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                                                  }`}>
                                                      {status}
                                                  </span>
                                              </div>
                                              <div className="w-32 text-right">
                                                  <button className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50 disabled:no-underline" disabled={status === 'Pending'}>
                                                      View Work
                                                  </button>
                                              </div>
                                          </div>
                                      );
                                  })
                              ) : (
                                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                      No students found in this class.
                                  </div>
                              )}
                          </div>
                      </div>
                   </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0 flex justify-end">
                  <button 
                      onClick={() => setViewAssignment(null)}
                      className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                      Close
                  </button>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Assignments;