"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { CinematicFrameSet } from '../types/cinematic.types';

export interface CanvasSequencePlayerProps {
  frameSet: CinematicFrameSet;
  progress: number; // 0 to 1
  loadedFrames: HTMLImageElement[];
  posterImage: HTMLImageElement | null;
  hasErrors: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain';
  zoom?: number;
  onReady?: () => void;
}

export default function CanvasSequencePlayer({
  frameSet,
  progress,
  loadedFrames,
  posterImage,
  hasErrors,
  className = '',
  objectFit = 'cover',
  zoom = 1,
  onReady
}: CanvasSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Determine what image to draw
    let imageToDraw: HTMLImageElement | null = null;
    let isFallback = false;

    if (!hasErrors && loadedFrames.length > 0) {
      // Find the correct frame index
      const totalFrames = frameSet.frameCount;
      const targetIndex = Math.min(
        Math.floor(progress * (totalFrames - 1)),
        totalFrames - 1
      );

      // Attempt to get the target image
      imageToDraw = loadedFrames[targetIndex];

      // If that frame isn't loaded yet, find the nearest loaded frame
      if (!imageToDraw) {
        let leftIdx = targetIndex;
        let rightIdx = targetIndex;
        while (leftIdx >= 0 || rightIdx < totalFrames) {
          if (leftIdx >= 0 && loadedFrames[leftIdx]) {
            imageToDraw = loadedFrames[leftIdx];
            break;
          }
          if (rightIdx < totalFrames && loadedFrames[rightIdx]) {
            imageToDraw = loadedFrames[rightIdx];
            break;
          }
          leftIdx--;
          rightIdx++;
        }
      }
    }

    // Fall back to poster image if frame sequence failed or is still loading
    if (!imageToDraw && posterImage) {
      imageToDraw = posterImage;
      isFallback = true;
    }

    if (imageToDraw) {
      ctx.clearRect(0, 0, width, height);

      const iw = imageToDraw.width;
      const ih = imageToDraw.height;

      if (objectFit === 'cover') {
        const scale = Math.max(width / iw, height / ih);
        
        // Calculate crop parameters
        const nw = iw * scale;
        const nh = ih * scale;
        
        let cx = (nw - width) / 2 / scale;
        let cy = (nh - height) / 2 / scale;
        let cw = iw - (nw - width) / scale;
        let ch = ih - (nh - height) / scale;

        // Apply a subtle dynamic zoom & translation parallax if drawing the poster fallback
        if (isFallback) {
          const zoom = 1 + progress * 0.08;
          cw /= zoom;
          ch /= zoom;
          cx += (iw - cw) / 2 + (progress - 0.5) * 40;
          cy += (ih - ch) / 2 + (progress - 0.5) * 20;
        }

        ctx.drawImage(
          imageToDraw,
          Math.max(0, cx),
          Math.max(0, cy),
          Math.min(iw, cw),
          Math.min(ih, ch),
          0,
          0,
          width,
          height
        );
      } else {
        // contain
        let scale = Math.min(width / iw, height / ih);
        
        // Apply responsive zoom
        scale = scale * zoom;
        
        const nw = iw * scale;
        const nh = ih * scale;
        const dx = (width - nw) / 2;
        const dy = (height - nh) / 2;

        ctx.drawImage(imageToDraw, 0, 0, iw, ih, dx, dy, nw, nh);
      }

      if (onReady) {
        onReady();
      }
    } else {
      // Just clear and render a dark elegant solid background
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    }
  }, [progress, loadedFrames, posterImage, hasErrors, objectFit, frameSet]);

  return (
    <canvas
      ref={canvasRef}
      id="cinematic-canvas"
      className={`w-full h-full block bg-slate-950 transition-opacity duration-500 ${className}`}
    />
  );
}
