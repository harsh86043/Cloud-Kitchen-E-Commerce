/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CinematicFrameFormat = 'webp' | 'avif' | 'jpg' | 'png';

export interface CinematicFrameVariant {
  basePath: string;
  width: number;
  height: number;
  frameCount: number;
  format: CinematicFrameFormat;
}

export interface CinematicFrameSet {
  id: string;
  dishId: string;
  frameCount: number;
  format: CinematicFrameFormat;
  basePath: string;
  filePrefix: string;
  padLength: number;
  desktop?: CinematicFrameVariant;
  tablet?: CinematicFrameVariant;
  mobile?: CinematicFrameVariant;
  posterUrl: string;
  width?: number;
  height?: number;
}

export interface CinematicSection {
  id: string;
  title: string;
  description: string;
  startProgress: number; // 0 to 1
  endProgress: number;   // 0 to 1
  placement: 'left' | 'right' | 'center' | 'bottom';
  badge?: string;
}

export interface CinematicDishConfig {
  frameSetId: string;
  enabled: boolean;
  sections: CinematicSection[];
  fallbackPosterUrl: string;
  minDesktopWidth?: number;
  disableOnLowEndDevice?: boolean;
}
