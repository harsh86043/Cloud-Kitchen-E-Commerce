/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CinematicFrameSet, CinematicDishConfig, CinematicSection } from '../types/cinematic.types';

// Mock frame sets for testing and demonstration
export const DEMO_FRAME_SETS: Record<string, CinematicFrameSet> = {
  'smoked-truffle-beef-burger': {
    id: "burger-explode-desktop",
    dishId: "burger",
    frameCount: 81,
    format: "webp",
    basePath: "/cinematic/dishes/burger/desktop",
    filePrefix: "frame_",
    padLength: 4,
    posterUrl: "/cinematic/dishes/burger/poster.webp",
    width: 1920,
    height: 1080,
  },
  'truffle-beef-burger': {
    id: "burger-explode-desktop",
    dishId: "burger",
    frameCount: 81,
    format: "webp",
    basePath: "/cinematic/dishes/burger/desktop",
    filePrefix: "frame_",
    padLength: 4,
    posterUrl: "/cinematic/dishes/burger/poster.webp",
    width: 1920,
    height: 1080,
  },
  'burger': {
    id: "burger-explode-desktop",
    dishId: "burger",
    frameCount: 81,
    format: "webp",
    basePath: "/cinematic/dishes/burger/desktop",
    filePrefix: "frame_",
    padLength: 4,
    posterUrl: "/cinematic/dishes/burger/poster.webp",
    width: 1920,
    height: 1080,
  },
  'margherita-extra': {
    id: 'pizza-toppings-fall-desktop',
    dishId: 'pizza',
    frameCount: 72,
    format: 'webp',
    basePath: '/cinematic/dishes/pizza',
    filePrefix: 'frame_',
    padLength: 4,
    posterUrl: '/cinematic/dishes/pizza/poster.webp',
  },
  'szechuan-chili-noodles': {
    id: 'fs-noodles',
    dishId: 'dish-3',
    frameCount: 30,
    format: 'webp',
    basePath: '/cinematic/dishes/szechuan-chili-noodles/desktop',
    filePrefix: 'frame_',
    padLength: 4,
    posterUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&auto=format&fit=crop&q=80',
  }
};

const DEFAULT_SECTIONS_BURGER: CinematicSection[] = [
  {
    id: 'hero',
    title: 'Smoked Truffle Beef Burger',
    description: '150g grass-fed beef, melted swiss cheese, wild mushrooms, and white truffle aioli.',
    startProgress: 0,
    endProgress: 0.18,
    placement: 'left',
    badge: 'Signature Burger'
  },
  {
    id: 'bun',
    title: 'Toasted Brioche',
    description: 'Glossy sesame brioche with a soft center, golden crust, and premium sesame finish.',
    startProgress: 0.18,
    endProgress: 0.35,
    placement: 'right',
    badge: 'The Bun'
  },
  {
    id: 'patty',
    title: 'Double Smashed Patty',
    description: 'Charred edges, juicy center, and melted cheese layered between rich smashed patties.',
    startProgress: 0.35,
    endProgress: 0.55,
    placement: 'left',
    badge: 'The Core'
  },
  {
    id: 'fresh',
    title: 'Fresh Crunch',
    description: 'Lettuce, tomato, onion, and pickles add freshness, crunch, and balance.',
    startProgress: 0.55,
    endProgress: 0.72,
    placement: 'right',
    badge: 'The Toppings'
  },
  {
    id: 'nutrition',
    title: '740 Calories',
    description: 'A filling gourmet burger with 38g protein, 52g carbs, and 42g fat.',
    startProgress: 0.72,
    endProgress: 0.88,
    placement: 'left',
    badge: 'Nutrition'
  },
  {
    id: 'order',
    title: 'Ready to Order?',
    description: 'Add the burger to your cart and complete checkout in seconds.',
    startProgress: 0.88,
    endProgress: 1,
    placement: 'right',
    badge: 'Order Now'
  }
];

