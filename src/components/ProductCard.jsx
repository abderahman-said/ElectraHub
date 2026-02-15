import React, { useState } from 'react';
import { ShoppingBag, Star, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const ProductCard = ({ product }) => {
  const { id, name, averagePrice, price, category, image, suppliers = [], rating = 4.8 } = product;
  const displayPrice = averagePrice || price;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative bg-white rounded-[2.5rem] shadow-premium hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.15)] transition-all duration-700 overflow-hidden border-solid border-[#17255421] hover:-translate-y-2 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${id}`}
        className="block focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-[2.5rem] flex-grow"
      >
        <div className="relative h-[250px] bg-slate-50 overflow-hidden">
          {/* Main Product Image */}
          <OptimizedImage
            src={image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'}`}
            alt={`${name} - ${category}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Hover Overlay Actions */}
          <div className={`absolute inset-0 bg-blue-950/20 backdrop-blur-[2px] flex items-center justify-center gap-4 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="h-12 w-12 glass rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-700 hover:text-white transition-all transform hover:scale-110 shadow-xl"
              aria-label="إضافة إلى السلة"
            >
              <ShoppingBag size={20} />
            </button>
            <button
              className="h-12 w-12 glass rounded-full flex items-center justify-center text-blue-900 hover:bg-white transition-all transform hover:scale-110 shadow-xl"
              aria-label="عرض التفاصيل"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-6 right-6">
            <span className="glass px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest text-blue-900 shadow-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-right">سعر الجملة</span>
              <span className="text-3xl font-black text-[#2650fc] tracking-tighter">{(displayPrice * 50).toLocaleString()} ج.م</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <span className="text-sm font-black text-yellow-700">{rating}</span>
              <Star size={14} className="text-yellow-500" fill="currentColor" />
            </div>
          </div>

          <h3 className="text-xl font-black text-blue-950 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {name}
          </h3>

          <div className="pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#2650fc]/10 text-[#2650fc] text-xs font-black px-2.5 py-1 rounded-lg border border-brand/20">الحد الأدنى: 5 قطع</span>
              <span className="text-sm font-black text-slate-400">|</span>
              <span className="text-sm font-black text-slate-600">متوفر من {suppliers.length} موردين</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {suppliers.map((supplier, idx) => (
                <div key={idx} className="group/supplier relative">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover/supplier:border-brand/40 transition-all duration-300">
                    <img
                      src={supplier.image}
                      alt={`مورد: ${supplier.name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover/supplier:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                    {supplier.name}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-4 bg-[#2650fc] text-white font-black rounded-2xl hover:bg-brand-dark transition-all uppercase text-sm tracking-widest shadow-lg shadow-brand/20">
              أضف للطلب
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
