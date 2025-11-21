import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { School, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Role } from '../types';

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Automatically update email and password when role changes
  useEffect(() => {
    if (role === 'admin') {
        setEmail('admin@gmail.com');
    } else if (role === 'teacher') {
        setEmail('teacher@gmail.com');
    } else if (role === 'student') {
        setEmail('student@gmail.com');
    }
    // Reset password to default dummy password
    setPassword('password');
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
      toast.success(`Welcome back, ${role}!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/20 dark:border-gray-700 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30 transform rotate-3 hover:rotate-0 transition-all">
            <School size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EduTrack Pro</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back! Please sign in to continue.</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          {(['admin', 'teacher', 'student'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                role === r ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-brand-300 shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-all bg-gray-50/50 dark:bg-gray-700/50"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <span className="text-xs text-gray-400">Default: password</span>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-700 dark:text-white focus:border-brand-500 outline-none transition-all bg-gray-50/50 dark:bg-gray-700/50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-600 focus:ring-brand-500" />
              <span className="text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <a href="#" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;