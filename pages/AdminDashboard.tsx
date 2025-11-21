import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, GraduationCap, School, Activity, ClipboardCheck, 
  UserPlus, FileBarChart, ArrowRight, TrendingUp, TrendingDown, 
  MoreHorizontal, FileText, Download 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { MOCK_STUDENTS, MOCK_TEACHERS, ATTENDANCE_DATA, GRADE_DISTRIBUTION, MOCK_CLASSES } from '../constants';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState<'today' | '30days'>('today');
  const [showChartMenu, setShowChartMenu] = useState(false);

  const chartData = timeRange === 'today' 
    ? ATTENDANCE_DATA 
    : [
        { name: 'Week 1', rate: 85 },
        { name: 'Week 2', rate: 88 },
        { name: 'Week 3', rate: 92 },
        { name: 'Week 4', rate: 90 },
        { name: 'Week 5', rate: 94 },
      ];

  const stats = [
    {
      title: 'Total Students',
      value: MOCK_STUDENTS.length,
      trend: '+12%',
      isPositive: true,
      icon: Users,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-900/20',
    },
    {
      title: 'Total Teachers',
      value: MOCK_TEACHERS.length,
      trend: '+4%',
      isPositive: true,
      icon: GraduationCap,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Classes',
      value: MOCK_CLASSES.length,
      trend: '0%',
      isPositive: true,
      icon: School,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Avg Attendance',
      value: '92%',
      trend: '+3%',
      isPositive: true,
      icon: Activity,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  const quickLinks = [
    {
      title: 'Mark Attendance',
      subtitle: 'Log daily class attendance',
      icon: ClipboardCheck,
      color: 'bg-emerald-500',
      path: '/attendance'
    },
    {
      title: 'Add New Student',
      subtitle: 'Register a new enrollment',
      icon: UserPlus,
      color: 'bg-blue-500',
      path: '/students?action=add'
    },
    {
      title: 'Generate Reports',
      subtitle: 'View performance analytics',
      icon: FileBarChart,
      color: 'bg-indigo-500',
      path: '/exams'
    }
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of school performance and activities.</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
           <button 
             onClick={() => setTimeRange('30days')}
             className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
               timeRange === '30days' 
                 ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 shadow-sm' 
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
             }`}
           >
             Last 30 Days
           </button>
           <button 
             onClick={() => setTimeRange('today')}
             className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
               timeRange === 'today' 
                 ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 shadow-sm' 
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
             }`}
           >
             Today
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-brand-100 dark:hover:border-gray-600 transition-all duration-200 group h-24 flex items-center">
            <div className="flex items-center gap-4 w-full overflow-hidden">
              <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mt-0.5 truncate">{stat.value}</h3>
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                stat.isPositive 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Trends</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overview for {timeRange === 'today' ? 'current week' : 'past month'}</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowChartMenu(!showChartMenu)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreHorizontal size={20} />
              </button>
              {showChartMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><FileText size={16} /> View Full Report</button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Download size={16} /> Download CSV</button>
                </div>
              )}
              {showChartMenu && <div className="fixed inset-0 z-0" onClick={() => setShowChartMenu(false)}></div>}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008C7E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#008C7E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#F3F4F6"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12}} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#fff', borderColor: isDark ? '#374151' : '#E5E7EB', borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '12px' }} />
                <Area type="monotone" dataKey="rate" stroke="#008C7E" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Student grade distribution</p>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GRADE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke={isDark ? '#1F2937' : '#fff'} strokeWidth={2}>
                  {GRADE_DISTRIBUTION.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#fff', borderColor: isDark ? '#374151' : '#E5E7EB', borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">B+</span>
              <p className="text-sm text-gray-500">Avg</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <button key={index} onClick={() => navigate(link.path)} className="h-full group relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-300 text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-700/20 dark:to-transparent rounded-bl-[100%] opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${link.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  <link.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed truncate">{link.subtitle}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={18} className="text-brand-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
