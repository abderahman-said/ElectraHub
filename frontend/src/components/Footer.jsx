import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white py-12 sm:py-16 mt-auto">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    <div>
                        <img src="/logo.png" alt="Store Logo" className="h-16 sm:h-20 w-auto object-contain rounded-xl" />
                        <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed max-w-sm">
                            منصتك المتكاملة للأدوات المنزلية والأجهزة الذكية. نقدم لك أفضل العلامات العالمية بجودة لا تُضاهى وأسعار تنافسية.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 text-white">روابط سريعة</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">الرئيسية</Link></li>
                            <li><Link to="/shop" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">تسوق الآن</Link></li>
                            <li><Link to="/about" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">من نحن</Link></li>
                            <li><Link to="/contact" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">تواصل معنا</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 text-white">حسابك</h4>
                        <ul className="space-y-3">
                            <li><Link to="/login" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">تسجيل الدخول</Link></li>
                            <li><Link to="/register" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">إنشاء حساب جديد</Link></li>
                            <li><Link to="/cart" className="text-xs sm:text-sm text-slate-400 hover:text-[#2650fc] transition-colors">سلة المشتريات</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 text-white">خدمة العملاء</h4>
                        <ul className="space-y-3">
                            <li className="text-xs sm:text-sm text-slate-400 selection:bg-blue-900">البريد: support@shopping.com</li>
                            <li className="text-xs sm:text-sm text-slate-400 selection:bg-blue-900">الهاتف: 01012345678</li>
                            <li className="text-xs sm:text-sm text-slate-400">ساعات العمل: طوال أيام الأسبوع 24/7</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-slate-500">&copy; {new Date().getFullYear()} شوبينج للأدوات المنزلية. جميع الحقوق محفوظة.</p>
                    <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        <Link to="/" className="text-slate-500 hover:text-[#2650fc] transition-colors">سياسة الخصوصية</Link>
                        <span className="text-slate-800">|</span>
                        <Link to="/" className="text-slate-500 hover:text-[#2650fc] transition-colors">شروط الخدمة</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
