import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getProductImage, handleImageError } from '../utils/imageUtils';
import {
    ArrowLeft, ShoppingBag, Truck, ShieldCheck, Star,
    Heart, Share2, Zap, Cpu, Settings, Package,
    ClipboardList, Phone, FileText, BadgeCheck, Scale
} from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getProduct(id);
            setProduct(response.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل المنتج...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📦</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">المنتج غير موجود</h2>
                    <p className="text-gray-600 mb-6">المنتج الذي تبحث عنه غير موجود.</p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        <ArrowLeft size={20} className="rotate-180" />
                        العودة للمتجر
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        // Add the product multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const handleQuantityChange = (newQuantity) => {
        const clampedQuantity = Math.max(1, Math.min(999, newQuantity));
        setQuantity(clampedQuantity);
    };

    // Electrical product certifications & specs badges
    const certifications = [
        { label: 'CE Certified', color: 'blue' },
        { label: 'ISO 9001', color: 'green' },
        { label: 'IEC 60364', color: 'purple' },
    ];

    // Generate image variations for gallery
    const productImages = [
        getProductImage(product),
        '/placeholder-product.webp',
        '/placeholder-product.webp',
        '/placeholder-product.webp'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white" dir="rtl">

            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                    <ArrowLeft size={18} className="rotate-180" />
                    العودة للمجموعة
                </Link>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Gallery Section ── */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={productImages[selectedImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={handleImageError}
                                />
                            </div>

                            {/* Certifications badge overlay */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                {certifications.map((cert, i) => (
                                    <span
                                        key={i}
                                        className={`px-2 py-1 bg-${cert.color}-600 text-white text-xs font-bold rounded-lg shadow`}
                                    >
                                        {cert.label}
                                    </span>
                                ))}
                            </div>

                            {/* Action buttons overlay */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
                                </button>
                                <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <Share2 size={18} className="text-gray-600 hover:text-blue-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail gallery */}
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedImageIndex === index
                                        ? 'ring-2 ring-blue-500 ring-offset-2'
                                        : 'hover:ring-2 hover:ring-blue-500'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Quick Specs Card */}
                        <div className="bg-[#0f172a] text-white rounded-2xl p-5 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Zap size={20} className="text-yellow-400" />
                                <div>
                                    <p className="text-xs text-gray-400">الجهد الكهربي</p>
                                    <p className="font-bold text-sm">220 – 240 V</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Cpu size={20} className="text-blue-400" />
                                <div>
                                    <p className="text-xs text-gray-400">التردد</p>
                                    <p className="font-bold text-sm">50 / 60 Hz</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Settings size={20} className="text-green-400" />
                                <div>
                                    <p className="text-xs text-gray-400">القدرة</p>
                                    <p className="font-bold text-sm">2200 W</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-purple-400" />
                                <div>
                                    <p className="text-xs text-gray-400">الضمان</p>
                                    <p className="font-bold text-sm">3 سنوات</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Info Section ── */}
                    <div className="space-y-6">

                        {/* Product Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                    {product.category_name}
                                </span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 mr-2">4.9 (128 تقييم)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h1>

                            {/* SKU / Model */}
                            <p className="text-sm text-gray-500">
                                رقم الموديل: <span className="font-mono font-semibold text-gray-700">EL-{product.id?.toString().padStart(4, '0')}</span>
                            </p>

                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-gray-900">${product.price || 0}</span>
                                <span className="text-lg text-gray-500 line-through">${((product.price || 0) * 1.3).toFixed(2)}</span>
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">وفر 23%</span>
                            </div>

                            {/* MOQ notice */}
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                                <Package size={16} />
                                الحد الأدنى للطلب: <span className="font-bold">5 وحدات</span> — أسعار خاصة للكميات الكبيرة
                            </div>
                        </div>

                        {/* Quantity & Order Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
                            <h3 className="font-semibold text-gray-900 text-lg">الكمية والطلب</h3>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">الكمية المطلوبة</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xl"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="999"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-24 h-11 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all font-bold text-xl"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500 mr-2">وحدة</span>
                                </div>
                            </div>

                            {/* Volume pricing tiers */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">أسعار الكميات</p>
                                {[
                                    { range: '1 – 9 وحدات', price: product.price || 0, active: quantity < 10 },
                                    { range: '10 – 49 وحدة', price: ((product.price || 0) * 0.9).toFixed(2), active: quantity >= 10 && quantity < 50 },
                                    { range: '50+ وحدة', price: ((product.price || 0) * 0.8).toFixed(2), active: quantity >= 50 },
                                ].map((tier, i) => (
                                    <div
                                        key={i}
                                        className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg transition-colors ${tier.active ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600'}`}
                                    >
                                        <span>{tier.range}</span>
                                        <span>${tier.price} / وحدة</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-[#0f172a] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#031a79] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={24} />
                                أضف للسلة — ${((product.price || 0) * quantity).toFixed(2)}
                            </button>
                         
                        </div>

                        {/* Verified Suppliers Section */}
                        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-[2rem] p-8 border border-blue-100/50 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                            الموردين المعتمدين
                                            <span className="flex h-6 w-6 items-center justify-center bg-blue-600 text-white rounded-full text-[10px] shadow-lg shadow-blue-200">
                                                {product.suppliers?.length || 0}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Verified B2B Electrical Suppliers</p>
                                    </div>
                                    <div className="flex -space-x-3 rtl:space-x-reverse">
                                        {product.suppliers?.map((s, i) => (
                                            <img key={i} src={s.image} className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover" alt="" />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {product.suppliers?.map((supplier, i) => (
                                        <div key={i} className="bg-white/60 backdrop-blur border border-white/60 p-3 rounded-2xl hover:bg-white/80 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 group/card transform hover:-translate-y-1">
                                            <div className="flex flex-col  sm:items-center justify-between gap-6">
                                                <div className="flex items-center flex-col gap-5">
                                                    <div className="relative">
                                                        <img src={supplier.image} alt={supplier.name} className="w-[100px] h-[100px] rounded-2xl object-cover shadow-md group-hover/card:scale-105 transition-transform duration-500" />
                                                        <div className="absolute -bottom-2 -left-2 bg-blue-600 text-white p-1 rounded-lg shadow-lg">
                                                            <ShieldCheck size={14} />
                                                        </div>
                                                    </div>
                                                    <div className="font-extrabold text-blue-950 text-xl mb-1">{supplier.name}</div>
                                                </div>

                                                <a
                                                    href={`https://wa.me/${supplier.whatsapp?.replace('+', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200/50 group/wa active:scale-95"
                                                >
                                                    <span className="uppercase tracking-widest">تواصل سريع</span>
                                                    <div className="bg-white/20 p-1.5 rounded-lg group-hover/wa:rotate-12 transition-transform">
                                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                {[
                                    { id: 'description', label: 'الوصف', icon: FileText },
                                    { id: 'specs', label: 'المواصفات', icon: ClipboardList },
                                    { id: 'shipping', label: 'الشحن', icon: Truck },
                                    { id: 'reviews', label: 'التقييمات', icon: Star },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex-1 py-4 px-3 text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1
                                            ${activeTab === tab.id
                                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">

                                {/* ── Description Tab ── */}
                                {activeTab === 'description' && (
                                    <div className="space-y-5">
                                        <p className="text-gray-700 leading-relaxed text-[15px]">
                                            {product.description || "جهاز كهربائي صناعي عالي الكفاءة مصمم وفق أحدث المعايير الأوروبية. يتميز بكفاءة استهلاك طاقة مصنفة A+++، حماية متقدمة من التذبذبات والحِمل الزائد، وتقنية تحكم ذكية تضمن أداءً مستقراً على مدار الساعة. مناسب للمشاريع الإنشائية والصناعية الكبرى."}
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                <Zap className="text-blue-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-blue-900">كفاءة طاقة A+++</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                <ShieldCheck className="text-green-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-green-900">حماية من التذبذب</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                <Cpu className="text-purple-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-purple-900">تكنولوجيا ذكية</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                                <Settings className="text-orange-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-orange-900">سهولة التركيب</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                                <BadgeCheck className="text-red-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-red-900">شهادات دولية CE/IEC</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                                                <Scale className="text-teal-600 shrink-0" size={20} />
                                                <span className="text-sm font-medium text-teal-900">مطابق للمواصفات القياسية</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Specs Tab (replaces "details") ── */}
                                {activeTab === 'specs' && (
                                    <div className="space-y-5">
                                        <h3 className="font-semibold text-gray-900">المواصفات الفنية التفصيلية</h3>
                                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                                            {[
                                                { label: 'القدرة الكهربائية', value: '2200 واط' },
                                                { label: 'جهد التشغيل', value: '220 – 240 فولت' },
                                                { label: 'التردد', value: '50 / 60 هرتز' },
                                                { label: 'تيار التشغيل', value: '10 أمبير' },
                                                { label: 'درجة الحماية', value: 'IP65' },
                                                { label: 'درجة حرارة التشغيل', value: '-10°C إلى +60°C' },
                                                { label: 'الوزن الصافي', value: '4.5 كجم' },
                                                { label: 'الأبعاد (ط×ع×ع)', value: '300 × 200 × 150 مم' },
                                                { label: 'مادة الهيكل', value: 'ألومنيوم مقاوم للصدأ' },
                                                { label: 'الشهادات', value: 'CE · IEC 60364 · ISO 9001' },
                                                { label: 'بلد المنشأ', value: 'أوروبي — مطابق للمواصفات' },
                                                { label: 'الضمان', value: '3 سنوات شامل قطع الغيار' },
                                            ].map((spec, i) => (
                                                <div key={i} className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <span className="text-gray-500 font-medium">{spec.label}</span>
                                                    <span className="font-semibold text-gray-900 text-left">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Shipping Tab ── */}
                                {activeTab === 'shipping' && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900">الشحن والإرجاع</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                                <Truck className="text-green-600 mt-1 shrink-0" size={24} />
                                                <div>
                                                    <h4 className="font-medium text-green-900">شحن للمشاريع والمستودعات</h4>
                                                    <p className="text-sm text-green-700 mt-1">شحن مجاني للطلبات فوق $500. التسليم خلال 48–72 ساعة داخل المدن الرئيسية.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                                <Package className="text-blue-600 mt-1 shrink-0" size={24} />
                                                <div>
                                                    <h4 className="font-medium text-blue-900">تغليف صناعي آمن</h4>
                                                    <p className="text-sm text-blue-700 mt-1">جميع الأجهزة تُشحن في تغليف صناعي مخصص يضمن سلامة المعدات الحساسة.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
                                                <ShieldCheck className="text-amber-600 mt-1 shrink-0" size={24} />
                                                <div>
                                                    <h4 className="font-medium text-amber-900">سياسة الإرجاع</h4>
                                                    <p className="text-sm text-amber-700 mt-1">إرجاع مجاني خلال 14 يوماً في حال عيوب التصنيع أو عدم مطابقة المواصفات المتفق عليها.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                                                <BadgeCheck className="text-purple-600 mt-1 shrink-0" size={24} />
                                                <div>
                                                    <h4 className="font-medium text-purple-900">ضمان الشركة المصنعة</h4>
                                                    <p className="text-sm text-purple-700 mt-1">ضمان شامل لمدة 3 سنوات من الشركة المصنعة، مع دعم فني متخصص.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Reviews Tab ── */}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900">تقييمات العملاء</h3>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-gray-900">4.9</div>
                                                <div className="flex gap-1 mt-1 justify-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} className={i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">128 تقييم</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {[
                                                    { stars: 5, pct: 82 },
                                                    { stars: 4, pct: 12 },
                                                    { stars: 3, pct: 4 },
                                                    { stars: 2, pct: 1 },
                                                    { stars: 1, pct: 1 },
                                                ].map(({ stars, pct }) => (
                                                    <div key={stars} className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-600 w-3">{stars}</span>
                                                        <Star size={11} className="fill-yellow-400 text-yellow-400" />
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sample reviews */}
                                        <div className="space-y-4 border-t pt-4">
                                            {[
                                                { name: 'م. أحمد السيد', role: 'مقاول كهربائي', text: 'جهاز ممتاز، استخدمناه في مشروع تجاري كبير ولم نواجه أي مشكلة. المواصفات مطابقة تماماً للكتالوج.', stars: 5 },
                                                { name: 'شركة النور للتوريدات', role: 'موزع معتمد', text: 'تعاملنا معهم لأكثر من سنتين، الجودة ثابتة والدعم الفني سريع الاستجابة.', stars: 5 },
                                            ].map((review, i) => (
                                                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                                                            <p className="text-xs text-gray-500">{review.role}</p>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(review.stars)].map((_, j) => (
                                                                <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{review.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Truck className="text-blue-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">توصيل آمن</h4>
                                    <p className="text-xs text-gray-600">تغليف صناعي للمعدات الثقيلة</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <BadgeCheck className="text-green-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">شهادات معتمدة</h4>
                                    <p className="text-xs text-gray-600">CE · IEC · ISO 9001</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Phone className="text-purple-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">دعم فني متخصص</h4>
                                    <p className="text-xs text-gray-600">مهندسون متاحون 6 أيام</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <ShieldCheck className="text-orange-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">ضمان 3 سنوات</h4>
                                    <p className="text-xs text-gray-600">شامل قطع الغيار والصيانة</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;