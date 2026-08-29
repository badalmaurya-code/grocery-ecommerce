import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PolicyPages } from './pages/PolicyPages';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const { isAdmin } = useAuth();

  const navigate = (view: string, params: any = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render specific view based on navigation state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'shop':
        return (
          <ShopPage
            navigate={navigate}
            initialCategory={viewParams.category}
            initialSearch={viewParams.search}
          />
        );
      case 'product-detail':
        return <ProductDetailPage slug={viewParams.slug} navigate={navigate} />;
      case 'categories':
        return <CategoriesPage navigate={navigate} />;
      case 'cart':
        return <CartPage navigate={navigate} />;
      case 'checkout':
        return <CheckoutPage navigate={navigate} />;
      case 'order-success':
        return <OrderSuccessPage orderId={viewParams.orderId} navigate={navigate} />;
      case 'my-orders':
        return <MyOrdersPage navigate={navigate} />;
      case 'order-detail':
        return <OrderDetailPage orderId={viewParams.orderId} navigate={navigate} />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} redirect={viewParams.redirect} />;
      case 'register':
        return <RegisterPage navigate={navigate} redirect={viewParams.redirect} />;
      case 'about':
        return <AboutUsPage navigate={navigate} />;
      case 'contact':
        return <ContactUsPage navigate={navigate} />;
      case 'privacy-policy':
        return <PolicyPages type="privacy" navigate={navigate} />;
      case 'terms':
        return <PolicyPages type="terms" navigate={navigate} />;
      case 'refund-policy':
        return <PolicyPages type="refund" navigate={navigate} />;

      // Protected Admin Routes (Only accessible by isAdmin)
      case 'admin-dashboard':
        return isAdmin ? <AdminDashboardPage navigate={navigate} /> : <AccessDeniedPage navigate={navigate} />;
      case 'admin-products':
        return isAdmin ? <AdminProductsPage navigate={navigate} openAddModal={viewParams.action === 'add'} /> : <AccessDeniedPage navigate={navigate} />;
      case 'admin-categories':
        return isAdmin ? <AdminCategoriesPage navigate={navigate} /> : <AccessDeniedPage navigate={navigate} />;
      case 'admin-orders':
        return isAdmin ? <AdminOrdersPage navigate={navigate} /> : <AccessDeniedPage navigate={navigate} />;
      case 'admin-settings':
        return isAdmin ? <AdminSettingsPage navigate={navigate} /> : <AccessDeniedPage navigate={navigate} />;

      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 font-sans selection:bg-emerald-700 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Header Navigation */}
      <Navbar currentView={currentView} navigate={navigate} />

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {renderCurrentView()}
      </main>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Global Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
