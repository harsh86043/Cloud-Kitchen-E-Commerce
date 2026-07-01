/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store';
import { getKitchenSettings } from '../../data';
import { useToast } from '../ui/Toast';

export default function CartView() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal, 
    setView 
  } = useAppStore();
  const { showToast } = useToast();

  const settings = getKitchenSettings();
  const subtotal = getCartSubtotal();
  const tax = subtotal * settings.taxRate;
  const deliveryFee = subtotal > 0 ? settings.deliveryFee : 0;
  const total = subtotal + tax + deliveryFee;

  const handleRemove = (itemId: string, name: string) => {
    removeFromCart(itemId);
    showToast(`${name} removed from cart.`, 'info');
  };

  const handleUpdateQty = (itemId: string, name: string, oldQty: number, newQty: number) => {
    updateQuantity(itemId, newQty);
    if (newQty > oldQty) {
      showToast(`Increased quantity of ${name}`, 'success');
    } else if (newQty < oldQty && newQty > 0) {
      showToast(`Decreased quantity of ${name}`, 'info');
    } else {
      showToast(`${name} removed from cart.`, 'info');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div id="cart-view" className="max-w-md mx-auto text-center py-20 px-4 space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-200 dark:border-slate-800">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Your cart is currently empty
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You haven't added any delicious chef creations yet. Check out our high-temperature preservation dishes!
          </p>
        </div>
        <button
          onClick={() => setView('menu')}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Culinary Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Culinary Cart
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your gourmet selections before forwarding them to our active kitchen labs.
          </p>
        </div>
        <button
          onClick={() => setView('menu')}
          className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Dishes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map((item) => {
            const itemBasePrice = item.variant ? item.variant.price : item.dish.price;
            const itemAddonsPrice = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
            const itemSingleCost = itemBasePrice + itemAddonsPrice;
            const itemTotalCost = itemSingleCost * item.quantity;

            return (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex items-start sm:items-center gap-4 p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              >
                {/* Thumbnail Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-800">
                  <img
                    src={item.dish.imageUrl}
                    alt={item.dish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.dish.isVeg ? (
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" title="Vegetarian" />
                    ) : (
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" title="Non-Vegetarian" />
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {item.dish.name}
                    </h3>
                  </div>

                  {/* Portions/Variant Name */}
                  {item.variant && (
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider font-mono">
                      Portion: {item.variant.name}
                    </p>
                  )}

                  {/* Selected Add-ons Summary */}
                  {item.selectedAddons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.selectedAddons.map((add) => (
                        <span key={add.id} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                          +{add.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantity and Price mobile layout */}
                  <div className="flex sm:hidden items-center justify-between gap-2 pt-2">
                    {/* Qty buttons */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-8 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.dish.name, item.quantity, item.quantity - 1)}
                        className="px-2 h-full flex items-center justify-center text-slate-500 hover:text-slate-800"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.dish.name, item.quantity, item.quantity + 1)}
                        className="px-2 h-full flex items-center justify-center text-slate-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-slate-950 dark:text-white font-mono">
                      ${itemTotalCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Desktop Qty, Price, Remove controls */}
                <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-9 rounded-xl overflow-hidden w-28 shadow-sm">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.dish.name, item.quantity, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-grow text-center font-bold text-xs font-mono text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.dish.name, item.quantity, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Individual Subtotal */}
                  <div className="text-right w-20">
                    <span className="font-bold text-slate-900 dark:text-white font-mono block">
                      ${itemTotalCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ${itemSingleCost.toFixed(2)} ea
                    </span>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.dish.name)}
                    className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Trash button */}
                <button
                  onClick={() => handleRemove(item.id, item.dish.name)}
                  className="sm:hidden p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        {/* Pricing Summary & Checkout Button Column */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Order Pricing Summary
            </h3>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Basket Subtotal</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lab Packaging & Tax ({(settings.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Superfast Dispatch Fee</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4 flex justify-between items-baseline">
                <span className="font-black text-base text-slate-900 dark:text-white">Est. Grand Total</span>
                <span className="font-black text-2xl text-slate-900 dark:text-white font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => setView('checkout')}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed text-center font-mono">
                💡 Prices verified by server. Placing an order will clear this cart and trigger high-temperature kitchen preparation processes immediately.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
