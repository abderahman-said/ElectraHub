import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Mail, Lock, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = login(formData.email, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center py-20 px-4" dir="rtl">
            <div className="max-w-xl w-full glass rounded-[3rem] shadow-premium border border-white/50 overflow-hidden relative group">
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-yellow-400/10 rounded-full blur-3xl" />

                <div className="p-10 sm:p-14 relative z-10">
                    <div className="text-center mb-12">
                        <img src="/logo.png" alt="" className='w-auto h-auto max-w-[180px] mx-auto' />
                        <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-4 leading-tight">
                            مرحباً بك <br />
                            <span className="text-gradient">مرة أخرى</span>
                        </h2>
                        <p className="text-slate-500 font-medium">
                            سجل الدخول لإدارة منتجاتك وعروضك.
                        </p>
                    </div>

                    <form className="space-y-8 animate-slideInUp" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 pr-14 rounded-2xl  border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="البريد@الموقع.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={20} />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-6 py-4 pr-14 rounded-2xl border   border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={20} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-5 px-4 bg-blue-700 text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 flex items-center gap-3 overflow-hidden group"
                        >
                            <span>تسجيل الدخول</span>
                            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-500" />
                        </button>

                        <div className="text-center">
                            <p className="text-slate-500 text-sm font-bold">
                                ليس لديك حساب؟{' '}
                                <Link to="/register" className="text-blue-700 hover:text-blue-800 transition-colors">
                                    سجل كمستورد الآن
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
