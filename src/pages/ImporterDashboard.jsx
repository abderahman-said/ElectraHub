import React from 'react';
import {
    LayoutDashboard,
    Box,
    ShoppingCart,
    TrendingUp,
    Settings,
    Plus,
    Users,
    Activity,
    Bell,
    Search,
    ChevronRight
} from 'lucide-react';

const ImporterDashboard = () => {
    const stats = [
        { label: 'Total Products', value: '42', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Orders', value: '18', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Revenue', value: '$12,450', icon: TrendingUp, color: 'text-blue-700', bg: 'bg-blue-100' },
        { label: 'Profile Views', value: '1.2k', icon: Users, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    const recentOrders = [
        { id: '#ORD-9921', trader: 'Electronics Hub Ltd', status: 'Pending', total: '$1,200', date: '2 hours ago' },
        { id: '#ORD-9920', trader: 'Al-Madina Trading', status: 'Shipped', total: '$3,400', date: '5 hours ago' },
        { id: '#ORD-9919', trader: 'Global Tech Suez', status: 'Delivered', total: '$850', date: '1 day ago' },
    ];

    return (
        <div className="min-h-screen bg-mesh flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-2xl border-r border-blue-100/50 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-blue-700 rounded-xl flex items-center justify-center text-yellow-400 shadow-lg shadow-blue-200">
                            <Box size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">
                            Electra<span className="text-blue-600">Hub</span>
                        </h2>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Importer Control</p>
                </div>

                <nav className="flex-grow px-4 pb-8 space-y-2">
                    {[
                        { name: 'Overview', icon: LayoutDashboard, active: true },
                        { name: 'Inventory Management', icon: Box },
                        { name: 'Wholesale Orders', icon: ShoppingCart },
                        { name: 'Performance AI', icon: Activity },
                        { name: 'Account Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${item.active
                                    ? 'bg-blue-700 text-white shadow-xl shadow-blue-200 translate-x-1'
                                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="glass p-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                        <p className="text-xs font-black text-blue-900 uppercase mb-2">Pro Plan</p>
                        <p className="text-[10px] text-slate-500 mb-4">You have used 80% of your product limit.</p>
                        <button className="w-full py-2.5 bg-yellow-400 text-blue-950 text-[10px] font-black uppercase rounded-lg shadow-lg shadow-yellow-100 hover:bg-yellow-500 transition-all">Upgrade Now</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 lg:p-12 space-y-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-blue-950 tracking-tighter">Enterprise Dashboard</h1>
                        <p className="text-slate-500 font-medium mt-1">Welcome back, <span className="text-blue-700 font-bold">Al-Nour Electronics</span> 👋</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 glass rounded-2xl flex items-center justify-center text-slate-500 relative cursor-pointer hover:bg-white transition-all">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </div>
                        <button className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 active:scale-95">
                            <Plus size={20} />
                            List New Product
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-blue-950 tracking-tighter">{stat.value}</span>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase">+12%</p>
                                </div>
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Viewport Content */}
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Table Section */}
                    <div className="lg:col-span-2 glass rounded-[2.5rem] overflow-hidden shadow-premium">
                        <div className="p-8 border-b border-blue-50 flex items-center justify-between bg-white/30">
                            <h3 className="text-xl font-black text-blue-950 tracking-tight">Recent B2B Orders</h3>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-40 glass rounded-xl px-4 flex items-center gap-2 text-slate-400 focus-within:w-60 transition-all border-none">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search orders..." className="bg-transparent border-none text-xs font-bold outline-none w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto p-4">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 rounded-xl overflow-hidden">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50/30">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-6 py-6 font-black text-blue-900 group-hover:text-blue-700 transition-colors">{order.id}</td>
                                            <td className="px-6 py-6 text-sm font-bold text-slate-700">{order.trader}</td>
                                            <td className="px-6 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Pending' ? 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-50' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-600 shadow-sm shadow-blue-50' :
                                                            'bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-50'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 font-black text-blue-700 text-lg">{order.total}</td>
                                            <td className="px-6 py-6 text-right">
                                                <button className="h-10 w-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-700 transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Analytics / Right Bar */}
                    <div className="space-y-10">
                        <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-700 to-blue-900 text-white border-none shadow-2xl shadow-blue-200">
                            <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                                <TrendingUp />
                                AI Projections
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
                                        <span>Monthly Goal</span>
                                        <span>$20k</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 w-[62%] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed opacity-90">
                                    Better listing optimization could increase your visibility by <span className="text-yellow-400 font-black">24%</span> this week.
                                </p>
                                <button className="w-full py-4 glass border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all">View Insights</button>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border border-blue-100">
                            <h4 className="text-lg font-black text-blue-950 mb-6 uppercase tracking-tight">Market Pulse</h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Smart Fridges', trend: 'up', val: '+22.5%' },
                                    { name: 'AC Units', trend: 'up', val: '+18.1%' },
                                    { name: 'Microwaves', trend: 'down', val: '-2.4%' },
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-blue-50 transition-colors">
                                        <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                        <span className={`text-xs font-black ${item.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ImporterDashboard;
