import React, { useState } from 'react';
import { Check, Zap, Shield, Crown, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ArrowUpRight, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────
   Pricing Page — Premium Dark Edition
   Electrical B2B Platform
───────────────────────────────────────── */

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        nameAr: 'البداية',
        tagline: 'للمستوردين الجدد',
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: Shield,
        accent: '#64748b',
        accentBg: 'rgba(100,116,139,0.08)',
        features: [
            'إضافة حتى 5 منتجات',
            'لوحة تحكم أساسية',
            'دعم عبر البريد الإلكتروني',
            'ظهور عادي في نتائج البحث',
        ],
        cta: 'ابدأ مجاناً',
        ctaStyle: 'outline',
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        nameAr: 'المحترف',
        tagline: 'للشركات النشطة الساعية للنمو',
        monthlyPrice: 59,
        yearlyPrice: 49,
        icon: Zap,
        accent: '#3b82f6',
        accentBg: 'rgba(59,130,246,0.1)',
        features: [
            'إضافة منتجات غير محدودة',
            'شارة "مستورد معتمد"',
            'ظهور ذو أولوية في البحث',
            'إحصائيات متقدمة للزيارات',
            'دعم فني سريع (واتساب)',
        ],
        cta: 'اشترك الآن',
        ctaStyle: 'solid',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        nameAr: 'المؤسسات',
        tagline: 'للمؤسسات الكبرى والمجموعات',
        monthlyPrice: 179,
        yearlyPrice: 149,
        icon: Crown,
        accent: '#f59e0b',
        accentBg: 'rgba(245,158,11,0.08)',
        features: [
            'كل مميزات باقة المحترف',
            'مدير حساب مخصص',
            'ربط API للمخزون',
            'تقارير تحليلية شهرية',
            'إعلانات ممولة شهرية',
        ],
        cta: 'تواصل معنا',
        ctaStyle: 'gold',
        popular: false,
    },
];

const faqs = [
    {
        q: 'ما هو الفرق بين الاشتراك الشهري والسنوي؟',
        a: 'الاشتراك السنوي يوفر لك خصماً يصل إلى 20% مقارنة بالدفع الشهري، كما يضمن لك ثبات السعر طوال العام.',
    },
    {
        q: 'هل يمكنني تغيير باقتي في أي وقت؟',
        a: 'نعم، يمكنك الترقية من باقة إلى أخرى في أي وقت من خلال لوحة التحكم الخاصة بك.',
    },
    {
        q: 'كيف تضمنون جودة المستوردين بشارة "معتمد"؟',
        a: 'نقوم بمراجعة السجلات التجارية والشهادات الجمركية يدوياً لكل مستورد يطلب الشارة لضمان الموثوقية.',
    },
    {
        q: 'هل هناك دعم فني متخصص للأجهزة الكهربائية؟',
        a: 'نعم، فريق دعمنا يضم مهندسين متخصصين في قطاع الأجهزة الكهربائية والإلكترونيات الصناعية.',
    },
];

/* ── Sub-components ─────────────────────── */

const GlowOrb = ({ className = '', style }) => (
    <div
        className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
        style={style}
    />
);

