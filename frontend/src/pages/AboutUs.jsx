import React from 'react';
import { ShieldCheck, Truck, Zap, Heart } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            {/* Hero Section */}
            <section className="relative py-24 bg-blue-950 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/50 blur-3xl rounded-full translate-x-1/2 -z-10" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        من نحن
                    </h1>
                    <p className="text-xl text-blue-200 font-medium max-w-2xl mx-auto leading-relaxed">
                        وجهتكم الأولى لأفضل المنتجات والأجهزة الإلكترونية الحديثة، الجودة والموثوقية هما شعارنا الدائم لخدمة عملائنا.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 -mt-10">
                <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-16 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-[100px] -z-10" />
                        
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-black text-blue-950 mb-4">رؤيتنا</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    نسعى لأن نكون المنصة الأبرز والأكثر ثقة محليًا لتقديم الأجهزة الإلكترونية والأدوات المنزلية عالية الجودة، وبأسعار تنافسية. نحن نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع بطريقة سهلة وآمنة.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-blue-950 mb-4">مهمتنا</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    العمل على اختيار منتجاتنا بعناية فائقة لنضع بين يديكم أحدث التقنيات وأفضل العلامات التجارية. نحرص دائما على رضا العميل كأولوية قصوى من خلال تقديم خدمة عملاء استثنائية وعمليات تسوق آمنة ومريحة.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-950 mb-2">جودة مضمونة</h3>
                                        <p className="text-slate-500">نضمن أصالة جميع منتجاتنا مع كفالة تغطي جميع الأعطال المصنعية.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <Truck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-950 mb-2">توصيل سريع</h3>
                                        <p className="text-slate-500">فريقنا اللوجستي يضمن وصول طلباتك بأسرع وقت لجميع المناطق بأمان.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <Zap size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-950 mb-2">تسوق سهل</h3>
                                        <p className="text-slate-500">واجهة استخدام سهلة وعملية بحث متقدمة لتجد ما تبحث عنه بثوانٍ.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <Heart size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-950 mb-2">خدمة عملاء 24/7</h3>
                                        <p className="text-slate-500">متواجدون دائماً للرد على استفساراتكم وحل أي مشكلة قد تواجهكم.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
