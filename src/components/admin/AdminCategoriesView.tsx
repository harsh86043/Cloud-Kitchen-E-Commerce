/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { getCategories, saveCategory, deleteCategory } from '../../data';
import { Category } from '../../types';
import { useToast } from '../ui/Toast';
import { Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react';

export default function AdminCategoriesView() {
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const loadData = () => {
    // Sort categories by display order
    const list = getCategories().sort((a, b) => a.displayOrder - b.displayOrder);
    setCategories(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCatId(null);
    setName('');
    setDescription('');
    setDisplayOrder((categories.length + 1).toString());
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setDisplayOrder(cat.displayOrder.toString());
    setIsActive(cat.isActive);
    setIsFormOpen(true);
  };

  const handleDelete = (catId: string, catName: string) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete the category: "${catName}"? This will affect dish assignments!`);
    if (confirmDelete) {
      deleteCategory(catId);
      showToast(`Category ${catName} successfully deleted.`, 'info');
      loadData();
    }
  };

  const handleToggleActive = (catId: string) => {
    const current = getCategories();
    const cat = current.find(c => c.id === catId);
    if (cat) {
      cat.isActive = !cat.isActive;
      saveCategory(cat);
      showToast(`Toggled status for category: ${cat.name}`, 'success');
      loadData();
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const targetCategory: Category = {
      id: editingCatId || `cat-${Date.now()}`,
      slug,
      name,
      description,
      isActive,
      displayOrder: Number(displayOrder) || 1
    };

    saveCategory(targetCategory);
    showToast(`Category ${name} successfully saved.`, 'success');
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div id="admin-categories-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-left">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Kitchen Category Hub
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Group dishes into logical culinary segments, set display ordering, and toggle storefront visibility.
          </p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories table list */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-mono text-[10px] font-bold tracking-wider uppercase border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Slug endpoint</th>
                <th className="px-6 py-4">Display order</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  
                  {/* Category Name */}
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </td>

                  {/* Slug endpoint */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-500">
                    /{cat.slug}
                  </td>

                  {/* Display order */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-800 dark:text-slate-200">
                    {cat.displayOrder}
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 min-w-[200px] text-slate-500 dark:text-slate-400">
                    <p className="line-clamp-1">{cat.description}</p>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        cat.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-550 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat.isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit category details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in p-6 sm:p-8 space-y-6">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingCatId ? 'Edit Culinary Segment' : 'Formulate Segment'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Category fields control active filters on customer menus.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-left">
              
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Segment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourdough Stone Pizzas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order index (sorting)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brief Segment Description</label>
                <textarea
                  rows={2}
                  placeholder="Tell customers about the recipes grouped under this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="py-2 flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="cat-active-check"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="cat-active-check" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Activate Category immediately on menus
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Category</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
