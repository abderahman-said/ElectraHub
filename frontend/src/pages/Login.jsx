import React, { useState } from 'react';
import {   ArrowLeft, Mail, Lock,   } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
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
            console.log('Login form data:', data);
            const result = await login(data);
            console.log('Login result:', result);
            
            if (result.success) {
                toast.success('Login successful!');
                console.log('Navigating to dashboard...');
                // Token is already stored in useAuth hook, no need to set manually
                navigate('/dashboard');
            } else {
                console.error('Login failed:', result.error);
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center py-20 px-4" dir="rtl">
            <div className="max-w-xl w-full glass rounded-[3rem] shadow-premium border border-white/50 overflow-hidden relative group">
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-yellow-400/10 rounded-full blur-3xl" />

                <div className="p-10 sm:p-14 relative z-10">
                    <div className="text-center mb-12">
                        <img src="/logo.png" alt="" className=' rounded-xl w-auto h-auto max-w-[180px] mx-auto' />
                        <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-4 leading-tight">
                            مرحباً بك <br />
                            <span className="text-gradient">مرة أخرى</span>
                        </h2>
                        <p className="text-slate-500 font-medium">
                            سجل الدخول لإدارة منتجاتك وعروضك.
                        </p>
                    </div>

                    <form className="space-y-8 animate-slideInUp" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2">اسم المستخدم أو البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        {...register('username', { required: 'Username is required' })}
                                        type="text"
                                        className="w-full px-6 py-4 pr-14 rounded-2xl  border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="اسم المستخدم أو البريد الإلكتروني"
                                    />
                                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={20} />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                                )}
                            </div>
                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        {...register('password', { required: 'Password is required' })}
                                        type="password"
                                        className="w-full px-6 py-4 pr-14 rounded-2xl border   border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={20} />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-5 px-4 bg-blue-700 text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 flex items-center gap-3 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
                            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-500" />
                        </button>

                        <div className="text-center">
                            <p className="text-slate-500 text-sm font-bold">
                                ليس لديك حساب؟{' '}
                                <Link to="/register" className="text-blue-700 hover:text-blue-800 transition-colors">
                                    سجل كمستورد الآن
                                </Link>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                بيانات الافتراضية: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin / admin123</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
