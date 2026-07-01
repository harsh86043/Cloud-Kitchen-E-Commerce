/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { getOrders } from '../../data';
import { Order } from '../../types';
import { ClipboardList, Calendar, Receipt, ChevronRight } from 'lucide-react';

export default function MyOrdersView() {
  const { setView, setConfirmedOrderId } = useAppStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Pull orders (newest first is handled by saveOrder pushing to beginning)
    setOrders(getOrders());
  }, []);

  const handleTrackOrder = (orderId: string) => {
    setConfirmedOrderId(orderId);
    setView('confirmation');
  };

  const getStatusBadge = (status: Order['status']) => {
    const styles: Record<Order['status'], string> = {
      pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      accepted: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/50',
      preparing: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200/50',
      ready: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/50',
      delivering: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/50',
      completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50',
      cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50',
    };

    const labels: Record<Order['status'], string> = {
      pending: 'Awaiting Acceptance',
      accepted: 'Confirmed',
      preparing: 'Preparing in Lab',
      ready: 'Sealed & Ready',
      delivering: 'Out for Delivery',
      completed: 'Delivered',
      cancelled: 'Cancelled',
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div id="my-orders-view" className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-200 dark:border-slate-800">
          <ClipboardList className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            No order history recorded
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You haven't dispatched any orders under this browser profile yet. Place your first chef creation request!
          </p>
        </div>
        <button
          onClick={() => setView('menu')}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-500/20"
        >
          Explore Gourmet Menu
        </button>
      </div>
    );
  }

  return (
    <div id="my-orders-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Culinary History
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review previous invoices and track active dispatch couriers in real time.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={order.id}
              id={`order-row-${order.id}`}
              className="p-5 sm:p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-2 min-w-0 flex-grow">
                {/* Reference ID & Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono uppercase">
                    {order.id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                {/* Date & Quantity Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    <span>{totalItems} items ordered</span>
                  </div>
                </div>

                {/* Summary list of items */}
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate pr-4">
                  {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </p>
              </div>

              {/* Price & Tracker deep link */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">Paid Amount</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleTrackOrder(order.id)}
                  className="px-4 py-2 bg-slate-100 hover:bg-orange-500 dark:bg-slate-800 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer hover:shadow-md hover:shadow-orange-500/10"
                >
                  <span>Track Lab Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
