import React, { useState } from 'react';
import { Save, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardProfile = () => {
    const { user, updateProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        companyName: user?.companyName || '',
        whatsapp: user?.whatsapp || '',
        contactEmail: user?.contactEmail || '',
        category: user?.category || 'AC',
        password: user?.password || ''
    });

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh" dir="rtl">
                <div className="glass p-10 rounded-[2rem] text-center space-y-6">
                    <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">يرجى تسجيل الدخول أولاً</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200"
                    >
                        الذهاب لصفحة الدخول
                    </button>
                </div>
            </div>
        );
    }

    const categories = [
        { id: 'AC', name: 'تكييفات' },
        { id: 'FR', name: 'ثلاجات' },
        { id: 'TV', name: 'شاشات سمارت' },
        { id: 'WA', name: 'غسالات' },
        { id: 'SA', name: 'أجهزة صغيرة' }
    ];

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateProfile(profileData);
        alert('تم تحديث الملف الشخصي بنجاح!');
    };

    return (
        <div className="max-w-2xl glass rounded-[2.5rem] p-10 shadow-premium">
            <h3 className="text-xl font-black text-blue-950 mb-8 tracking-tight">تعديل الملف الشخصي</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2 text-right">اسم الشركة</label>
                    <input
                        type="text"
                        className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    />
                </div>
                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2 text-right">واتساب</label>
                    <input
                        type="tel"
                        className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.whatsapp}
                        onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    />
                </div>
                <div className="group relative">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2 text-right">التخصص الأساسي</label>
                    <select
                        className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-950 text-right appearance-none"
                        value={profileData.category}
                        onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
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
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2 text-right">البريد الإلكتروني للارتباط</label>
                    <input
                        type="email"
                        className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.contactEmail}
                        onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    />
                </div>
                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 ml-2 text-right">كلمة المرور الجديدة</label>
                    <input
                        type="password"
                        className="w-full px-6 py-4 rounded-2xl border border-[#17255421] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.password}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-3"
                >
                    <Save size={20} />
                    حفظ التغييرات
                </button>
            </form>
        </div>
    );
};

export default DashboardProfile;
