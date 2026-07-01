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
    return {
      canUseCinematic: false,
      reason: 'This dish is not configured to support the cinematic interactive experience.',
      mode: 'disabled',
    };
  }

  const { config } = cinematicData;

  // 1. Check canvas support
  if (!capabilities.hasCanvas) {
    return {
      canUseCinematic: false,
      reason: 'Browser canvas render context is unsupported on this device.',
      mode: 'disabled',
    };
  }

  // 2. Check reduced motion preferences
  if (isReducedMotion) {
    return {
      canUseCinematic: false,
      reason: 'Reduced motion mode is active on this device. Fallback static layout rendered.',
      mode: 'fallback',
    };
  }

  // 3. Check screen size limits if defined
  if (config.minDesktopWidth && capabilities.screenWidth < config.minDesktopWidth) {
    return {
      canUseCinematic: false,
      reason: 'Screen width falls below cinematic criteria.',
      mode: 'fallback',
    };
  }

  // 4. Check low end device flags
  if (config.disableOnLowEndDevice && capabilities.isLowEnd) {
    return {
      canUseCinematic: false,
      reason: 'Device capability limits reached (slow connection or low memory). Fallback active.',
      mode: 'fallback',
    };
  }

  return {
    canUseCinematic: true,
    mode: 'full',
  };
}
