/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { getDishes, getCategories, saveDish, deleteDish } from '../../data';
import { Dish, Category, DishVariant, DishAddon } from '../../types';
import { useToast } from '../ui/Toast';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function AdminDishesView() {
  const { showToast } = useToast();
  
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('14.99');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVeg, setIsVeg] = useState(true);
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(0);
  const [prepTime, setPrepTime] = useState('15');
  const [tagsInput, setTagsInput] = useState('');
  const [supportsCinematic, setSupportsCinematic] = useState(false);
  const [animationPosterUrl, setAnimationPosterUrl] = useState('');
  const [animationFrameSetId, setAnimationFrameSetId] = useState('');
  const [animationFrameCount, setAnimationFrameCount] = useState('30');
  const [animationFrameFormat, setAnimationFrameFormat] = useState('webp');
  const [animationDesktopBasePath, setAnimationDesktopBasePath] = useState('');
  const [animationMobileBasePath, setAnimationMobileBasePath] = useState('');

  const loadData = () => {
    setDishes(getDishes());
    const cats = getCategories().filter(c => c.isActive);
    setCategories(cats);
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = (dishId: string) => {
    const list = getDishes();
    const dish = list.find(d => d.id === dishId);
    if (dish) {
      dish.isAvailable = !dish.isAvailable;
      saveDish(dish);
      showToast(`Toggled availability for ${dish.name}.`, 'success');
      loadData();
    }
  };

  const handleOpenCreate = () => {
    setEditingDishId(null);
    setName('');
    setDescription('');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setPrice('14.99');
    setCompareAtPrice('');
    // Dynamic food placeholder suggestion
    setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
    setIsAvailable(true);
    setIsVeg(true);
    setSpiceLevel(0);
    setPrepTime('15');
    setTagsInput('Gourmet, Chef Special');
    setSupportsCinematic(false);
    setAnimationPosterUrl('');
    setAnimationFrameSetId('');
    setAnimationFrameCount('30');
    setAnimationFrameFormat('webp');
    setAnimationDesktopBasePath('');
    setAnimationMobileBasePath('');
    
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDishId(dish.id);
    setName(dish.name);
    setDescription(dish.description);
    setCategoryId(dish.categoryId);
    setPrice(dish.price.toString());
    setCompareAtPrice(dish.compareAtPrice ? dish.compareAtPrice.toString() : '');
    setImageUrl(dish.imageUrl);
    setIsAvailable(dish.isAvailable);
    setIsVeg(dish.isVeg);
    setSpiceLevel(dish.spiceLevel);
    setPrepTime(dish.preparationTimeMinutes.toString());
    setTagsInput(dish.tags.join(', '));
    setSupportsCinematic(dish.supportsCinematicExperience);
    setAnimationPosterUrl(dish.animationPosterUrl || '');
    setAnimationFrameSetId(dish.animationFrameSetId || '');
    setAnimationFrameCount(dish.animationFrameCount?.toString() || '30');
    setAnimationFrameFormat(dish.animationFrameFormat || 'webp');
    setAnimationDesktopBasePath(dish.animationDesktopBasePath || '');
    setAnimationMobileBasePath(dish.animationMobileBasePath || '');
    
    setIsFormOpen(true);
  };

  const handleDelete = (dishId: string, name: string) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete ${name}? This action cannot be undone.`);
    if (confirmDelete) {
      deleteDish(dishId);
      showToast(`Dish ${name} successfully deleted.`, 'info');
      loadData();
    }
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Dish name is required.', 'error');
      return;
    }
    if (!price || isNaN(Number(price))) {
      showToast('Price must be a valid number.', 'error');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    // Build standard variants / addons
    const standardVariants: DishVariant[] = [
      { id: `v-${Date.now()}-1`, name: 'Regular Portion', price: Number(price) },
      { id: `v-${Date.now()}-2`, name: 'Large Sharing Portion (+ $4.00)', price: Number(price) + 4.00 }
    ];

    const standardAddons: DishAddon[] = [
      { id: `a-${Date.now()}-1`, name: 'Extra Chef Special Sauce', price: 1.50 },
      { id: `a-${Date.now()}-2`, name: 'Aromatic Mushroom Slices', price: 2.00 }
    ];

    const currentDishes = getDishes();
    const existing = currentDishes.find(d => d.id === editingDishId);

    const targetDish: Dish = {
      id: editingDishId || `dish-${Date.now()}`,
      slug,
      name,
      description,
      categoryId,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      imageUrl,
      isAvailable,
      isVeg,
      spiceLevel,
      preparationTimeMinutes: Number(prepTime) || 15,
      tags: finalTags,
      variants: existing?.variants && existing.variants.length > 0 ? existing.variants : standardVariants,
      addons: existing?.addons && existing.addons.length > 0 ? existing.addons : standardAddons,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supportsCinematicExperience: supportsCinematic,
      animationPosterUrl: supportsCinematic ? animationPosterUrl : undefined,
      animationFrameSetId: supportsCinematic ? animationFrameSetId : undefined,
      animationFrameCount: supportsCinematic ? Number(animationFrameCount) : undefined,
      animationFrameFormat: supportsCinematic ? animationFrameFormat : undefined,
      animationDesktopBasePath: supportsCinematic ? animationDesktopBasePath : undefined,
      animationMobileBasePath: supportsCinematic ? animationMobileBasePath : undefined,
    };

    saveDish(targetDish);
    showToast(`Dish ${name} successfully saved.`, 'success');
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div id="admin-dishes-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-left">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Menu Catalog Manager
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build formulas, edit prices, set prep times, and toggle dish availability for active storefront users.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Dish</span>
        </button>
      </div>

      {/* Main Table View */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-mono text-[10px] font-bold tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Dish details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Prep time</th>
                <th className="px-6 py-4">Attributes</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {dishes.map((dish) => {
                const cat = categories.find(c => c.id === dish.categoryId);
                return (
                  <tr key={dish.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* Dish details */}
                    <td className="px-6 py-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 flex-shrink-0">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                            {dish.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            ID: {dish.id} • /{dish.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] rounded uppercase">
                        {cat ? cat.name : 'Unknown'}
                      </span>
                    </td>

                    {/* Base Price */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-950 dark:text-white">
                      ${dish.price.toFixed(2)}
                      {dish.compareAtPrice && (
                        <span className="text-[10px] text-slate-400 line-through block font-medium">
                          ${dish.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* Prep Time */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {dish.preparationTimeMinutes} Mins
                    </td>

                    {/* Attributes */}
                    <td className="px-6 py-4 min-w-[140px]">
                      <div className="flex flex-wrap gap-1">
                        {dish.isVeg ? (
                          <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded">
                            🥬 Veg
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[9px] font-bold rounded">
                            🥩 Meat
                          </span>
                        )}
                        {dish.spiceLevel > 0 && (
                          <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold rounded">
                            🌶️ Lvl {dish.spiceLevel}
                          </span>
                        )}
                        {dish.supportsCinematicExperience && (
                          <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold rounded flex items-center gap-0.5">
                            ✧ 3D
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Availability toggle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(dish.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          dish.isAvailable
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-550 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {dish.isAvailable ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(dish)}
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit formula"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dish.id, dish.name)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT FORM MODAL DIALOG */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            
            {/* Form Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 rounded-t-3xl text-left">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingDishId ? 'Modify Dish Formula' : 'Formulate New Dish'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingDishId ? `Editing details for ID: ${editingDishId}` : 'Add a fresh recipe to your kitchen catalog'}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveDish} className="p-6 sm:p-8 space-y-5 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipe Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sizzling Jalapeno Poppers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Assignment</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Preparation Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preparation Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>

                {/* Base price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Storefront Price ($)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14.50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>

                {/* Compare At Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Strike Price (Compare At, optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 19.99"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>

                {/* Spice Level selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Spice Index</label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(Number(e.target.value) as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="0">0: Non-Spicy (Mildest)</option>
                    <option value="1">1: Light Warmth 🌶️</option>
                    <option value="2">2: Medium Tang 🌶️🌶️</option>
                    <option value="3">3: Szechuan/Volcano Fire 🌶️🌶️🌶️</option>
                  </select>
                </div>

                {/* Tags comma input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Visual Badges / Hashtags (Comma list)</label>
                  <input
                    type="text"
                    placeholder="e.g. Healthy, Gluten Free, Spicy"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Customer Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="List culinary details, ingredients, allergy reports, breading type, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Unsplash Photo URL Placeholder</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>

                {/* Attributes switches row */}
                <div className="flex flex-col gap-4 sm:col-span-2 py-2">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVeg}
                        onChange={(e) => setIsVeg(e.target.checked)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lettuce pure veg 🥬</span>
                    </label>

                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={supportsCinematic}
                        onChange={(e) => setSupportsCinematic(e.target.checked)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Supports cinematic experience ✧</span>
                    </label>
                  </div>

                  {supportsCinematic && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black text-orange-500 font-mono tracking-wider uppercase">
                          Cinematic Experience Assets & Meta
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Frame Set ID</label>
                          <input
                            type="text"
                            placeholder="e.g. fs-burger"
                            value={animationFrameSetId}
                            onChange={(e) => setAnimationFrameSetId(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Frame Count</label>
                          <input
                            type="number"
                            min="1"
                            value={animationFrameCount}
                            onChange={(e) => setAnimationFrameCount(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Frame Format</label>
                          <select
                            value={animationFrameFormat}
                            onChange={(e) => setAnimationFrameFormat(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          >
                            <option value="webp">webp</option>
                            <option value="avif">avif</option>
                            <option value="jpg">jpg</option>
                            <option value="png">png</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Animation Poster URL</label>
                          <input
                            type="url"
                            placeholder="e.g. https://images.unsplash.com/..."
                            value={animationPosterUrl}
                            onChange={(e) => setAnimationPosterUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Desktop Base Path</label>
                          <input
                            type="text"
                            placeholder="e.g. /cinematic/dishes/burger/desktop"
                            value={animationDesktopBasePath}
                            onChange={(e) => setAnimationDesktopBasePath(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mobile Base Path</label>
                          <input
                            type="text"
                            placeholder="e.g. /cinematic/dishes/burger/mobile"
                            value={animationMobileBasePath}
                            onChange={(e) => setAnimationMobileBasePath(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  {editingDishId ? 'Save Formula Updates' : 'Add to Active Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
