import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ShieldCheck,
    MapPin,
    Globe,
    Phone,
    Star,
    MessageSquare,
    Package,
    Clock,
    TrendingUp,
    Zap,
    ChevronLeft,
    Share2,
    Calendar,
    Users
} from 'lucide-react';
import { suppliersAPI, productsAPI } from '../services/api';

const ImporterProfile = () => {
    const { id } = useParams();
    const [supplier, setSupplier] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupplierData();
    }, [id]);

    const fetchSupplierData = async () => {
        try {
            setLoading(true);
            const [supplierRes, productsRes] = await Promise.all([
                suppliersAPI.getSupplier(id),
                productsAPI.getProducts({ supplier: id })
            ]);
            
            setSupplier(supplierRes.data);
            setProducts(productsRes.data || []);
        } catch (error) {
            console.error('Failed to fetch supplier data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل بيانات المورد...</p>
                </div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🏢</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">المورد غير موجود</h2>
                    <p className="text-gray-600 mb-6">المورد الذي تبحث عنه غير موجود.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        <ChevronLeft size={20} className="rotate-180" />
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        );
    }
             return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* ── Decorative Background ── */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
            </div>

            {/* ── Main Content ── */}بيح
            <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">

                {/* ── Breadcrumb/Back button ── */}
                <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">العودة للرئيسية</span>
                </Link>

                {/* ── Profile Header Card ── */}
                <div className="bg-white rounded-[3rem] shadow-premium p-8 md:p-12 mb-10 overflow-hidden relative border border-white">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Logo/Image */}
                        <div className="relative shrink-0 mx-auto lg:mx-0">
                            <div className="w-48 h-48 rounded-[2.5rem] bg-white shadow-2xl p-4 border-solid border-[#17255421] flex items-center justify-center overflow-hidden">
                                <img src={supplier.logo_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'} alt={supplier.name} className="w-full h-full object-cover rounded-2xl" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-black text-sm border-4 border-white animate-bounce-slow">
                                <ShieldCheck size={18} />
                                معتمد A+
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6 text-center lg:text-right w-full">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{supplier.name}</h1>
                                    <p className="text-xl font-bold text-blue-600">{supplier.category || 'مورد موثوق'}</p>
                                </div>
                                <div className="flex items-center gap-3 justify-center lg:justify-end">
                                    <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white border-solid border-[#17255421] transition-all shadow-sm">
                                        <Share2 size={20} />
                                    </button>
                                    <a
                                        href={`https://wa.me/${supplier.whatsapp?.replace('+', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 shadow-premium active:scale-95 group"
                                    >
                                        تواصل سريع
                                        <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                            <Phone size={18} />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl lg:ml-0 lg:mr-auto">
                                {supplier.description || 'مورد موثوق يقدم منتجات عالية الجودة'}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-slate-500 font-bold">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    {supplier.city || 'مصر'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={18} className="text-blue-500" />
                                    {supplier.website || 'www.example.com'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-500" />
                                    عضو منذ {supplier.experience || '5+ سنوات'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-slate-50 rounded-[2rem] border-solid border-[#17255421]">
                        {[
                            { label: 'التقييم العام', val: supplier.rating || '4.5', sub: `${supplier.reviews || 100} مراجعة`, icon: Star, color: 'text-yellow-500' },
                            { label: 'المخزون', val: supplier.product_count || '500+', sub: 'عنصر نشط', icon: Package, color: 'text-blue-500' },
                            { label: 'الموظفون', val: supplier.employees || '50+', sub: 'خبير صناعي', icon: Users, color: 'text-indigo-500' },
                            { label: 'معدل الرد', val: '98%', sub: 'بائع سريع', icon: MessageSquare, color: 'text-emerald-500' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-[1.5rem] text-center shadow-sm border-solid border-[#17255421]">
                                <div className={`w-10 h-10 ${stat.color} bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Content Grid ── */}

                {/* Main Products Grid */}
                <div className="flex items-center justify-between pb-6">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                        <Package className="text-blue-600" />
                        منتجات {supplier.name}
                    </h2>
                    <button className="text-blue-600 font-bold hover:underline">عرض الكل</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product) => (
                        <div key={product.id} className="group bg-white rounded-3xl border-solid border-[#17255421] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-slate-900 font-black shadow-lg">
                                    ${product.price || '0'}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{product.category_name || 'منتج'}</p>
                                    <h4 className="text-xl font-black text-slate-900">{product.name}</h4>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                        <Zap size={16} className="text-yellow-500" />
                                        شحن فوري
                                    </div>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                                    >
                                        <ChevronLeft size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImporterProfile;
