import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import { useCart } from './context/CartContext';
import { AuthProvider } from './hooks/useAuth';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import ImporterDashboard from './pages/ImporterDashboard';
import ImporterProfile from './pages/ImporterProfile';
import Importers from './pages/Importers';
import Pricing from './pages/Pricing';
import ManageProduct from './pages/ManageProduct';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardInventory from './pages/dashboard/DashboardInventory';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import PamDashboard from './pages/PamDashboard';
import Products from './pages/Products';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import OrderManagement from './pages/OrderManagement';

function App() {
  const { cartCount } = useCart();

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-white text-gray-900" dir="rtl">
          <Navbar cartCount={cartCount} />
          <CartDrawer />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pam-dashboard" element={<PamDashboard />} />
              <Route path="/product-management" element={<ProductManagement />} />
              <Route path="/category-management" element={<CategoryManagement />} />
              <Route path="/supplier-management" element={<SupplierManagement />} />
              <Route path="/order-management" element={<OrderManagement />} />
              <Route path="/dashboard" element={<PrivateRoute><ImporterDashboard /></PrivateRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="inventory" element={<DashboardInventory />} />
                <Route path="profile" element={<DashboardProfile />} />
              </Route>
              <Route path="/dashboard/add-product" element={<PrivateRoute><ManageProduct /></PrivateRoute>} />
              <Route path="/dashboard/edit-product/:id" element={<PrivateRoute><ManageProduct /></PrivateRoute>} />
              <Route path="/importers" element={<Importers />} />
              <Route path="/importer/:id" element={<ImporterProfile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
