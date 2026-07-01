/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Flame, Star, Check, Plus, Minus, HelpCircle, Box } from 'lucide-react';
import { useAppStore } from '../../store';
import { getDishes, getCategories } from '../../data';
import { Dish, DishVariant, DishAddon } from '../../types';
import { useToast } from '../ui/Toast';
import { useCinematicEligibility } from '../../features/cinematic/hooks/useCinematicEligibility';
import { getCinematicConfigForDish } from '../../features/cinematic/lib/cinematicConfig';
import CinematicDishExperience from '../../features/cinematic/components/CinematicDishExperience';

export default function DishDetailView() {
  const { 
    selectedDishSlug, 
    setView, 
    addToCart, 
    setSelectedDishSlug 
  } = useAppStore();
  const { showToast } = useToast();

  const [dish, setDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Selection States
  const [selectedVariant, setSelectedVariant] = useState<DishVariant | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<DishAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const eligibility = useCinematicEligibility(dish);

  useEffect(() => {
    if (selectedDishSlug) {
      const foundDish = getDishes().find(d => d.slug === selectedDishSlug);
      if (foundDish) {
        setDish(foundDish);
        // Set default variant if available
        if (foundDish.variants && foundDish.variants.length > 0) {
          setSelectedVariant(foundDish.variants[0]);
        } else {
          setSelectedVariant(undefined);
        }
        setSelectedAddons([]);
        setQuantity(1);
      }
    }
    setCategories(getCategories());
  }, [selectedDishSlug]);

  if (!dish) {
    return (
      <div className="max-w-md mx-auto text-center py-20 animate-fade-in">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-4">Dish not found</h3>
        <button
          onClick={() => setView('menu')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const categoryName = categories.find(c => c.id === dish.categoryId)?.name || 'Chef Specialty';

  // Calculate Single Item Base Price based on selected variant
  const basePrice = selectedVariant ? selectedVariant.price : dish.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleItemTotal = basePrice + addonsTotal;
  const grandTotal = singleItemTotal * quantity;

  const cinematicData = getCinematicConfigForDish(dish.slug);

  const handleAddonChange = (addon: DishAddon, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAddons(prev => [...prev, addon]);
    } else {
      setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
    }
  };

  const handleAddToCart = () => {
    addToCart(dish, selectedVariant, selectedAddons, quantity);
    showToast(`${quantity}x ${dish.name} customized and added to cart!`, 'success');
  };

  if (eligibility.mode === 'full' && cinematicData) {
    return (
      <CinematicDishExperience
        dish={dish}
        config={cinematicData.config}
        frameSet={cinematicData.frameSet}
        onBack={() => {
          setSelectedDishSlug(null);
          setView('menu');
        }}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        selectedAddons={selectedAddons}
        setSelectedAddons={setSelectedAddons}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
        grandTotal={grandTotal}
        singleItemTotal={singleItemTotal}
      />
    );
  }

  return (
    <div id="dish-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setSelectedDishSlug(null);
            setView('menu');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Culinary Menu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Food Image & Future Cinematic teaser */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Dish Photo */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm animate-fade-in">
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {dish.isVeg ? (
                <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg tracking-wider shadow">
                  Pure Veg
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase rounded-lg tracking-wider shadow">
                  Gourmet Meat
                </span>
              )}
            </div>
          </div>

          {/* Cinematic 3D Teaser Placeholder (Future Enhancement Extension Point) */}
          <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl">
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center text-orange-400">
                <Box className="w-6 h-6 animate-spin-slow" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                    Progressive Expansion
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-800 text-[9px] text-slate-400 rounded-md font-mono">
                    MVP READY
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-100 leading-tight">
                  Cinematic 3D Asset Slot
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This page contains a pre-configured viewport hook for scroll-based WebGL/GSAP frame animations. The 3D layer can load here smoothly as a progressive enhancement.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Interactive 3D viewport registered: id="3d-canvas-container"</span>
                </div>
              </div>
            </div>

            {/* Hidden Target Hook for Future 3D Canvas */}
            <div id="3d-canvas-container" className="hidden" />
          </div>
        </div>

        {/* Right Column: Customization & Checkout options */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Metadata */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg uppercase tracking-wider">
                {categoryName}
              </span>
              <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{dish.preparationTimeMinutes} Mins Cook Time</span>
              </div>
              <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1">
                <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>4.9 (240+ reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {dish.name}
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              {dish.description}
            </p>
          </div>

          {/* CUSTOMIZER SECTIONS */}
          <div className="space-y-6">
            
            {/* 1. Variants Selection (e.g. Size, Patty options) */}
            {dish.variants && dish.variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Portion / Build
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dish.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10 shadow-md shadow-orange-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="dish-variant"
                          checked={selectedVariant?.id === variant.id}
                          onChange={() => setSelectedVariant(variant)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {variant.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                        ${variant.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Add-ons Selection (e.g. toppings, extras) */}
            {dish.addons && dish.addons.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Enhance Your Dish (Add-ons)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dish.addons.map((addon) => {
                    const isSelected = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-950/5 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleAddonChange(addon, e.target.checked)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded"
                          />
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                          +${addon.price.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Quantity & Pricing Footer bar */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Quantity Control */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quantity Selector
                  </span>
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-32 h-11 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-grow text-center font-extrabold text-sm font-mono text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Display */}
                <div className="text-left sm:text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dynamic Subtotal
                  </span>
                  <div className="flex items-baseline justify-start sm:justify-end gap-1.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                    {quantity}x base ${singleItemTotal.toFixed(2)}
                  </span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {dish.isAvailable ? (
                  <button
                    onClick={handleAddToCart}
                    data-add-to-cart-source={`classic-${dish.id}`}
                    className="flex-grow py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <span>Confirm Customization & Add to Cart</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-grow py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold rounded-xl cursor-not-allowed"
                  >
                    Kitchen Lab Sold Out (Unavailable)
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
