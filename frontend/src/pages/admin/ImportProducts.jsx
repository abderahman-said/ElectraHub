import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Package, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { productsAPI } from '../../services/api';

const ImportProducts = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                setFile(selectedFile);
                setResults(null);
            } else {
                toast.error('يرجى اختيار ملف Excel صحيح (.xlsx أو .xls)');
            }
        }
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                'الاسم بالعربي': 'اسم المنتج المكتوب بالعربي',
                'اسم (إنجليزي)': 'Product Name in English',
                'الوصف بالعربي': 'وصف المنتج بالتفصيل بالعربي',
                'وصف (إنجليزي)': 'Product Description in English',
                'كود المنتج (SKU)': 'SKU-001',
                'الباركود': '123456789',
                'السعر': 1000,
                'سعر الجملة': 800,
                'التكلفة': 600,
                'أقل كمية للطلب': 5,
                'أقصى كمية للطلب': 100,
                'الكمية المتوفرة': 50,
                'الوحدة': 'قطعة',
                'الوزن (كجم)': 1.5,
                'الأبعاد': '10x10x10',
                'رقم الفئة': 1,
                'رقم المورد': 1
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "قالب المنتجات");
        XLSX.writeFile(workbook, "نموذج_رفع_المنتجات.xlsx");
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await productsAPI.importProducts(formData);

            setResults(response.data.results);
            toast.success(response.data.message);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMsg = error.response?.data?.error || 'فشل في رفع الملف';
            toast.error(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10" dir="rtl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-blue-950 tracking-tighter">استيراد المنتجات من Excel</h2>
                    <p className="text-slate-500 font-medium">ارفع ملف Excel لإضافة مئات المنتجات دفعة واحدة</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                >
                    <ArrowLeft size={18} className="rotate-180" />
                    رجوع
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Instructions */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] space-y-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                            <Info size={24} />
                        </div>
                        <h3 className="text-lg font-black text-blue-900 leading-tight">تعليمات الرفع</h3>
                        <ul className="text-sm text-blue-800 space-y-2 font-medium list-disc list-inside">
                            <li>استخدم ملف Excel (.xlsx)</li>
                            <li>تأكد من وجود كود منتج (SKU) فريد لكل منتج</li>
                            <li>الحقول المطلوبة: الاسم وكود المنتج (SKU)</li>
                            <li>الأسعار والكميات يجب أن تكون أرقاماً</li>
                        </ul>
                        <button
                            onClick={downloadTemplate}
                            className="w-full py-4 bg-white border-2 border-blue-200 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"
                        >
                            <Download size={18} />
                            تحميل النموذج
                        </button>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className={`
                        relative border-3 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300
                        ${file ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30'}
                    `}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className={`h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 ${file ? 'bg-blue-600 text-white scale-110' : 'bg-white text-slate-400 group-hover:scale-110'}`}>
                                <FileSpreadsheet size={40} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-blue-950">
                                    {file ? file.name : 'اسحب الملف هنا أو انقر للاختيار'}
                                </h4>
                                <p className="text-slate-500 font-medium mt-1">
                                    {file ? `حجم الملف: ${(file.size / 1024).toFixed(2)} KB` : 'يدعم ملفات Excel فقط'}
                                </p>
                            </div>
                            {file && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="text-red-500 font-bold text-sm hover:underline"
                                >
                                    إلغاء الملف
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className={`
                            w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3
                            ${!file || isUploading 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-blue-700 text-white hover:bg-blue-800 hover:-translate-y-1 shadow-blue-200'}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري المعالجة...
                            </>
                        ) : (
                            <>
                                <Upload size={24} />
                                بدء عملية الاستيراد
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Display */}
            {results && (
                <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-xl animate-fadeIn space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                        <h3 className="text-2xl font-black text-blue-950">نتائج الاستيراد</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold">
                                <CheckCircle2 size={18} />
                                {results.success} نجح
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold">
                                <XCircle size={18} />
                                {results.failed} فشل
                            </div>
                        </div>
                    </div>

                    {results.errors?.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-slate-800 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-500" />
                                الأخطاء المسجلة
                            </h4>
                            <div className="max-h-60 overflow-y-auto rounded-2xl border border-red-50 bg-red-50/20">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-red-50 text-red-700 font-black sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3">الخطأ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-50">
                                        {results.errors.map((err, idx) => (
                                            <tr key={idx} className="hover:bg-red-50/50 transition-colors">
                                                <td className="px-4 py-3 font-mono font-bold text-slate-700">{err.sku}</td>
                                                <td className="px-4 py-3 text-red-600 font-medium">{err.error}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => navigate('/dashboard/inventory')}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            الذهاب لإدارة المنتجات
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImportProducts;
