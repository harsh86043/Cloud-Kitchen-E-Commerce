/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, Flame, Star, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { getDishes, getCategories } from '../../data';
import { Dish, Category } from '../../types';
import { useToast } from '../ui/Toast';

export default function MenuView() {
  const { setView, setSelectedDishSlug, addToCart, openCustomizer } = useAppStore();
  const { showToast } = useToast();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(30);

  useEffect(() => {
    setDishes(getDishes());
    setCategories(getCategories().filter(c => c.isActive));
  }, []);

  const handleAddToCartDirect = (dish: Dish) => {
    if (dish.variants.length > 0 || dish.addons.length > 0) {
      openCustomizer(dish);
    } else {
      addToCart(dish, undefined, [], 1);
      showToast(`${dish.name} added to your cart!`, 'success');
    }
  };

  // Run filters
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.categoryId === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVeg = !filterVegOnly || dish.isVeg;
    const matchesPrice = dish.price <= maxPrice;

    return matchesCategory && matchesSearch && matchesVeg && matchesPrice;
  });

  const getSpiceChilis = (level: number) => {
    if (level === 0) return null;
    return (
      <span className="flex items-center gap-0.5 text-rose-500" title={`Spice Level: ${level}`}>
        {Array.from({ length: level }).map((_, i) => (
          <span key={i} className="text-sm">🌶️</span>
        ))}
      </span>
    );
  };

  return (
    <div id="menu-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Title Header */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight animate-fade-in">
          Explore Our Culinary Lab Menu
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Everything is made fresh-to-order inside our certified, hygiene-monitored kitchen labs. Filter by food type or search your favorite cravings.
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search burgers, pizzas, secret sauces, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Veg Only Toggle */}
          <div className="md:col-span-3 flex items-center gap-2 select-none justify-start sm:justify-center">
            <input
              type="checkbox"
              id="veg-only-toggle"
              checked={filterVegOnly}
              onChange={(e) => setFilterVegOnly(e.target.checked)}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="veg-only-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              🥬 Pure Vegetarian (Veg)
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="md:col-span-4 flex items-center gap-3 w-full">
            <span className="text-xs text-slate-500 font-mono flex-shrink-0">Price Max:</span>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono flex-shrink-0 w-12 text-right">
              ${maxPrice}
            </span>
          </div>

        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600'
            }`}
          >
            All Creations
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dishes Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map((dish) => {
            const hasCustomization = dish.variants.length > 0 || dish.addons.length > 0;

            return (
              <div
                key={dish.id}
                id={`dish-card-${dish.id}`}
                className={`group bg-white dark:bg-slate-900/50 rounded-2xl border ${
                  dish.isAvailable 
                    ? 'border-slate-200 dark:border-slate-800' 
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                } overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Image Box */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  onClick={() => {
                    setSelectedDishSlug(dish.slug);
                    if (dish.supportsCinematicExperience && dish.cinematicConfig?.forceCinematicPage) {
                      setView('cinematic');
                    } else {
                      setView('dish');
                    }
                  }}
                >
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {dish.isVeg ? (
                      <span className="px-2 py-1 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded-lg tracking-wider">
                        Veg
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-lg tracking-wider">
                        Non-Veg
                      </span>
                    )}
                    {dish.isAvailable ? (
                      <span className="px-2 py-1 bg-orange-500 text-white text-[9px] font-extrabold uppercase rounded-lg tracking-wider shadow-sm shadow-orange-500/25">
                        Ready in {dish.preparationTimeMinutes}m
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-600 text-white text-[9px] font-extrabold uppercase rounded-lg tracking-wider">
                        Unavailable
                      </span>
                    )}
                  </div>
                  
                  {/* Future Cinematic Indicator */}
                  {dish.supportsCinematicExperience && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-[9px] text-orange-400 font-mono rounded-md border border-orange-500/30">
                      ✧ Dynamic 3D Ready
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        {categories.find(c => c.id === dish.categoryId)?.name || 'Chef Specialty'}
                      </span>
                      {getSpiceChilis(dish.spiceLevel)}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                      {dish.name}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                    
                    {/* Tags */}
                    {dish.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {dish.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                          ${dish.price.toFixed(2)}
                        </span>
                        {dish.compareAtPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${dish.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {hasCustomization && (
                        <span className="text-[10px] text-orange-500 font-medium">Customizable options</span>
                      )}
                    </div>

                    {dish.isAvailable ? (
                      <div className="flex gap-2">
                        {/* If it has custom addons, guide to detail, else quick add */}
                        <button
                          onClick={() => {
                            setSelectedDishSlug(dish.slug);
                            if (dish.supportsCinematicExperience && dish.cinematicConfig?.forceCinematicPage) {
                              setView('cinematic');
                            } else {
                              setView('dish');
                            }
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
                          title="View dish specifications"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => handleAddToCartDirect(dish)}
                          className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-md shadow-orange-500/15"
                        >
                          Add +
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-xs font-bold rounded-xl cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No culinary creations found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, price limit, or select a different kitchen category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterVegOnly(false);
              setMaxPrice(30);
            }}
            className="mt-4 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
