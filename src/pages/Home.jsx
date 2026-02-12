import { TrendingUp, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const categories = [
    { name: 'تكييف وتبريد', image: 'https://images.unsplash.com/photo-1585338927620-f134b2da3f31?auto=format&fit=crop&w=200&q=75', count: '1.2k منتج', importers: '45 بائع' },
    { name: 'ثلاجات', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=200&q=75', count: '850 منتج', importers: '32 بائع' },
    { name: 'شاشات ذكية', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=75', count: '2.4k منتج', importers: '68 بائع' },
    { name: 'غسالات', image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=200&q=75', count: '640 منتج', importers: '24 بائع' },
    { name: 'طاقة وكهرباء', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=75', count: '1.1k منتج', importers: '38 بائع' },
    { name: 'سلامة وأمان', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=200&q=75', count: '420 منتج', importers: '15 بائع' },
  ];

  return (
    <div className="overflow-hidden bg-white" dir="rtl">
      <Hero />

      {/* Categories Grid - High End SaaS Look */}
      <section id="categories" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50/20 -z-10" />
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[16px] font-black text-blue-600 uppercase tracking-[0.3em]">نظام السوق</span>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter leading-tight">
              فئات <span className="text-gradient">الأجهزة</span> المتخصصة
            </h2>
            <p className="text-slate-500 font-medium">
              مورّد من مستوردين عالميين معتمدين متخصصين في الأنظمة الكهربائية للمؤسسات.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="glass p-6 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white hover:-translate-y-3 transition-all duration-500 border-blue-50/50 shadow-premium cursor-pointer">
                <div className="relative h-24 w-24 mb-6 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-500"></div>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="relative w-full h-full object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-sm font-black text-blue-950 mb-2 uppercase tracking-tight group-hover:text-blue-700 transition-colors duration-300">{cat.name}</h3>
                <div className="space-y-1">
                  <p className="text-[16px] font-bold text-slate-400 uppercase tracking-widest">{cat.count}</p>
                  <p className="text-[16px] font-black text-blue-600 uppercase tracking-widest">{cat.importers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-32 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 -z-10 blur-3xl opacity-50" />
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl space-y-4">
              <span className="text-[16px] font-black text-blue-600 uppercase tracking-[0.3em]">مخزون B2B</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-950 tracking-tighter leading-tight">
                سوق <span className="text-gradient">الجملة</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium max-w-xl">
                مخزون فوري من المستوردين المعتمدين. احمِ عملك بالترخيص المباشر وشفافية الحد الأدنى للطلب.
              </p>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-blue-900 font-black uppercase tracking-widest text-xs hover:text-blue-700 transition-all">
              بحث متقدم في القوائم
              <div className="h-10 w-10 glass rounded-full flex items-center justify-center group-hover:-translate-x-2 transition-transform shadow-premium">
                <ArrowRight size={18} className="rotate-180" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <ProductCard product={{ id: 1, name: "تكييف ذكي احترافي XL", price: 1200, category: "ثلاجات", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=75" }} />
            <ProductCard product={{ id: 2, name: "تهوية صناعية 5K", price: 850, category: "تكييف", image: "https://images.unsplash.com/photo-1591189863430-ab87e120f312?auto=format&fit=crop&w=600&q=75" }} />
            <ProductCard product={{ id: 3, name: "شاشة OLED 8K", price: 2100, category: "إلكترونيات", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=75" }} />
            <ProductCard product={{ id: 4, name: "غسالة توربو سريعة", price: 450, category: "غسالات", image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=600&q=75" }} />
          </div>
        </div>
      </section>

      {/* Top Importers / Partners Section */}
      <section id="importers" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20  ">
            <div className="max-w-xl space-y-4">
              <span className="text-[16px] font-black text-yellow-400 uppercase tracking-[0.4em]">الشركاء النخبة</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                مركز <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">المستوردين المعتمدين</span>
              </h2>
            </div>
            <button className="px-10 py-5 bg-white text-blue-950 font-black rounded-2xl hover:bg-yellow-400 transition-all uppercase text-xs tracking-widest shadow-2xl shadow-white/5">
              عرض جميع الشركاء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'النور العالمية',
                cat: 'الأجهزة الثقيلة',
                stock: '1.2k عنصر',
                active: '24 سنة',
                img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=100&q=75'
              },
              {
                name: 'تكنولوجيا السويس للخدمات',
                cat: 'الإلكترونيات الذكية',
                stock: '850 عنصر',
                active: '12 سنة',
                img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=75'
              },
              {
                name: 'شركة دلتا للتبريد',
                cat: 'متخصصو التكييف',
                stock: '2.1k عنصر',
                active: '15 سنة',
                img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=75'
              }
            ].map((partner, i) => (
              <div key={i} className="group relative glass-dark p-8 rounded-[2.5rem] border-white/5 hover:-translate-y-4 transition-all duration-700 overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center p-3">
                      <img src={partner.img} className="w-full h-full object-cover rounded-lg" alt="" />
                    </div>
                    <div className="px-4 py-1.5 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                      <span className="text-[16px] font-black text-yellow-400 uppercase tracking-widest">معتمد A+</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight text-white">{partner.name}</h3>
                    <p className="text-sm font-medium text-slate-400">{partner.cat}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-[16px] font-black text-slate-500 uppercase tracking-widest mb-1">المخزون النشط</p>
                      <p className="text-lg font-black text-yellow-400">{partner.stock}</p>
                    </div>
                    <div>
                      <p className="text-[16px] font-black text-slate-500 uppercase tracking-widest mb-1">الخبرة</p>
                      <p className="text-lg font-black text-white">{partner.active}</p>
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
            {[
              {
                title: 'أسعار الجملة',
                desc: 'أسعار المصنع المباشرة من المستوردين المرخصين بدون هوامش ربح للوسطاء.',
                icon: <TrendingUp className="text-blue-700" size={32} />
              },
              {
                title: 'توريد معتمد',
                desc: 'كل مستورد في إلكترا هب يخضع لفحص تحقق صارم من 24 نقطة.',
                icon: <Award className="text-yellow-600" size={32} />
              },
              {
                title: 'خدمات B2B',
                desc: 'تتبع الخدمات اللوجستية المتكاملة وإدارة الشحن على مستوى الحاويات.',
                icon: <ShoppingBag className="text-blue-700" size={32} />
              }
            ].map((badge, i) => (
              <div key={i} className="glass p-10 rounded-[2.5rem] shadow-premium hover:-translate-y-2 transition-all duration-500 group border-white/50">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {badge.icon}
                </div>
                <h3 className="text-xl font-black text-blue-950 mb-4 tracking-tight uppercase">{badge.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;