import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Grid, List, Filter, Package, User, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { customersAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const OrderManagement = () => {
  const { hasAccessLevel } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1 }],
    notes: '',
    shipping_address: '',
    billing_address: '',
    payment_method: 'cash'
  });

  const statusOptions = [
    { value: 'pending', label: 'قيد الانتظار', color: 'yellow' },
    { value: 'confirmed', label: 'مؤكد', color: 'blue' },
    { value: 'processing', label: 'قيد المعالجة', color: 'purple' },
    { value: 'shipped', label: 'تم الشحن', color: 'indigo' },
    { value: 'delivered', label: 'تم التسليم', color: 'green' },
    { value: 'cancelled', label: 'ملغي', color: 'red' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'قيد الانتظار', color: 'yellow' },
    { value: 'paid', label: 'مدفوع', color: 'green' },
    { value: 'failed', label: 'فشل', color: 'red' },
    { value: 'refunded', label: 'مسترد', color: 'gray' }
  ];

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [searchTerm, selectedStatus, selectedCustomer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedCustomer) params.customer_id = selectedCustomer;
      
      const response = await ordersAPI.getOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrder(orderId, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      await ordersAPI.updateOrder(orderId, { payment_status: newPaymentStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        await ordersAPI.deleteOrder(orderId);
        fetchOrders();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const response = await ordersAPI.getOrder(order.id);
      setViewingOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  const getPaymentStatusColor = (status) => {
    const statusOption = paymentStatusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">طلب #{order.order_number}</h3>
            <p className="text-sm text-gray-600">
              {formatDate(order.created_at)}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
              {statusOptions.find(s => s.value === order.status)?.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getPaymentStatusColor(order.payment_status)}-100 text-${getPaymentStatusColor(order.payment_status)}-800`}>
              {paymentStatusOptions.find(s => s.value === order.payment_status)?.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">العميل</p>
            <p className="font-semibold text-gray-900">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">الإجمالي</p>
            <p className="font-bold text-lg text-green-600">{formatPrice(order.total_amount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewOrder(order)}
              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            {hasAccessLevel('admin') && (
              <>
                <button 
                  onClick={() => handleStatusUpdate(order.id, order.status === 'pending' ? 'confirmed' : 'pending')}
                  className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            بواسطة: {order.created_by_username}
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
            <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
            <div className="flex items-center gap-4">
              {hasAccessLevel('admin') && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  طلب جديد
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
                placeholder="بحث عن طلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">جميع الحالات</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">جميع العملاء</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name_ar}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('');
                setSelectedCustomer('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لم يتم العثور على طلبات تطابق معايير البحث</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                تم العثور على {orders.length} طلب
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلب</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدفع</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                          <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                            {statusOptions.find(s => s.value === order.status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getPaymentStatusColor(order.payment_status)}-100 text-${getPaymentStatusColor(order.payment_status)}-800`}>
                            {paymentStatusOptions.find(s => s.value === order.payment_status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {hasAccessLevel('admin') && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, order.status === 'pending' ? 'confirmed' : 'pending')}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
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

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب #{viewingOrder.order_number}</h2>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">رقم الطلب</p>
                      <p className="font-semibold">#{viewingOrder.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">التاريخ</p>
                      <p className="font-semibold">{formatDate(viewingOrder.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">الحالة</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${getStatusColor(viewingOrder.status)}-100 text-${getStatusColor(viewingOrder.status)}-800`}>
                        {statusOptions.find(s => s.value === viewingOrder.status)?.label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">حالة الدفع</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${getPaymentStatusColor(viewingOrder.payment_status)}-100 text-${getPaymentStatusColor(viewingOrder.payment_status)}-800`}>
                        {paymentStatusOptions.find(s => s.value === viewingOrder.payment_status)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">العميل</p>
                      <p className="font-semibold">{viewingOrder.customer_name}</p>
                      {viewingOrder.customer_email && (
                        <p className="text-sm text-gray-600">{viewingOrder.customer_email}</p>
                      )}
                    </div>
                    {viewingOrder.shipping_address && (
                      <div>
                        <p className="text-sm text-gray-500">عنوان الشحن</p>
                        <p className="font-semibold">{viewingOrder.shipping_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewingOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name_ar}</div>
                              <div className="text-sm text-gray-500">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.unit_price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatPrice(item.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">الإجمالي</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(viewingOrder.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الخصم</p>
                  <p className="text-xl font-semibold text-red-600">{formatPrice(viewingOrder.discount_amount || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الشحن</p>
                  <p className="text-xl font-semibold text-blue-600">{formatPrice(viewingOrder.shipping_cost || 0)}</p>
                </div>
              </div>

              {viewingOrder.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">ملاحظات</h3>
                  <p className="text-gray-600">{viewingOrder.notes}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">طلب جديد</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle order creation here
              setShowModal(false);
            }} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العميل</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر العميل</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات</h3>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المنتج</label>
                        <input
                          type="text"
                          placeholder="أدخل اسم المنتج أو SKU"
                          value={item.product_id}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index].product_id = e.target.value;
                            setFormData({...formData, items: newItems});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index].quantity = parseInt(e.target.value) || 1;
                            setFormData({...formData, items: newItems});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = formData.items.filter((_, i) => i !== index);
                            setFormData({...formData, items: newItems});
                          }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        items: [...formData.items, { product_id: '', quantity: 1 }]
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إضافة منتج
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">نقدي</option>
                    <option value="card">بطاقة ائتمان</option>
                    <option value="transfer">تحويل بنكي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إنشاء الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
