import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, ShoppingBag, ArrowLeft, LayoutDashboard, LogOut, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_PRODUCTS } from '../data/products';
import OptimizedImage from './OptimizedImage';

const Navbar = ({ cartCount = 0 }) => {
  const { setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'السوق', href: '/shop' },
    { name: 'الشركاء', href: '/importers' },
    { name: 'الأسعار', href: '/pricing' }
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return SAMPLE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky bg-white top-0 z-50 py-3 border-b border-white/20 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-8 h-18 lg:h-22 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <OptimizedImage
            src="/logo.png"
            alt="Bel-Gomla Logo"
            width="150"
            height="150"
            className="h-auto w-auto max-w-[100px]  rounded-xl"
            priority={true}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-xl font-black uppercase tracking-widest text-slate-900 hover:text-[#2650fc] transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute right-0 -bottom-1 w-0 h-0.5 bg-[#2650fc] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="h-11 w-11 glass rounded-xl flex items-center justify-center text-slate-900 hover:bg-white transition-all"
              aria-label="فتح البحث"
            >
              <Search size={18} />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="h-11 px-6 bg-[#2650fc]/10 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-[#2650fc] hover:bg-white transition-all gap-2">
                  <LayoutDashboard size={16} />
                  لوحة التحكم
                </Link>
                <button
                  onClick={logout}
                  className="h-11 w-11 glass rounded-xl flex items-center justify-center text-red-500 hover:bg-white transition-all"
                  title="تسجيل الخروج"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="h-11 px-6 glass rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest text-blue-950 hover:bg-white transition-all">
                تسجيل الدخول
              </Link>
            )}
          </div>

          <button
            className="h-11 w-11 bg-[#2650fc] text-white rounded-xl flex items-center justify-center relative hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
            onClick={() => setIsCartOpen(true)}
            aria-label={`عربة التسوق${cartCount > 0 ? ` - ${cartCount} منتج` : ''}`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[16px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden h-11 w-11 glass rounded-xl flex items-center justify-center text-blue-950"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Popup Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-blue-950/20 backdrop-blur-md flex flex-col pt-24 px-4 animate-fadeIn">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-grow relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="ابحث عن أدوات منزلية، مستوردين..."
                  className="w-full bg-white/90 backdrop-blur-xl border border-white/20 px-8 py-6 rounded-[2rem] text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-brand/20 shadow-2xl transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2650fc] hover:scale-110 transition-transform" aria-label="بحث">
                  <Search size={28} />
                </button>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="h-11 w-11 glass rounded-xl flex items-center justify-center text-blue-950 hover:bg-white transition-all shadow-lg"
                aria-label="إغلاق البحث"
              >
                <X size={24} />
              </button>
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-4 animate-slideIn">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-6 py-4 border-b border-blue-50/50">النتائج المقترحة ({searchResults.length})</p>
                <div className="flex flex-col">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="group flex items-center gap-6 p-6 rounded-[2rem] hover:bg-blue-50 transition-all"
                    >
                      <div className="h-16 w-16 bg-white rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-sm">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                        ) : (
                          <Package className="text-slate-300" size={24} />
                        )}
                      </div>
                      <div className="flex-grow flex flex-col gap-1">
                        <span className="font-black text-slate-900 text-lg group-hover:text-[#2650fc] transition-colors uppercase tracking-tight">{product.name}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                      </div>
                      <div className="text-left">
                        <span className="font-black text-[#2650fc] text-xl tracking-tighter">${product.averagePrice}</span>
                      </div>
                      <div className="h-11 w-11 glass rounded-xl flex items-center justify-center text-blue-950 group-hover:bg-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t border-blue-50/50">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-5 bg-[#2650fc] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3"
                  >
                    عرض جميع النتائج
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl p-12 text-center animate-slideIn">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-blue-950 mb-2">عذراً، لم نجد نتائج لـ "{searchQuery}"</h3>
                <p className="text-slate-500 font-medium">جرب البحث بكلمات مختلفة أو تصفح الأقسام</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass border-b border-blue-100 py-6 px-6 flex flex-col gap-4 shadow-2xl animate-slideInDown">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-black uppercase tracking-widest text-blue-950 py-4 px-6 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
              <ArrowLeft size={16} className="text-blue-200 rotate-180" />
            </Link>
          ))}
          <div className="pt-4 border-t border-blue-50 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full py-5 bg-blue-50 text-blue-700 text-center rounded-2xl font-black text-xs uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-5 bg-red-50 text-red-500 text-center rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="w-full py-5 bg-[#2650fc] text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                أصبح مستورداً
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
