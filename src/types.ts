/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}

export interface DishVariant {
  id: string;
  name: string;
  price: number; // additional cost or absolute price. Let's make it absolute for simple pricing.
}

export interface DishAddon {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel: 0 | 1 | 2 | 3; // 0: None, 1: Mild, 2: Medium, 3: Hot
  preparationTimeMinutes: number;
  tags: string[];
  variants: DishVariant[];
  addons: DishAddon[];
  createdAt: string;
  updatedAt: string;
  
  // Future cinematic asset placeholders
  animationPosterUrl?: string;
  animationFrameSetId?: string;
  animationFrameCount?: number;
  animationFrameFormat?: string;
  animationDesktopBasePath?: string;
  animationMobileBasePath?: string;
  supportsCinematicExperience: boolean;
  cinematicConfig?: any;
}

export interface CartItem {
  id: string; // unique id composed of: dishId + variantId? + addonsIdsJoined
  dish: Dish;
  variant?: DishVariant;
  selectedAddons: DishAddon[];
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
  addonNames: string[];
  isVeg: boolean;
}

export interface Order {
  id: string;
  customerDetails: Address;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash_on_delivery' | 'card_placeholder';
  paymentStatus: PaymentStatus;
  estimatedPrepTimeMinutes: number;
  createdAt: string;
}

export interface AdminDashboardStats {
  todayOrdersCount: number;
  pendingCount: number;
  preparingCount: number;
  completedCount: number;
  cancelledCount: number;
  revenue: number;
  topDishes: {
    name: string;
    count: number;
    revenue: number;
    isVeg: boolean;
  }[];
}

export interface KitchenSettings {
  kitchenName: string;
  openingTime: string; // e.g., "11:00"
  closingTime: string; // e.g., "23:00"
  isAcceptingOrders: boolean;
  deliveryFee: number;
  taxRate: number; // e.g., 0.05 for 5%
}
