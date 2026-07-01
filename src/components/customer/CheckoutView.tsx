/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { getKitchenSettings, saveOrder } from '../../data';
import { Address, Order, OrderItem } from '../../types';
import { useToast } from '../ui/Toast';
import { CreditCard, Truck, ClipboardCheck, ArrowLeft, Loader2 } from 'lucide-react';

export default function CheckoutView() {
  const { 
    cartItems, 
    getCartSubtotal, 
    clearCart, 
    setConfirmedOrderId, 
    setView 
  } = useAppStore();
  const { showToast } = useToast();

  const settings = getKitchenSettings();
  const subtotal = getCartSubtotal();
  const tax = subtotal * settings.taxRate;
  const deliveryFee = settings.deliveryFee;
  const total = subtotal + tax + deliveryFee;

  // Form Fields
  const [fullName, setFullName] = useState('Suryavanshi Harsh');
  const [email, setEmail] = useState('suryavanshiharsh860@gmail.com');
  const [phone, setPhone] = useState('+1 415 555 2671');
  const [streetAddress, setStreetAddress] = useState('100 Pine Street');
  const [apartment, setApartment] = useState('Suite 2400');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94111');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave with front desk concierge.');

  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_placeholder'>('card_placeholder');
  
  // UX States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'A valid email is required';
    if (!phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!streetAddress.trim()) tempErrors.streetAddress = 'Delivery address is required';
    if (!city.trim()) tempErrors.city = 'City is required';
    if (!state.trim()) tempErrors.state = 'State is required';
    if (!postalCode.trim()) tempErrors.postalCode = 'Postal code is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write & security check
    setTimeout(() => {
      try {
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        
        const customerDetails: Address = {
          fullName,
          email,
          phone,
          streetAddress,
          apartment: apartment || undefined,
          city,
          state,
          postalCode,
          deliveryNotes: deliveryNotes || undefined
        };

        const items: OrderItem[] = cartItems.map(item => {
          const itemBasePrice = item.variant ? item.variant.price : item.dish.price;
          const itemAddonsPrice = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
          
          return {
            dishId: item.dish.id,
            name: item.dish.name,
            price: itemBasePrice + itemAddonsPrice,
            quantity: item.quantity,
            variantName: item.variant?.name,
            addonNames: item.selectedAddons.map(a => a.name),
            isVeg: item.dish.isVeg
          };
        });

        // Calculate final preparation time based on maximum of selected dishes prep times
        const maxPrepTime = Math.max(...cartItems.map(item => item.dish.preparationTimeMinutes));

        const newOrder: Order = {
          id: orderId,
          customerDetails,
          items,
          subtotal,
          tax,
          deliveryFee,
          total,
          status: 'pending', // Pending initially so that admin workflow triggers correctly
          paymentMethod,
          paymentStatus: paymentMethod === 'card_placeholder' ? 'paid' : 'pending',
          estimatedPrepTimeMinutes: maxPrepTime,
          createdAt: new Date().toISOString()
        };

        // Save order and clear cart
        saveOrder(newOrder);
        clearCart();
        setConfirmedOrderId(orderId);
        
        showToast('Order successfully dispatched to Gourmet kitchen!', 'success');
        setView('confirmation');
      } catch (error) {
        showToast('Critical error compiling checkout items. Try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500); // Realistic 1.5s loader
  };

  return (
    <div id="checkout-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => setView('cart')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery details form */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Secure Order Dispatch
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We secure your details using standard sandboxed storage mechanisms. No data is shared externally.
              </p>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                1. Customer Contact Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.fullName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Destination Address */}
            <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-800">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                2. Delivery Destination Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="space-y-1.5 sm:col-span-4">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.streetAddress ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.streetAddress && <p className="text-xs text-rose-500">{errors.streetAddress}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Apt / Suite</label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.city ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.city && <p className="text-xs text-rose-500">{errors.city}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.state ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.state && <p className="text-xs text-rose-500">{errors.state}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border ${errors.postalCode ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.postalCode && <p className="text-xs text-rose-500">{errors.postalCode}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-6">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dispatch instructions for courier</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Ring doorbell, leave on porch table, dial 040 in call box..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-800">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                3. Select Payment Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Simulated credit card */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card_placeholder'
                      ? 'border-orange-500 bg-orange-50/15 dark:bg-orange-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === 'card_placeholder'}
                    onChange={() => setPaymentMethod('card_placeholder')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <span>Credit/Debit Card</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      Instant verification. Authorizes checkout immediately using sandboxed gateway tokens.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-orange-500 bg-orange-50/15 dark:bg-orange-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                      <Truck className="w-4 h-4 text-orange-500" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      Pay cash when our dispatch courier delivers the thermal box to your door.
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Order breakdown summary */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm sticky top-24">
            
            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
              Review Lab Order
            </h3>

            {/* Item list */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const basePrice = item.variant ? item.variant.price : item.dish.price;
                const addonsPrice = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
                const cost = basePrice + addonsPrice;
                
                return (
                  <div key={item.id} className="flex justify-between items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono text-xs">{item.quantity}x</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.dish.name}</span>
                      {item.variant && (
                        <span className="block text-[10px] text-orange-500 font-mono font-medium">({item.variant.name})</span>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <span className="block text-[10px] text-slate-400">
                          + {item.selectedAddons.map(a => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      ${(cost * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financials details */}
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Items Subtotal</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lab Tax ({(settings.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Superfast Delivery</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4 flex justify-between items-baseline">
                <span className="font-black text-slate-900 dark:text-white">Total Amount Due</span>
                <span className="font-black text-2xl text-slate-950 dark:text-white font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Order Details...</span>
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="w-5 h-5" />
                    <span>Authorize & Dispatch Order</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
