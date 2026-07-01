/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, LayoutDashboard, UserCheck, Shield, UtensilsCrossed, ClipboardList } from 'lucide-react';
import { useAppStore, AppView } from '../../store';
import { getKitchenSettings } from '../../data';
import { useEffect, useState } from 'react';

export default function Header() {
  const { 
    currentView, 
    currentRole, 
    setView, 
    setRole, 
    getCartCount 
  } = useAppStore();
  
  const [kitchenName, setKitchenName] = useState('Gourmet Atelier');
  const cartCount = getCartCount();

  useEffect(() => {
    // Refresh name when view changes (e.g. from admin updates)
    const settings = getKitchenSettings();
    if (settings && settings.kitchenName) {
      setKitchenName(settings.kitchenName);
    }
  }, [currentView]);

  const customerNavItems: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Explore Menu', view: 'menu' },
    { label: 'My Orders', view: 'my-orders' },
  ];

  const adminNavItems: { label: string; view: AppView; icon: any }[] = [
    { label: 'Dashboard', view: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'Orders', view: 'admin-orders', icon: ClipboardList },
    { label: 'Manage Dishes', view: 'admin-dishes', icon: UtensilsCrossed },
    { label: 'Categories', view: 'admin-categories', icon: ClipboardList },
    { label: 'Settings', view: 'admin-settings', icon: Shield },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <button
          onClick={() => setView(currentRole === 'admin' ? 'admin-dashboard' : 'home')}
          className="flex items-center gap-3 text-left hover:opacity-95 transition-opacity animate-fade-in"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/25">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-950 dark:text-white leading-tight tracking-tight uppercase">
              {kitchenName}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
              Neon Cloud Kitchen
            </p>
          </div>
        </button>

        {/* Navigation - Adaptive based on Role */}
        <nav className="hidden md:flex items-center gap-1">
          {currentRole === 'customer' ? (
            customerNavItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  currentView === item.view
                    ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-orange-50 dark:hover:bg-slate-900 hover:text-orange-600'
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentView === item.view
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-slate-900 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setRole('customer')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'customer'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kitchen Admin</span>
            </button>
          </div>

          {/* Cart Icon (Only available or active in Customer role) */}
          {currentRole === 'customer' && (
            <button
              onClick={() => setView('cart')}
              data-cart-target="header-cart"
              className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                currentView === 'cart'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600'
              }`}
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5">
        {currentRole === 'customer' ? (
          customerNavItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === item.view
                  ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))
        ) : (
          adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all ${
                  currentView === item.view
                    ? 'text-orange-500'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })
        )}
      </div>
    </header>
  );
}
