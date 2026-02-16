import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Grid, List, Building, Mail, Phone, MapPin, Star, CheckCircle } from 'lucide-react';
import { suppliersAPI, productsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const SupplierManagement = () => {
  const { hasAccessLevel } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    email: '',
    phone: '',
    address: '',
    address_ar: '',
    city: '',
    city_ar: '',
    country: '',
    country_ar: '',
    tax_id: '',
    commercial_register: '',
    rating: '0',
    is_verified: false,
    is_active: true
  });

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, showVerifiedOnly]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getSuppliers();
      let filteredSuppliers = response.data;
      
      if (searchTerm) {
        filteredSuppliers = filteredSuppliers.filter(supplier =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.name_ar.includes(searchTerm) ||
          supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.phone?.includes(searchTerm)
        );
      }
      
      if (showVerifiedOnly) {
        filteredSuppliers = filteredSuppliers.filter(supplier => supplier.is_verified);
      }
      
      setSuppliers(filteredSuppliers);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.updateSupplier(editingSupplier.id, formData);
      } else {
        await suppliersAPI.createSupplier(formData);
      }
      
      setShowModal(false);
      setEditingSupplier(null);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to save supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      name_ar: supplier.name_ar || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      address_ar: supplier.address_ar || '',
      city: supplier.city || '',
      city_ar: supplier.city_ar || '',
      country: supplier.country || '',
      country_ar: supplier.country_ar || '',
      tax_id: supplier.tax_id || '',
      commercial_register: supplier.commercial_register || '',
      rating: supplier.rating?.toString() || '0',
      is_verified: supplier.is_verified || false,
      is_active: supplier.is_active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      try {
        await suppliersAPI.deleteSupplier(supplierId);
        fetchSuppliers();
      } catch (error) {
        console.error('Failed to delete supplier:', error);
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
      email: '',
      phone: '',
      address: '',
      address_ar: '',
      city: '',
      city_ar: '',
      country: '',
      country_ar: '',
      tax_id: '',
      commercial_register: '',
      rating: '0',
      is_verified: false,
      is_active: true
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const SupplierCard = ({ supplier }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{supplier.name_ar}</h3>
              <p className="text-sm text-gray-600">{supplier.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {supplier.is_verified && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                موثق
              </div>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${
              supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {supplier.is_active ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {supplier.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{supplier.email}</span>
            </div>
          )}
          
          {supplier.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{supplier.phone}</span>
            </div>
          )}
          
          {supplier.city_ar && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{supplier.city_ar}, {supplier.country_ar}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(supplier.rating)}
            </div>
            <span className="text-sm text-gray-600">({supplier.rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {supplier.product_count} منتج
          </div>
          
          {hasAccessLevel('admin') && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(supplier)}
                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(supplier.id)}
                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                disabled={supplier.product_count > 0}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
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
            <h1 className="text-2xl font-bold text-gray-900">إدارة الموردين</h1>
            <div className="flex items-center gap-4">
              {hasAccessLevel('admin') && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditingSupplier(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة مورد
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث عن مورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">الموردين الموثقين فقط</span>
            </label>

            <button
              onClick={() => {
                setSearchTerm('');
                setShowVerifiedOnly(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {suppliers.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موردين</h3>
            <p className="text-gray-500">لم يتم العثور على موردين تطابق معايير البحث</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                تم العثور على {suppliers.length} مورد
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(supplier => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSupplier ? 'تعديل مورد' : 'إضافة مورد جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSupplier(null);
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المورد (إنجليزي)</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المورد (عربي)</label>
                    <input
                      type="text"
                      required
                      value={formData.name_ar}
                      onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التقييم</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">0 نجوم</option>
                      <option value="1">1 نجمة</option>
                      <option value="2">نجمتان</option>
                      <option value="3">3 نجوم</option>
                      <option value="4">4 نجوم</option>
                      <option value="5">5 نجوم</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">العنوان</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (إنجليزي)</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (عربي)</label>
                    <textarea
                      rows={2}
                      value={formData.address_ar}
                      onChange={(e) => setFormData({...formData, address_ar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المدينة (إنجليزي)</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المدينة (عربي)</label>
                      <input
                        type="text"
                        value={formData.city_ar}
                        onChange={(e) => setFormData({...formData, city_ar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البلد (إنجليزي)</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البلد (عربي)</label>
                      <input
                        type="text"
                        value={formData.country_ar}
                        onChange={(e) => setFormData({...formData, country_ar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">معلومات تجارية</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الضريبي</label>
                    <input
                      type="text"
                      value={formData.tax_id}
                      onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السجل التجاري</label>
                    <input
                      type="text"
                      value={formData.commercial_register}
                      onChange={(e) => setFormData({...formData, commercial_register: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">الحالة</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_verified}
                        onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">موثق</span>
                    </label>

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
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSupplier(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSupplier ? 'تحديث المورد' : 'إضافة المورد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
