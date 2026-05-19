import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import HomePage from '../pages/shop/HomePage'
import ProductDetailPage from '../pages/product/ProductDetailPage'
import CartPage from '../pages/cart/CartPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import CheckoutPage from '../pages/cart/CheckoutPage'
import WishlistPage from '../pages/user/WishlistPage'
import CategoryPage from '../pages/shop/CategoryPage'
import OffersPage from '../pages/shop/OffersPage'
import SearchPage from '../pages/shop/SearchPage'
import OrdersPage from '../pages/user/OrdersPage'
import OrderSuccessPage from '../pages/user/OrderSuccessPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />

      {/* Protected Routes */}
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />

      {/* Fallback Route */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
