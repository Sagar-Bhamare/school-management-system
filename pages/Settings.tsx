import React, { useState, useRef } from 'react';
import { Bell, Lock, User, Globe, Moon, Shield, Key, Smartphone, Mail, Sun, Eye, EyeOff, Upload, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // State for password form
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Mock API call simulation
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Updating password...',
        success: () => {
          setPasswords({ current: '', new: '', confirm: '' });
          return 'Password updated successfully';
        },
        error: 'Failed to update password',
      }
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile information updated successfully');
  };

  // Photo Upload Handler
  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (e.g., limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ avatar: base64String });
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (user?.avatar) {
      if(window.confirm('Are you sure you want to remove your profile photo?')) {
        updateUser({ avatar: '' }); // Clear avatar
        toast.success('Profile photo removed');
      }
    }
  };

  const menuItems = [
    { id: 'profile', label: 'General Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all sticky top-24">
                <nav className="flex flex-col p-2 gap-1">
                    {menuItems.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === item.id 
                                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <User size={20} className="text-brand-500" /> Profile Information
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-sm overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name.charAt(0)
                                )}
                            </div>
                             <div 
                                onClick={handlePhotoUploadClick}
                                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                             >
                                <Camera className="text-white" size={20} />
                             </div>
                             {/* Hidden File Input */}
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                             />
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 capitalize">{user?.role}</p>
                             <div className="flex gap-2 justify-center sm:justify-start">
                                <button 
                                    type="button"
                                    onClick={handlePhotoUploadClick}
                                    className="px-3 py-1.5 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg border border-brand-100 dark:border-brand-900/30 hover:bg-brand-100 transition-colors flex items-center gap-1"
                                >
                                    <Upload size={12} /> Update Photo
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                <input type="text" defaultValue={user?.name} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                                <input type="email" defaultValue={user?.email} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                                <input type="text" defaultValue={user?.role} disabled className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg px-3 py-2.5 capitalize cursor-not-allowed" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                            <textarea rows={3} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors resize-none" placeholder="Tell us a little about yourself..."></textarea>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <Shield size={20} className="text-brand-500" /> Security Settings
                    </h3>

                    <div className="space-y-8">
                        {/* Password Change */}
                        <div>
                             <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Key size={18} className="text-gray-400" /> Change Password
                             </h4>
                             <div className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="current"
                                            value={passwords.current}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password" 
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors pr-10" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            name="new"
                                            value={passwords.new}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password" 
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors pr-10" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        name="confirm"
                                        value={passwords.confirm}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors" 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleUpdatePassword} 
                                    className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Update Password
                                </button>
                             </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Smartphone size={18} className="text-gray-400" /> Two-Factor Authentication
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <Bell size={20} className="text-brand-500" /> Notification Preferences
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about new assignments, exams, and announcements.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive real-time alerts on your dashboard.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                        </div>

                         <div className="flex items-center justify-between py-2">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                    <Smartphone size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">SMS Alerts</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Get important alerts via text message for urgent updates.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                         <button type="button" onClick={() => toast.success('Notification preferences saved')} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
                            Save Preferences
                        </button>
                    </div>
                </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <Moon size={20} className="text-brand-500" /> Appearance Settings
                    </h3>

                    <div className="space-y-6">
                         <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Theme Preference</h4>
                            <div className="grid grid-cols-3 gap-4 max-w-lg">
                                <button 
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                        theme === 'light' 
                                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <Sun size={24} />
                                    <span className="text-sm font-medium">Light</span>
                                </button>
                                <button 
                                    onClick={() => theme === 'light' && toggleTheme()}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                        theme === 'dark' 
                                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <Moon size={24} />
                                    <span className="text-sm font-medium">Dark</span>
                                </button>
                                <button className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 transition-all opacity-60 cursor-not-allowed">
                                    <Globe size={24} />
                                    <span className="text-sm font-medium">System</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Language</h4>
                            <select className="w-full max-w-xs border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-200 dark:bg-gray-700 dark:text-white outline-none transition-colors cursor-pointer">
                                <option>English (United States)</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Chinese</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Settings;