/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Compass, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useAppStore } from '../../store';

export default function Footer() {
  const { setView } = useAppStore();

  return (
    <footer id="app-footer" className="bg-slate-900 dark:bg-black text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">Gourmet Atelier</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              Premium, hyper-local cloud kitchen serving chef-crafted gourmet burgers, sourdough stone pizzas, and artisanal noodles. Delivered piping hot to your door.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>for food lovers globally.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Kitchen Storefront
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => setView('home')} 
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-orange-500" />
                  <span>Home Page</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('menu')} 
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Explore Menu</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('my-orders')} 
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Order Tracking</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Info */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Our Promise
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>15-Minute Prep Commitment</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Hygienic Kitchen Labs</span>
              </li>
              <li className="text-slate-500 text-xs leading-relaxed mt-2">
                All food cooked under strict temperature monitoring and packaged in biodegradable thermal boxes.
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Gourmet Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Allergies Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
