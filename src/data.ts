/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Dish, Order, KitchenSettings, AdminDashboardStats } from './types';

// Key names for localStorage
const STORAGE_KEYS = {
  CATEGORIES: 'cloud_kitchen_categories',
  DISHES: 'cloud_kitchen_dishes',
  ORDERS: 'cloud_kitchen_orders',
  SETTINGS: 'cloud_kitchen_settings',
};

// Initial static fallback data
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'burgers',
    name: 'Gourmet Burgers',
    description: 'Artisanal burgers made with premium ingredients and hand-cut fries.',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'cat-2',
    slug: 'pizzas',
    name: 'Stone-Oven Pizzas',
    description: 'Neapolitan-style pizzas baked at 450°C with fresh mozzarella.',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'cat-3',
    slug: 'asian-bowls',
    name: 'Asian Fusion Bowls',
    description: 'Spicy noodles, healthy rice bowls, and aromatic broths.',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'cat-4',
    slug: 'fresh-salads',
    name: 'Organic Salads',
    description: 'Crisp, seasonal farm-to-table greens with house-made vinaigrettes.',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'cat-5',
    slug: 'desserts',
    name: 'Signature Desserts',
    description: 'Delectable sweet treats designed by our pastry chef.',
    isActive: true,
    displayOrder: 5,
  }
];

const INITIAL_DISHES: Dish[] = [
  {
    id: 'dish-1',
    slug: 'truffle-beef-burger',
    name: 'Smoked Truffle Beef Burger',
    description: '150g grass-fed beef patty, melted swiss cheese, sautéed wild mushrooms, white truffle aioli, toasted brioche bun. Served with a side of sea salt fries.',
    categoryId: 'cat-1',
    price: 16.99,
    compareAtPrice: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: false,
    spiceLevel: 0,
    preparationTimeMinutes: 15,
    tags: ['Best Seller', 'Gourmet'],
    variants: [
      { id: 'v-1', name: 'Single Patty', price: 16.99 },
      { id: 'v-2', name: 'Double Patty (+ $4.00)', price: 20.99 }
    ],
    addons: [
      { id: 'a-1', name: 'Extra Swiss Cheese', price: 1.50 },
      { id: 'a-2', name: 'Crisp Beef Bacon', price: 2.50 },
      { id: 'a-3', name: 'Avocado Slices', price: 2.00 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: true,
    animationPosterUrl: '/cinematic/dishes/burger/poster.webp',
    animationFrameSetId: 'burger-explode-desktop',
    animationFrameCount: 81,
    animationFrameFormat: 'webp',
    animationDesktopBasePath: '/cinematic/dishes/burger/desktop',
    animationMobileBasePath: '/cinematic/dishes/burger/desktop',
  },
  {
    id: 'dish-2',
    slug: 'margherita-extra',
    name: 'Margherita Extra Pizza',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil leaves, premium cold-pressed extra virgin olive oil on a charred sourdough crust.',
    categoryId: 'cat-2',
    price: 14.50,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: true,
    spiceLevel: 0,
    preparationTimeMinutes: 12,
    tags: ['Classic', 'Vegetarian'],
    variants: [
      { id: 'v-3', name: 'Personal 10"', price: 14.50 },
      { id: 'v-4', name: 'Sharing 14" (+ $5.00)', price: 19.50 }
    ],
    addons: [
      { id: 'a-4', name: 'Arugula', price: 1.50 },
      { id: 'a-5', name: 'Truffle Oil Drizzle', price: 2.00 },
      { id: 'a-6', name: 'Extra Mozzarella', price: 2.50 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: true,
  },
  {
    id: 'dish-3',
    slug: 'szechuan-chili-noodles',
    name: 'Szechuan Fire Chili Noodles',
    description: 'Hand-pulled flat noodles tossed in a premium roasted house chili oil, dark soy sauce, black vinegar, sesame paste, baby bok choy, toasted peanuts, and green onions.',
    categoryId: 'cat-3',
    price: 13.99,
    compareAtPrice: 15.50,
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: true,
    spiceLevel: 3,
    preparationTimeMinutes: 10,
    tags: ['Spicy', 'Vegan Option'],
    variants: [
      { id: 'v-5', name: 'Regular Portion', price: 13.99 },
      { id: 'v-6', name: 'Large Portion (+ $3.00)', price: 16.99 }
    ],
    addons: [
      { id: 'a-7', name: 'Soft-Boiled Ramen Egg', price: 1.50 },
      { id: 'a-8', name: 'Pan-Seared Tofu Blocks', price: 2.50 },
      { id: 'a-9', name: 'Braised Minced Shiitake', price: 2.00 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: true,
  },
  {
    id: 'dish-4',
    slug: 'avocado-quinoa-bowl',
    name: 'Superfood Avocado Quinoa Salad',
    description: 'Organic tri-color quinoa, sliced hass avocado, sweet cherry tomatoes, crisp cucumber, shredded kale, toasted pumpkin seeds, tangy lemon-herb emulsion.',
    categoryId: 'cat-4',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: true,
    spiceLevel: 0,
    preparationTimeMinutes: 8,
    tags: ['Healthy', 'Vegan', 'Gluten Free'],
    variants: [],
    addons: [
      { id: 'a-10', name: 'Herb Grilled Chicken', price: 3.50 },
      { id: 'a-11', name: 'Cured Smoked Salmon', price: 4.50 },
      { id: 'a-12', name: 'Creamy Goat Cheese Crumbles', price: 2.00 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: false,
  },
  {
    id: 'dish-5',
    slug: 'molten-lava-cake',
    name: 'Belgian Molten Lava Cake',
    description: 'Decadent dark Belgian chocolate cake with a rich liquid hot chocolate center. Served with a scoop of fresh Tahitian vanilla bean gelato.',
    categoryId: 'cat-5',
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: true,
    spiceLevel: 0,
    preparationTimeMinutes: 10,
    tags: ['Warm', 'Dessert Heaven'],
    variants: [],
    addons: [
      { id: 'a-13', name: 'Extra Vanilla Gelato Scoop', price: 2.00 },
      { id: 'a-14', name: 'Warm Salted Caramel Drizzle', price: 1.00 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: false,
  },
  {
    id: 'dish-6',
    slug: 'korean-fried-chicken-burger',
    name: 'Crispy Korean Gochujang Glazed Chicken Burger',
    description: 'Extra-crispy buttermilk fried chicken breast drenched in sweet and spicy gochujang glaze, topped with creamy sesame slaw and quick-pickled cucumbers on brioche.',
    categoryId: 'cat-1',
    price: 15.25,
    imageUrl: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3cb3?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    isVeg: false,
    spiceLevel: 2,
    preparationTimeMinutes: 14,
    tags: ['New', 'Trending'],
    variants: [],
    addons: [
      { id: 'a-15', name: 'Double Sesame Slaw', price: 1.00 },
      { id: 'a-16', name: 'Melty Cheddar Slice', price: 1.25 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    supportsCinematicExperience: false,
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-84319',
    customerDetails: {
      fullName: 'Suryavanshi Harsh',
      email: 'suryavanshiharsh860@gmail.com',
      phone: '+1 415 555 2671',
      streetAddress: '100 Pine Street',
      apartment: 'Suite 2400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      deliveryNotes: 'Leave with front desk concierge, thank you!'
    },
    items: [
      {
        dishId: 'dish-1',
        name: 'Smoked Truffle Beef Burger',
        price: 16.99,
        quantity: 2,
        variantName: 'Single Patty',
        addonNames: ['Extra Swiss Cheese', 'Crisp Beef Bacon'],
        isVeg: false
      },
      {
        dishId: 'dish-5',
        name: 'Belgian Molten Lava Cake',
        price: 8.50,
        quantity: 1,
        addonNames: ['Extra Vanilla Gelato Scoop'],
        isVeg: true
      }
    ],
    subtotal: 46.48,
    tax: 2.32,
    deliveryFee: 3.99,
    total: 52.79,
    status: 'preparing',
    paymentMethod: 'card_placeholder',
    paymentStatus: 'paid',
    estimatedPrepTimeMinutes: 20,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
  },
  {
    id: 'ORD-75210',
    customerDetails: {
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      phone: '+1 650 555 0192',
      streetAddress: '450 University Ave',
      city: 'Palo Alto',
      state: 'CA',
      postalCode: '94301',
    },
    items: [
      {
        dishId: 'dish-3',
        name: 'Szechuan Fire Chili Noodles',
        price: 13.99,
        quantity: 1,
        variantName: 'Regular Portion',
        addonNames: ['Soft-Boiled Ramen Egg'],
        isVeg: true
      }
    ],
    subtotal: 15.49,
    tax: 0.77,
    deliveryFee: 3.99,
    total: 20.25,
    status: 'completed',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    estimatedPrepTimeMinutes: 10,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
  }
];

const INITIAL_SETTINGS: KitchenSettings = {
  kitchenName: 'Gourmet Atelier Cloud Kitchen',
  openingTime: '11:00',
  closingTime: '23:00',
  isAcceptingOrders: true,
  deliveryFee: 3.99,
  taxRate: 0.05, // 5%
};

// Database Initializers / Fetchers (Local Storage Wrapper)
function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage`, error);
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key ${key} to localStorage`, error);
  }
}

// Public API Service Mock functions
export const getCategories = (): Category[] => {
  const data = getLocalStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  if (data.length === 0) {
    setLocalStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }
  return data;
};

export const saveCategory = (category: Category): Category[] => {
  const current = getCategories();
  const index = current.findIndex(c => c.id === category.id);
  if (index > -1) {
    current[index] = category;
  } else {
    current.push(category);
  }
  setLocalStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, current);
  return current;
};

export const deleteCategory = (id: string): Category[] => {
  const current = getCategories();
  const updated = current.filter(c => c.id !== id);
  setLocalStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, updated);
  return updated;
};

export const getDishes = (): Dish[] => {
  const data = getLocalStorageItem<Dish[]>(STORAGE_KEYS.DISHES, []);
  if (data.length === 0) {
    setLocalStorageItem<Dish[]>(STORAGE_KEYS.DISHES, INITIAL_DISHES);
    return INITIAL_DISHES;
  }
  
  // Self-heal/update the burger dish configuration in localStorage if it is legacy or missing fields
  const burgerIndex = data.findIndex(d => d.slug === 'truffle-beef-burger');
  if (burgerIndex > -1) {
    const burger = data[burgerIndex];
    if (!burger.animationFrameSetId || burger.animationFrameCount !== 81) {
      burger.supportsCinematicExperience = true;
      burger.animationPosterUrl = '/cinematic/dishes/burger/poster.webp';
      burger.animationFrameSetId = 'burger-explode-desktop';
      burger.animationFrameCount = 81;
      burger.animationFrameFormat = 'webp';
      burger.animationDesktopBasePath = '/cinematic/dishes/burger/desktop';
      burger.animationMobileBasePath = '/cinematic/dishes/burger/desktop';
      setLocalStorageItem<Dish[]>(STORAGE_KEYS.DISHES, data);
    }
  }
  
  return data;
};

export const saveDish = (dish: Dish): Dish[] => {
  const current = getDishes();
  const index = current.findIndex(d => d.id === dish.id);
  dish.updatedAt = new Date().toISOString();
  if (index > -1) {
    current[index] = dish;
  } else {
    dish.createdAt = new Date().toISOString();
    current.push(dish);
  }
  setLocalStorageItem<Dish[]>(STORAGE_KEYS.DISHES, current);
  return current;
};

export const deleteDish = (id: string): Dish[] => {
  const current = getDishes();
  const updated = current.filter(d => d.id !== id);
  setLocalStorageItem<Dish[]>(STORAGE_KEYS.DISHES, updated);
  return updated;
};

export const getOrders = (): Order[] => {
  const data = getLocalStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  if (data.length === 0) {
    setLocalStorageItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return INITIAL_ORDERS;
  }
  return data;
};

export const saveOrder = (order: Order): Order[] => {
  const current = getOrders();
  const index = current.findIndex(o => o.id === order.id);
  if (index > -1) {
    current[index] = order;
  } else {
    current.unshift(order); // New orders at the top
  }
  setLocalStorageItem<Order[]>(STORAGE_KEYS.ORDERS, current);
  return current;
};

export const updateOrderStatus = (id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Order[] => {
  const current = getOrders();
  const order = current.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else if (status === 'completed') {
      order.paymentStatus = 'paid';
    }
    setLocalStorageItem<Order[]>(STORAGE_KEYS.ORDERS, current);
  }
  return current;
};

export const getKitchenSettings = (): KitchenSettings => {
  const data = getLocalStorageItem<KitchenSettings | null>(STORAGE_KEYS.SETTINGS, null);
  if (!data) {
    setLocalStorageItem<KitchenSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  }
  return data;
};

export const saveKitchenSettings = (settings: KitchenSettings): KitchenSettings => {
  setLocalStorageItem<KitchenSettings>(STORAGE_KEYS.SETTINGS, settings);
  return settings;
};

// Generates real-time dynamic statistics for Admin Dashboard
export const getAdminDashboardStats = (): AdminDashboardStats => {
  const orders = getOrders();
  const today = new Date().toDateString();
  
  // Filter today's orders
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  
  const stats: AdminDashboardStats = {
    todayOrdersCount: todayOrders.length,
    pendingCount: orders.filter(o => o.status === 'pending').length,
    preparingCount: orders.filter(o => o.status === 'accepted' || o.status === 'preparing').length,
    completedCount: orders.filter(o => o.status === 'completed').length,
    cancelledCount: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
    topDishes: [],
  };
  
  // Calculate top selling dishes dynamically
  const dishCounts: Record<string, { count: number; revenue: number; isVeg: boolean }> = {};
  
  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(o => {
      o.items.forEach(item => {
        if (!dishCounts[item.name]) {
          dishCounts[item.name] = { count: 0, revenue: 0, isVeg: item.isVeg };
        }
        dishCounts[item.name].count += item.quantity;
        dishCounts[item.name].revenue += item.price * item.quantity;
      });
    });
    
  stats.topDishes = Object.entries(dishCounts)
    .map(([name, d]) => ({
      name,
      count: d.count,
      revenue: Math.round(d.revenue * 100) / 100,
      isVeg: d.isVeg,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5
    
  return stats;
};
