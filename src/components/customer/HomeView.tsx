/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Utensils, Clock, Flame, ShieldAlert, ArrowRight, Star } from 'lucide-react';
import { useAppStore } from '../../store';
import { getDishes, getCategories } from '../../data';
import { useEffect, useState } from 'react';
import { Dish, Category } from '../../types';

export default function HomeView() {
  const { setView, setSelectedDishSlug } = useAppStore();
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load top available dishes to display as featured
    const allDishes = getDishes().filter(d => d.isAvailable);
    setFeaturedDishes(allDishes.slice(0, 3));
    
    // Load active categories
    const allCats = getCategories().filter(c => c.isActive);
    setCategories(allCats.slice(0, 4));
  }, []);

  return (
    <div id="home-view" className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-45 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-950/80 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center sm:text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>100% Chef-Crafted Cloud Kitchen</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
            Gastronomy, <br />
            <span className="text-orange-500">Delivered in 15 Mins.</span>
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            We operate state-of-the-art culinary labs to bring gourmet-tier burgers, charred sourdough pizzas, and spicy Szechuan fire bowls straight to your doorstep. No seating, just pure flavor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-2">
            <button
              onClick={() => setView('menu')}
              className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <span>Explore Gourmet Menu</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 transition-all text-center"
            >
              Learn Our Kitchen Secret
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Browse Popular Categories
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Carefully curated culinary lab categories optimized for transport temperature preservation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            // Pick a matching category background icon or cover
            const colors = [
              'from-orange-500/10 to-orange-500/5 hover:border-orange-500/40 text-orange-600 dark:text-orange-400',
              'from-rose-500/10 to-rose-500/5 hover:border-rose-500/40 text-rose-600 dark:text-rose-400',
              'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
              'from-blue-500/10 to-blue-500/5 hover:border-blue-500/40 text-blue-600 dark:text-blue-400',
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <button
                key={cat.id}
                onClick={() => setView('menu')}
                className={`group p-6 rounded-2xl bg-gradient-to-b ${colorClass} border border-slate-200 dark:border-slate-800 text-left transition-all hover:scale-[1.02] cursor-pointer`}
              >
                <span className="text-2xl font-bold block mb-1 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Chef Specials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Lab Creations
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Top-rated molecular-precision recipes prepared fresh upon request.
            </p>
          </div>
          <button
            onClick={() => setView('menu')}
            className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <span>See Entire Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <div
              key={dish.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {dish.isVeg ? (
                    <span className="px-2 py-1 bg-emerald-500/90 text-white text-[10px] font-black uppercase rounded-lg tracking-wider">
                      Veg
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-rose-500/90 text-white text-[10px] font-black uppercase rounded-lg tracking-wider">
                      Non-Veg
                    </span>
                  )}
                </div>
                {dish.compareAtPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    PROMO PRICE
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 flex items-center text-xs font-bold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-orange-500" />
                      4.9
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• {dish.preparationTimeMinutes} Mins Prep</span>
                  </div>
                  
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                    {dish.name}
                  </h4>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ${dish.price.toFixed(2)}
                    </span>
                    {dish.compareAtPrice && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ${dish.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDishSlug(dish.slug);
                      setView('dish');
                    }}
                    className="px-4 py-2 bg-slate-950 hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Select & Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud Kitchen Secret Model Section */}
      <section id="how-it-works" className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              The Cloud Kitchen Advantage
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We eliminated dine-in seating friction to invest 100% in premium culinary ingredients and superfast thermal box logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mx-auto md:mx-0">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                1. Chef-Only Kitchen Labs
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We operate hygienic, specialized culinary hubs. No waiters, no tables, just highly skilled chefs preparing your food with clinical attention to recipe weights and temperatures.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mx-auto md:mx-0">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                2. Instant Thermal Sealing
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                As soon as the dish leaves the grill, it is loaded into a bespoke, self-heating thermal box that keeps your gourmet burger crunchy and stone pizzas bubble-hot on travel.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mx-auto md:mx-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                3. Zero Contact Delivery
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our optimized local dispatch team delivers within strict geographic boundaries. This guarantees your food arrives on time, fully crisp, and perfectly intact.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