const DEFAULT_SECTIONS_PIZZA: CinematicSection[] = [
  {
    id: "hero",
    placement: "left",
    badge: "Stone-Oven Pizza",
    title: "Margherita Extra Pizza",
    description: "A premium pizza base layered with tomato sauce, melted mozzarella, and fresh toppings.",
    startProgress: 0,
    endProgress: 0.18
  },
  {
    id: "cheese",
    placement: "right",
    badge: "The Base",
    title: "Melted Mozzarella",
    description: "A rich cheese layer gives every slice a soft, glossy, satisfying pull.",
    startProgress: 0.18,
    endProgress: 0.35
  },
  {
    id: "vegetables",
    placement: "left",
    badge: "Fresh Toppings",
    title: "Colorful Vegetables",
    description: "Bell peppers, onions, olives, jalapeños, and tomato pieces add freshness and depth.",
    startProgress: 0.35,
    endProgress: 0.55
  },
  {
    id: "seasoning",
    placement: "right",
    badge: "Final Finish",
    title: "Oregano & Chilli Flakes",
    description: "A final rain of herbs and chilli flakes brings aroma, heat, and restaurant-style flavor.",
    startProgress: 0.55,
    endProgress: 0.75
  },
  {
    id: "nutrition",
    placement: "left",
    badge: "Nutrition",
    title: "Freshly Baked",
    description: "A balanced gourmet pizza with crisp crust, creamy cheese, and vibrant toppings.",
    startProgress: 0.75,
    endProgress: 0.9
  },
  {
    id: "order",
    placement: "right",
    badge: "Order Now",
    title: "Ready to Serve",
    description: "Add this pizza to your cart and customize size, cheese, and toppings before checkout.",
    startProgress: 0.9,
    endProgress: 1
  }
];

const DEFAULT_SECTIONS_NOODLES: CinematicSection[] = [
  {
    id: 'n-oil',
    title: 'Aromatic House Chili Oil',
    description: 'A deep, complex chili oil brewed with Szechuan peppercorns, star anise, cardamom, cinnamon, and toasted sesame.',
    startProgress: 0.05,
    endProgress: 0.35,
    placement: 'right',
    badge: 'Szechuan Spice'
  },
  {
    id: 'n-pull',
    title: 'Biang Biang Hand-Pulled Flat Ribbons',
    description: 'Pulled fresh to order. The rough, elastic surface binds perfectly to our emulsified sesame-vinegar sauce for an optimal chew.',
    startProgress: 0.4,
    endProgress: 0.7,
    placement: 'left',
    badge: 'Hand-Pulled'
  },
  {
    id: 'n-finish',
    title: 'The Volcano Peppercorn Numb',
    description: 'Topped with flash-fried garlic, roasted peanut bits, toasted sesame, and freshly crushed red pepper flakes for layers of flavor.',
    startProgress: 0.75,
    endProgress: 1.0,
    placement: 'right',
    badge: 'Volcano Heat'
  }
];

export const DEMO_CONFIGS: Record<string, CinematicDishConfig> = {
  'smoked-truffle-beef-burger': {
    frameSetId: 'burger-explode-desktop',
    enabled: true,
    sections: DEFAULT_SECTIONS_BURGER,
    fallbackPosterUrl: '/cinematic/dishes/burger/poster.webp',
    minDesktopWidth: 768,
    disableOnLowEndDevice: false,
  },
  'truffle-beef-burger': {
    frameSetId: 'burger-explode-desktop',
    enabled: true,
    sections: DEFAULT_SECTIONS_BURGER,
    fallbackPosterUrl: '/cinematic/dishes/burger/poster.webp',
    minDesktopWidth: 768,
    disableOnLowEndDevice: false,
  },
  'burger': {
    frameSetId: 'burger-explode-desktop',
    enabled: true,
    sections: DEFAULT_SECTIONS_BURGER,
    fallbackPosterUrl: '/cinematic/dishes/burger/poster.webp',
    minDesktopWidth: 768,
    disableOnLowEndDevice: false,
  },
  'margherita-extra': {
    frameSetId: 'pizza-toppings-fall-desktop',
    enabled: true,
    sections: DEFAULT_SECTIONS_PIZZA,
    fallbackPosterUrl: '/cinematic/dishes/pizza/poster.webp',
    minDesktopWidth: 768,
    disableOnLowEndDevice: false,
  },
  'szechuan-chili-noodles': {
    frameSetId: 'fs-noodles',
    enabled: true,
    sections: DEFAULT_SECTIONS_NOODLES,
    fallbackPosterUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&auto=format&fit=crop&q=80',
    minDesktopWidth: 768,
    disableOnLowEndDevice: true,
  }
};

export function getCinematicConfigForDish(slug: string): { config: CinematicDishConfig; frameSet: CinematicFrameSet } | null {
  const config = DEMO_CONFIGS[slug];
  const frameSet = DEMO_FRAME_SETS[slug];
  if (config && frameSet && config.enabled) {
    return { config, frameSet };
  }
  return null;
}
