import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Phone, MessageSquare, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getProductImage, handleImageError } from '../utils/imageUtils';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    country: 'Egypt',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateOrderNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const formatWhatsAppMessage = () => {
    const orderNumber = generateOrderNumber();
    const subtotal = getTotalPrice();
    const deliveryFee = 'Depends on your place';
    const total = subtotal;

    let message = `*Order Number:* ${orderNumber}\n`;
    message += `*Order Details:*\n`;
    message += `- First Name: ${formData.firstName}\n`;
    message += `- Last Name: ${formData.lastName}\n`;
    message += `- Email: ${formData.email}\n`;
    message += `- Street: ${formData.street}\n`;
    message += `- City: ${formData.city}\n`;
    message += `- Country: ${formData.country}\n`;
    message += `- Phone: ${formData.phone}\n`;
    message += `*Cart Items:*\n`;

    items.forEach((item, index) => {
      message += `**Item number:* ${item.id}\n`;
      message += `*Item:* ${item.name}\n`;
      message += `*Price:* ${item.price} EGP\n`;
      message += `*Weight:* ${item.weight || 'N/A'}\n`;
      message += `*Quantity:* ${item.quantity}\n`;
    });

    message += `*\n`;
    message += `- Subtotal: ${subtotal} EGP\n`;
    message += `- Delivery Fee: ${deliveryFee} EGP\n`;
    message += `- Total: ${total} EGP`;

    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (items.length === 0) {
      alert('السلة فارغة');
      return;
    }

    const message = formatWhatsAppMessage();
    const phoneNumber = '2010966885685'; // Replace with your WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#2650fc] text-white font-medium rounded-lg hover:bg-[#1e40d8] transition-colors"
          >
            العودة للتسوق
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">عربة التسوق</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">المنتجات</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.weight || 'N/A'}</p>
                      <p className="font-semibold text-[#2650fc]">{item.price} EGP</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">معلومات الدفع</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدينة
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الدولة
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2650fc] focus:border-transparent"
                    required
                  />
                </div>
              </form>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">{getTotalPrice()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رسوم التوصيل</span>
                    <span className="font-medium">حسب المكان EGP</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>الإجمالي</span>
                    <span className="text-[#2650fc]">{getTotalPrice()} EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-[#2650fc] text-white py-3 rounded-lg font-medium hover:bg-[#1e40d8] transition-colors flex items-center justify-center gap-2"
                >
                  الدفع عبر واتساب
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-2 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  إفراغ السلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
