/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useAppStore, AppView } from '../../store';
import { getOrders } from '../../data';
import { Order, OrderStatus } from '../../types';
import { Check, Clipboard, HelpCircle, ShoppingBag } from 'lucide-react';
import { useToast } from '../ui/Toast';

export default function ConfirmationView() {
  const { confirmedOrderId, setView, setConfirmedOrderId } = useAppStore();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Poll for live status changes (so when they simulate Admin and change status, they see it here instantly!)
  useEffect(() => {
    const fetchOrderDetails = () => {
      if (confirmedOrderId) {
        const found = getOrders().find(o => o.id === confirmedOrderId);
        if (found) {
          setOrder(found);
        }
      }
    };

    fetchOrderDetails();
    
    // Check for changes every 3 seconds
    const interval = setInterval(fetchOrderDetails, 3000);
    return () => clearInterval(interval);
  }, [confirmedOrderId]);

  if (!confirmedOrderId || !order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order not found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We couldn't locate any active order session in this workspace. Let's return you to the kitchen explore page.
        </p>
        <button
          onClick={() => setView('menu')}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all cursor-pointer"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(order.id);
      setCopiedId(true);
      showToast('Order ID copied to clipboard!', 'success');
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      showToast('Copy failed. Manual copy: ' + order.id, 'error');
    }
  };

  // Status mapping
  const statusSteps: { label: string; status: OrderStatus; desc: string }[] = [
    { label: 'Pending', status: 'pending', desc: 'Awaiting admin confirmation' },
    { label: 'Accepted', status: 'accepted', desc: 'Order verified by head chef' },
    { label: 'Preparing', status: 'preparing', desc: 'Active cooking & temperature checks' },
    { label: 'Ready', status: 'ready', desc: 'Sealed inside dynamic thermal box' },
    { label: 'Out for Delivery', status: 'delivering', desc: 'Dispatch courier is on the road' },
    { label: 'Completed', status: 'completed', desc: 'Arrived at destination' }
  ];

  // Find active step index
  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);
  
  // Is cancelled helper
  const isCancelled = order.status === 'cancelled';

  return (
    <div id="confirmation-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Top Banner */}
      <div className="text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-8 rounded-3xl">
        <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <Check className="w-7 h-7 stroke-[3px]" />
        </div>
        <div className="space-y-1.5 max-w-xl mx-auto">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider uppercase">
            Order Securely Dispatched
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Order Confirmed & Received!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Thank you for ordering with <span className="font-bold">Gourmet Atelier</span>. Our kitchen lab team has been notified and is preparing to sterilize utensils for preparation.
          </p>
        </div>
      </div>

      {/* Simulator Guidance box */}
      <div className="p-4 bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-start gap-3.5 text-xs">
        <span className="text-lg">💡</span>
        <div className="space-y-1 text-left">
          <span className="font-bold">Admin Simulation Guide:</span>
          <p className="leading-relaxed">
            Since this is a foundation playground, you can test both roles! Click <strong>"Kitchen Admin"</strong> in the top header, click <strong>"Orders"</strong>, select this order <strong>({order.id})</strong>, and advance the status. Return to "Storefront" and watch the live tracker below update in real time!
          </p>
        </div>
      </div>

      {/* Tracking and Details columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Track Column */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">Order Reference ID</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{order.id}</span>
                <button 
                  onClick={handleCopyId}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                  title="Copy reference id"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">Est. Preparation Time</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{order.estimatedPrepTimeMinutes} Mins</span>
            </div>
          </div>

          {/* Status steps list */}
          {isCancelled ? (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/30 rounded-2xl text-center space-y-2">
              <span className="text-2xl">⚠️</span>
              <h4 className="font-extrabold text-base text-rose-600 dark:text-rose-400">Order Cancelled</h4>
              <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                This order has been cancelled by the kitchen management. If you paid via simulated card, your placeholder credits will auto-restore.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Live Status Tracker
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                {statusSteps.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="relative flex gap-4 text-left">
                      {/* Node circle */}
                      <span className={`absolute -left-5 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isDone 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : isActive 
                            ? 'bg-orange-500 border-orange-500 text-white animate-pulse shadow-md shadow-orange-500/25' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300'
                      }`}>
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        ) : (
                          <span className="w-1.5 h-1.5 bg-current rounded-full" />
                        )}
                      </span>

                      <div className="space-y-0.5">
                        <span className={`text-sm font-bold block ${
                          isActive 
                            ? 'text-orange-500 font-extrabold' 
                            : isDone 
                              ? 'text-slate-800 dark:text-slate-200' 
                              : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Breakdown Summary column */}
        <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Receipt Overview
          </h3>

          <div className="space-y-4 max-h-56 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm leading-snug">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{item.quantity}x</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                  {item.variantName && (
                    <span className="block text-[10px] text-orange-500 font-mono">({item.variantName})</span>
                  )}
                  {item.addonNames.length > 0 && (
                    <span className="block text-[10px] text-slate-400 leading-normal">
                      + {item.addonNames.join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Packaging & Tax</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dispatch courier</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-4 flex justify-between items-baseline">
              <span className="font-black text-slate-900 dark:text-white">Amount Paid ({order.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Card'})</span>
              <span className="font-black text-xl text-slate-950 dark:text-white font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Back to menu */}
          <div className="pt-2">
            <button
              onClick={() => {
                setConfirmedOrderId(null);
                setView('menu');
              }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <span>Order More food</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
