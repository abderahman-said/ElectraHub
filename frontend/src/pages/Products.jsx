import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Package, Eye, ShoppingCart } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Products = () => {
  const { user, hasAccessLevel } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory, priceRange, showFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products with params:', {
        search: searchTerm,
        category: selectedCategory,
        min_price: priceRange.min,
        max_price: priceRange.max,
        featured: showFeatured
      });
      
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (priceRange.min) params.min_price = priceRange.min;
      if (priceRange.max) params.max_price = priceRange.max;
      if (showFeatured) params.featured = true;
      
      const response = await productsAPI.getProducts(params);
      console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories for products page...');
      const response = await categoriesAPI.getCategories();
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={product.images?.[0] || '/placeholder-product.jpg'} 
          alt={product.name_ar}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            مميز
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name_ar}</h3>
          <p className="text-sm text-gray-600 truncate">{product.name}</p>
        </div>
        
        <div className="mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {product.category_name_ar}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(product.wholesale_price)}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">الكمية المتاحة</p>
              <p className="text-sm font-semibold">{product.stock_quantity}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm">
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </button>
          {hasAccessLevel('admin') && (
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="flex gap-4">
        <img 
          src={product.images?.[0] || '/placeholder-product.jpg'} 
          alt={product.name_ar}
          className="w-24 h-24 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name_ar}</h3>
              <p className="text-sm text-gray-600">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>
            {product.is_featured && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" />
                مميز
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {product.category_name_ar}
            </span>
            <span className="text-xs text-gray-500">
              المورد: {product.supplier_name}
            </span>
            <span className="text-xs text-gray-500">
              الكمية: {product.stock_quantity}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(product.wholesale_price)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm">
                <ShoppingCart className="w-4 h-4" />
                أضف للسلة
              </button>
              {hasAccessLevel('admin') && (
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name_ar} ({category.product_count})
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="السعر الأدنى"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="السعر الأقصى"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Featured Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeatured}
                onChange={(e) => setShowFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">المنتجات المميزة فقط</span>
            </label>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange({ min: '', max: '' });
                setShowFeatured(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                تم العثور على {products.length} منتج
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
