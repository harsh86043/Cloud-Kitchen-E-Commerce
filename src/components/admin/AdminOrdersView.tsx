/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../data';
import { Order, OrderStatus } from '../../types';
import { useToast } from '../ui/Toast';
import { ClipboardList, User, MapPin, Phone, Mail, MessageSquare, Clock, Save } from 'lucide-react';

export default function AdminOrdersView() {
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Status Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'kitchen' | 'completed' | 'cancelled'>('all');
  
  // Selected Order Status Edit state
  const [editStatus, setEditStatus] = useState<OrderStatus>('pending');

  const loadAllOrders = () => {
    const list = getOrders();
    setOrders(list);
    // Auto select first order if none selected or if previously selected is invalid
    if (list.length > 0 && !selectedOrderId) {
      setSelectedOrderId(list[0].id);
      setEditStatus(list[0].status);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setEditStatus(order.status);
  };

  const handleSaveStatus = (id: string) => {
    try {
      updateOrderStatus(id, editStatus);
      showToast(`Order ${id} successfully updated to status: ${editStatus}`, 'success');
      
      // Reload lists
      loadAllOrders();
    } catch {
      showToast('Failed to write status update to localStorage.', 'error');
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'kitchen') {
      return ['accepted', 'preparing', 'ready', 'delivering'].includes(order.status);
    }
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const getStatusBadgeClass = (status: OrderStatus) => {
    const classes: Record<OrderStatus, string> = {
      pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      accepted: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/40',
      preparing: 'bg-orange-50 text-orange-750 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200/40',
      ready: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/40',
      delivering: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/40',
      completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/40',
      cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/40',
    };
    return classes[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div id="admin-orders-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-left">
      
      {/* Header Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Active Kitchen Lanes
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor incoming customer checkouts, confirm receipts, and update preparation statuses.
        </p>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {(['all', 'pending', 'kitchen', 'completed', 'cancelled'] as const).map((tab) => {
          const count = orders.filter(o => {
            if (tab === 'all') return true;
            if (tab === 'pending') return o.status === 'pending';
            if (tab === 'kitchen') return ['accepted', 'preparing', 'ready', 'delivering'].includes(o.status);
            if (tab === 'completed') return o.status === 'completed';
            return o.status === 'cancelled';
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <span className="capitalize">{tab === 'kitchen' ? 'In Kitchen' : tab}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                activeTab === tab 
                  ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-555 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Orders list selection */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[640px] overflow-y-auto">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const elapsedMins = Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000);

              return (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`w-full p-5 text-left flex justify-between gap-4 items-start transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-500/5 border-l-4 border-l-orange-500 shadow-sm' 
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/10'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white uppercase">
                        {order.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {order.customerDetails.fullName}
                    </p>
                    
                    <p className="text-xs text-slate-400 font-medium truncate">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{elapsedMins < 1 ? 'Just now' : `${elapsedMins}m ago`}</span>
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-10 text-center text-slate-400 text-sm">
              No orders found matching this lane filter.
            </div>
          )}
        </div>

        {/* Right Column: Order Details inspector panel */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Header inspect */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Inspecting Order</span>
                  <span className="font-mono text-base font-black text-slate-950 dark:text-white">{selectedOrder.id}</span>
                </div>

                {/* Live Status advancing dropdown control */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending Acceptance</option>
                    <option value="accepted">Accepted (Confirm)</option>
                    <option value="preparing">Preparing in Kitchen</option>
                    <option value="ready">Ready (Seal Packaging)</option>
                    <option value="delivering">Out for Delivery</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <button
                    onClick={() => handleSaveStatus(selectedOrder.id)}
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center gap-1 text-xs cursor-pointer shadow-md shadow-orange-500/10"
                    title="Commit status update"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>

              {/* Grid content breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-150 dark:border-slate-800">
                
                {/* Delivery Information */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Delivery Specifications
                  </h4>
                  
                  <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold">{selectedOrder.customerDetails.fullName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-normal">
                        {selectedOrder.customerDetails.streetAddress}
                        {selectedOrder.customerDetails.apartment && `, ${selectedOrder.customerDetails.apartment}`}
                        <br />
                        {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} {selectedOrder.customerDetails.postalCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedOrder.customerDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{selectedOrder.customerDetails.email}</span>
                    </div>
                  </div>
                </div>

                {/* Additional instructions / details */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Instructional Logs
                  </h4>
                  
                  {selectedOrder.customerDetails.deliveryNotes ? (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-normal border border-slate-150 dark:border-slate-800">
                      <MessageSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p>"{selectedOrder.customerDetails.deliveryNotes}"</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No custom dispatch notes provided by customer.</p>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Payment Token Status</span>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold">
                      <span>{selectedOrder.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Card'}</span>
                      <span>•</span>
                      <span className={selectedOrder.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-orange-500'}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Culinary Dishes Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Kitchen Chef Log (Dishes)
                </h4>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 text-xs leading-relaxed border-b border-slate-100 dark:border-slate-800/40 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold font-mono text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 w-5 h-5 rounded flex items-center justify-center">
                            {item.quantity}
                          </span>
                          {item.isVeg ? (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full" title="Veg" />
                          ) : (
                            <span className="w-2 h-2 bg-rose-500 rounded-full" title="Non-Veg" />
                          )}
                          <span className="font-bold text-slate-800 dark:text-slate-100">{item.name}</span>
                        </div>
                        {item.variantName && (
                          <span className="block text-[10px] text-orange-500 font-mono pl-6 uppercase tracking-wider font-semibold">
                            Portion: {item.variantName}
                          </span>
                        )}
                        {item.addonNames.length > 0 && (
                          <span className="block text-[10px] text-slate-400 pl-6 leading-normal">
                            Toppings: {item.addonNames.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals breakdown */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 p-4 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Lanes Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxing Amount</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch Fee</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-1 pt-2 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                    <span>Grand Total Invoice</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-semibold">No order selected</p>
              <p className="text-xs text-slate-400 mt-1">Select an active kitchen lane on the left to inspect customer specifications.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
