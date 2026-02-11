import { TrendingUp, Award, ShoppingBag, ArrowRight, Wind, Snowflake, Monitor, Waves, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const categories = [
    { name: 'HVAC & Cooling', icon: <Wind size={32} />, count: '1.2k Products', importers: '45 Sellers' },
    { name: 'Refrigeration', icon: <Snowflake size={32} />, count: '850 Products', importers: '32 Sellers' },
    { name: 'Smart Display', icon: <Monitor size={32} />, count: '2.4k Products', importers: '68 Sellers' },
    { name: 'Washing Systems', icon: <Waves size={32} />, count: '640 Products', importers: '24 Sellers' },
    { name: 'Power & Energy', icon: <Zap size={32} />, count: '1.1k Products', importers: '38 Sellers' },
    { name: 'Safety & Security', icon: <ShieldCheck size={32} />, count: '420 Products', importers: '15 Sellers' },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <Hero />

      {/* Categories Grid - High End SaaS Look */}
      <section id="categories" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50/20 -z-10" />
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Marketplace Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tighter leading-tight">
              Specialized <span className="text-gradient">Appliance</span> Categories
            </h2>
            <p className="text-slate-500 font-medium">
              Sourced from certified global importers specialized in enterprise-grade electrical systems.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white hover:-translate-y-2 transition-all duration-500 border-blue-50/50 shadow-premium">
                <div className="h-20 w-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500 shadow-inner">
                  {cat.icon}
                </div>
                <h3 className="text-sm font-black text-blue-950 mb-2 uppercase tracking-tight">{cat.name}</h3>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{cat.importers}</p>
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
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">B2B Inventory</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-950 tracking-tighter leading-tight">
                Wholesale <span className="text-gradient">Marketplace</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium max-w-xl">
                Real-time stock from verified importers. Protect your business with direct licensing and transparent MOQ.
              </p>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-blue-900 font-black uppercase tracking-widest text-xs hover:text-blue-700 transition-all">
              Deep Search Listings
              <div className="h-10 w-10 glass rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-premium">
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <ProductCard product={{ id: 1, name: "Smart Cooling Pro XL", price: 1200, category: "Refrigeration", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" }} />
            <ProductCard product={{ id: 2, name: "Industrial Air Flow 5K", price: 850, category: "HVAC", image: "https://images.unsplash.com/photo-1591189863430-ab87e120f312?auto=format&fit=crop&w=800&q=80" }} />
            <ProductCard product={{ id: 3, name: "Vision Core OLED 8K", price: 2100, category: "Electronics", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" }} />
            <ProductCard product={{ id: 4, name: "Swift Clean Turbo", price: 450, category: "Washing", image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=800&q=80" }} />
          </div>
        </div>
      </section>

      {/* Top Importers / Partners Section */}
      <section id="importers" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 font-heading">
            <div className="max-w-xl space-y-4">
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.4em]">Elite Partners</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                Verified <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Importers Hub</span>
              </h2>
            </div>
            <button className="px-10 py-5 bg-white text-blue-950 font-black rounded-2xl hover:bg-yellow-400 transition-all uppercase text-xs tracking-widest shadow-2xl shadow-white/5">
              View All Partners
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Al-Nour Global',
                cat: 'Heavy Appliances',
                stock: '1.2k Items',
                active: '24 Years',
                img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Tech Suez Logistics',
                cat: 'Smart Electronics',
                stock: '850 Items',
                active: '12 Years',
                img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Delta Cooling Co.',
                cat: 'HVAC Specialists',
                stock: '2.1k Items',
                active: '15 Years',
                img: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80'
              }
            ].map((partner, i) => (
              <div key={i} className="group relative glass-dark p-8 rounded-[2.5rem] border-white/5 hover:-translate-y-4 transition-all duration-700 overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center p-3">
                      <img src={partner.img} className="w-full h-full object-cover rounded-lg" alt="" />
                    </div>
                    <div className="px-4 py-1.5 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                      <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Verified A+</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tighter">{partner.name}</h3>
                    <p className="text-sm font-medium text-slate-400">{partner.cat}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Stock</p>
                      <p className="text-lg font-black text-yellow-400">{partner.stock}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                      <p className="text-lg font-black text-white">{partner.active}</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    View Importer Profile
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
                title: 'Wholesale Pricing',
                desc: 'Direct factory rates from licensed importers without middlemen markups.',
                icon: <TrendingUp className="text-blue-700" size={32} />
              },
              {
                title: 'Verified Supply',
                desc: 'Every importer on ElectraHub undergoes a strict 24-point verification audit.',
                icon: <Award className="text-yellow-600" size={32} />
              },
              {
                title: 'B2B Logistics',
                desc: 'Integrated logistics tracking and container-level shipping management.',
                icon: <ShoppingBag className="text-blue-700" size={32} />
              }
            ].map((badge, i) => (
              <div key={i} className="glass p-10 rounded-[2.5rem] shadow-premium hover:-translate-y-2 transition-all duration-500 group border-white/50">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {badge.icon}
                </div>
                <h3 className="text-xl font-black text-blue-950 mb-4 tracking-tight uppercase tracking-wider">{badge.title}</h3>
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