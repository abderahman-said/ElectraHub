import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Grid, List, Filter, Star, Package } from 'lucide-react';
import { productsAPI, categoriesAPI, suppliersAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ProductManagement = () => {
  const { user, hasAccessLevel } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    sku: '',
    barcode: '',
    price: '',
    wholesale_price: '',
    cost_price: '',
    min_order_quantity: '1',
    max_order_quantity: '',
    stock_quantity: '0',
    unit: 'piece',
    weight: '',
    dimensions: '',
    images: [],
    specifications: {},
    tags: [],
    category_id: '',
    supplier_id: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (hasAccessLevel('admin')) {
      fetchSuppliers();
    }
  }, [searchTerm, selectedCategory, selectedSupplier]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSupplier) params.supplier = selectedSupplier;
      
      const response = await productsAPI.getProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, formData);
      } else {
        await productsAPI.createProduct(formData);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      name_ar: product.name_ar || '',
      description: product.description || '',
      description_ar: product.description_ar || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      price: product.price || '',
      wholesale_price: product.wholesale_price || '',
      cost_price: product.cost_price || '',
      min_order_quantity: product.min_order_quantity || '1',
      max_order_quantity: product.max_order_quantity || '',
      stock_quantity: product.stock_quantity || '0',
      unit: product.unit || 'piece',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      images: product.images || [],
      specifications: product.specifications || {},
      tags: product.tags || [],
      category_id: product.category_id || '',
      supplier_id: product.supplier_id || '',
      is_active: product.is_active !== false,
      is_featured: product.is_featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await productsAPI.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      sku: '',
      barcode: '',
      price: '',
      wholesale_price: '',
      cost_price: '',
      min_order_quantity: '1',
      max_order_quantity: '',
      stock_quantity: '0',
      unit: 'piece',
      weight: '',
      dimensions: '',
      images: [],
      specifications: {},
      tags: [],
      category_id: '',
      supplier_id: '',
      is_active: true,
      is_featured: false
    });
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
          <div className="flex gap-2">
            <button 
              onClick={() => handleEdit(product)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            {hasAccessLevel('admin') && (
              <button 
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name_ar}</h3>
          <p className="text-sm text-gray-600 truncate">{product.name}</p>
          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
        </div>
        
        <div className="mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {categories.find(c => c.id === product.category_id)?.name_ar}
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
              <p className="text-xs text-gray-500">المخزون</p>
              <p className={`text-sm font-semibold ${product.stock_quantity > 10 ? 'text-green-600' : product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.stock_quantity}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.is_active ? 'نشط' : 'غير نشط'}
          </span>
          <Package className="w-4 h-4 text-gray-400" />
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
            <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
            <div className="flex items-center gap-4">
              {hasAccessLevel('admin') && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditingProduct(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج
                </button>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name_ar}
                </option>
              ))}
            </select>

            {hasAccessLevel('admin') && (
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الموردين</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name_ar}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedSupplier('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
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
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={product.images?.[0] || '/placeholder-product.jpg'} 
                              alt={product.name_ar}
                              className="w-10 h-10 rounded-lg object-cover ml-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name_ar}</div>
                              <div className="text-sm text-gray-500">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categories.find(c => c.id === product.category_id)?.name_ar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="text-gray-500 line-through">{formatPrice(product.price)}</div>
                            <div className="font-bold text-green-600">{formatPrice(product.wholesale_price)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock_quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {hasAccessLevel('admin') && (
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (إنجليزي)</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (عربي)</label>
                    <input
                      type="text"
                      required
                      value={formData.name_ar}
                      onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الباركود</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (إنجليزي)</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي)</label>
                    <textarea
                      rows={3}
                      value={formData.description_ar}
                      onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">التسعير والمخزون</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر الجملة</label>
                    <input
                      type="number"
                      required
                      value={formData.wholesale_price}
                      onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر التكلفة</label>
                    <input
                      type="number"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">أدنى كمية</label>
                      <input
                        type="number"
                        value={formData.min_order_quantity}
                        onChange={(e) => setFormData({...formData, min_order_quantity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">أقصى كمية</label>
                      <input
                        type="number"
                        value={formData.max_order_quantity}
                        onChange={(e) => setFormData({...formData, max_order_quantity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية في المخزون</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوحدة</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="piece">قطعة</option>
                        <option value="box">صندوق</option>
                        <option value="kg">كيلوجرام</option>
                        <option value="meter">متر</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوزن (كجم)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الأبعاد</label>
                    <input
                      type="text"
                      placeholder="طول × عرض × ارتفاع"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Supplier */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                {hasAccessLevel('admin') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المورد</label>
                    <select
                      value={formData.supplier_id}
                      onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر المورد</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="mt-6 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">نشط</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">منتج مميز</span>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
