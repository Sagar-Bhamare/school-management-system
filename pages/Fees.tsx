import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X, 
  Loader2, 
  ArrowUpDown, 
  ChevronDown, 
  Calendar, 
  Clock,
  Filter,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_FEES, MOCK_STUDENTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Fee } from '../types';

// --- STUDENT VIEW COMPONENT ---
const StudentFees = () => {
  const { user } = useAuth();
  
  // Mock filtering: Show fees for "Alice Johnson" (mock user) or fees that match current user's name
  const myFees = MOCK_FEES.filter(f => f.studentName === 'Alice Johnson' || f.studentName === user?.name);
  
  const totalOutstanding = myFees.filter(f => f.status !== 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
  const lastPayment = myFees.find(f => f.status === 'Paid');
  const nextDue = myFees.find(f => f.status !== 'Paid');

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Fees</h1>
            <p className="text-gray-500 dark:text-gray-400">View your invoices and payment history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-brand-100 text-sm font-medium">Total Outstanding</p>
                    <h3 className="text-3xl font-bold mt-2">${totalOutstanding.toLocaleString()}</h3>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-500 p-3 rounded-full opacity-50">
                    <DollarSign size={32} className="text-white" />
                  </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Next Due Date</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{nextDue ? nextDue.dueDate : 'No dues'}</h3>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full text-orange-600 dark:text-orange-400">
                    <Calendar size={24} />
                  </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Last Payment</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{lastPayment ? `$${lastPayment.amount}` : '$0'}</h3>
                  </div>
                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full text-green-600 dark:text-green-400">
                    <CheckCircle size={24} />
                  </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                <h3 className="font-bold text-gray-900 dark:text-white">Invoice History</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {myFees.length > 0 ? (
                    myFees.map(fee => (
                        <div key={fee.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg shrink-0 ${
                                    fee.status === 'Paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                                    fee.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                }`}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{fee.type}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span>Due: {fee.dueDate}</span>
                                        {fee.description && <span className="hidden sm:inline">• {fee.description}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:block sm:text-right">
                                <p className="font-bold text-gray-900 dark:text-white">${fee.amount}</p>
                                <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${
                                    fee.status === 'Paid' ? 'text-green-600 dark:text-green-400' :
                                    fee.status === 'Overdue' ? 'text-red-600 dark:text-red-400' :
                                    'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                    {fee.status === 'Paid' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                    {fee.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">No fee records found.</div>
                )}
            </div>
        </div>
    </div>
  );
};

// --- ADMIN VIEW COMPONENT ---
const FeeManagement = () => {
  // State
  const [fees, setFees] = useState<Fee[]>(() => {
    const saved = localStorage.getItem('edu_fees');
    return saved ? JSON.parse(saved) : MOCK_FEES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialForm = {
    studentId: '',
    type: 'Tuition',
    amount: '',
    dueDate: '',
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Persist
  useEffect(() => {
    localStorage.setItem('edu_fees', JSON.stringify(fees));
  }, [fees]);

  // Stats
  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = fees.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const overdueCount = fees.filter(f => f.status === 'Overdue').length;
  const totalRecords = fees.length;

  // Filter & Sort
  const filteredFees = fees
    .filter(fee => {
      const matchesSearch = 
        fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        fee.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || fee.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount || !formData.dueDate) {
      toast.error('Please fill required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const student = MOCK_STUDENTS.find(s => s.id === formData.studentId);
    
    const newFee: Fee = {
      id: `fee-${Date.now()}`,
      studentId: formData.studentId,
      studentName: student ? student.name : 'Unknown Student',
      type: formData.type,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      status: 'Pending',
      description: formData.description
    };

    setFees(prev => [newFee, ...prev]);
    toast.success('Fee record added successfully');
    
    setIsSubmitting(false);
    setShowModal(false);
    setFormData(initialForm);
  };

  const handleRecordPayment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click events if any
    if(window.confirm('Are you sure you want to mark this fee as PAID?')) {
        setFees(prev => prev.map(f => f.id === id ? { 
            ...f, 
            status: 'Paid', 
            datePaid: new Date().toISOString().split('T')[0] 
        } : f));
        toast.success('Payment recorded successfully');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage student fee payments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          Add Fee Record
        </button>
      </div>

      {/* Stats Cards - Redesigned for visibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-green-200 dark:hover:border-green-900 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${totalCollected.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-amber-200 dark:hover:border-amber-900 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Amount</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${pendingAmount.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>

        {/* Overdue Records */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-red-200 dark:hover:border-red-900 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Records</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{overdueCount}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Total Records */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-900 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalRecords}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center gap-4 justify-between bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student or type..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white transition-all"
                    />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none cursor-pointer"
                    >
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="amount">Sort by Amount</option>
                    </select>
                </div>
            </div>
            
            <div className="hidden lg:block text-sm text-gray-500 dark:text-gray-400 font-medium">
                Showing {filteredFees.length} records
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-gray-50/80 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Student Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Fee Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                          {fee.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{fee.studentName}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                     <div className="flex flex-col">
                       <span className="font-medium text-gray-900 dark:text-white">{fee.type}</span>
                       {fee.description && <span className="text-xs text-gray-400 truncate max-w-[200px]">{fee.description}</span>}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                     ${fee.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                     <div className="flex items-center gap-2">
                       <Calendar size={14} />
                       {fee.dueDate}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                      fee.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                      fee.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                      'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                    }`}>
                      {fee.status === 'Paid' && <CheckCircle size={12} />}
                      {fee.status === 'Overdue' && <AlertCircle size={12} />}
                      {fee.status === 'Pending' && <Clock size={12} />}
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fee.status !== 'Paid' ? (
                        <button 
                            onClick={(e) => handleRecordPayment(e, fee.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors transform active:scale-95"
                        >
                            <DollarSign size={12} />
                            Record Payment
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 italic flex items-center justify-end gap-1">
                           Paid on {fee.datePaid || 'date unknown'}
                        </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredFees.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={24} className="text-gray-300" />
                          <p>No fee records found.</p>
                        </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Showing 1-{Math.min(10, filteredFees.length)} of {filteredFees.length}
            </p>
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors" disabled>
                  Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Next
              </button>
            </div>
        </div>
      </div>

      {/* Add Fee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Fee Record</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create a new fee invoice for a student</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="feeForm" onSubmit={handleAddFee} className="space-y-5">
                
                {/* Student Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Student</label>
                    <div className="relative">
                        <select 
                            name="studentId"
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select Student</option>
                            {MOCK_STUDENTS.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.grade}-{s.section})</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Fee Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Fee Type</label>
                        <div className="relative">
                            <select 
                                name="type"
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all appearance-none"
                                value={formData.type}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="Tuition">Tuition Fee</option>
                                <option value="Transport">Transport Fee</option>
                                <option value="Library">Library Fee</option>
                                <option value="Exam">Exam Fee</option>
                                <option value="Activity">Activity Fee</option>
                                <option value="Uniform">Uniform Fee</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
                        <div className="relative">
                            <input 
                                type="number"
                                name="amount"
                                required
                                min="0"
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                                value={formData.amount}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</div>
                        </div>
                    </div>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                    <div className="relative">
                         <input 
                            type="date"
                            name="dueDate"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description (Optional)</label>
                    <textarea 
                        name="description"
                        rows={3}
                        placeholder="e.g. Fall Semester Tuition Fee 2024"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-white outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>
                
              </form>
            </div>

            {/* Modal Footer */}
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
                form="feeForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 font-medium transform active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add Record
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
const Fees = () => {
  const { user } = useAuth();

  if (user?.role === 'student') {
      return <StudentFees />;
  }

  // Admin View
  return <FeeManagement />;
};

export default Fees;