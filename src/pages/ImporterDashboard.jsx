import React from 'react';
import {
    LayoutDashboard,
    Box,
    Settings,
    Plus,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

const ImporterDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
        { path: '/dashboard/inventory', label: 'إدارة المنتجات', icon: Box },
        { path: '/dashboard/profile', label: 'تعديل البروفايل', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-mesh flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-2xl border-l border-blue-100/50 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <img src="/logo.png" alt="" className="w-24 h-24" />
                    <p className="text-[16px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 text-right">لوحة تحكم المستورد</p>
                </div>

                <nav className="flex-grow px-4 pb-8 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300
                                ${isActive
                                    ? 'bg-blue-700 text-white shadow-xl shadow-blue-200 -translate-x-1'
                                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 hover:-translate-x-1'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        تسجيل الخروج
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 lg:p-12 space-y-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-blue-950 tracking-tighter">لوحة التحكم</h1>
                        <p className="text-slate-500 font-medium mt-1">مرحباً بك مجدداً، <span className="text-blue-700 font-bold">{user.companyName}</span> 👋</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/add-product')}
                            className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            <Plus size={20} />
                            إضافة منتج جديد
                        </button>
                    </div>
                </header>

                <div className="animate-fadeIn">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ImporterDashboard;
