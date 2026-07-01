/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Customer Views
import HomeView from './components/customer/HomeView';
import MenuView from './components/customer/MenuView';
import DishDetailView from './components/customer/DishDetailView';
import CartView from './components/customer/CartView';
import CheckoutView from './components/customer/CheckoutView';
import ConfirmationView from './components/customer/ConfirmationView';
import MyOrdersView from './components/customer/MyOrdersView';

// Admin Views
import AdminDashboardView from './components/admin/AdminDashboardView';
import AdminOrdersView from './components/admin/AdminOrdersView';
import AdminDishesView from './components/admin/AdminDishesView';
import AdminCategoriesView from './components/admin/AdminCategoriesView';
import AdminSettingsView from './components/admin/AdminSettingsView';

import CinematicView from './components/customer/CinematicView';
import ProductCustomizationModal from './components/customer/ProductCustomizationModal';

export default function App() {
  const { currentView, selectedDishSlug, setView, setSelectedDishSlug } = useAppStore();

  // Sync URL to state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/dishes/')) {
        if (path.endsWith('/cinematic')) {
          const slug = path.replace('/dishes/', '').replace('/cinematic', '');
          setSelectedDishSlug(slug);
          setView('cinematic');
        } else {
          const slug = path.replace('/dishes/', '');
          setSelectedDishSlug(slug);
          setView('dish');
        }
      } else if (path === '/menu') {
        setView('menu');
      } else if (path === '/cart') {
        setView('cart');
      } else if (path === '/checkout') {
        setView('checkout');
      } else {
        setView('home');
      }
    };
    
    // Check initial route
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, setSelectedDishSlug]);

  // Sync state to URL
  useEffect(() => {
    let path = '/';
    if (currentView === 'dish' && selectedDishSlug) {
      path = `/dishes/${selectedDishSlug}`;
    } else if (currentView === 'cinematic' && selectedDishSlug) {
      path = `/dishes/${selectedDishSlug}/cinematic`;
    } else if (currentView === 'menu') {
      path = '/menu';
    } else if (currentView === 'cart') {
      path = '/cart';
    } else if (currentView === 'checkout') {
      path = '/checkout';
    }
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView, selectedDishSlug]);

  // Route Dispatcher
  const renderView = () => {
    switch (currentView) {
      // Customer Storefront Paths
      case 'home':
        return <HomeView />;
      case 'menu':
        return <MenuView />;
      case 'dish':
        return <DishDetailView />;
      case 'cinematic':
        return <CinematicView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'confirmation':
        return <ConfirmationView />;
      case 'my-orders':
        return <MyOrdersView />;

      // Kitchen Admin Paths
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'admin-orders':
        return <AdminOrdersView />;
      case 'admin-dishes':
        return <AdminDishesView />;
      case 'admin-categories':
        return <AdminCategoriesView />;
      case 'admin-settings':
        return <AdminSettingsView />;

      default:
        return <HomeView />;
    }
  };

  return (
    <ToastProvider>
      <div id="app-root-container" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-350">
        {/* Navigation Bar Header */}
        <Header />
        
        {/* Core Screen Viewport */}
        <main className="flex-grow">
          {renderView()}
        </main>

        {/* Global Footer */}
        <Footer />
        <ProductCustomizationModal />
      </div>
    </ToastProvider>
  );
}
