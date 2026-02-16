import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Grid, List, Folder, FolderOpen, Package } from 'lucide-react';
import { categoriesAPI, productsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CategoryManagement = () => {
  const { hasAccessLevel } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    image_url: '',
    parent_id: '',
    sort_order: '0',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('Fetching categories...');
      const response = await categoriesAPI.getCategories();
      console.log('Categories response:', response.data);
      let filteredCategories = response.data;
      
      if (searchTerm) {
        filteredCategories = filteredCategories.filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.name_ar.includes(searchTerm)
        );
      }
      
      console.log('Filtered categories:', filteredCategories);
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory.id, formData);
      } else {
        await categoriesAPI.createCategory(formData);
      }
      
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      name_ar: category.name_ar || '',
      description: category.description || '',
      description_ar: category.description_ar || '',
      image_url: category.image_url || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order?.toString() || '0',
      is_active: category.is_active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        await categoriesAPI.deleteCategory(categoryId);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      image_url: '',
      parent_id: '',
      sort_order: '0',
      is_active: true
    });
  };

  const getCategoryTree = (categories, parentId = null) => {
    return categories
      .filter(category => category.parent_id === parentId)
      .map(category => ({
        ...category,
        children: getCategoryTree(categories, category.id)
      }));
  };

  const CategoryCard = ({ category, level = 0 }) => (
    <div className={`${level > 0 ? 'mr-6' : ''}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              {category.children?.length > 0 ? (
                <FolderOpen className="w-6 h-6 text-blue-600" />
              ) : (
                <Folder className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name_ar}</h3>
              <p className="text-sm text-gray-600">{category.name}</p>
              {category.description_ar && (
                <p className="text-sm text-gray-500 mt-1">{category.description_ar}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                <span>{category.product_count} منتج</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            
            {hasAccessLevel('admin') && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={category.product_count > 0}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {category.image_url && (
          <div className="mt-4">
            <img 
              src={category.image_url} 
              alt={category.name_ar}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>
      
      {category.children && category.children.length > 0 && (
        <div className="mt-4 space-y-4">
          {category.children.map(child => (
            <CategoryCard key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categoryTree = getCategoryTree(categories);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">إدارة الفئات</h1>
            <div className="flex items-center gap-4">
              {hasAccessLevel('admin') && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditingCategory(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة فئة
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث عن فئة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
            <p className="text-gray-500">لم يتم العثور على فئات</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                تم العثور على {categories.length} فئة
              </p>
            </div>

            <div className="space-y-4">
              {categoryTree.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفئة (إنجليزي)</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفئة (عربي)</label>
                      <input
                        type="text"
                        required
                        value={formData.name_ar}
                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                </div>

                {/* Hierarchy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">التسلسل الهرمي</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الفئة الأصل</label>
                      <select
                        value={formData.parent_id}
                        onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">فئة رئيسية</option>
                        {categories
                          .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                          .filter(cat => !editingCategory || !isChildOf(cat, editingCategory.id, categories))
                          .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({...formData, sort_order: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">الصورة</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {formData.image_url && (
                    <div className="mt-4">
                      <img 
                        src={formData.image_url} 
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">نشط</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'تحديث الفئة' : 'إضافة الفئة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to check if a category is a child of another category
const isChildOf = (category, parentId, categories) => {
  if (category.parent_id === parentId) return true;
  if (!category.parent_id) return false;
  const parent = categories.find(cat => cat.id === category.parent_id);
  return parent ? isChildOf(parent, parentId, categories) : false;
};

export default CategoryManagement;
