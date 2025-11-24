
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Save, Download, Filter, AlertTriangle, FileBadge, TrendingUp, CheckCircle, XCircle, FileSpreadsheet, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_STUDENTS, MOCK_SUBJECTS, MOCK_TEACHERS } from '../constants';
import { useAuth } from '../context/AuthContext';

// Local interface for Exam Result
interface ExamResult {
  id: string;
  studentName: string;
  subject: string;
  examType: string;
  teacher: string;
  score: number;
  term: string;
  status: 'Passed' | 'Failed';
}

// --- STUDENT VIEW COMPONENT ---
const MyResults = () => {
  const { user } = useAuth();
  
  // Mock data for the specific student
  const [exams] = useState<ExamResult[]>([
    { id: '6', studentName: 'John Student', subject: 'Mathematics', examType: 'Mid-Term', teacher: 'Mr. Robert Anderson', score: 76, term: 'Term 1', status: 'Passed' },
    { id: '7', studentName: 'John Student', subject: 'Physics', examType: 'Quiz', teacher: 'Ms. Sarah Davis', score: 82, term: 'Term 1', status: 'Passed' },
    { id: '8', studentName: 'John Student', subject: 'History', examType: 'Final', teacher: 'Mr. James Moore', score: 65, term: 'Term 1', status: 'Passed' },
    { id: '9', studentName: 'John Student', subject: 'Chemistry', examType: 'Mid-Term', teacher: 'Ms. Jessica Taylor', score: 88, term: 'Term 1', status: 'Passed' },
  ]);

  const myExams = exams.filter(e => e.studentName === user?.name || e.studentName === 'John Student');
  const averageScore = myExams.length > 0 ? Math.round(myExams.reduce((acc, curr) => acc + curr.score, 0) / myExams.length) : 0;
  const passedCount = myExams.filter(e => e.status === 'Passed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Results</h1>
        <p className="text-gray-500 dark:text-gray-400">View your academic performance and exam history</p>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-full text-brand-600 dark:text-brand-400">
                  <TrendingUp size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore}%</h3>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                  <FileBadge size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Exams Taken</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{myExams.length}</h3>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                  <CheckCircle size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Passed</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{passedCount}</h3>
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
              <h3 className="font-semibold text-gray-900 dark:text-white">Exam History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                      <tr>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Exam Type</th>
                          <th className="px-6 py-4">Term</th>
                          <th className="px-6 py-4">Score</th>
                          <th className="px-6 py-4">Grade</th>
                          <th className="px-6 py-4">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {myExams.length > 0 ? (
                          myExams.map((exam) => (
                              <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{exam.subject}</td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{exam.examType}</td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{exam.term}</td>
                                  <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">{exam.score}%</td>
                                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">
                                      {exam.score >= 90 ? 'A' : exam.score >= 80 ? 'B' : exam.score >= 70 ? 'C' : exam.score >= 60 ? 'D' : 'F'}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          exam.status === 'Passed'
                                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                      }`}>
                                          {exam.status === 'Passed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                          {exam.status}
                                      </span>
                                  </td>
                              </tr>
                          ))
                      ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                  No exam results found.
                              </td>
                            </tr>
                      )}
                  </tbody>
              </table>
            </div>
      </div>
    </div>
  );
};

// --- ADMIN / TEACHER VIEW COMPONENT ---
const ExamManagement = () => {
  // Initialize state with dummy data
  const [exams, setExams] = useState<ExamResult[]>([
    { id: '1', studentName: 'Alice Johnson', subject: 'Mathematics', examType: 'Mid-Term', teacher: 'Mr. Robert Anderson', score: 85, term: 'Term 1', status: 'Passed' },
    { id: '2', studentName: 'Bob Smith', subject: 'Physics', examType: 'Quiz', teacher: 'Ms. Sarah Davis', score: 42, term: 'Term 1', status: 'Failed' },
    { id: '3', studentName: 'Charlie Brown', subject: 'History', examType: 'Final', teacher: 'Mr. James Moore', score: 92, term: 'Term 1', status: 'Passed' },
    { id: '4', studentName: 'Daisy Miller', subject: 'Chemistry', examType: 'Mid-Term', teacher: 'Ms. Jessica Taylor', score: 78, term: 'Term 1', status: 'Passed' },
    { id: '5', studentName: 'Ethan Hunt', subject: 'Literature', examType: 'Quiz', teacher: 'Mrs. Emily Wilson', score: 88, term: 'Term 1', status: 'Passed' },
    { id: '6', studentName: 'Fiona Gallagher', subject: 'Mathematics', examType: 'Final', teacher: 'Mr. Robert Anderson', score: 95, term: 'Term 1', status: 'Passed' },
    { id: '7', studentName: 'Alice Johnson', subject: 'Physics', examType: 'Project', teacher: 'Ms. Sarah Davis', score: 65, term: 'Term 1', status: 'Passed' },
    { id: '8', studentName: 'Bob Smith', subject: 'Mathematics', examType: 'Mid-Term', teacher: 'Mr. Robert Anderson', score: 55, term: 'Term 1', status: 'Passed' },
  ]);

  // Main UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);

  // Filtering State
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    examType: '',
    term: '',
    status: ''
  });

  // Export State
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close Export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initialFormState = {
    studentName: '',
    subject: '',
    examType: '',
    teacher: '',
    score: '',
    term: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Combined Filtering Logic
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.examType ? exam.examType === filters.examType : true;
    const matchesTerm = filters.term ? exam.term === filters.term : true;
    const matchesStatus = filters.status ? exam.status === filters.status : true;

    return matchesSearch && matchesType && matchesTerm && matchesStatus;
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ examType: '', term: '', status: '' });
  };

  // Export Logic (CSV)
  const handleExportCSV = () => {
    if (filteredExams.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Student Name', 'Subject', 'Exam Type', 'Teacher', 'Term', 'Score', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredExams.map(row => {
        return [
          `"${row.studentName}"`,
          `"${row.subject}"`,
          `"${row.examType}"`,
          `"${row.teacher}"`,
          `"${row.term}"`,
          row.score,
          row.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exams_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
    toast.success('Exported to CSV successfully');
  };

  // CRUD Handlers
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentExamId(null);
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

  const handleEditClick = (exam: ExamResult) => {
    setFormData({
      studentName: exam.studentName,
      subject: exam.subject,
      examType: exam.examType,
      teacher: exam.teacher,
      score: exam.score.toString(),
      term: exam.term
    });
    setCurrentExamId(exam.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setExamToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (examToDelete) {
      setExams(prev => prev.filter(e => e.id !== examToDelete));
      toast.success('Exam record deleted successfully');
      setShowDeleteModal(false);
      setExamToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.subject || !formData.examType || !formData.teacher || !formData.score || !formData.term) {
      toast.error('Please fill in all required fields');
      return;
    }

    const scoreNum = Number(formData.score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Please enter a valid score between 0 and 100');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const status: 'Passed' | 'Failed' = scoreNum >= 50 ? 'Passed' : 'Failed';

    if (isEditing && currentExamId) {
      setExams(prev => prev.map(e => e.id === currentExamId ? {
        ...e,
        studentName: formData.studentName,
        subject: formData.subject,
        examType: formData.examType,
        teacher: formData.teacher,
        score: scoreNum,
        term: formData.term,
        status
      } : e));
      toast.success('Exam record updated');
    } else {
      const newExam: ExamResult = {
        id: `ex${Date.now()}`,
        studentName: formData.studentName,
        subject: formData.subject,
        examType: formData.examType,
        teacher: formData.teacher,
        score: scoreNum,
        term: formData.term,
        status
      };
      setExams(prev => [newExam, ...prev]);
      toast.success('Exam record added');
    }
    
    setIsSubmitting(false);
    handleCloseModal();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exams</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage student exam marks and results</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Exam
        </button>
      </div>

      {/* Toolbar & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/20">
          {/* Search */}
          <div className="relative w-full sm:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student, subject or exam type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white w-full transition-colors"
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                  showFilterPanel || activeFilterCount > 0
                  ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-400' 
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
             >
                <Filter size={16} /> Filter
                {activeFilterCount > 0 && <span className="bg-brand-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{activeFilterCount}</span>}
             </button>
             
             <div className="relative" ref={exportMenuRef}>
               <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
               >
                  <Download size={16} /> Export
                  <ChevronDown size={14} />
               </button>
               {showExportMenu && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={handleExportCSV}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} className="text-green-600" /> Export to CSV (Excel)
                    </button>
                    <button 
                      onClick={() => { window.print(); setShowExportMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                       <Download size={16} /> Print View
                    </button>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
             <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Exam Type</label>
                <select 
                  name="examType" 
                  value={filters.examType} 
                  onChange={handleFilterChange}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="">All Types</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Final">Final</option>
                  <option value="Project">Project</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Term</label>
                <select 
                  name="term" 
                  value={filters.term} 
                  onChange={handleFilterChange}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="">All Terms</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
             </div>
             <div className="flex items-end">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors w-full"
                >
                   Clear Filters
                </button>
             </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Exam Type</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Term</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {exam.studentName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {exam.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                      {exam.examType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                    {exam.teacher}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {exam.term}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {exam.score}%
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        exam.status === 'Passed'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {exam.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(exam)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(exam.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No exam records found matching your filters.
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Exam Result' : 'Add Exam Result'}</h3>
              <button 
                onClick={handleCloseModal} 
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="examForm" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Student */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
                  <select 
                    name="studentName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Student</option>
                    {MOCK_STUDENTS.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.grade}-{s.section})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select 
                            name="subject"
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                            value={formData.subject}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select Subject</option>
                            {MOCK_SUBJECTS.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Exam Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Type</label>
                        <select 
                            name="examType"
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                            value={formData.examType}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select Type</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Mid-Term">Mid-Term</option>
                            <option value="Final">Final</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                </div>

                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher (Examiner)</label>
                  <select 
                    name="teacher"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Teacher</option>
                    {MOCK_TEACHERS.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Term */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Term</label>
                        <select 
                            name="term"
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                            value={formData.term}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                        </select>
                    </div>
                    {/* Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Score (%)</label>
                        <input 
                            type="number" 
                            name="score"
                            required
                            min="0"
                            max="100"
                            placeholder="e.g. 85"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-colors"
                            value={formData.score}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
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
                form="examForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEditing ? 'Update Exam' : 'Save Exam'}
                  </>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Record?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this exam record? This action cannot be undone.
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
const Exams = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') {
    return <MyResults />;
  }
  
  return <ExamManagement />;
};

export default Exams;
