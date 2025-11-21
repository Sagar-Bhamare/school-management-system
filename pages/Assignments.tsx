import React, { useState } from 'react';
import { Plus, FileText, Calendar, CheckCircle, Clock, MoreVertical, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ASSIGNMENTS } from '../constants';

const Assignments = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage homework and submissions</p>
        </div>
        {user?.role === 'teacher' && (
          <button className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors">
            <Plus size={18} />
            Create Assignment
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search assignments..." className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
            {['All', 'Active', 'Completed'].map(f => (
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
        {MOCK_ASSIGNMENTS.map((assign) => (
            <div key={assign.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                        <FileText size={24} />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{assign.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{assign.subject} • {assign.grade}</p>
                
                <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={16} /> Due: {assign.dueDate}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                            assign.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
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
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${(assign.submissions / assign.total) * 100}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;