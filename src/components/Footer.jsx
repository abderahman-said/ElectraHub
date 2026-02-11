import React from 'react';
import { Link } from 'react-router-dom';
 
const Footer = () => {
    return (
        <footer className="bg-primary text-white py-12 sm:py-16 mt-auto">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    <div>
                        <img src={"/logo.png"} alt="ElectraHub Logo" className="h-auto max-w-[150px] w-auto" />
                        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-80">
                            السوق الرائد للأجهزة الكهربائية B2B. نربط المستوردين بالتجار عالمياً.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">استكشف</h4>
                        <ul className="space-y-3">
                            <li><Link to="/shop" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">السوق</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">الفئات</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">المستوردون المميزون</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">أسعار الجملة</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">الدعم</h4>
                        <ul className="space-y-3">
                            <li><a href="#faq" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">الأسئلة الشائعة</a></li>
                            <li><a href="#shipping" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">الشحن</a></li>
                            <li><a href="#returns" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">المرتجعات</a></li>
                            <li><a href="#contact" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">اتصل بنا</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">الشركة</h4>
                        <ul className="space-y-3">
                            <li><a href="#about" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">من نحن</a></li>
                            <li><a href="#sustainability" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">الاستدامة</a></li>
                            <li><a href="#careers" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">الوظائف</a></li>
                            <li><a href="#press" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">الصحافة</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-blue-100/60">&copy; 2026 منصة إلكترا هب B2B. جميع الحقوق محفوظة.</p>
                    <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        <a href="#privacy" className="text-gray-400 hover:text-accent transition-colors">سياسة الخصوصية</a>
                        <span className="text-gray-700">|</span>
                        <a href="#terms" className="text-gray-400 hover:text-accent transition-colors">شروط الخدمة</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
