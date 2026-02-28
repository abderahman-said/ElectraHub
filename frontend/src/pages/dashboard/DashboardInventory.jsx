import React, { useState, useEffect } from 'react';
import { Package, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { dashboardProductsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const DashboardInventory = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        }
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await dashboardProductsAPI.getProducts();
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('فشل في جلب المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await dashboardProductsAPI.deleteProduct(productId);
            toast.success('تم حذف المنتج بنجاح');
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('فشل في حذف المنتج');
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

    const categoryColorMap = {
        'أدوات منزلية': 'bg-blue-50 text-blue-600 border-blue-100',
        'مطبخ': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'تنظيف': 'bg-purple-50 text-purple-600 border-purple-100',
        'حديقة': 'bg-green-50 text-green-600 border-green-100',
        'ديكور': 'bg-amber-50 text-amber-600 border-amber-100',
        'تخزين': 'bg-rose-50 text-rose-600 border-rose-100',
        'إضاءة': 'bg-yellow-50 text-yellow-600 border-yellow-100',
        'إلكترونيات': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'أجهزة منزلية': 'bg-orange-50 text-orange-600 border-orange-100'
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل المنتجات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-blue-950 tracking-tight">إدارة المنتجات</h3>
                    <p className="text-slate-500 font-medium">لديك إجمالي <span className="text-blue-700 font-bold">{products.length || 0}</span> منتج معروض حالياً</p>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden shadow-premium border border-white/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50">المنتج والتفاصيل</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">الفئة</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-center">السعر والكمية</th>
                                <th className="px-8 py-6 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50/50 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50/20">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-100 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center p-1">
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                                                ) : (
                                                    <Package className="text-slate-300" size={28} />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-blue-950 text-lg group-hover:text-blue-700 transition-colors uppercase tracking-tight">{product.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                        📦 المخزون: {product.stock_quantity || 0}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                        🛍️ أقل كمية: {product.moq || 1}
                                                    </span>
                                                    {product.warranty && (
                                                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                            🛡️ {product.warranty}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black border tracking-widest uppercase ${categoryColorMap[product.category_name_ar] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            {product.category_name_ar || product.category_name || 'غير محدد'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-black text-blue-700 text-xl tracking-tighter">${product.price}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative -top-1">السعر للمستهلك</span>
                                            <div className="mt-1 flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                                                <span>الجملة:</span>
                                                <span>${product.wholesale_price}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => navigate(`/dashboard/edit-product/${product.id}`)}
                                                className="h-11 w-11 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-90 shadow-sm"
                                                title="تعديل المنتج"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                                        handleDeleteProduct(product.id);
                                                    }
                                                }}
                                                className="h-11 w-11 bg-white border border-red-50 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all duration-300 active:scale-90 shadow-sm"
                                                title="حذف المنتج"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!products || products.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                                <Package size={40} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-blue-950">لا يوجد منتجات حالياً</p>
                                                <p className="text-slate-400 font-medium">ابدأ بإضافة منتجاتك لبدء تلقي الطلبات</p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/dashboard/add-product')}
                                                className="mt-4 px-8 py-3 bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-200"
                                            >
                                                إضافة أول منتج
                                            </button>
                                        </div>
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

export default DashboardInventory;
