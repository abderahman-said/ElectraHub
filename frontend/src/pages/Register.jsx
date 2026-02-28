import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Zap, Globe, Heart, Check, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log('Register form data:', data);
            const result = await registerUser(data);
            console.log('Register result:', result);
            
            if (result.success) {
                toast.success(result.message || 'Registration successful!');
                
                if (result.autoLogin) {
                    // Auto-login successful, go to dashboard
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    // Registration successful but login failed, go to login page
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } else {
                console.error('Register failed:', result.error);
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Register error:', error);
            toast.error('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center py-20 px-4" dir="rtl">
            <div className="max-w-xl w-full glass rounded-[3rem] shadow-premium border border-white/50 overflow-hidden relative group">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-yellow-400/10 rounded-full blur-3xl" />

                <div className="p-10 sm:p-14 relative z-10">
                    <div className="text-center mb-12">
                        <img src="/logo.png" alt="" className=' rounded-xl w-auto h-auto max-w-[180px] mx-auto' />

                        <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-4 leading-tight">
                            إنشاء حساب جديد
                        </h2>
                        <p className="text-slate-500 font-medium">
                            انضم إلى منصة بالجملة للتجار
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        {errors.username && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-right">
                                {errors.username.message}
                            </div>
                        )}
                        {errors.email && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-right">
                                {errors.email.message}
                            </div>
                        )}
                        {errors.password && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-right">
                                {errors.password.message}
                            </div>
                        )}
                        {errors.full_name && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-right">
                                {errors.full_name.message}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">اسم المستخدم</label>
                                <input
                                    type="text"
                                    {...register('username', { required: 'Username is required' })}
                                    className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-[#2650fc]/10 focus:border-brand/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="أدخل اسم المستخدم"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">الاسم الكامل</label>
                                <input
                                    type="text"
                                    {...register('full_name', { required: 'Full name is required' })}
                                    className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-[#2650fc]/10 focus:border-brand/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="أدخل اسمك الكامل"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Valid email is required' })}
                                    className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-[#2650fc]/10 focus:border-brand/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">كلمة المرور</label>
                                <input
                                    type="password"
                                    {...register('password', { 
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-[#2650fc]/10 focus:border-brand/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="•••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex justify-center py-5 px-4 bg-[#2650fc] text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed items-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>جاري التسجيل...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إنشاء حساب</span>
                                        <ArrowLeft size={20} className="-translate-x-2" />
                                    </>
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="flex justify-center py-5 px-4 border border-[#17255421] text-blue-950 text-base font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-500 items-center gap-3"
                            >
                                <span>تسجيل الدخول</span>
                                <ArrowLeft size={20} className="-translate-x-2" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Add missing icon
const ChevronDown = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export default Register;
