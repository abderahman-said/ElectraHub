import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, Sparkles, Truck, Shield, CreditCard, Package, Star, Heart, Zap, Check, Eye, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());
    const [addedToCart, setAddedToCart] = useState(new Set());
    const drawerRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isCartOpen, setIsCartOpen]);

    useEffect(() => {
        if (isCartOpen) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    const handleOpenChange = (isOpen) => {
        setIsCartOpen(isOpen);
    };

    const handleRemoveItem = async (itemId, e) => {
        e.stopPropagation();
        setRemovingItems(prev => new Set(prev).add(itemId));

        const itemElement = document.getElementById(`cart-item-${itemId}`);
        if (itemElement) {
            itemElement.classList.add('animate-slideOutLeft');
            await new Promise(resolve => setTimeout(resolve, 300));
            removeFromCart(itemId);
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleQuantityChange = (itemId, newQuantity, e) => {
        e.stopPropagation();
        if (newQuantity > 0) {
            updateQuantity(itemId, newQuantity);

            // Add success animation
            setAddedToCart(prev => new Set(prev).add(itemId));
            setTimeout(() => {
                setAddedToCart(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }, 1000);
        }
    };

    const toggleItemExpansion = (itemId) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const CartItem = ({ item, index }) => {
        const isRemoving = removingItems.has(item.id);

        return (
            <div
                id={`cart-item-${item.id}`}
                className={`
                    group relative bg-white rounded-2xl border-solid border-[#17255421] p-4 mb-3
                    transition-all duration-300
                    ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                    hover:border-slate-300 hover:shadow-md
                `}
                style={{ animationDelay: `${index * 80}ms` }}
            >
                <div className="flex gap-4">
                    {/* Img - Right side for RTL */}
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl border-solid border-[#17255421]">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-1 right-1 bg-slate-900 text-white text-[16px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                            {item.quantity}×
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-[15px] leading-tight line-clamp-2">
                                {item.name}
                            </h4>
                            <button
                                onClick={(e) => handleRemoveItem(item.id, e)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                disabled={isRemoving}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-end justify-between mt-2">
                            <div className="space-y-1">
                                <div className="text-lg font-black text-slate-900">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                    {formatPrice(item.price)} للوحدة
                                </div>
                            </div>

                            <div className="flex items-center bg-slate-50 border-solid border-[#17255421] rounded-lg p-0.5">
                                <button
                                    onClick={(e) => handleQuantityChange(item.id, item.quantity - 1, e)}
                                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-600 transition-all disabled:opacity-30"
                                    disabled={item.quantity <= 1 || isRemoving}
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="w-8 text-center font-bold text-slate-900 text-xs">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={(e) => handleQuantityChange(item.id, item.quantity + 1, e)}
                                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                                    disabled={isRemoving}
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Enhanced Backdrop */}
            <div
                className={`
                    fixed inset-0 bg-black/70 backdrop-blur-md z-40
                    transition-all duration-300
                    ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => handleOpenChange(false)}
            />

            {/* Enhanced Cart Drawer */}
            <div
                ref={drawerRef}
                className={`
                    fixed right-0 top-0 h-full w-full sm:w-96 md:w-[420px] lg:max-w-xl bg-white shadow-2xl z-50
                    transform transition-all duration-500 ease-out flex flex-col
                    ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
                    ${isAnimating ? 'scale-95' : 'scale-100'}
                `}
            >
                {/* Enhanced Header */}
                <div className="bg-[#2650fc] text-white px-6 py-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2650fc]/10 to-transparent"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#2650fc]/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <ShoppingBag className="w-6 h-6 text-[#fff]" />
                            </div>
                            <div>
                                <h2 className="text-xl text-white font-bold tracking-tight">عربة التسوق</h2>
                                <p className="pt-2 text-xs text-slate-400 font-medium mt-0.5">
                                    لديك <span className="text-white">{cart.length}</span> {cart.length === 1 ? 'منتج' : 'منتجات'} حالياً
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenChange(false)}
                            className="w-10 h-10 bg-[#031a79] text-slate-400 rounded-xl flex items-center justify-center hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {cart.length > 0 && (
                        <div className="mt-6 flex items-baseline gap-2">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">الإجمالي:</span>
                            <span className="text-2xl font-black text-white">{formatPrice(cartTotal)}</span>
                        </div>
                    )}
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 min-h-[400px]">
                            <div className="text-center">
                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#2650fc] mb-2">عربة التسوق فارغة</h3>
                                <p className="text-gray-600 mb-6 max-w-sm">
                                    يبدو أنك لم تضف أي شيء لعربة التسوق بعد. ابدأ التسوق لملئها!
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Link
                                        to="/shop"
                                        onClick={() => handleOpenChange(false)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2650fc] text-white rounded-xl hover:bg-primary-hover transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <ShoppingBag size={18} />
                                        ابدأ التسوق
                                    </Link>
                                    <button
                                        onClick={() => handleOpenChange(false)}
                                        className="px-6 py-3 border-2 border-[#17255421] text-gray-700 rounded-xl hover:border-[#2650fc] hover:bg-slate-50 transition-colors duration-200 font-semibold"
                                    >
                                        لاحقاً
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 space-y-4">
                            {cart.map((item, index) => (
                                <CartItem key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Enhanced Footer */}
                <div className="border-t border-[#17255421] p-6 bg-slate-50/50 backdrop-blur-sm">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">المجموع الفرعي</span>
                            <span className="text-3xl font-bold text-primary">
                                {formatPrice(cartTotal)}
                            </span>
                        </div>

                        {cartTotal > 100 && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                                <Truck className="w-5 h-5" />
                                <span className="text-sm font-semibold">لقد تأهلت للشحن المجاني!</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-1">
                            <Shield className="w-4 h-4" />
                            <span>دفع آمن 100% — ضمان استرداد الأموال</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link
                                to="/checkout"
                                onClick={() => handleOpenChange(false)}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#2650fc] text-white rounded-xl hover:bg-[#031a79] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                            >
                                <CreditCard className="w-5 h-5" />
                                المتابعة للدفع
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
                            </Link>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleOpenChange(false)}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-[#2650fc] hover:bg-white transition-all duration-200 font-medium text-sm"
                                >
                                    استمر في التسوق
                                </button>
                                <button
                                    className="px-4 py-3 border-2 border-slate-200 text-slate-400 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                    onClick={() => cart.forEach(item => removeFromCart(item.id))}
                                    title="مسح العربة"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
