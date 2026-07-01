/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFramePreloader } from '../hooks/useFramePreloader';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import CinematicStage from './CinematicStage';
import { Dish, DishVariant, DishAddon } from '../../../types';
import { CinematicDishConfig, CinematicFrameSet } from '../types/cinematic.types';
import { ArrowLeft, Sparkles, Check, Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CinematicDishExperienceProps {
  dish: Dish;
  config: CinematicDishConfig;
  frameSet: CinematicFrameSet;
  onBack: () => void;
  selectedVariant: DishVariant | undefined;
  setSelectedVariant: (variant: DishVariant) => void;
  selectedAddons: DishAddon[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<DishAddon[]>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleAddToCart: () => void;
  grandTotal: number;
  singleItemTotal: number;
}

export default function CinematicDishExperience({
  dish,
  config,
  frameSet,
  onBack,
  selectedVariant,
  setSelectedVariant,
  selectedAddons,
  setSelectedAddons,
  quantity,
  setQuantity,
  handleAddToCart,
  grandTotal,
  singleItemTotal
}: CinematicDishExperienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { screenWidth } = useDeviceCapability();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Preload frames
  const {
    loadedFrames,
    isPreloadingComplete,
    preloadProgress,
    hasErrors,
    posterImage
  } = useFramePreloader(frameSet, screenWidth);

  // Scroll Trigger linking
  useEffect(() => {
    if (!isPreloadingComplete) return;

    // Direct scroll tracker mapped cleanly to state
    const triggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      triggerInstance.kill();
    };
  }, [isPreloadingComplete]);

  const handleAddonChange = (addon: DishAddon, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAddons(prev => [...prev, addon]);
    } else {
      setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-slate-950 text-slate-100 antialiased text-left">
      
      {/* Immersive layout container */}
      <div className="flex flex-col md:flex-row relative">
        
        {/* Left Pane: Fixed Sticky Stage (Canvas sequence renderer) */}
        <div className="w-full md:w-[60%] h-[45vh] md:h-screen sticky top-0 md:top-16 overflow-hidden bg-slate-950 z-0">
          <CinematicStage
            frameSet={frameSet}
            progress={scrollProgress}
            loadedFrames={loadedFrames}
            posterImage={posterImage}
            isPreloadingComplete={isPreloadingComplete}
            preloadProgress={preloadProgress}
            hasErrors={hasErrors}
          />
        </div>

        {/* Absolute Scrolling Text Overlays for Storytelling */}
        <div className="absolute top-0 left-0 w-full md:w-[60%] pointer-events-none z-10">
          <div className="md:pt-[10vh]" />
          {config.sections.map((section, idx) => {
            const isActive = scrollProgress >= section.startProgress && scrollProgress <= section.endProgress;
            
            return (
              <div
                key={section.id}
                className="min-h-[60vh] md:min-h-[80vh] flex items-center p-6 md:p-12 pointer-events-none"
              >
                <div
                  className={`w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 pointer-events-auto transform ${
                    isActive
                      ? 'opacity-100 scale-100 translate-y-0 border-orange-500/40 shadow-orange-500/10'
                      : 'opacity-15 scale-95 translate-y-6'
                  }`}
                >
                  {section.badge && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider mb-4">
                      <Sparkles className="w-3 h-3" />
                      <span>{section.badge}</span>
                    </span>
                  )}
                  <h3 className="text-lg md:text-2xl font-black text-white tracking-tight leading-snug">
                    {section.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-3">
                    {section.description}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Extra trailing space so last cards can scroll cleanly */}
          <div className="h-[40vh]" />
        </div>

        {/* Right Pane: Checkout / Order Customization Hub */}
        <div className="w-full md:w-[40%] min-h-screen md:h-screen md:sticky md:top-16 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-20 shadow-2xl">
          
          {/* Top content */}
          <div className="space-y-6">
            
            {/* Nav Back & Category */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Dishes</span>
              </button>

              <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase rounded-lg tracking-wider">
                Cinematic View
              </span>
            </div>

            {/* Header info */}
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                {dish.isVeg ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded">
                    Veg 🥬
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase rounded">
                    Gourmet 🥩
                  </span>
                )}
                {dish.spiceLevel > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] font-black uppercase rounded">
                    Spice Lvl {dish.spiceLevel} 🌶️
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {dish.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Variants selection */}
            {dish.variants && dish.variants.length > 0 && (
              <div className="space-y-3 pt-2 text-left">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Portion size
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {dish.variants.map((v) => (
                    <label
                      key={v.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-950/5 shadow-sm'
                          : 'border-slate-150 dark:border-slate-800 bg-slate-550 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="cinematic-variant"
                          checked={selectedVariant?.id === v.id}
                          onChange={() => setSelectedVariant(v)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          {v.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                        ${v.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Addons selection */}
            {dish.addons && dish.addons.length > 0 && (
              <div className="space-y-3 pt-2 text-left">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Extra toppings
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {dish.addons.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50/5 dark:bg-orange-950/5 shadow-sm'
                            : 'border-slate-150 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/10 hover:border-slate-250'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleAddonChange(addon, e.target.checked)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                          />
                          <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                          +${addon.price.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Bottom customizer checkout panels */}
          <div className="border-t border-slate-150 dark:border-slate-800 pt-6 mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quantity
                </span>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-10 rounded-xl overflow-hidden w-28 shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-grow text-center font-bold text-xs font-mono text-slate-850 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Grand Total
                </span>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-black text-slate-950 dark:text-white font-mono">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono block">
                  {quantity}x base ${singleItemTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                data-add-to-cart-source={`cinematic-${dish.id}`}
                className="flex-grow py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add customized meal to Cart</span>
              </button>
            </div>
            
            <p className="text-[9px] text-center text-slate-400 font-mono flex items-center justify-center gap-1 select-none">
              <Info className="w-3 h-3 text-orange-500" />
              <span>Full-scale e-commerce bindings synchronized live.</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