const PlanCard = ({ plan, isYearly }) => {
    const Icon = plan.icon;
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

    return (
        <div
            className={`relative rounded-[28px] p-[40px_36px] transition-all duration-400 cursor-default flex flex-col gap-7
                ${plan.popular
                    ? 'bg-gradient-to-br from-[#0f1729] to-[#0d1a3a] border border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.12),0_30px_60px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_0_80px_rgba(59,130,246,0.2),0_40px_80px_rgba(0,0,0,0.5)]'
                    : 'bg-gradient-to-br from-[#0c1222] to-[#0a0f1e] border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.04),0_40px_60px_rgba(0,0,0,0.5)]'
                }`}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-extrabold tracking-[0.15em] uppercase px-5 py-1.5 rounded-b-[14px] z-10">
                    الأكثر طلباً
                </div>
            )}

            {/* Inner glow */}
            <div
                className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[60px] pointer-events-none"
                style={{ background: plan.accentBg }}
            />

            {/* Icon + name */}
            <div className="flex items-center gap-4 relative">
                <div
                    className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: plan.accentBg,
                        border: `1px solid ${plan.accent}33`
                    }}
                >
                    <Icon size={26} color={plan.accent} />
                </div>
                <div>
                    <div
                        className="text-[13px] font-bold tracking-[0.1em] uppercase mb-0.5"
                        style={{ color: plan.accent }}
                    >
                        {plan.name}
                    </div>
                    <div className="text-lg font-extrabold text-[#f1f5f9]">{plan.nameAr}</div>
                </div>
            </div>

            {/* Tagline */}
            <p className="text-[#64748b] text-sm leading-relaxed font-medium m-0 relative">
                {plan.tagline}
            </p>

            {/* Price */}
            <div className="relative border-t border-white/5 pt-6">
                <div className="flex items-baseline gap-2">
                    <span
                        className={`text-[60px] font-black leading-none tabular-nums tracking-tighter font-['SF_Pro_Display',system-ui]`}
                        style={{ color: price === 0 ? '#e2e8f0' : plan.accent }}
                    >
                        {price === 0 ? 'مجاناً' : `$${price}`}
                    </span>
                    {price > 0 && (
                        <span className="text-slate-600 text-sm font-semibold mb-2">
                            / {isYearly ? 'شهر · دفع سنوي' : 'شهرياً'}
                        </span>
                    )}
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                    <div className="mt-1.5 text-xs text-slate-600 font-semibold">
                        بدلاً من <span className="line-through text-slate-700">${plan.monthlyPrice}</span>
                        <span className="mr-2 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                            وفر {Math.round((1 - plan.yearlyPrice / plan.monthlyPrice) * 100)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3.5 relative flex-1">
                {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div
                            className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                                background: `${plan.accent}18`,
                                border: `1px solid ${plan.accent}33`
                            }}
                        >
                            <Check size={12} color={plan.accent} strokeWidth={3} />
                        </div>
                        <span className="text-[#94a3b8] text-sm font-semibold">{f}</span>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <button
                className={`w-full p-4 rounded-[14px] text-[15px] font-extrabold tracking-wide cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border-none
                    ${plan.ctaStyle === 'solid'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.45)]'
                        : plan.ctaStyle === 'gold'
                            ? 'bg-gradient-to-br from-amber-600 to-amber-500 text-[#0f172a] shadow-[0_8px_24px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.4)]'
                            : 'bg-transparent text-[#94a3b8] border border-white/10 hover:bg-white/5'
                    }`}
            >
                {plan.cta}
                <ArrowUpRight size={16} />
            </button>
        </div>
    );
};

