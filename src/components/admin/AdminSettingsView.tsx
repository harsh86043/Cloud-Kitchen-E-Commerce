/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { getKitchenSettings, saveKitchenSettings } from '../../data';
import { KitchenSettings } from '../../types';
import { useToast } from '../ui/Toast';
import { Shield, Clock, DollarSign, Percent, Save, Power } from 'lucide-react';

export default function AdminSettingsView() {
  const { showToast } = useToast();

  const [kitchenName, setKitchenName] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [isAccepting, setIsAccepting] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState('3.99');
  const [taxRate, setTaxRate] = useState('5'); // display as percentage

  useEffect(() => {
    const s = getKitchenSettings();
    setKitchenName(s.kitchenName);
    setOpeningTime(s.openingTime);
    setClosingTime(s.closingTime);
    setIsAccepting(s.isAcceptingOrders);
    setDeliveryFee(s.deliveryFee.toString());
    setTaxRate((s.taxRate * 100).toString());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenName.trim()) {
      showToast('Kitchen name cannot be empty.', 'error');
      return;
    }
    if (isNaN(Number(deliveryFee))) {
      showToast('Delivery fee must be a valid number.', 'error');
      return;
    }
    if (isNaN(Number(taxRate))) {
      showToast('Tax rate must be a valid number.', 'error');
      return;
    }

    const updated: KitchenSettings = {
      kitchenName,
      openingTime,
      closingTime,
      isAcceptingOrders: isAccepting,
      deliveryFee: Number(deliveryFee),
      taxRate: Number(taxRate) / 100
    };

    saveKitchenSettings(updated);
    showToast('Kitchen parameter matrix successfully saved.', 'success');
  };

  return (
    <div id="admin-settings-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-left">
      
      {/* Title Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          System Core Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure physical parameters of Gourmet Atelier, delivery logistics metrics, and kitchen lane switches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Settings Fields form */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Branding Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-orange-500" />
                <span>Cloud Kitchen Brand Name</span>
              </label>
              <input
                type="text"
                required
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Timings row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Opening Timings (24h)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:00"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Closing Timings (24h)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 23:00"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            {/* Financial Parameters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                  <span>Courier Delivery Fee ($)</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Percent className="w-3.5 h-3.5 text-orange-500" />
                  <span>Local Lab Tax rate (%)</span>
                </label>
                <input
                  type="text"
                  required
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            {/* accepting orders toggle block */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">Accepting Storefront Orders</span>
                <p className="text-[10px] text-slate-400 leading-normal max-w-sm">
                  Deactivating this switch immediately disables checkout processes on storefront customer browsers, preventing new queue additions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAccepting(!isAccepting)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAccepting ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAccepting ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Submit button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Parameters</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Guide Info */}
        <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">
            <Power className="w-4 h-4 text-orange-500" />
            <span>Master Switch Guide</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            These variables are saved under a client profile sandbox (localStorage). Changing parameters has an immediate effect:
          </p>

          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 pl-4 list-disc leading-normal">
            <li>
              <strong>Kitchen Brand Name</strong>: Modifies header title and footer logs dynamically across pages.
            </li>
            <li>
              <strong>Logistics Rates</strong>: Calculates billing values on checkout totals.
            </li>
            <li>
              <strong>Closing hours</strong>: Dictates order schedule calculations.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
