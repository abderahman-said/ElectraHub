import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50" dir="rtl">
            {/* Hero Section */}
            <section className="relative py-20 bg-blue-950 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/40 blur-3xl rounded-full translate-x-1/2 -z-10" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                        تواصل معنا
                    </h1>
                    <p className="text-lg text-blue-200 font-medium max-w-2xl mx-auto leading-relaxed">
                        نحن هنا للإجابة على جميع استفساراتكم وتقديم الدعم اللازم. لا تتردد في مراسلتنا في أي وقت.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 -mt-10">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
                        
                        {/* Contact Info */}
                        <div className="lg:w-2/5 bg-blue-50 p-10 md:p-14 border-b lg:border-b-0 lg:border-l border-blue-100 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-tr-[100px] -z-10" />
                            <h2 className="text-3xl font-black text-blue-950 mb-8 tracking-tight">معلومات الاتصال</h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-950 mb-1">العنوان</h3>
                                        <p className="text-slate-500 font-medium">المنطقة الصناعية، مبنى الإدارة، الدور الثالث، مصر</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-950 mb-1">رقم الهاتف</h3>
                                        <p className="text-slate-500 font-medium" dir="ltr">+20 123 456 7890</p>
                                        <p className="text-slate-500 font-medium" dir="ltr">+20 098 765 4321</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-950 mb-1">البريد الإلكتروني</h3>
                                        <p className="text-slate-500 font-medium" dir="ltr">support@example.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:w-3/5 p-10 md:p-14">
                            <h2 className="text-3xl font-black text-blue-950 mb-8 tracking-tight">أرسل رسالتك</h2>
                            
                            {submitted ? (
                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center">
                                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-emerald-600 mb-2">تم الإرسال بنجاح!</h3>
                                    <p className="text-emerald-700 font-medium">شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm"
                                    >
                                        إرسال رسالة أخرى
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-blue-950">الاسم الكامل</label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                                placeholder="أدخل اسمك"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-blue-950">البريد الإلكتروني</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-blue-950">الموضوع</label>
                                        <input 
                                            type="text" 
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                            placeholder="موضوع الرسالة"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-blue-950">الرسالة</label>
                                        <textarea 
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium resize-none"
                                            placeholder="اكتب رسالتك هنا..."
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-black text-[16px] rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'جاري الإرسال...' : (
                                            <>
                                                إرسال الرسالة
                                                <Send size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
