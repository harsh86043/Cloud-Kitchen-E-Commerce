/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Flame, Star, Check, Plus, Minus, HelpCircle, Box, Play } from 'lucide-react';
import { useAppStore } from '../../store';
import { getDishes, getCategories } from '../../data';
import { Dish } from '../../types';
import { useToast } from '../ui/Toast';
import { getCinematicConfigForDish } from '../../features/cinematic/lib/cinematicConfig';

export default function DishDetailView() {
  const { 
    selectedDishSlug, 
    setView, 
    addToCart, 
    openCustomizer,
    setSelectedDishSlug 
  } = useAppStore();
  const { showToast } = useToast();

  const [dish, setDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (selectedDishSlug) {
      const foundDish = getDishes().find(d => d.slug === selectedDishSlug);
      if (foundDish) {
        setDish(foundDish);
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

  const cinematicData = getCinematicConfigForDish(dish.slug);

  const handleAddToCart = () => {
    if ((dish.variants && dish.variants.length > 0) || (dish.addons && dish.addons.length > 0)) {
      openCustomizer(dish);
    } else {
      addToCart(dish, undefined, [], 1);
      showToast(`Added ${dish.name} to cart`, 'success');
    }
  };

  return (
    <div id="dish-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32 relative">
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

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Food Image & Cinematic button */}
        <div className="w-full lg:w-5/12 space-y-6">
          {/* Main Dish Photo */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm animate-fade-in group">
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

          {/* Cinematic 3D Call to Action */}
          {cinematicData && (
            <button 
              onClick={() => setView('cinematic')}
              className="w-full p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/50 transition-all group text-left flex items-center justify-between"
            >
              {/* Ambient Background Glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-colors" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-100 leading-tight">
                    Experience in 3D
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    View cinematic animated breakdown
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Right Column: Information, Customization & Checkout options */}
        <div className="w-full lg:w-7/12 space-y-8">
          
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

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {dish.name}
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {dish.description}
            </p>
          </div>

          {/* Nutrition Macros */}
          {dish.calories && (
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 sm:gap-4 no-scrollbar hide-scrollbar">
              <div className="flex-shrink-0 min-w-[100px] p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Calories</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">{dish.calories}</div>
              </div>
              <div className="flex-shrink-0 min-w-[100px] p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Protein</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">{dish.proteinGrams}g</div>
              </div>
              <div className="flex-shrink-0 min-w-[100px] p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Carbs</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">{dish.carbsGrams}g</div>
              </div>
              <div className="flex-shrink-0 min-w-[100px] p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Fat</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200">{dish.fatGrams}g</div>
              </div>
            </div>
          )}

          {/* Details (Ingredients, Contains) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
            {dish.ingredients && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Ingredients</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {dish.ingredients.join(', ')}
                </p>
              </div>
            )}
            {dish.contains && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Contains</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {dish.contains.join(', ')}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Action Footer (Sticky on Mobile) */}
      <div className="fixed sm:static bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 sm:bg-transparent p-4 sm:p-0 backdrop-blur-md sm:backdrop-blur-none border-t border-slate-200 dark:border-slate-800 sm:border-none shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] sm:shadow-none sm:mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="space-y-0.5 hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Base Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                ${dish.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {dish.isAvailable ? (
              <button
                onClick={handleAddToCart}
                data-add-to-cart-source={`classic-${dish.id}`}
                className="w-full sm:w-auto sm:px-12 py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 text-lg"
              >
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto sm:px-12 py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold rounded-2xl cursor-not-allowed text-lg"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
