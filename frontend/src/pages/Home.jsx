import { TrendingUp, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import OptimizedImage from '../components/OptimizedImage';
import { productsAPI, categoriesAPI, suppliersAPI, trustBadgesAPI } from '../services/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [trustBadges, setTrustBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="overflow-hidden bg-white" dir="rtl">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : (
        <>
          <Hero />

          {/* Categories Grid - High End SaaS Look */}
          <section id="categories" className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-50/20 -z-10" />
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-[16px] font-black text-[#2650fc] uppercase tracking-[0.3em]">نظام السوق</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                  فئات <span className="text-brand">المنزل</span> المتخصصة
                </h2>
                <p className="text-slate-500 font-medium">
                  مورّد من مستوردين عالميين معتمدين متخصصين في الأدوات والأجهزة المنزلية.
                </p>
              </div>

              <div className="categories-slider">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={24}
                  slidesPerView={2}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 6 },
                  }}
                  className="pb-16"
                >
                  {categories.map((cat, i) => (
                    <SwiperSlide key={cat.id} className='py-5'>
                      <div className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/5] cursor-pointer">
                        <OptimizedImage
                          src={cat.image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'}
                          alt={cat.name_ar || cat.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-right">
                          <h3 className="text-xl font-bold text-white mb-1">{cat.name_ar || cat.name}</h3>
                          <p className="text-sm text-white/80 font-medium">{cat.product_count || 0} منتج</p>
                          <button className="mt-4 w-full rounded-xl bg-[#2650fc] py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
                            عرض المنتجات
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

            </div>
          </section>

          {/* Marketplace Section */}
          <section id="marketplace" className="py-32 relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 -z-10 blur-3xl opacity-50" />
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                <div className="max-w-2xl space-y-4 text-right">
                  <span className="text-[16px] font-black text-[#2650fc] uppercase tracking-[0.3em]">مخزون B2B</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                    سوق <span className="text-brand">الجملة</span>
                  </h2>
                  <p className="text-lg text-slate-500 font-medium max-w-xl">
                    مخزون فوري من المستوردين المعتمدين. احمِ عملك بالترخيص المباشر وشفافية الأدوات والمنتجات المنزلية.
                  </p>
                </div>
                <Link to="/shop" className="group flex items-center gap-3 text-[#2650fc] font-black uppercase tracking-widest text-xs hover:text-brand-dark transition-all">
                  بحث متقدم في القوائم
                  <div className="h-10 w-10 glass rounded-full flex items-center justify-center group-hover:-translate-x-2 transition-transform shadow-premium">
                    <ArrowRight size={18} className="rotate-180" />
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Top Importers / Partners Section */}
          <section id="importers" className="py-32 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10" />
            <div className="container mx-auto px-4 md:px-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 ">
                <div className="max-w-xl space-y-4">
                  <span className="text-[16px] font-black text-yellow-400 uppercase tracking-[0.4em]">الشركاء النخبة</span>
                  <h2 className="text-4xl md:text-6xl text-white font-black tracking-tighter leading-[0.9]">
                    مركز <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">المستوردين المعتمدين</span>
                  </h2>
                </div>
                <button className="px-10 py-5 bg-white text-blue-950 font-black rounded-2xl hover:bg-yellow-400 transition-all uppercase text-xs tracking-widest shadow-2xl shadow-white/5">
                  عرض جميع الشركاء
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suppliers.slice(0, 3).map((supplier, i) => (
                  <div key={supplier.id} className="group relative glass-dark p-8 rounded-[2.5rem] border-white/5 hover:-translate-y-4 transition-all duration-700 overflow-hidden">
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center p-3">
                          <img src={supplier.logo_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=75'} className="w-full h-full object-cover rounded-lg" alt={supplier.name} />
                        </div>
                        <div className="px-4 py-1.5 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                          <span className="text-[16px] font-black text-yellow-400 uppercase tracking-widest">معتمد A+</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white tracking-tight">{supplier.name}</h3>
                        <p className="text-sm font-medium text-slate-400">{supplier.category || 'مورد موثوق'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                        <div>
                          <p className="text-[16px] font-black text-slate-500 uppercase tracking-widest mb-1">المخزون النشط</p>
                          <p className="text-lg font-black text-yellow-400">{supplier.product_count || 0} منتج</p>
                        </div>
                        <div>
                          <p className="text-[16px] font-black text-slate-500 uppercase tracking-widest mb-1">الخبرة</p>
                          <p className="text-lg font-black text-white">{supplier.experience || '5+ سنوات'}</p>
                        </div>
                      </div>

                      <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[16px] font-black uppercase tracking-widest transition-all">
                        عرض الملف الشخصي للمستورد
                      </button>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-blue-600/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Badges - B2B Focus */}
          <section className="py-24 bg-mesh border-y border-blue-50">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {trustBadges.map((badge, i) => {
                  const getIcon = (iconName) => {
                    switch (iconName) {
                      case 'trending-up': return <TrendingUp className="text-brand" size={32} />;
                      case 'award': return <Award className="text-yellow-600" size={32} />;
                      case 'shopping-bag': return <ShoppingBag className="text-brand" size={32} />;
                      default: return <TrendingUp className="text-brand" size={32} />;
                    }
                  };

                  return (
                    <div key={badge.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100">
                      <div className="h-16 w-16 bg-brand/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        {getIcon(badge.icon)}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">{badge.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;