const FaqItem = ({ faq, index, openFaq, toggleFaq }) => {
    const isOpen = openFaq === index;
    return (
        <div
            className={`rounded-[18px] overflow-hidden transition-all duration-300 border
                ${isOpen
                    ? 'bg-white/[0.04] border-blue-500/20'
                    : 'bg-white/[0.02] border-white/5'
                }`}
        >
            <button
                onClick={() => toggleFaq(index)}
                className="w-full p-[22px_28px] flex items-center justify-between bg-transparent border-none cursor-pointer text-right gap-4 focus:outline-none"
            >
                <span className="text-base font-bold text-[#e2e8f0]">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${isOpen ? 'bg-blue-500/15 text-blue-500' : 'bg-white/5 text-slate-600'}`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>
            {isOpen && (
                <div className="px-7 pb-[22px] border-t border-white/5">
                    <p className="text-[#64748b] text-[15px] font-medium leading-[1.8] m-0 pt-[18px]">
                        {faq.a}
                    </p>
                </div>
            )}
        </div>
    );
};

/* ── Main Component ─────────────────────── */
const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    return (
        <div dir="rtl" className="min-h-screen bg-white text-blue-950 font-['Cairo','Tajawal',system-ui,sans-serif] overflow-x-hidden relative">
            {/* Global glows */}
            <GlowOrb className="-top-[200px] -right-[200px] w-[700px] h-[700px] bg-blue-100/30" />
            <GlowOrb className="top-[600px] -left-[300px] w-[600px] h-[600px] bg-amber-50/20" />

            {/* ── Subtle grid overlay ── */}
            <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:60px_60px]" />

            <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-[120px] relative z-10">

                {/* ── Header ── */}
                <div className="text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-black tracking-widest uppercase shadow-sm">
                        <Sparkles size={14} className="animate-pulse" />
                        نظام الاشتراكات المطور
                    </div>

                    <h1 className="text-[clamp(40px,7vw,80px)] font-black leading-[1] tracking-tighter text-blue-950">
                        استثمر في <span className="text-gradient">مستقبل</span>{' '}
                        <br />
                        أعمالك التجارية
                    </h1>

                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-[600px] mx-auto font-medium">
                        حلول توريد رقمية متكاملة لربط المستوردين بأكبر شبكة تجار تجزئة في المنطقة.
                    </p>

                    {/* ── Billing toggle ── */}
                    <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-2 pl-6 shadow-inner">
                        <span className={`text-[15px] font-black tracking-tight transition-colors ${!isYearly ? 'text-blue-600' : 'text-slate-400'}`}>شهرياً</span>

                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className={`w-[60px] h-[32px] rounded-full border-2 relative p-0 transition-all duration-500 cursor-pointer
                                ${isYearly ? 'bg-blue-600 border-blue-700' : 'bg-slate-200 border-slate-300'}`}
                        >
                            <div className={`absolute top-[2px] w-6 h-6 rounded-full transition-all duration-500 shadow-md
                                ${isYearly
                                    ? 'right-[2px] bg-white'
                                    : 'right-[calc(100%-28px)] bg-slate-500'}`}
                            />
                        </button>

                        <span className={`text-[15px] font-black tracking-tight transition-colors ${isYearly ? 'text-blue-600' : 'text-slate-400'}`}>سنوياً</span>

                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-2xl text-[12px] font-black tracking-wider animate-bounce-subtle shadow-lg">
                            وفر 20%
                        </div>
                    </div>
                </div>

                {/* ── Plans Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-[120px] items-start">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} isYearly={isYearly} />
                    ))}
                </div>

                {/* ── Comparison Strip ── */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-[3rem] p-10 px-12 flex items-center justify-between gap-10 flex-wrap mb-[120px] shadow-premium">
                    {[
                        { icon: Building2, label: 'مستورد معتمد', value: '+2,400' },
                        { icon: Shield, label: 'منتج نشط', value: '+85,000' },
                        { icon: Zap, label: 'دعم مباشر', value: '24/7' },
                        { icon: Check, label: 'معدل رضا', value: '98.7%' },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500 text-blue-600">
                                <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-blue-950 leading-none tracking-tighter">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-bold mt-1.5 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>



                {/* ── CTA Banner ── */}
                <div className="relative rounded-[3rem] p-24 text-center overflow-hidden bg-blue-950 text-white shadow-3xl">
                    <GlowOrb className="-top-[100px] -right-[100px] w-[500px] h-[500px] bg-blue-500/20" />
                    <GlowOrb className="-bottom-[100px] -left-[100px] w-[500px] h-[500px] bg-blue-400/10" />

                    {/* Grid lines */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-6 py-2.5 text-blue-200 text-sm font-black tracking-widest uppercase">
                            <Sparkles size={16} />
                            انضم للنخبة اليوم
                        </div>

                        <h2 className="text-white text-[clamp(32px,5vw,60px)] font-black leading-[1] tracking-tighter">
                            هل أنت مستعد لمضاعفة <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">أرقام مبيعاتك؟</span>
                        </h2>

                        <p className="text-blue-200/70 text-lg md:text-xl leading-relaxed font-medium">
                            انخرط في أكبر شبكة رقمية لقطاع التوريد الكهربائي في الشرق الأوسط وابدأ في إدارة طلبات الجملة بذكاء.
                        </p>

                        <div className="flex gap-6 justify-center flex-wrap pt-4">
                            <Link
                                to="/register"
                                className="px-10 py-5 bg-white text-blue-950 rounded-2xl font-black text-base transition-all duration-300 hover:bg-blue-50 hover:scale-105 shadow-2xl shadow-white/10 flex items-center gap-3"
                            >
                                اشترك الآن كمستورد
                                <ArrowUpRight size={20} strokeWidth={3} />
                            </Link>
                            <button className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-base transition-all duration-300 hover:bg-white/10 flex items-center gap-3">
                                <MessageCircle size={20} />
                                استشارة مجانية
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Pricing;