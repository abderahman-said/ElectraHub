const suppliers = [
    { id: '1', name: "النور للتوريدات", whatsapp: "+201012345678", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" },
    { id: '2', name: "شركة دلتا", whatsapp: "+201087654321", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" },
    { id: '4', name: "المتحدة للإلكترونيات", whatsapp: "+201011223344", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80" },
    { id: '5', name: "سويفت تريد", whatsapp: "+201055667788", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
    { id: '6', name: "جلوبال باور", whatsapp: "+201099887766", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" }
];

export const SAMPLE_PRODUCTS = [
    {
        id: 1,
        name: "تكييف ذكي إنفرتر 2.25 حصان",
        averagePrice: 1250,
        category: "تكييف وتبريد",
        image: "https://images.unsplash.com/photo-1590496794008-383c8070bb2b?auto=format&fit=crop&w=600&q=75",
        description: "تكييف ذكي بتقنية الإنفرتر لتوفير الطاقة، يتميز بتبريد سريع وفلتر لتنقية الهواء.",
        suppliers: suppliers,
        rating: 4.8,
        tags: ['bestseller', 'premium']
    },
    {
        id: 2,
        name: "ثلاجة بابين سعة 500 لتر",
        averagePrice: 2100,
        category: "ثلاجات",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=75",
        description: "ثلاجة حديثة بنظام نوفروست وتصميم انسيابي يناسب المطابخ العصرية.",
        suppliers: suppliers,
        rating: 4.9,
        tags: ['premium']
    },
    {
        id: 3,
        name: "شاشة OLED 65 بوصة 4K",
        averagePrice: 3500,
        category: "شاشات ذكية",
        image: "https://images.unsplash.com/photo-1593784991095-a205029471b6?auto=format&fit=crop&w=600&q=75",
        description: "تجربة مشاهدة سينمائية مع تقنية OLED وألوان نابضة بالحياة.",
        suppliers: suppliers,
        rating: 4.9,
        tags: ['new', 'premium']
    },
    {
        id: 4,
        name: "غسالة أوتوماتيك 9 كيلو",
        averagePrice: 850,
        category: "غسالات",
        image: "https://images.unsplash.com/photo-1582733775062-eb92170f5e13?auto=format&fit=crop&w=600&q=75",
        description: "غسالة متطورة مع برامج غسيل متعددة ومحرك هادئ وموفر للكهرباء.",
        suppliers: suppliers,
        rating: 4.7,
        tags: ['bestseller']
    },
    {
        id: 5,
        name: "لوح طاقة شمسية 450 واط",
        averagePrice: 450,
        category: "طاقة وكهرباء",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=75",
        description: "ألواح شمسية عالية الكفاءة لتوليد الطاقة النظيفة للمنازل والمصانع.",
        suppliers: suppliers,
        rating: 4.6,
        tags: ['eco', 'premium']
    },
    {
        id: 6,
        name: "نظام كاميرات مراقبة متكامل",
        averagePrice: 1200,
        category: "سلامة وأمان",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=75",
        description: "نظام أمني ذكي مع رؤية ليلية وتنبيهات فورية على الهاتف.",
        suppliers: suppliers,
        rating: 4.8,
        tags: ['new']
    },
    {
        id: 7,
        name: "تكييف شباك 1.5 حصان",
        averagePrice: 680,
        category: "تكييف وتبريد",
        image: "https://images.unsplash.com/photo-1585338927620-f134b2da3f31?auto=format&fit=crop&w=800&q=80",
        description: "تكييف شباك اقتصادي بتبريد قوي ومناسب للغرف الصغيرة والمتوسطة.",
        suppliers: suppliers.slice(0, 3),
        rating: 4.5,
        tags: ['bestseller']
    },
    {
        id: 8,
        name: "ثلاجة ديب فريزر 14 قدم",
        averagePrice: 1850,
        category: "ثلاجات",
        image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80",
        description: "ثلاجة كبيرة بتصميم عصري ونظام ديجيتال للتحكم في درجة الحرارة.",
        suppliers: suppliers.slice(1, 4),
        rating: 4.7,
        tags: ['new', 'premium']
    },
    {
        id: 9,
        name: "شاشة LED 43 بوصة Full HD",
        averagePrice: 1200,
        category: "شاشات ذكية",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
        description: "شاشة عملية بجودة عالية ومدخل HDMI متعدد للألعاب والأفلام.",
        suppliers: suppliers,
        rating: 4.3,
        tags: ['bestseller', 'sale']
    },
    {
        id: 10,
        name: "غسالة نصف أوتوماتيك 7 كيلو",
        averagePrice: 450,
        category: "غسالات",
        image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=800&q=80",
        description: "غسالة عملية واقتصادية مثالية للاستخدام اليومي.",
        suppliers: suppliers.slice(0, 4),
        rating: 4.1
    },
    {
        id: 11,
        name: "منظم كهرباء 5000 واط",
        averagePrice: 320,
        category: "طاقة وكهرباء",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
        description: "منظم جهد كهربائي لحماية الأجهزة من تقلبات الكهرباء.",
        suppliers: suppliers.slice(2, 5),
        rating: 4.6,
        tags: ['premium']
    },
    {
        id: 12,
        name: "جرس باب ذكي مع كاميرا",
        averagePrice: 380,
        category: "سلامة وأمان",
        image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=800&q=80",
        description: "جرس ذكي مع كاميرا HD وميكروفون للتواصل مع الزوار.",
        suppliers: suppliers.slice(0, 3),
        rating: 4.8,
        tags: ['new', 'premium']
    },
    {
        id: 13,
        name: "تكييف محمول 10000 BTU",
        averagePrice: 920,
        category: "تكييف وتبريد",
        image: "https://images.unsplash.com/photo-1585338927620-f134b2da3f31?auto=format&fit=crop&w=800&q=80",
        description: "تكييف متنقل سهل التركيب مع ريموت كنترول وتايمر.",
        suppliers: suppliers.slice(1, 5),
        rating: 4.4,
        tags: ['new']
    },
    {
        id: 14,
        name: "فريزر رأسي 6 درج",
        averagePrice: 1450,
        category: "ثلاجات",
        image: "https://images.unsplash.com/photo-1571089409661-4b773ce0de95?auto=format&fit=crop&w=800&q=80",
        description: "فريزر رأسي بتصميم عملي وسعة تخزينية كبيرة.",
        suppliers: suppliers.slice(0, 4),
        rating: 4.5,
        tags: ['bestseller']
    },
    {
        id: 15,
        name: "شاشة منحنية 55 بوصة 4K",
        averagePrice: 2800,
        category: "شاشات ذكية",
        image: "https://images.unsplash.com/photo-1593784991095-a205029471b6?auto=format&fit=crop&w=800&q=80",
        description: "تجربة غامرة مع شاشة منحنية وتقنية HDR للألوان الحقيقية.",
        suppliers: suppliers,
        rating: 4.9,
        tags: ['premium', 'new']
    },
    {
        id: 16,
        name: "غسالة فوق أوتوماتيك 12 كيلو",
        averagePrice: 1150,
        category: "غسالات",
        image: "https://images.unsplash.com/photo-1582733775062-eb92170f5e13?auto=format&fit=crop&w=800&q=80",
        description: "غسالة متطورة بسعة كبيرة وبرامج غسيل متقدمة.",
        suppliers: suppliers.slice(1, 5),
        rating: 4.7,
        tags: ['premium', 'bestseller']
    },
    {
        id: 17,
        name: "محول طاقة شمسية 3000 واط",
        averagePrice: 780,
        category: "طاقة وكهرباء",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        description: "محول طاقة عالي الكفاءة لتحويل طاقة الألواح الشمسية.",
        suppliers: suppliers.slice(0, 3),
        rating: 4.6,
        tags: ['eco', 'premium']
    },
    {
        id: 18,
        name: "نظام إنذار لاسلكي",
        averagePrice: 550,
        category: "سلامة وأمان",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
        description: "نظام إنذار متكامل مع حساسات حركة وتنبيهات صوتية.",
        suppliers: suppliers.slice(2, 5),
        rating: 4.4,
        tags: ['bestseller']
    },
    {
        id: 19,
        name: "تكييف سبليت 3 حصان إنفرتر",
        averagePrice: 1850,
        category: "تكييف وتبريد",
        image: "https://images.unsplash.com/photo-1590496794008-383c8070bb2b?auto=format&fit=crop&w=800&q=80",
        description: "تكييف قوي بتقنية الإنفرتر للتبريد السريع وتوفير الطاقة.",
        suppliers: suppliers,
        rating: 4.8,
        tags: ['premium', 'new', 'eco']
    },
    {
        id: 20,
        name: "ثلاجة صغيرة للمكتب 90 لتر",
        averagePrice: 580,
        category: "ثلاجات",
        image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80",
        description: "ثلاجة مدمجة مثالية للمكاتب والغرف الصغيرة.",
        suppliers: suppliers.slice(0, 3),
        rating: 4.2,
        tags: ['new']
    }
];
