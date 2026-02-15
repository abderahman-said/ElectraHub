import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    X,
    Upload,
    Image as ImageIcon,
    ChevronDown,
    ArrowRight,
    Package,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ManageProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addProduct, editProduct } = useAuth();

    const [productFormData, setProductFormData] = useState({
        name: '',
        price: '',
        category: 'AC',
        desc: '',
        image: '',
        moq: '',
        voltage: '',
        frequency: '',
        power: '',
        warranty: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id && user?.products) {
            const productToEdit = user.products.find(p => p.id.toString() === id.toString());
            if (productToEdit) {
                setProductFormData({
                    name: productToEdit.name,
                    price: productToEdit.price,
                    category: productToEdit.category,
                    desc: productToEdit.desc,
                    image: productToEdit.image || '',
                    moq: productToEdit.moq || '',
                    voltage: productToEdit.voltage || '',
                    frequency: productToEdit.frequency || '',
                    power: productToEdit.power || '',
                    warranty: productToEdit.warranty || ''
                });
            }
        }
    }, [id, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductFormData({ ...productFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            editProduct(id, productFormData);
        } else {
            addProduct(productFormData);
        }
        navigate('/dashboard/inventory');
    };

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
                                <Package size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-blue-950 tracking-tighter">
                                {id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Image Upload - Full Width */}
                            <div className="md:col-span-2 group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-4 text-right">صورة المنتج</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
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
                                                <span className="block text-[16px] font-black uppercase tracking-wider">اضغط لرفع صورة احترافية للعملية</span>
                                                <span className="text-sm text-slate-400 font-medium">PNG, JPG, JPEG (Max 2MB)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="group md:col-span-2">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">اسم المنتج بالتفصيل</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                                    placeholder="مثال: تكييف ذكي إنفرتر 1.5 حصان"
                                    value={productFormData.name}
                                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">السعر ($)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right"
                                    value={productFormData.price}
                                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                                />
                            </div>

                            <div className="group relative">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">التصنيف</label>
                                <select
                                    className="w-full px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right appearance-none"
                                    value={productFormData.category}
                                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                                >
                                    <option value="AC">تكييفات</option>
                                    <option value="FR">ثلاجات</option>
                                    <option value="WA">غسالات</option>
                                    <option value="TV">شاشات</option>
                                    <option value="SA">أجهزة صغيرة</option>
                                </select>
                                <div className="absolute left-6 top-[3.5rem] pointer-events-none text-blue-300">
                                    <ChevronDown size={20} />
                                </div>
                            </div>

                            {/* Technical Specs Section */}
                            <div className="md:col-span-2 bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50">
                                <div className="flex items-center gap-3 mb-8 border-b border-blue-100 pb-4">
                                    <div className="h-8 w-8 bg-blue-700 text-white rounded-lg flex items-center justify-center">
                                        <Settings size={18} />
                                    </div>
                                    <h3 className="text-lg font-black text-blue-900 uppercase tracking-widest">المواصفات الفنية المتقدمة</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">الجهد الكهربائي (V)</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="220-240V"
                                            value={productFormData.voltage}
                                            onChange={(e) => setProductFormData({ ...productFormData, voltage: e.target.value })}
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">التردد (Hz)</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="50/60Hz"
                                            value={productFormData.frequency}
                                            onChange={(e) => setProductFormData({ ...productFormData, frequency: e.target.value })}
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">القدرة القصوى (W)</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="2200W"
                                            value={productFormData.power}
                                            onChange={(e) => setProductFormData({ ...productFormData, power: e.target.value })}
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">مدة الضمان</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="مثال: 10 سنوات شامل"
                                            value={productFormData.warranty}
                                            onChange={(e) => setProductFormData({ ...productFormData, warranty: e.target.value })}
                                        />
                                    </div>
                                    <div className="group sm:col-span-2">
                                        <label className="block text-[16px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">الحد الأدنى للطلب (MOQ)</label>
                                        <input
                                            type="number"
                                            className="w-full px-6 py-3.5 rounded-xl border border-white bg-white/80 focus:bg-white outline-none transition-all font-bold text-blue-950 text-right"
                                            placeholder="أدخل عدد القطع كحد أدنى"
                                            value={productFormData.moq}
                                            onChange={(e) => setProductFormData({ ...productFormData, moq: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2 group">
                                <label className="block text-[16px] font-black text-blue-950 uppercase tracking-[0.2em] mb-3 text-right">وصف تفصيلي للمنتج</label>
                                <textarea
                                    className="w-full px-6 py-4 rounded-[2rem] border border-blue-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-blue-950 text-right h-40 resize-none"
                                    placeholder="اكتب هنا كافة تفاصيل المنتج التي تهم التاجر..."
                                    value={productFormData.desc}
                                    onChange={(e) => setProductFormData({ ...productFormData, desc: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="md:col-span-2 w-full py-6 bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-800 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-lg"
                            >
                                <Save size={24} />
                                {id ? 'حفظ التغييرات الجديدة' : 'إضافة المنتج للمنصة الآن'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProduct;
