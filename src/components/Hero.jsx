import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);


  return (
    <section className="relative min-h-screen flex items-center bg-mesh overflow-hidden py-20">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className={`space-y-10 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full shadow-premium border border-white/50">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-blue-900 tracking-widest uppercase">
                الطلبات الشهرية
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-3xl pb-3 md:text-4xl lg:text-6xl xl:text-7xl font-black text-blue-950 leading-[1] tracking-tighter">
                التوريد الذكي <br />
                <span className="text-gradient">تسريع النمو</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
                يربط إلكتراهب بـ <span className="text-blue-700 font-bold underline decoration-yellow-400/50">موردي</span> مع تجار مؤهلين في نظام سحابي سلس مدفوع بالبيانات.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-blue-700 text-white font-extrabold rounded-2xl overflow-hidden transition-all duration-500 hover:bg-blue-800 hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto text-lg shadow-xl shadow-blue-200"
              >
                <span className="relative z-10">ابدأ التوريد الآن</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>

              <Link
                to="/register"
                className="group inline-flex items-center gap-4 text-blue-900 font-bold hover:text-blue-700 transition-all text-lg"
              >
                <span>كن مستورداً</span>
                <div className="h-10 w-10 glass rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-premium">
                  <ArrowLeft size={20} />
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 pt-8">
              {[
                { val: '150+', label: 'مستوردون موثقون' },
                { val: '8.4k', label: 'الطلبات الشهرية' },
                { val: '99.9%', label: 'دقة الطلبات' }
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-black text-blue-950   tracking-tighter">{s.val}</div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visuals */}
          <div className={`relative transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />

              <div className="relative glass p-4 rounded-[2.5rem] shadow-premium">
                <div className="relative aspect-[5/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img
                    src="/hero_premium.png"
                    alt="الأجهزة الذكية"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Glass Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl shadow-premium animate-slideInUp">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                          <TrendingUp size={16} />
                        </div>
                        <span className="text-sm font-black text-blue-950">النمو في الأجهزة الذكية</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+14.5%</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase">النمو في الأجهزة الذكية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;