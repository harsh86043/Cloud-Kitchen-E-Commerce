/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { CartItem, Dish, DishVariant, DishAddon, UserRole } from './types';

export type AppView = 
  | 'home'
  | 'menu'
  | 'dish'
  | 'cinematic'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'my-orders'
  | 'admin-dashboard'
  | 'admin-orders'
  | 'admin-dishes'
  | 'admin-categories'
  | 'admin-settings';

interface AppStore {
  // Navigation & Role State
  currentView: AppView;
  currentRole: UserRole;
  selectedDishSlug: string | null;
  confirmedOrderId: string | null;
  setView: (view: AppView) => void;
  setRole: (role: UserRole) => void;
  setSelectedDishSlug: (slug: string | null) => void;
  setConfirmedOrderId: (id: string | null) => void;

  // Customization State
  activeCustomizationDish: Dish | null;
  openCustomizer: (dish: Dish) => void;
  closeCustomizer: () => void;

  // Cart State
  cartItems: CartItem[];
  addToCart: (dish: Dish, variant?: DishVariant, selectedAddons?: DishAddon[], quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;
}

// Helper to generate unique cart item ID
const generateCartItemId = (dishId: string, variant?: DishVariant, addons: DishAddon[] = []): string => {
  const vId = variant ? variant.id : 'none';
  const aIds = addons.map(a => a.id).sort().join('-');
  return `${dishId}-${vId}-${aIds}`;
};

// Helper to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem('cloud_kitchen_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Helper to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('cloud_kitchen_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Navigation & Role State Initial Values
  currentView: 'home',
  currentRole: 'customer',
  selectedDishSlug: null,
  confirmedOrderId: null,
  
  setView: (view) => set({ currentView: view }),
  setRole: (role) => {
    // Automatically transition to default view of the selected role
    const defaultView: AppView = role === 'admin' ? 'admin-dashboard' : 'home';
    set({ currentRole: role, currentView: defaultView });
  },
  setSelectedDishSlug: (slug) => set({ selectedDishSlug: slug }),
  setConfirmedOrderId: (id) => set({ confirmedOrderId: id }),

  // Customization State Initial Values
  activeCustomizationDish: null,
  openCustomizer: (dish) => set({ activeCustomizationDish: dish }),
  closeCustomizer: () => set({ activeCustomizationDish: null }),

  // Cart State Initial Values
  cartItems: loadCartFromStorage(),

  addToCart: (dish, variant, selectedAddons = [], quantity = 1) => {
    const itemId = generateCartItemId(dish.id, variant, selectedAddons);
    const existingItems = get().cartItems;
    const existingIndex = existingItems.findIndex(item => item.id === itemId);

    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = [...existingItems];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [
        ...existingItems,
        {
          id: itemId,
          dish,
          variant,
          selectedAddons,
          quantity,
        }
      ];
    }

    set({ cartItems: updatedItems });
    saveCartToStorage(updatedItems);
  },

  updateQuantity: (itemId, quantity) => {
    const existingItems = get().cartItems;
    if (quantity <= 0) {
      const updatedItems = existingItems.filter(item => item.id !== itemId);
      set({ cartItems: updatedItems });
      saveCartToStorage(updatedItems);
      return;
    }

    const updatedItems = existingItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );

    set({ cartItems: updatedItems });
    saveCartToStorage(updatedItems);
  },

  removeFromCart: (itemId) => {
    const existingItems = get().cartItems;
    const updatedItems = existingItems.filter(item => item.id !== itemId);
    set({ cartItems: updatedItems });
    saveCartToStorage(updatedItems);
  },

  clearCart: () => {
    set({ cartItems: [] });
    saveCartToStorage([]);
  },

  getCartCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  },

  getCartSubtotal: () => {
    return get().cartItems.reduce((sum, item) => {
      const basePrice = item.variant ? item.variant.price : item.dish.price;
      const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
      return sum + (basePrice + addonsPrice) * item.quantity;
    }, 0);
  },
}));
