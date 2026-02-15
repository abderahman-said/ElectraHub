import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Building2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { IMPORTERS } from '../data/importers';

const Importers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredImporters = IMPORTERS.filter(imp =>
        imp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imp.cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {/* Hero Section - Light Premium */}
            <section className="relative py-24 bg-blue-50/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/20 blur-3xl rounded-full translate-x-1/2 -z-10" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full shadow-premium border border-white/50 mb-8">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <span className="text-sm font-bold text-blue-900 tracking-widest uppercase">
                            شركاء بالجملة المعتمدون
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-blue-950 tracking-tighter mb-6">
                        شبكة <span className="text-gradient">المستوردين</span> النخبة
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        تواصل مباشرة مع أكبر الموردين الموثقين في قطاع الأدوات والأجهزة المنزلية. شفافية كاملة في الأسعار والحد الأدنى للطلب.
                    </p>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="py-12 border-b border-[#17255421] bg-white sticky top-22 z-40 transition-all duration-300">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن مستورد أو تخصص (مثلاً: مطبخ، أثاث، إلكترونيات)..."
                            className="w-full py-5 pr-14 pl-6 bg-slate-50 border border-slate-200 rounded-[20px] text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Importers Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-8">
                    {filteredImporters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredImporters.map((imp) => (
                                <div key={imp.id} className="group glass p-8 rounded-[2.5rem] border-[#17255421]/50 hover:bg-white hover:scale-[1.02] hover:shadow-premium transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                                    {/* Decorative Glow */}
                                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Importer Image/Logo */}
                                        <div className="relative h-48 rounded-3xl overflow-hidden mb-6 shadow-lg shadow-blue-50">
                                            <img src={imp.img} alt={imp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-bold text-blue-950">{imp.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex-grow space-y-4">
                                            <div className="space-y-1">
                                                <div className="text-xs font-black text-blue-600 uppercase tracking-widest">{imp.cat}</div>
                                                <h3 className="text-2xl font-black text-blue-950">{imp.name}</h3>
                                            </div>

                                            <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed h-12">
                                                {imp.desc}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                                                <div className="space-y-1">
                                                    <div className="text-[16px] font-black text-slate-400 uppercase tracking-tighter">المخزون النشط</div>
                                                    <div className="text-lg font-black text-blue-950 flex items-center gap-1.5">
                                                        <Zap size={16} className="text-yellow-500" />
                                                        {imp.stock}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[16px] font-black text-slate-400 uppercase tracking-tighter">سنوات الخبرة</div>
                                                    <div className="text-lg font-black text-blue-950 flex items-center gap-1.5">
                                                        <Star size={16} className="text-blue-600" />
                                                        {imp.active}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Link
                                                to={`/importer/${imp.id}`}
                                                className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest group-hover:bg-blue-700 transition-all shadow-xl shadow-slate-200"
                                            >
                                                عرض المخزون بالكامل
                                                <ArrowLeft size={18} className="translate-x-0 group-hover:-translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-blue-950 mb-2">لا يوجد بائعون بهذا الاسم</h3>
                            <p className="text-slate-500 font-bold">جرب البحث بكلمات أخرى أو تخصص مختلف</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-slate-50/50 border-t border-[#17255421]">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { icon: ShieldCheck, title: 'تحقق صارم', desc: 'كل مستورد يخضع لفحص قانوني وتجاري شامل بـ 24 نقطة قبل الانضمام.' },
                            { icon: Building2, title: 'توريد مباشر', desc: 'نهدم الحواجز بينك وبين المصنع عبر مستوردين معتمدين فقط.' },
                            { icon: Zap, title: 'لوجستيات سريعة', desc: 'أنظمة تتبع متكاملة لضمان وصول شحناتك في الوقت المحدد وبأعلى جودة.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <div className="h-20 w-20 bg-white rounded-[2rem] shadow-premium border border-white/50 flex items-center justify-center mx-auto text-blue-600">
                                    <item.icon size={36} />
                                </div>
                                <h4 className="text-xl font-black text-blue-950 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Importers;
