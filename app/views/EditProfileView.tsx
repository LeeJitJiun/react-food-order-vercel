'use client';

import React, { useState } from 'react';
import { 
    X, 
    User, 
    MapPin, 
    Mail, 
    Upload, 
    CheckCircle2, 
    Sparkles,
    KeyRound,
    Eye,
    EyeOff
} from 'lucide-react';

const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '', color: '', width: '0%' };
  
  let strength = 0;
  if (password.length >= 1) strength++; // Weak for any input
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const levels = [
    { strength: 0, label: '', color: '', width: '0%' },
    { strength: 1, label: 'Weak', color: 'bg-red-500', width: '20%' },
    { strength: 2, label: 'Fair', color: 'bg-orange-500', width: '40%' },
    { strength: 3, label: 'Good', color: 'bg-yellow-500', width: '60%' },
    { strength: 4, label: 'Strong', color: 'bg-emerald-500', width: '80%' },
    { strength: 5, label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
    { strength: 6, label: 'Excellent', color: 'bg-emerald-700', width: '100%' },
  ];
  
  return levels[Math.min(strength, 6)];
};

interface User {
    userId: string;
    username: string;
    email: string;
    role: string;
    avatar?: string | null;
    password?: string;
}

interface EditProfileViewProps {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: Partial<User>) => void;
}

export function EditProfileView({ user, onClose, onSave }: EditProfileViewProps) {
    const [avatar, setAvatar] = useState<string | null>(user.avatar || null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const passwordStrength = getPasswordStrength(password);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Store the file for upload
            setUploadedFile(file);
            
            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let photoUrl = avatar;

            // Upload file if a new one was selected
            if (uploadedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', uploadedFile);
                uploadFormData.append('userId', user.userId);

                const uploadResponse = await fetch('/api/upload/avatar', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    const error = await uploadResponse.json();
                    throw new Error(error.error || 'Failed to upload image');
                }

                const uploadData = await uploadResponse.json();
                photoUrl = uploadData.photoUrl;
            }

            // Get form values
            const form = e.target as HTMLFormElement;
            
            // Validate password if provided
            if (password && password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            if (password && password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            
            const updatedUser = {
                username: (form.elements.namedItem('name') as HTMLInputElement).value,
                email: (form.elements.namedItem('email') as HTMLInputElement).value,
                avatar: photoUrl,
                ...(password && { password }) // Only include password if it's being changed
            };

            onSave(updatedUser);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-[#3e3a36]/40 dark:bg-black/80 backdrop-blur-md transition-opacity" 
                onClick={onClose} 
            />
            
            {/* Split Card Container */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-[#2d2a27] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-white/20 dark:border-white/5">
                
                {/* Left Side: Visual Identity (Dark Theme) */}
                <div className="md:w-5/12 bg-[#2d2a27] dark:bg-black/30 relative flex flex-col items-center justify-center p-10 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#1a1816]/90"></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-6 left-6 opacity-30">
                        <Sparkles size={24} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center w-full">
                        {/* Avatar Uploader with "Grow" Effect */}
                        <label className="group relative cursor-pointer mb-8">
                            {/* Outer Rings */}
                            <div className="absolute inset-0 rounded-full border border-white/10 scale-125 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 scale-110 group-hover:rotate-180 transition-transform duration-[10s] ease-linear"></div>
                            
                            <div className="w-40 h-40 rounded-[2.5rem] bg-[#3e3a36] border-4 border-[#c8a47e] shadow-2xl overflow-hidden relative group-hover:shadow-[#c8a47e]/20 transition-all">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                                )}
                                
                                {/* Glass Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <Upload className="text-white" size={28} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Update</span>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                            />
                        </label>

                        <div className="text-center space-y-1">
                            <div className="px-3 py-1 bg-[#c8a47e]/20 text-[#c8a47e] text-[10px] font-black uppercase tracking-widest rounded-full inline-block mb-3 border border-[#c8a47e]/20">
                                {user.role} Tier
                            </div>
                            <h3 className="text-2xl font-black italic">{user.username}</h3>
                            <p className="text-white/40 text-xs font-medium">Member since 2026</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Data (Clean Theme) */}
                <div className="md:w-7/12 p-8 md:p-12 relative flex flex-col">
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-gray-400 dark:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black italic dark:text-white mb-2">Cultivate Identity</h2>
                        <p className="text-gray-400 text-sm">Update your personal details within the sanctuary records.</p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="flex-1 flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                                <input 
                                    name="name" 
                                    defaultValue={user.username} 
                                    className="w-full bg-gray-50 dark:bg-black/20 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-[#c8a47e]/20 dark:text-white font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Digital Frequency (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                                <input 
                                    name="email" 
                                    defaultValue={user.email} 
                                    className="w-full bg-gray-50 dark:bg-black/20 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-[#c8a47e]/20 dark:text-white font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5" 
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-white/5 pt-6">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Change Password (Optional)</p>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                                    <div className="relative group">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full bg-gray-50 dark:bg-black/20 rounded-2xl pl-12 pr-12 py-4 outline-none focus:ring-2 focus:ring-[#c8a47e]/20 dark:text-white font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a47e] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: passwordStrength.width }}
                                                />
                                            </div>
                                            {passwordStrength.label && (
                                                <p className="text-xs font-bold text-gray-400">
                                                    Strength: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full bg-gray-50 dark:bg-black/20 rounded-2xl pl-12 pr-12 py-4 outline-none focus:ring-2 focus:ring-[#c8a47e]/20 dark:text-white font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a47e] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isUploading}
                                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-4 rounded-full font-bold text-lg hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-[#3e3a36]/10 dark:shadow-none flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" /> Save Records
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
