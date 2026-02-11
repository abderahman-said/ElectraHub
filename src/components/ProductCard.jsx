import React, { useState } from 'react';
import { ShoppingBag, Star, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { id, name, price, category, image, stock = 10, rating = 4.8 } = product;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative bg-white rounded-[2.5rem] shadow-premium hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.15)] transition-all duration-700 overflow-hidden border border-slate-100 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${id}`}
        className="block focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-[2.5rem]"
      >
        <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
          {/* Main Product Image */}
          <img
            src={image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            alt={name}
          />

          {/* Hover Overlay Actions */}
          <div className={`absolute inset-0 bg-blue-950/20 backdrop-blur-[2px] flex items-center justify-center gap-4 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-12 w-12 glass rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-700 hover:text-white transition-all transform hover:scale-110 shadow-xl">
              <ShoppingBag size={20} />
            </div>
            <div className="h-12 w-12 glass rounded-full flex items-center justify-center text-blue-900 hover:bg-white transition-all transform hover:scale-110 shadow-xl">
              <ArrowRight size={20} />
            </div>
          </div>

          {/* Premium Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="glass px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900 shadow-sm">
              Verified Importer
            </span>
            {stock < 5 && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                Low Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50">
              {category}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-blue-950">{rating}</span>
              <div className="flex text-yellow-500"><Star size={14} fill="currentColor" /></div>
            </div>
          </div>

          <h3 className="text-xl font-black text-blue-950 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300 min-h-[3.5rem]">
            {name}
          </h3>

          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wholesale Price</span>
                <span className="text-3xl font-black text-blue-700 tracking-tighter">${price}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min. Order</span>
                <p className="text-sm font-black text-blue-950">50 Units</p>
              </div>
            </div>

            <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all duration-500 shadow-lg shadow-blue-100 active:scale-95">
              Request Quotation
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;