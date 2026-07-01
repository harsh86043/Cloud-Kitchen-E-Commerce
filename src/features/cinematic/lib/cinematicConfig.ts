/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CinematicFrameSet, CinematicDishConfig, CinematicSection } from '../types/cinematic.types';

// Mock frame sets for testing and demonstration
export const DEMO_FRAME_SETS: Record<string, CinematicFrameSet> = {
  'truffle-beef-burger': {
    id: 'fs-burger',
    dishId: 'dish-1',
    frameCount: 30, // 30 frames for a lightweight demo sequence
    format: 'webp',
    basePath: '/cinematic/dishes/truffle-beef-burger/desktop',
    filePrefix: 'frame_',
    padLength: 4,
    desktop: {
      basePath: '/cinematic/dishes/truffle-beef-burger/desktop',
      width: 1920,
      height: 1080,
      frameCount: 30,
      format: 'webp'
    },
    mobile: {
      basePath: '/cinematic/dishes/truffle-beef-burger/mobile',
      width: 1080,
      height: 1920,
      frameCount: 30,
      format: 'webp'
    },
    posterUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
  },
  'margherita-extra': {
    id: 'fs-pizza',
    dishId: 'dish-2',
    frameCount: 30,
    format: 'webp',
    basePath: '/cinematic/dishes/margherita-extra/desktop',
    filePrefix: 'frame_',
    padLength: 4,
    posterUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1200&auto=format&fit=crop&q=80',
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
    id: 'intro',
    title: 'Hickory-Wood Char-Grill',
    description: 'We grill our 150g grass-fed beef patty over raw embers to secure a deep, smoky crust while maintaining rich tenderness inside.',
    startProgress: 0.05,
    endProgress: 0.25,
    placement: 'left',
    badge: '100% Grass-Fed'
  },
  {
    id: 'cheese',
    title: 'Wild Sautéed Mushrooms & Swiss',
    description: 'A gourmet melt of thick, aged Swiss cheese over freshly shaved wild mushrooms sautéed in clarified organic butter.',
    startProgress: 0.3,
    endProgress: 0.5,
    placement: 'right',
    badge: 'Double Melt'
  },
  {
    id: 'sauce',
    title: 'Decadent White Truffle Aioli',
    description: 'Organic egg yolks emulsified with cold-pressed garlic oil, fine sea salt, and highly fragrant white truffle paste.',
    startProgress: 0.55,
    endProgress: 0.75,
    placement: 'left',
    badge: 'White Truffle'
  },
  {
    id: 'finish',
    title: 'Toasted Brioche Bun',
    description: 'Sealed on the flat top with pure sweet cream butter, keeping the crumb soft and elastic to capture every drop of truffle glaze.',
    startProgress: 0.8,
    endProgress: 1.0,
    placement: 'right',
    badge: 'Artisanal Brioche'
  }
];

const DEFAULT_SECTIONS_PIZZA: CinematicSection[] = [
  {
    id: 'p-dough',
    title: '48-Hour Stone-Baked Crust',
    description: 'Our proprietary slow-fermented dough is hand-stretched and baked at 450°C in our custom stone oven for beautiful leopard-spot charring.',
    startProgress: 0.05,
    endProgress: 0.3,
    placement: 'left',
    badge: 'Sourdough'
  },
  {
    id: 'p-cheese',
    title: 'Milky Buffalo Mozzarella',
    description: 'Hand-torn fresh Italian buffalo mozzarella melts into creamy, luxurious pockets on the tart San Marzano base.',
    startProgress: 0.35,
    endProgress: 0.65,
    placement: 'right',
    badge: 'Fresh Buffalo'
  },
  {
    id: 'p-oil',
    title: 'Cold-Pressed Basil Infusion',
    description: 'Drizzled right out of the oven with premium early-harvest Sicilian olive oil and scattered with fresh-plucked organic sweet basil.',
    startProgress: 0.7,
    endProgress: 1.0,
    placement: 'left',
    badge: 'Cold-Pressed'
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
  'truffle-beef-burger': {
    frameSetId: 'fs-burger',
    enabled: true,
    sections: DEFAULT_SECTIONS_BURGER,
    fallbackPosterUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
    minDesktopWidth: 768,
    disableOnLowEndDevice: true,
  },
  'margherita-extra': {
    frameSetId: 'fs-pizza',
    enabled: true,
    sections: DEFAULT_SECTIONS_PIZZA,
    fallbackPosterUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1200&auto=format&fit=crop&q=80',
    minDesktopWidth: 768,
    disableOnLowEndDevice: true,
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
