import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Zap, Globe, Heart, Check, Lock, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('customer'); // Default to customer
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            role: 'customer'
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const registrationData = {
                ...data,
                role: userType
            };
            console.log('Registering as:', userType, registrationData);
            const result = await registerUser(registrationData);
            
            if (result.success) {
                toast.success(result.message || 'تم التسجيل بنجاح!');
                
                if (userType === 'customer') {
                    // Customers don't have dashboard access, go home
                    setTimeout(() => navigate('/'), 2000);
                } else if (result.autoLogin) {
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('فشل عملية التسجيل');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center py-20 px-4" dir="rtl">
            <div className="max-w-2xl w-full glass rounded-[3rem] shadow-premium border border-white/50 overflow-hidden relative group">
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-yellow-400/10 rounded-full blur-3xl" />

                <div className="p-8 sm:p-12 relative z-10">
                    <div className="text-center mb-10">
                        <img src="/logo.png" alt="" className=' rounded-xl w-auto h-auto max-w-[150px] mx-auto mb-4' />
                        <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-2">
                            {userType === 'customer' ? 'إنشاء حساب مشتري' : 'إنشاء حساب تاجر'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {userType === 'customer' ? 'سجل للحصول على أفضل العروض والمنتجات' : 'ابدأ بيع منتجاتك والوصول لآلاف العملاء'}
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                        <button
                            type="button"
                            onClick={() => setUserType('customer')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === 'customer' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-blue-950'}`}
                        >
                            أنا مشتري
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('merchant')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === 'merchant' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-blue-950'}`}
                        >
                            أنا تاجر (مستورد)
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">الاسم الأول</label>
                                <input
                                    type="text"
                                    {...register('first_name', { required: 'الاسم الأول مطلوب' })}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="أدخل الاسم الأول"
                                />
                                {errors.first_name && <p className="mt-1 text-xs text-red-600 mr-2">{errors.first_name.message}</p>}
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">الاسم الأخير</label>
                                <input
                                    type="text"
                                    {...register('last_name', { required: 'الاسم الأخير مطلوب' })}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="أدخل الاسم الأخير"
                                />
                                {errors.last_name && <p className="mt-1 text-xs text-red-600 mr-2">{errors.last_name.message}</p>}
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">رقم الهاتف</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                                        className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="01xxxxxxxxx"
                                    />
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                </div>
                                {errors.phone && <p className="mt-1 text-xs text-red-600 mr-2">{errors.phone.message}</p>}
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">البريد الإلكتروني (اختياري)</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600 mr-2">{errors.email.message}</p>}
                            </div>

                            {userType === 'customer' && (
                                <>
                                    <div className="group md:col-span-2">
                                        <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">العنوان</label>
                                        <input
                                            type="text"
                                            {...register('address', { required: userType === 'customer' ? 'العنوان مطلوب' : false })}
                                            className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                            placeholder="أدخل العنوان بالتفصيل"
                                        />
                                        {errors.address && <p className="mt-1 text-xs text-red-600 mr-2">{errors.address.message}</p>}
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">المدينة</label>
                                        <input
                                            type="text"
                                            {...register('city', { required: userType === 'customer' ? 'المدينة مطلوبة' : false })}
                                            className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                            placeholder="أدخل المدينة"
                                        />
                                        {errors.city && <p className="mt-1 text-xs text-red-600 mr-2">{errors.city.message}</p>}
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">الدولة</label>
                                        <input
                                            type="text"
                                            {...register('country', { required: userType === 'customer' ? 'الدولة مطلوبة' : false })}
                                            className="w-full px-5 py-3.5 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                            placeholder="أدخل الدولة"
                                            defaultValue="مصر"
                                        />
                                        {errors.country && <p className="mt-1 text-xs text-red-600 mr-2">{errors.country.message}</p>}
                                    </div>
                                </>
                            )}

                            <div className="group md:col-span-2">
                                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider mb-2 mr-2 text-right">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        {...register('password', { 
                                            required: 'كلمة المرور مطلوبة',
                                            minLength: { value: 6, message: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' }
                                        })}
                                        className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 focus:border-blue-700/50 outline-none transition-all duration-500 font-bold text-blue-950 placeholder:text-slate-300 text-right"
                                        placeholder="•••••••••"
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-600 mr-2">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-[2] flex justify-center py-4 px-6 bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>جاري إنشاء الحساب...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{userType === 'customer' ? 'سجل الآن' : 'سجل كتاجر'}</span>
                                        <ArrowLeft size={18} className="-translate-x-1" />
                                    </>
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="flex-1 flex justify-center py-4 px-6 border border-[#17255421] text-blue-950 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all duration-500 items-center gap-2"
                            >
                                <span>لديك حساب؟</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
