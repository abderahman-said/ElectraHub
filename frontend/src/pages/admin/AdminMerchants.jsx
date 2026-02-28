import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Building, Globe, Trash2 } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminMerchants = () => {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { hasAccessLevel } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasAccessLevel || (!hasAccessLevel('admin') && !hasAccessLevel('super_admin'))) {
            toast.error('غير مصرح لك بالوصول إلى هذه الصفحة');
            navigate('/dashboard');
            return;
        }
        fetchMerchants();
    }, [hasAccessLevel, navigate]);

    const fetchMerchants = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getUsers();
            // Optional: Filter for a specific role if needed
            // For now, listing all users or assume users returned contain importers
            setMerchants(response.data || []);
        } catch (error) {
            console.error('Failed to fetch merchants:', error);
            toast.error('فشل في جلب قائمة التجار');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMerchant = async (id, name) => {
        if (!window.confirm(`هل أنت متأكد من حذف التاجر "${name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            return;
        }

        try {
            await usersAPI.deleteUser(id);
            setMerchants(merchants.filter(m => m.id !== id));
            toast.success('تم حذف التاجر بنجاح');
        } catch (error) {
            console.error('Failed to delete merchant:', error);
            toast.error(error.response?.data?.error || 'حدث خطأ أثناء حذف التاجر');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-blue-950 tracking-tight">جميع التجار والمستوردين</h3>
                    <p className="text-slate-500 font-medium">إجمالي عدد التجار المسجلين: <span className="text-blue-700 font-bold">{merchants.length}</span></p>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden shadow-premium border border-white/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50">التاجر / الشركة</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50">التواصل</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">الحالة</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">مستوى الوصول</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50/20">
                            {merchants.map((merchant) => (
                                <tr key={merchant.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                <Building size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-blue-950 text-lg uppercase tracking-tight">{merchant.full_name}</span>
                                                <span className="text-sm font-bold text-slate-400">@{merchant.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="text-sm font-semibold">{merchant.email}</span>
                                            </div>
                                            {(merchant.phone || merchant.country) && (
                                                <div className="flex items-center gap-4 text-slate-500">
                                                    {merchant.phone && (
                                                        <span className="flex items-center gap-1 text-xs font-semibold"><Phone size={14} /> {merchant.phone}</span>
                                                    )}
                                                    {merchant.country && (
                                                        <span className="flex items-center gap-1 text-xs font-semibold"><Globe size={14} /> {merchant.country}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase ${merchant.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            merchant.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                                'bg-red-50 text-red-500 border border-red-100'
                                            }`}>
                                            {merchant.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 tracking-widest uppercase">
                                            {merchant.access_level || 'Basic'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => handleDeleteMerchant(merchant.id, merchant.full_name || merchant.username)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف التاجر"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {merchants.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center text-slate-500 font-bold text-lg">
                                        لا يوجد تجار مسجلين حالياً
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminMerchants;
