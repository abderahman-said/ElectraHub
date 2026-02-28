import React, { useState, useEffect } from 'react';
import { Box, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dashboardProductsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const DashboardOverview = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [overviewData, setOverviewData] = useState({
        totalProducts: 0,
        activeOrders: 0,
        totalRevenue: 0,
        profileViews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOverviewData();
        }
    }, [isAuthenticated]);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            const response = await dashboardProductsAPI.getOverview();
            setOverviewData(response.data);
        } catch (error) {
            console.error('Failed to fetch overview data:', error);
            toast.error('فشل في جلب بيانات النظرة العامة');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'إجمالي المنتجات', value: overviewData.totalProducts || 0, icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'الطلبات النشطة', value: overviewData.activeOrders || 0, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'إجمالي الإيرادات', value: `$${overviewData.totalRevenue || 0}`, icon: TrendingUp, color: 'text-blue-700', bg: 'bg-blue-100' },
        { label: 'مشاهدات الملف', value: overviewData.profileViews || 0, icon: Users, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
                <div key={stat.label} className="glass p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                        <div className="text-left">
                            <span className="text-3xl font-black text-blue-950 tracking-tighter">{stat.value}</span>
                        </div>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardOverview;
