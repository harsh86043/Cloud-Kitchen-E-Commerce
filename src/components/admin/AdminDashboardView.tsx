/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useAppStore, AppView } from '../../store';
import { getAdminDashboardStats, getKitchenSettings } from '../../data';
import { AdminDashboardStats } from '../../types';
import { ClipboardList, ShieldAlert, Timer, CheckCircle, TrendingUp, Sparkles, Plus } from 'lucide-react';

export default function AdminDashboardView() {
  const { setView } = useAppStore();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isAccepting, setIsAccepting] = useState(true);

  useEffect(() => {
    setStats(getAdminDashboardStats());
    setIsAccepting(getKitchenSettings().isAcceptingOrders);
  }, []);

  if (!stats) return null;

  const cardData = [
    {
      label: "Today's Orders",
      value: stats.todayOrdersCount,
      desc: "Fresh dispatch requests",
      icon: ClipboardList,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
      view: "admin-orders" as AppView
    },
    {
      label: "Pending Orders",
      value: stats.pendingCount,
      desc: "Requires verification",
      icon: ShieldAlert,
      color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20",
      view: "admin-orders" as AppView
    },
    {
      label: "Preparing in Labs",
      value: stats.preparingCount,
      desc: "Active chef stations",
      icon: Timer,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
      view: "admin-orders" as AppView
    },
    {
      label: "Completed Orders",
      value: stats.completedCount,
      desc: "Successfully delivered",
      icon: CheckCircle,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
      view: "admin-orders" as AppView
    }
  ];

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Kitchen Management Console
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and controls for active cloud kitchen lanes.
          </p>
        </div>

        {/* Operating status banner */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
            isAccepting 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400' 
              : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAccepting ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
            <span>Kitchen is {isAccepting ? 'Accepting Orders' : 'CLOSED'}</span>
          </span>
          
          <button
            onClick={() => setView('admin-dishes')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Dish</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => setView(card.view)}
              className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md transition-shadow text-left flex gap-4 items-start w-full cursor-pointer"
            >
              <div className={`p-3.5 rounded-xl ${card.color} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {card.label}
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono block leading-none">
                  {card.value}
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  {card.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Breakdown Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Top Selling Dishes */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Top Chef Lab Creations
            </h3>
          </div>

          {stats.topDishes.length > 0 ? (
            <div className="space-y-4">
              {stats.topDishes.map((dish, idx) => {
                // simple progress bar ratio relative to highest seller
                const maxCount = stats.topDishes[0].count;
                const ratio = Math.max(10, (dish.count / maxCount) * 100);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        {dish.isVeg ? (
                          <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" title="Veg" />
                        ) : (
                          <span className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0" title="Non-Veg" />
                        )}
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{dish.name}</span>
                      </div>
                      <div className="flex gap-4 font-mono text-xs font-bold text-slate-900 dark:text-white flex-shrink-0">
                        <span>{dish.count} orders</span>
                        <span className="text-slate-400 dark:text-slate-500">${dish.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Visual Bar Indicator */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              No orders registered yet to compile analytics. Place your first storefront order!
            </div>
          )}
        </div>

        {/* Revenue Summary and Control Card */}
        <div className="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="space-y-4 relative">
            <div className="flex items-center gap-2 text-orange-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider font-mono">Dynamic Revenue Stream</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-medium block">Total Calculated Turnover</span>
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white block">
                ${stats.revenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block">
                * Dynamic aggregation excluding cancelled items
              </span>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Revenue source</span>
                <span className="font-mono text-slate-300 font-semibold">Gourmet Atelier MVP</span>
              </div>
              <div className="flex justify-between">
                <span>Active Channels</span>
                <span className="font-mono text-slate-300 font-semibold">Web Client Stores</span>
              </div>
              <div className="flex justify-between">
                <span>Database engine</span>
                <span className="font-mono text-slate-300 font-semibold">HTML5 Storage</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setView('admin-orders')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 block text-center cursor-pointer"
              >
                Go Manage Order Lanes
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
