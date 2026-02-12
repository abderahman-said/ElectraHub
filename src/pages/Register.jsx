import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Zap, Globe, Heart, Check, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ImporterRegister = () => {
    const [step, setStep] = useState(2); // Start directly at step 2
    const [formData, setFormData] = useState({
        companyName: '',
        contactEmail: '',
        whatsapp: '',
        password: '',
        category: 'AC',
        subscription: 'basic'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const categories = [
        { id: 'AC', name: 'تكييفات' },
        { id: 'FR', name: 'ثلاجات' },
        { id: 'TV', name: 'شاشات سمارت' },
        { id: 'WA', name: 'غسالات' },
        { id: 'SA', name: 'أجهزة صغيرة' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = register(formData);
        if (result.success) {
            setStep(3); // Show success
        } else {
            setError(result.message);
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
                                                <img src="/logo.png" alt="" className='w-auto h-auto max-w-[180px] mx-auto' />

                        <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-4 leading-tight">
                            ارتقِ <br />
                            <span className="text-gradient">بتجارتك</span>
                        </h2>
                        <p className="text-slate-500 font-medium font-arabic">
                            انضم إلى شبكة ElectraHub لنخبة مستوردي الأجهزة الكهربائية.
                        </p>
                    </div>

                    {step === 1 && (
                        <div className="space-y-8 animate-slideInUp">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="p-6 glass border-blue-50/50 rounded-2xl hover:border-blue-700/30 transition-all duration-500 cursor-pointer group shadow-premium">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500 shadow-inner">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-blue-900 leading-tight">Verified Importer Status</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Access to 5000+ traders</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 glass border-yellow-50/50 rounded-2xl hover:border-yellow-400/30 transition-all duration-500 cursor-pointer group shadow-premium">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-all duration-500 shadow-inner">
                                            <Zap size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-blue-900 leading-tight">Advanced SaaS Tools</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Real-time stock & order tracking</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex justify-center py-5 px-4 bg-blue-700 text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-500 active:scale-95"
                            >
                                Begin Application
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form className="space-y-8 animate-slideInUp" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">اسم المنشأة / الشركة</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border   border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="مثال: شركة النور للإلكترونيات"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">رقم الواتساب للتواصل</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="01xxxxxxxxx"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>
                                <div className="group relative">
                                    <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">التخصص الأساسي</label>
                                    <select
                                        className="w-full px-6 py-4 rounded-2xl border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 appearance-none cursor-pointer text-right"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute left-6 top-[3.25rem] pointer-events-none text-blue-900">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="contact@company.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-3 mr-2 text-right">كلمة المرور</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border  border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-5 px-4 bg-blue-700 text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 flex items-center gap-3 overflow-hidden group"
                            >
                                <span>إرسال طلب التحقق</span>
                                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-500" />
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-10 animate-slideInUp">
                            <div className="mx-auto h-24 w-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
                                <Check size={48} strokeWidth={3} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">تم استلام طلبك!</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    سيقوم فريقنا بمراجعة بياناتك والتواصل معك عبر <span className="text-blue-700 font-bold">الواتساب</span> خلال 24 ساعة لتفعيل حسابك.
                                </p>
                            </div>
                            <Link
                                to="/dashboard"
                                className="inline-block w-full py-5 bg-blue-700 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
                            >
                                الذهاب للوحة التحكم
                            </Link>
                        </div>
                    )}
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

export default ImporterRegister;
