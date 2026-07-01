import React, { useState, useEffect } from 'react';
import { Dish, DishVariant, DishAddon } from '../../types';
import { useAppStore } from '../../store';
import { useToast } from '../ui/Toast';
import { X } from 'lucide-react';

export default function ProductCustomizationModal() {
  const { activeCustomizationDish, closeCustomizer, addToCart } = useAppStore();
  const { showToast } = useToast();
  
  const dish = activeCustomizationDish;
  
  const [selectedVariant, setSelectedVariant] = useState<DishVariant | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<DishAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (dish) {
      if (dish.variants && dish.variants.length > 0) {
        setSelectedVariant(dish.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setSelectedAddons([]);
      setQuantity(1);
      setErrorMsg(null);
    }
  }, [dish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCustomizer();
    };
    if (dish) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, closeCustomizer]);

  if (!dish) return null;

  const hasVariants = dish.variants && dish.variants.length > 0;
  const hasAddons = dish.addons && dish.addons.length > 0;

  const basePrice = selectedVariant ? selectedVariant.price : dish.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleItemTotal = basePrice + addonsTotal;
  const grandTotal = singleItemTotal * quantity;

  const handleAddonChange = (addon: DishAddon, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAddons((prev) => [...prev, addon]);
    } else {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    }
  };

  const handleConfirm = () => {
    if (hasVariants && !selectedVariant) {
      setErrorMsg("Please select a required option.");
      return;
    }
    
    addToCart(dish, selectedVariant, selectedAddons, quantity);
    showToast(`Added ${quantity}x ${dish.name} to cart`, 'success');
    closeCustomizer();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={closeCustomizer}
      />
      <div className="fixed inset-x-0 bottom-0 md:inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
        <div 
          className="w-full md:max-w-lg bg-white dark:bg-slate-950 rounded-t-3xl md:rounded-3xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="relative border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            {dish.imageUrl && (
              <div className="w-full h-48 md:h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <img 
                  src={dish.imageUrl} 
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <button 
              onClick={closeCustomizer}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className={`p-5 ${dish.imageUrl ? 'absolute bottom-0 left-0 w-full text-white' : ''}`}>
              <h2 className="text-2xl font-black">{dish.name}</h2>
              <p className={`text-sm mt-1 line-clamp-2 ${dish.imageUrl ? 'text-slate-200' : 'text-slate-500'}`}>
                {dish.description}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Required Variants */}
            {hasVariants && (
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Required Options
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">REQUIRED</span>
                </div>
                <div className="space-y-2">
                  {dish.variants.map(variant => (
                    <label 
                      key={variant.id}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedVariant?.id === variant.id 
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedVariant?.id === variant.id ? 'border-orange-500' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {selectedVariant?.id === variant.id && (
                            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{variant.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        ${variant.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Addons */}
            {hasAddons && (
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Optional Add-ons
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">OPTIONAL</span>
                </div>
                <div className="space-y-2">
                  {dish.addons.map(addon => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <label 
                        key={addon.id}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                          isChecked 
                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleAddonChange(addon, e.target.checked)}
                            className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300 rounded"
                          />
                          <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{addon.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">
                          +${addon.price.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nutrition/Allergens */}
            {(dish.calories || dish.ingredients) && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {dish.calories && (
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div><span className="font-bold text-slate-700 dark:text-slate-300">{dish.calories}</span> cal</div>
                    {dish.proteinGrams && <div><span className="font-bold text-slate-700 dark:text-slate-300">{dish.proteinGrams}g</span> protein</div>}
                  </div>
                )}
                {dish.contains && (
                  <p className="text-xs text-slate-500 mt-2">
                    <span className="font-bold">Contains:</span> {dish.contains.join(', ')}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Sticky Footer */}
          <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity</span>
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-10 rounded-xl overflow-hidden w-28">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="flex-grow text-center font-bold text-sm text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-between px-6 py-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] transition-all rounded-2xl text-white shadow-lg shadow-orange-500/20"
            >
              <span className="font-bold text-lg">Add to Cart</span>
              <span className="font-mono font-bold text-lg">${grandTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
