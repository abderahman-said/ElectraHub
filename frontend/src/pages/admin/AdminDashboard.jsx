import React from 'react';
import {
    LayoutDashboard,
    Users,
    Tags,
    LogOut,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout, isAuthenticated, hasAccessLevel } = useAuth();
    const navigate = useNavigate();

    // Ideally, check for admin access level here.
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

    // uncomment this and remove the visual component when ready:
    // if (!hasAccessLevel('admin') && !hasAccessLevel('super_admin')) {
    //  return <div>غير مصرح</div>;
    // }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin/merchants', label: 'جميع التجار', icon: Users },
        { path: '/admin/categories', label: 'جميع التصنيفات', icon: Tags },
    ];

    return (
        <div className="min-h-screen bg-mesh flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-2xl border-l border-blue-100/50 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="text-blue-700 w-10 h-10" />
                        <h2 className="text-2xl font-black text-blue-950 tracking-tighter">الإدارة</h2>
                    </div>
                    <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.1em] mt-2 text-right">لوحة تحكم المشرف</p>
                </div>

                <nav className="flex-grow px-4 pb-8 space-y-2 mt-4">
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
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all duration-300 mt-auto"
                    >
                        <LogOut size={20} />
                        تسجيل الخروج
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 lg:p-12 space-y-10 w-full overflow-hidden">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-blue-950 tracking-tighter">لوحة تحكم الإدارة</h1>
                        <p className="text-slate-500 font-medium mt-1">مرحباً بك مجدداً، <span className="text-blue-700 font-bold">{user?.full_name || 'Admin'}</span> 👋</p>
                    </div>
                </header>

                <div className="animate-fadeIn w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
