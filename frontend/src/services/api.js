import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pam_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('pam_token');
      localStorage.removeItem('pam_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Roles API
export const rolesAPI = {
  getRoles: () => api.get('/roles'),
  createRole: (roleData) => api.post('/roles', roleData),
  updateRole: (id, roleData) => api.put(`/roles/${id}`, roleData),
  deleteRole: (id) => api.delete(`/roles/${id}`),
};

// Permissions API
export const permissionsAPI = {
  getPermissions: () => api.get('/permissions'),
  createPermission: (permissionData) => api.post('/permissions', permissionData),
  updatePermission: (id, permissionData) => api.put(`/permissions/${id}`, permissionData),
  deletePermission: (id) => api.delete(`/permissions/${id}`),
};

// Sessions API
export const sessionsAPI = {
  getSessions: () => api.get('/sessions'),
  revokeSession: (id) => api.delete(`/sessions/${id}`),
  revokeAllSessions: (userId) => api.delete(`/sessions/user/${userId}`),
};

// Audit Logs API
export const auditLogsAPI = {
  getAuditLogs: () => api.get('/audit-logs'),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Dashboard Products API
export const dashboardProductsAPI = {
  getProducts: (params = {}) => api.get('/dashboard/products', { params }),
  getProduct: (id) => api.get(`/dashboard/products/${id}`),
  createProduct: (productData) => api.post('/dashboard/products', productData),
  updateProduct: (id, productData) => api.put(`/dashboard/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/dashboard/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getSuppliers: () => api.get('/suppliers'),
  getPublicSuppliers: () => api.get('/public/suppliers'),
  getSupplier: (id) => api.get(`/suppliers/${id}`),
  createSupplier: (supplierData) => api.post('/suppliers', supplierData),
  updateSupplier: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Customers API
export const customersAPI = {
  getCustomers: (params = {}) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

// Trust Badges API
export const trustBadgesAPI = {
  getBadges: () => api.get('/trust-badges'),
};

// Cycle/Carousel API
export const cycleAPI = {
  getFeaturedProducts: () => api.get('/cycle/featured-products'),
  getPromotions: () => api.get('/cycle/promotions'),
  getCategories: () => api.get('/cycle/categories'),
  getBanners: () => api.get('/cycle/banners'),
};

// Importers/Suppliers API
export const importersAPI = {
  getImporters: () => api.get('/public/suppliers'),
  getImporter: (id) => api.get(`/public/suppliers/${id}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
