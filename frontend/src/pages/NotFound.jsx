import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4" dir="rtl">
            <div className="max-w-2xl w-full">
                <div className="text-center">
                    {/* Animated 404 */}
                    <div className="relative mb-8">
                        <h1 className="text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 leading-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-8xl animate-bounce">🔍</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border border-white/40">
                        <h2 className="text-4xl font-black text-blue-950 mb-4">
                            عذراً، الصفحة غير موجودة!
                        </h2>
                        <p className="text-xl text-slate-600 font-medium mb-8 max-w-lg mx-auto">
                            يبدو أنك تبحث عن صفحة غير موجودة. ربما تم نقلها أو أن الرابط غير صحيح.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/"
                                className="group flex items-center gap-3 px-8 py-5 bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300"
                            >
                                <Home size={20} />
                                العودة للرئيسية
                                <ArrowLeft size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/shop"
                                className="flex items-center gap-3 px-8 py-5 glass rounded-2xl font-black text-sm uppercase tracking-widest text-blue-950 hover:bg-white transition-all shadow-lg"
                            >
                                <Search size={20} />
                                تصفح المنتجات
                            </Link>
                        </div>

                        {/* Popular Links */}
                        <div className="mt-12 pt-8 border-t border-blue-50">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">صفحات مقترحة</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Link to="/shop" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                                    المتجر
                                </Link>
                                <Link to="/importers" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                                    المستوردين
                                </Link>
                                <Link to="/pricing" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                                    الأسعار
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
