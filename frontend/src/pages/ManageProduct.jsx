import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    Upload,
    Image as ImageIcon,
    ChevronDown,
    ArrowRight,
    Package,
    Wrench,
    Home,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { dashboardProductsAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const ManageProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [productFormData, setProductFormData] = useState({
        name: '',
        price: '',
        category: '',
        desc: '',
        image: '',
        moq: '',
        brand: '',
        color: '',
        size: '',
        weight: '',
        warranty: '',
        material: '',
        features: '',
        origin: '',
        packaging: ''
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id && isAuthenticated) {
            fetchProduct();
        }
        if (isAuthenticated) {
            fetchCategories();
        }
    }, [id, isAuthenticated]);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('فشل في جلب التصنيفات');
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await dashboardProductsAPI.getProduct(id);
            const product = response.data;

            if (product) {
                setProductFormData({
                    name: product.name || '',
                    price: product.price || '',
                    category: product.category || 'KITCHEN',
                    desc: product.desc || '',
                    image: product.image || '',
                    moq: product.moq || '',
                    brand: product.brand || '',
                    color: product.color || '',
                    size: product.size || '',
                    weight: product.weight || '',
                    warranty: product.warranty || '',
                    material: product.material || '',
                    features: product.features || '',
                    origin: product.origin || '',
                    packaging: product.packaging || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error('فشل في جلب بيانات المنتج');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                toast.error('حجم الصورة كبير جداً. الرجاء اختيار صورة أقل من 2 ميجابايت');
                e.target.value = ''; // Clear the input
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('نوع الملف غير مدعوم. الرجاء اختيار صورة (JPG, PNG, WebP)');
                e.target.value = ''; // Clear the input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProductFormData({ ...productFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Submitting product data:', productFormData);

        try {
            if (id) {
                await dashboardProductsAPI.updateProduct(id, productFormData);
                toast.success('تم تحديث المنتج بنجاح');
            } else {
                await dashboardProductsAPI.createProduct(productFormData);
                toast.success('تم إضافة المنتج بنجاح');
            }
            navigate('/dashboard/inventory');
        } catch (error) {
            console.error('Failed to save product:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Handle different error types
            if (error.response?.data?.errors) {
                // Validation errors from backend
                const validationErrors = error.response.data.errors;
                validationErrors.forEach(err => {
                    toast.error(err.msg || err.message);
                });
            } else if (error.response?.data?.error) {
                // Single error from backend
                toast.error(error.response.data.error);
            } else {
                // Generic error
                toast.error('فشل في حفظ المنتج. الرجاء المحاولة مرة أخرى');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (e) =>
        setProductFormData({ ...productFormData, [field]: e.target.value });

    return (
        <div className="min-h-screen bg-mesh py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-blue-600 font-black mb-8 hover:-translate-x-2 transition-transform"
                >
                    <ArrowRight size={20} />
                    <span>العودة للوحة التحكم</span>
                </button>

                <div className="glass rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-14 w-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Home size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-blue-950 tracking-tighter">
                                {id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* ── صورة المنتج ── */}
                            <div className="md:col-span-2 group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-4 text-right">صورة المنتج</label>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} />
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full h-64 rounded-[2.5rem] border-2 border-dashed border-blue-100 bg-blue-50/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all overflow-hidden relative group"
                                >
                                    {productFormData.image ? (
                                        <>
                                            <img src={productFormData.image} alt="Preview" className="h-full w-full object-contain" />
                                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                <div className="h-16 w-16 glass rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-all duration-500">
                                                    <Upload size={32} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-blue-400">
                                            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
                                                <ImageIcon size={40} />
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-[16px] font-black uppercase tracking-wider">اضغط لرفع صورة احترافية للمنتج</span>
                                                <span className="text-sm text-slate-400 font-medium">PNG, JPG, JPEG (Max 2MB)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── اسم المنتج ── */}
                            <div className="group md:col-span-2">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">اسم المنتج بالتفصيل</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                                    placeholder="مثال: طقم أواني طبخ تيفال 10 قطع"
                                    value={productFormData.name}
                                    onChange={handleChange('name')}
                                />
                            </div>

                            {/* ── السعر ── */}
                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">السعر ($)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                                    placeholder="45"
                                    value={productFormData.price}
                                    onChange={handleChange('price')}
                                />
                            </div>

                            {/* ── التصنيف ── */}
                            <div className="group relative">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">التصنيف</label>
                                <select
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right appearance-none"
                                    value={productFormData.category}
                                    onChange={handleChange('category')}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id || category.name} value={category.name}>
                                            {category.name_ar || category.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-6 top-[3.5rem] pointer-events-none text-blue-300">
                                    <ChevronDown size={20} />
                                </div>
                            </div>

                            

                            {/* ══ قسم: تفاصيل المنتج ══ */}
                            <div className="md:col-span-2 bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50">
                                <div className="flex items-center gap-3 mb-8 border-b border-blue-100 pb-4">
                                    <div className="h-8 w-8 bg-blue-700 text-white rounded-lg flex items-center justify-center">
                                        <Package size={18} />
                                    </div>
                                    <h3 className="text-lg font-black text-blue-900 uppercase tracking-widest">تفاصيل المنتج</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* العلامة التجارية */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">العلامة التجارية</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: Tefal، OXO"
                                            value={productFormData.brand}
                                            onChange={handleChange('brand')}
                                        />
                                    </div>
                                    {/* المادة الخام */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">المادة المصنوعة منها</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: ستانلس ستيل، بلاستيك PP، سيليكون"
                                            value={productFormData.material}
                                            onChange={handleChange('material')}
                                        />
                                    </div>
                                    {/* اللون */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">اللون / الألوان المتاحة</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="أبيض، رمادي، متعدد الألوان"
                                            value={productFormData.color}
                                            onChange={handleChange('color')}
                                        />
                                    </div>
                                    {/* المقاس / الحجم */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">المقاس / الحجم</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: 30×20 سم، 2 لتر، قياس موحد"
                                            value={productFormData.size}
                                            onChange={handleChange('size')}
                                        />
                                    </div>
                                    {/* الوزن */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">الوزن الصافي</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: 1.2 كجم"
                                            value={productFormData.weight}
                                            onChange={handleChange('weight')}
                                        />
                                    </div>
                                    {/* بلد المنشأ */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">بلد المنشأ</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: الصين، تركيا، ألمانيا"
                                            value={productFormData.origin}
                                            onChange={handleChange('origin')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ══ قسم: المميزات والتغليف ══ */}
                            <div className="md:col-span-2 bg-amber-50/30 p-8 rounded-[2rem] border border-amber-100/50">
                                <div className="flex items-center gap-3 mb-8 border-b border-amber-100 pb-4">
                                    <div className="h-8 w-8 bg-amber-600 text-white rounded-lg flex items-center justify-center">
                                        <Wrench size={18} />
                                    </div>
                                    <h3 className="text-lg font-black text-amber-900 uppercase tracking-widest">المميزات والتغليف والضمان</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* المميزات */}
                                    <div className="group sm:col-span-2">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">نقاط البيع الرئيسية</label>
                                        <textarea
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right h-20 resize-none"
                                            placeholder="مثال: سهل التنظيف، مقاوم للصدأ، لا يتفاعل مع الطعام، مناسب للأطفال"
                                            value={productFormData.features}
                                            onChange={handleChange('features')}
                                        />
                                    </div>
                                    {/* التغليف */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">نوع التغليف</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: علبة كرتون، كيس مقوى، بليستر"
                                            value={productFormData.packaging}
                                            onChange={handleChange('packaging')}
                                        />
                                    </div>
                                    {/* الضمان */}
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">ضمان المنتج</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: ضمان سنة ضد عيوب الصناعة"
                                            value={productFormData.warranty}
                                            onChange={handleChange('warranty')}
                                        />
                                    </div>
                                    {/* MOQ */}
                                    <div className="group sm:col-span-2">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">الحد الأدنى للطلب (MOQ)</label>
                                        <input
                                            type="number"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="أدخل أقل كمية للطلب بالقطعة أو الكرتونة"
                                            value={productFormData.moq}
                                            onChange={handleChange('moq')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── الوصف التفصيلي ── */}
                            <div className="md:col-span-2 group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">وصف تفصيلي للمنتج</label>
                                <textarea
                                    className="w-full px-6 py-4 rounded-[2rem] border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right h-40 resize-none"
                                    placeholder="اكتب هنا كافة تفاصيل المنتج... الاستخدامات، المواصفات الكاملة، ملاحظات الاستخدام، وأي معلومات تفيد التاجر"
                                    value={productFormData.desc}
                                    onChange={handleChange('desc')}
                                />
                            </div>

                            {/* ── زر الحفظ ── */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 w-full py-6 bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-800 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>{id ? 'جاري الحفظ...' : 'جاري الإضافة...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={24} />
                                        <span>{id ? 'حفظ التغييرات الجديدة' : 'إضافة المنتج للمنصة الآن'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProduct;