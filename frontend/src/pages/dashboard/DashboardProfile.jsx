import React, { useState } from 'react';
import { Save, ChevronDown, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const DashboardProfile = () => {
    const { user, updateProfile, uploadLogo, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        company_name: user?.company_name || '',
        whatsapp: user?.whatsapp || '',
        contact_email: user?.contact_email || '',
        category: user?.category || 'AC',
        description: user?.description || '',
        website: user?.website || '',
        theme_color: user?.theme_color || '#1d4ed8',
        logo_url: user?.logo_url || '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleLogoFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const logoUrl = await uploadLogo(file);
        setIsUploading(false);

        if (logoUrl) {
            setProfileData(prev => ({ ...prev, logo_url: logoUrl }));
            toast.success('تم رفع الشعار بنجاح');
        }
    };

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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateProfile(profileData);
        setLoading(false);
        
        if (result.success) {
            toast.success('تم تحديث الملف الشخصي بنجاح!');
        } else {
            toast.error(result.error || 'فشل تحديث الملف الشخصي');
        }
    };

    return (
        <div className="max-w-4xl glass rounded-[2.5rem] p-10 shadow-premium">
            <h3 className="text-2xl font-black text-blue-950 mb-8 tracking-tight border-b border-blue-100 pb-4">تعديل الملف الشخصي والمعلومات التجارية</h3>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="group md:col-span-2">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">الاسم الكامل</label>
                    <input
                        type="text"
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    />
                </div>

                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">اسم الشركة / المتجر</label>
                    <input
                        type="text"
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.company_name}
                        onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                    />
                </div>

                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">واتساب</label>
                    <input
                        type="tel"
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.whatsapp}
                        onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    />
                </div>

                <div className="group relative">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">التخصص الأساسي</label>
                    <select
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right appearance-none"
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
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">البريد الإلكتروني التجاري</label>
                    <input
                        type="email"
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                        value={profileData.contact_email}
                        onChange={(e) => setProfileData({ ...profileData, contact_email: e.target.value })}
                    />
                </div>

                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">الموقع الإلكتروني</label>
                    <input
                        type="url"
                        className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                        placeholder="https://example.com"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                </div>

                <div className="group">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">لون السمة (Theme Color)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            className="h-14 w-24 rounded-xl border-none cursor-pointer bg-transparent"
                            value={profileData.theme_color}
                            onChange={(e) => setProfileData({ ...profileData, theme_color: e.target.value })}
                        />
                        <input
                            type="text"
                            className="flex-grow px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white outline-none font-mono font-bold text-blue-950 text-center uppercase"
                            value={profileData.theme_color}
                            onChange={(e) => setProfileData({ ...profileData, theme_color: e.target.value })}
                        />
                    </div>
                </div>

                <div className="group md:col-span-2">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">نبذة عن الشركة / المتجر</label>
                    <textarea
                        className="w-full px-6 py-4 rounded-[2rem] border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right h-32 resize-none"
                        value={profileData.description}
                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    />
                </div>

                <div className="group md:col-span-2">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">شعار الموقع (Logo)</label>
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/50 p-6 rounded-[2rem] border border-blue-100 border-dashed">
                        {profileData.logo_url ? (
                            <div className="relative group/logo">
                                <img 
                                    src={profileData.logo_url} 
                                    alt="Logo Preview" 
                                    className="h-24 w-24 object-contain rounded-2xl bg-white p-2 shadow-sm border border-blue-50"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setProfileData({ ...profileData, logo_url: '' })}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="h-24 w-24 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-200 border-2 border-dashed border-blue-100">
                                <ImageIcon size={40} />
                            </div>
                        )}
                        
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <label className="cursor-pointer group/upload">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleLogoFileChange}
                                    disabled={isUploading}
                                />
                                <div className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0">
                                    {isUploading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Upload size={20} />
                                    )}
                                    <span>{isUploading ? 'جاري الرفع...' : 'رفع شعار جديد'}</span>
                                </div>
                            </label>
                            <p className="text-xs text-blue-900/40 font-bold mt-3">PNG, JPG, WebP (بحد أقصى 5MB)</p>
                        </div>
                    </div>
                </div>

                <div className="group md:col-span-2 border-t border-blue-50 pt-8">
                    <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">تغيير كلمة المرور (اختياري)</label>
                    <input
                        type="password"
                        className="w-full px-6 py-4 rounded-2xl border border-red-50 bg-white/50 focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-blue-950 text-right"
                        placeholder="اتركه فارغاً إذا كنت لا تريد تغييره"
                        value={profileData.password}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-white shadow-2xl transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
                        style={{ backgroundColor: profileData.theme_color }}
                    >
                        {loading ? (
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={24} />
                                <span>حفظ كافة التغييرات</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DashboardProfile;
