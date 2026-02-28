import React, { useState, useEffect } from 'react';
import { Tags, Plus, Edit, Trash2 } from 'lucide-react';
import { categoriesAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { hasAccessLevel } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasAccessLevel || (!hasAccessLevel('admin') && !hasAccessLevel('super_admin'))) {
            toast.error('غير مصرح لك بالوصول إلى هذه الصفحة');
            navigate('/dashboard');
            return;
        }
        fetchCategories();
    }, [hasAccessLevel, navigate]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesAPI.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('فشل في جلب التصنيفات');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id, name_ar) => {
        if (!window.confirm(`هل أنت متأكد من حذف التصنيف "${name_ar}"؟`)) {
            return;
        }

        try {
            await categoriesAPI.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
            toast.success('تم حذف التصنيف بنجاح');
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error(error.response?.data?.error || 'حدث خطأ أثناء حذف التصنيف');
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
                    <h3 className="text-2xl font-black text-blue-950 tracking-tight">إدارة التصنيفات</h3>
                    <p className="text-slate-500 font-medium">إجمالي التصنيفات: <span className="text-blue-700 font-bold">{categories.length}</span></p>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden shadow-premium border border-white/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50">التصنيف</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50">الاسم بالإنجليزية</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">الحالة</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50/20">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                <Tags size={24} />
                                            </div>
                                            <span className="font-black text-blue-950 text-lg uppercase tracking-tight">{category.name_ar}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-slate-600">{category.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase ${category.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                                            }`}>
                                            {category.is_active ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => handleDeleteCategory(category.id, category.name_ar)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف التصنيف"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center text-slate-500 font-bold text-lg">
                                        لا يوجد تصنيفات حالياً
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

export default AdminCategories;
