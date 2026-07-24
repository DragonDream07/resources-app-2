import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

import App from '@/App';

// Lazy-loaded pages
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductListPage = lazy(() => import('@/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutReviewPage = lazy(() => import('@/pages/CheckoutReviewPage'));
const CheckoutAddressPage = lazy(() => import('@/pages/CheckoutAddressPage'));
const CheckoutPlaceOrderPage = lazy(() => import('@/pages/CheckoutPlaceOrderPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/AddressesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ReturnRequestPage = lazy(() => import('@/pages/ReturnRequestPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReturnRequestsPage = lazy(() => import('@/pages/admin/AdminReturnRequestsPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/AdminPromoCodesPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

function withSuspense(Component) {
  return (
    <Suspense fallback={<div className="page-loading">Loading...</div>}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      { index: true, element: withSuspense(HomePage) },
      { path: 'search', element: withSuspense(SearchPage) },
      { path: 'products', element: withSuspense(ProductListPage) },
      { path: 'products/:productId', element: withSuspense(ProductDetailPage) },
      { path: 'categories/:categoryId', element: withSuspense(CategoryPage) },
      { path: 'cart', element: withSuspense(CartPage) },

      // Guest-only routes
      {
        path: 'login',
        element: (
          <GuestRoute>
            {withSuspense(LoginPage)}
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            {withSuspense(RegisterPage)}
          </GuestRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            {withSuspense(ForgotPasswordPage)}
          </GuestRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <GuestRoute>
            {withSuspense(ResetPasswordPage)}
          </GuestRoute>
        ),
      },

      // Protected routes
      {
        path: 'checkout',
        children: [
          {
            path: 'review',
            element: (
              <ProtectedRoute>
                {withSuspense(CheckoutReviewPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: 'address',
            element: (
              <ProtectedRoute>
                {withSuspense(CheckoutAddressPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: 'place-order',
            element: (
              <ProtectedRoute>
                {withSuspense(CheckoutPlaceOrderPage)}
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            {withSuspense(PaymentPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                {withSuspense(OrdersPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: ':orderId',
            element: (
              <ProtectedRoute>
                {withSuspense(OrderDetailPage)}
              </ProtectedRoute>
            ),
          },
          {
            path: ':orderId/return-requests',
            element: (
              <ProtectedRoute>
                {withSuspense(ReturnRequestPage)}
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            {withSuspense(ProfilePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'addresses',
        element: (
          <ProtectedRoute>
            {withSuspense(AddressesPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            {withSuspense(NotificationsPage)}
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: 'admin',
        children: [
          {
            index: true,
            element: (
              <AdminRoute>
                {withSuspense(AdminDashboardPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'products',
            element: (
              <AdminRoute>
                {withSuspense(AdminProductsPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'categories',
            element: (
              <AdminRoute>
                {withSuspense(AdminCategoriesPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'brands',
            element: (
              <AdminRoute>
                {withSuspense(AdminBrandsPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <AdminRoute>
                {withSuspense(AdminOrdersPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'return-requests',
            element: (
              <AdminRoute>
                {withSuspense(AdminReturnRequestsPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'promo-codes',
            element: (
              <AdminRoute>
                {withSuspense(AdminPromoCodesPage)}
              </AdminRoute>
            ),
          },
          {
            path: 'reports',
            element: (
              <AdminRoute>
                {withSuspense(AdminReportsPage)}
              </AdminRoute>
            ),
          },
        ],
      },

      // Error routes
      { path: '403', element: withSuspense(ForbiddenPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);

export default router;
