/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReducedMotion } from './useReducedMotion';
import { useDeviceCapability } from './useDeviceCapability';
import { Dish } from '../../../types';
import { getCinematicConfigForDish } from '../lib/cinematicConfig';

export interface EligibilityResult {
  canUseCinematic: boolean;
  reason?: string;
  mode: 'full' | 'fallback' | 'disabled';
}

export function useCinematicEligibility(dish: Dish | null | undefined): EligibilityResult {
  const isReducedMotion = useReducedMotion();
  const capabilities = useDeviceCapability();

  if (!dish) {
    return {
      canUseCinematic: false,
      reason: 'No dish provided.',
      mode: 'disabled',
    };
  }

  const cinematicData = getCinematicConfigForDish(dish.slug);

  if (!dish.supportsCinematicExperience || !cinematicData) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cinematic Debug] Eligibility:', { dish: dish.slug, reason: 'Not configured for cinematic experience', mode: 'disabled' });
    }
    return {
      canUseCinematic: false,
      reason: 'This dish is not configured to support the cinematic interactive experience.',
      mode: 'disabled',
    };
  }

  const { config } = cinematicData;
  const isForced = config.forceCinematicPage === true || dish.slug === 'burger' || dish.name.toLowerCase().includes('burger');
  
  const fail = (reason: string, mode: 'fallback' | 'disabled'): EligibilityResult => {
    if (isForced) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Cinematic Debug] Eligibility override for Burger:', { originalReason: reason, mode });
      }
      return { canUseCinematic: true, mode: 'full' };
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cinematic Debug] Eligibility:', { dish: dish.slug, reason, mode });
    }
    return { canUseCinematic: false, reason, mode };
  };

  // 1. Check canvas support - we can't bypass this because it would crash without canvas
  if (!capabilities.hasCanvas) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cinematic Debug] Eligibility:', { dish: dish.slug, reason: 'Browser canvas render context is unsupported on this device.', mode: 'disabled' });
    }
    return { canUseCinematic: false, reason: 'Browser canvas render context is unsupported on this device.', mode: 'disabled' };
  }

  // 2. Check reduced motion preferences
  if (isReducedMotion) {
    if (isForced) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Cinematic Debug] Reduced motion detected; showing static cinematic poster.');
      }
      // Still show the cinematic page, but it should know about reduced motion
      return { canUseCinematic: true, mode: 'full', reason: 'Reduced motion detected; showing static cinematic poster.' };
    }
    return fail('Reduced motion mode is active on this device. Fallback static layout rendered.', 'fallback');
  }

  // 3. Check screen size limits if defined
  if (config.minDesktopWidth && capabilities.screenWidth < config.minDesktopWidth) {
    return fail('Screen width falls below cinematic criteria.', 'fallback');
  }

  // 4. Check low end device flags
  if (config.disableOnLowEndDevice && capabilities.isLowEnd) {
    return fail('Device capability limits reached (slow connection or low memory). Fallback active.', 'fallback');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Cinematic Debug] Eligibility:', { dish: dish.slug, mode: 'full' });
  }
  return {
    canUseCinematic: true,
    mode: 'full',
  };
}
