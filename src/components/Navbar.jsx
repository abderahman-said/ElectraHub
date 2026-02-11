import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ cartCount = 0 }) => {
  const { setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'السوق', href: '/#marketplace' },
    { name: 'الفئات', href: '/#categories' },
    { name: 'الشركاء', href: '/#importers' },
    { name: 'الأسعار', href: '/#pricing' }
  ];

  return (
    <header className="sticky top-0 z-50 glass py-3 border-b border-white/20 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-8 h-18 lg:h-22 flex items-center justify-between">
        <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="ElectraHub" 
                className="w-full h-full object-contain max-w-[100px]"
              />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xl font-black uppercase tracking-widest text-blue-950 hover:text-blue-600 transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute right-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button className="h-11 w-11 glass rounded-xl flex items-center justify-center text-blue-950 hover:bg-white transition-all">
              <Search size={18} />
            </button>
            <Link to="/login" className="h-11 px-6 glass rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-blue-950 hover:bg-white transition-all">
              تسجيل الدخول
            </Link>
          </div>

          <button
            className="h-11 w-11 bg-blue-700 text-white rounded-xl flex items-center justify-center relative hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-950 text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden h-11 w-11 glass rounded-xl flex items-center justify-center text-blue-950"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass border-b border-blue-100 py-6 px-6 flex flex-col gap-4 shadow-2xl animate-slideInDown">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-black uppercase tracking-widest text-blue-950 py-4 px-6 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
              <ArrowRight size={16} className="text-blue-200 rotate-180" />
            </a>
          ))}
          <div className="pt-4 border-t border-blue-50 flex flex-col gap-3">
            <Link
              to="/register-importer"
              className="w-full py-5 bg-blue-700 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              أصبح مستورداً
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
