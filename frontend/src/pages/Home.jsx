import { TrendingUp, Award, ShoppingBag, ArrowRight, ArrowUpRight, MessageCircle, Sparkles, Star, ChevronLeft, ChevronRight, Play, Shield, Truck, RotateCcw, Headphones, Zap, Users, Package, Eye, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import OptimizedImage from '../components/OptimizedImage';
import { productsAPI, categoriesAPI, suppliersAPI, trustBadgesAPI } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ─── Shared Atoms ─────────────────────────────────────────── */
const GlowOrb = ({ className = '', style }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`} style={style} />
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-[11px] font-black text-[#2650fc] uppercase tracking-[0.4em] mb-3 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
    {children}
  </span>
);

const CounterBadge = ({ value, label, icon: Icon }) => (
  <div className="flex flex-col items-center gap-1 px-8 py-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center mb-1">
      <Icon size={20} className="text-[#2650fc]" />
    </div>
    <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

/* ─── Flash Deal Timer ──────────────────────────────────────── */
const FlashTimer = () => {
  const [time, setTime] = useState({ h: 3, m: 47, s: 22 });
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="bg-white text-slate-900 font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg tabular-nums shadow-sm">{v}</span>
          {i < 2 && <span className="text-white font-black text-lg">:</span>}
        </span>
      ))}
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [trustBadges, setTrustBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('الكل');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes, suppliersRes, badgesRes] = await Promise.all([
        categoriesAPI.getCategories(),
        productsAPI.getProducts({ limit: 8 }),
        suppliersAPI.getPublicSuppliers(),
        trustBadgesAPI.getBadges()
      ]);
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setTrustBadges(badgesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const productTabs = ['الكل', 'الأكثر مبيعاً', 'الأعلى تقييماً', 'وصل حديثاً'];
 

  const TESTIMONIALS = [
    { name: 'أحمد محمد', role: 'عميل مميز', rating: 5, text: 'تجربة تسوق رائعة، المنتجات وصلت سريعاً وبجودة عالية. سأتسوق مجدداً بالتأكيد!', avatar: 'أ' },
    { name: 'سارة علي',  role: 'عميلة جديدة', rating: 5, text: 'أفضل موقع تسوق جربته. الأسعار منافسة والخدمة ممتازة.', avatar: 'س' },
    { name: 'محمود حسن', role: 'عميل دائم',  rating: 4, text: 'منتجات أصلية وشحن سريع. أنصح الجميع بالتسوق من هنا.', avatar: 'م' },
  ];

  const BRANDS = [
    { name: 'Samsung', color: '#1428A0' },
    { name: 'LG',      color: '#A50034' },
    { name: 'Bosch',   color: '#007BC0' },
    { name: 'Philips', color: '#0B2070' },
    { name: 'Sony',    color: '#000000' },
    { name: 'Arçelik', color: '#E5001A' },
  ];

  /* ─ flash-deal mock products ─ */
  const FLASH_DEALS = (products.length ? products : Array(4).fill(null)).slice(0, 4).map((p, i) => ({
    ...(p || {}),
    id: p?.id ?? i,
    name: p?.name ?? `منتج ${i + 1}`,
    original_price: p?.price ? Math.round(p.price * 1.35) : 1200,
    price: p?.price ?? 890,
    discount: 30 - i * 5,
    image_url: p?.image_url ?? 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2650fc] mx-auto mb-4" />
        <p className="text-gray-600 font-medium">جاري تحميل البيانات…</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden bg-white" dir="rtl">

      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <Hero />

       

      {/* ══════════════════════════════════════════════════════
          3. CATEGORIES SLIDER  (محسّن)
      ══════════════════════════════════════════════════════ */}
      <section id="categories" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#eff6ff_0%,_transparent_60%)] -z-10" />
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <SectionLabel>استكشف الفئات</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              تسوّق حسب <span className="text-[#2650fc]">الفئة</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">أجهزة ومنتجات منزلية مختارة بعناية من أشهر الماركات العالمية</p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 6 } }}
            className="pb-10"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="py-2">
                <div className="group relative overflow-hidden rounded-3xl shadow-md aspect-[3/4] cursor-pointer ring-0 hover:ring-2 hover:ring-[#2650fc]/40 transition-all duration-300">
                  <OptimizedImage
                    src={cat.image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name_ar || cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                  {/* badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-full">
                    {cat.product_count || 0} منتج
                  </span>
                  <div className="absolute bottom-0 inset-x-0 p-4 text-right">
                    <h3 className="text-white font-black text-lg mb-3 leading-tight">{cat.name_ar || cat.name}</h3>
                    <button className="w-full rounded-xl bg-[#2650fc] py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      عرض الكل
                      <ArrowRight size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

     

      {/* ══════════════════════════════════════════════════════
          6. FEATURED PRODUCTS  (محسّن بـ tabs)
      ══════════════════════════════════════════════════════ */}
      <section id="marketplace" className="py-20 relative">
        <div className="container mx-auto px-4 md:px-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div className="space-y-3 text-right">
              <SectionLabel>المنتجات</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                أحدث <span className="text-[#2650fc]">المنتجات</span>
              </h2>
            </div>
            {/* tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {productTabs.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === t
                      ? 'bg-white text-[#2650fc] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-[#2650fc] transition-colors duration-300 text-sm"
            >
              عرض جميع المنتجات
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. BRAND LOGOS  (Infinite Marquee)
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 border-y border-slate-100 bg-slate-50/50 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
            display: flex;
            width: max-content;
          }
        `}} />
        <div className="container mx-auto px-4 md:px-8 relative z-20 mb-10">
          <div className="text-center mb-14 space-y-3">
            <SectionLabel>تسوق أكبر الماركات العالمية</SectionLabel>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">تسوق أكبر <span className="text-[#2650fc]">الماركات العالمية</span></h2>
          </div>  
        </div>
        
        <div className="relative w-full flex overflow-hidden group" dir="ltr">
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          
          <div className="animate-scroll group-hover:[animation-play-state:paused]">
            {Array(4).fill(BRANDS).flat().map(({ name }, i) => (
              <div key={i} className="flex items-center justify-center px-12 md:px-20 w-[180px] md:w-[250px]">
                <span className="text-3xl md:text-5xl font-black text-slate-300 hover:text-slate-600 transition-colors duration-300 cursor-pointer tracking-tighter select-none">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. TRUST BADGES  (محسّن)
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14 space-y-3">
            <SectionLabel>لماذا نحن؟</SectionLabel>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">مميزات <span className="text-[#2650fc]">متجرنا</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge) => {
              const getIcon = (n) => {
                const map = { 'trending-up': TrendingUp, 'award': Award, 'shopping-bag': ShoppingBag };
                const Icon = map[n] || TrendingUp;
                return <Icon size={28} />;
              };
              const colors = [
                { bg: 'bg-blue-50', icon: 'text-[#2650fc]', border: 'border-blue-100', accent: 'bg-[#2650fc]' },
                { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100', accent: 'bg-amber-500' },
                { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100', accent: 'bg-green-500' },
              ];
              const c = colors[badge.id % 3] || colors[0];
              return (
                <div key={badge.id} className={`relative p-8 rounded-3xl border ${c.border} ${c.bg} hover:shadow-lg transition-all duration-400 group overflow-hidden text-right`}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${c.accent} rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm ${c.icon}`}>
                    {getIcon(badge.icon)}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{badge.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. TESTIMONIALS  (Infinite Scrolling)
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
            display: flex;
            width: max-content;
          }
        `}} />
        <GlowOrb className="top-0 right-0 w-[600px] h-[600px] bg-blue-600/10" />
        <GlowOrb className="bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 mb-14">
          <div className="text-center space-y-3">
            <span className="inline-block text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">آراء العملاء</span>
            <h2 className="text-4xl font-black text-white tracking-tighter">ماذا يقول <span className="text-blue-400">عملاؤنا</span></h2>
          </div>
        </div>

        {/* Row 1: Right to Left */}
        <div className="relative w-full flex overflow-hidden group mb-6" dir="ltr">
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          
          <div className="animate-scroll-left group-hover:[animation-play-state:paused]">
            {Array(4).fill(TESTIMONIALS).flat().map(({ name, role, rating, text, avatar }, i) => (
              <div key={`r1-${i}`} dir="rtl" className="w-[320px] md:w-[400px] mx-3 bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-300 shrink-0">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-blue-300 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="relative w-full flex overflow-hidden group" dir="ltr">
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          
          <div className="animate-scroll-right group-hover:[animation-play-state:paused]">
            {Array(4).fill([...TESTIMONIALS].reverse()).flat().map(({ name, role, rating, text, avatar }, i) => (
              <div key={`r2-${i}`} dir="rtl" className="w-[320px] md:w-[400px] mx-3 bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-300 shrink-0">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-blue-300 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ══════════════════════════════════════════════════════
          11. CTA BANNER  (محسّن)
      ══════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 md:px-8 py-24">
        <div className="relative rounded-[3rem] p-16 md:p-24 text-center overflow-hidden bg-gradient-to-br from-[#0a1a6e] via-blue-950 to-[#0a1a6e] text-white shadow-2xl">
          <GlowOrb className="-top-[100px] -right-[100px] w-[500px] h-[500px] bg-blue-500/20" />
          <GlowOrb className="-bottom-[100px] -left-[100px] w-[500px] h-[500px] bg-blue-400/10" />
          {/* grid lines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:40px_40px]" />
          {/* floating stars */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-pulse"
              style={{
                width: `${4 + (i % 3) * 3}px`, height: `${4 + (i % 3) * 3}px`,
                top: `${10 + i * 14}%`, left: `${8 + i * 14}%`,
                animationDelay: `${i * 0.4}s`
              }}
            />
          ))}
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-6 py-2.5 text-blue-200 text-sm font-black tracking-widest uppercase">
              <Sparkles size={16} />
              انضم للنخبة اليوم
            </div>
            <h2 className="text-white text-[clamp(32px,5vw,60px)] font-black leading-[1.1] tracking-tighter">
              هل أنت مستعد لتجهيز <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">منزلك بالكامل؟</span>
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed font-medium max-w-xl mx-auto">
              انضم إلينا الآن واستمتع بأفضل العروض الحصرية على أحدث الأجهزة والإلكترونيات المنزلية.
            </p>
            <div className="flex gap-4 justify-center flex-wrap pt-2">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-blue-950 rounded-2xl font-black text-sm transition-all duration-300 hover:bg-blue-50 hover:scale-105 shadow-xl flex items-center gap-3"
              >
                إنشاء حساب مجاني
                <ArrowUpRight size={18} strokeWidth={3} />
              </Link>
              <Link
                to="/shop"
                className="px-10 py-4 bg-white/5 text-white border border-white/15 rounded-2xl font-black text-sm transition-all duration-300 hover:bg-white/10 flex items-center gap-3"
              >
                <Eye size={18} />
                تصفح المنتجات
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;