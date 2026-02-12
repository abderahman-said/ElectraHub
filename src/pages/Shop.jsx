import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, Filter, X } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/products';
import CategoryFilter from '../components/ui/CategoryFilter';
import PriceRangeFilter from '../components/ui/PriceRangeFilter';
import TagFilter from '../components/ui/TagFilter';
import SortSelect from '../components/ui/SortSelect';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'تكييف وتبريد', 'ثلاجات', 'شاشات ذكية', 'غسالات', 'طاقة وكهرباء', 'سلامة وأمان'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'price-low', label: 'السعر: من الأقل للأعلى' },
    { value: 'price-high', label: 'السعر: من الأعلى للأقل' }
];

const Shop = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 4000 });
    const [selectedTags, setSelectedTags] = useState([]);

    const categoriesWithCounts = useMemo(() => {
        const counts = SAMPLE_PRODUCTS.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        return [
            { value: 'All', label: 'الكل', count: SAMPLE_PRODUCTS.length },
            ...CATEGORIES.filter(c => c !== 'All').map(cat => ({
                value: cat,
                label: cat,
                count: counts[cat] || 0
            }))
        ];
    }, []);

    const tagsWithCounts = useMemo(() => {
        const counts = {};
        SAMPLE_PRODUCTS.forEach(product => {
            if (product.tags) {
                product.tags.forEach(tag => {
                    counts[tag] = (counts[tag] || 0) + 1;
                });
            }
        });

        const tagLabels = {
            'bestseller': 'الأكثر مبيعاً',
            'new': 'وصل حديثاً',
            'sale': 'خصم',
            'premium': 'مميز',
            'eco': 'صديق للبيئة'
        };

        return Object.entries(tagLabels).map(([value, label]) => ({
            value,
            label,
            count: counts[value] || 0
        }));
    }, []);

    const filteredProducts = useMemo(() => {
        let result = SAMPLE_PRODUCTS.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesPrice = product.averagePrice >= priceRange.min && product.averagePrice <= priceRange.max;
            const matchesTags = selectedTags.length === 0 || selectedTags.some(tag =>
                product.tags && product.tags.includes(tag)
            );
            return matchesSearch && matchesCategory && matchesPrice && matchesTags;
        });

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.averagePrice - b.averagePrice);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.averagePrice - a.averagePrice);
        }
        // 'newest' assumes default order for now

        return result;
    }, [searchQuery, selectedCategory, sortBy, priceRange, selectedTags]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setPriceRange({ min: 0, max: 4000 });
        setSelectedTags([]);
        setSortBy('newest');
    };

    const activeFiltersCount = [
        searchQuery !== '',
        selectedCategory !== 'All',
        priceRange.min > 0 || priceRange.max < 4000,
        selectedTags.length > 0
    ].filter(Boolean).length;

    return (
        <>
            <SEO
                title="متجر الأجهزة الكهربائية - إلكترا هب"
                description="تسوق أفضل الأجهزة الكهربائية والإلكترونية من تكييفات، ثلاجات، شاشات، غسالات وأنظمة الطاقة من موردين معتمدين بأسعار تنافسية."
                keywords="شراء أجهزة كهربائية، تكييف، ثلاجات، شاشات ذكية، غسالات، طاقة شمسية، كاميرات مراقبة، B2B، جملة"
            />
            <div className="min-h-screen bg-white" dir="rtl">
                {/* Header Banner */}
                <div className="bg-gray-900 text-white py-12 sm:py-16 mb-8 sm:mb-12">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6 text-white">متجر الأجهزة الكهربائية</h1>
                            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                                اكتشف أفضل الأجهزة الكهربائية والإلكترونية من موردين معتمدين بأسعار تنافسية.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4 sm:mb-6 flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                            {filteredProducts.length} منتج
                        </h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                        >
                            <SlidersHorizontal size={16} className="sm:size-18" />
                            <span className="text-sm">المرشحات</span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6 sm:gap-8">

                        {/* Sidebar Filters */}
                        <aside className="hidden lg:block space-y-4 sm:space-y-6">
                            {/* Filter Header */}
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Filter size={18} className=" " />
                                    المرشحات
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-gray-900 hover:text-gray-700 font-medium flex items-center gap-1 touch-manipulation"
                                    >
                                        <X size={14} className="" />
                                        مسح الكل
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">بحث</h3>
                                <div className="relative">
                                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-18" />
                                    <input
                                        type="text"
                                        placeholder="ابحث عن منتجات..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">ترتيب حسب</h3>
                                <SortSelect
                                    value={sortBy}
                                    onChange={setSortBy}
                                    options={SORT_OPTIONS}
                                />
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                                <CategoryFilter
                                    categories={categoriesWithCounts}
                                    selectedCategories={selectedCategory === 'All' ? [] : [selectedCategory]}
                                    onChange={(cats) => setSelectedCategory(cats.length === 0 ? 'All' : cats[0])}
                                    variant="sidebar"
                                />
                            </div>

                            {/* Price Range */}
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                                <PriceRangeFilter
                                    minPrice={0}
                                    maxPrice={5000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    variant="compact"
                                />
                            </div>

                            {/* Tags */}
                            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                                <TagFilter
                                    tags={tagsWithCounts}
                                    selectedTags={selectedTags}
                                    onChange={setSelectedTags}
                                    variant="default"
                                    popularTags={tagsWithCounts.slice(0, 3)}
                                />
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div>
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <span className="text-sm text-gray-600">
                                        عرض <strong className="text-gray-900">{filteredProducts.length}</strong> منتج
                                    </span>
                                    {activeFiltersCount > 0 && (
                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            {activeFiltersCount} مرشح{activeFiltersCount > 1 ? 'ات' : ''} نشط
                                        </span>
                                    )}
                                </div>

                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm touch-manipulation"
                                >
                                    <SlidersHorizontal size={14} className="" />
                                    {showFilters ? 'إخفاء' : 'عرض'} المرشحات
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            </div>

                            {/* Mobile Filters */}
                            {showFilters && (
                                <div className="lg:hidden mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                                    <div className="space-y-3 sm:space-y-4">
                                        {/* Mobile Search */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">بحث</h3>
                                            <div className="relative">
                                                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-18" />
                                                <input
                                                    type="text"
                                                    placeholder="ابحث عن منتجات..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Mobile Categories */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">الفئة</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {CATEGORIES.map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => setSelectedCategory(category)}
                                                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors touch-manipulation ${selectedCategory === category
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {category === 'All' ? 'الكل' : category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 sm:py-16 md:py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <span className="text-2xl sm:text-3xl">🔍</span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                                            حاول تعديل المرشحات أو شروط البحث للعثور على ما تبحث عنه.
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation"
                                        >
                                            <X size={16} className="sm:size-18" />
                                            مسح جميع المرشحات
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
