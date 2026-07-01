"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CinematicFrameSet } from '../types/cinematic.types';
import CanvasSequencePlayer from './CanvasSequencePlayer';
import { Sparkles, HelpCircle } from 'lucide-react';

interface CinematicStageProps {
  frameSet: CinematicFrameSet;
  progress: number;
  loadedFrames: HTMLImageElement[];
  posterImage: HTMLImageElement | null;
  isPreloadingComplete: boolean;
  preloadProgress: number;
  hasErrors: boolean;
  zoom?: number;
  onReady?: () => void;
}

export default function CinematicStage({
  frameSet,
  progress,
  loadedFrames,
  posterImage,
  isPreloadingComplete,
  preloadProgress,
  hasErrors,
  zoom = 1,
  onReady
}: CinematicStageProps) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center select-none">
      
      {/* 3D Render Canvas */}
      <CanvasSequencePlayer
        frameSet={frameSet}
        progress={progress}
        loadedFrames={loadedFrames}
        posterImage={posterImage}
        hasErrors={hasErrors}
        objectFit="contain"
        zoom={zoom}
        onReady={onReady}
        className="transition-transform duration-300"
      />

      {/* Ambient Radial Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(9,9,11,0.85)_95%)] pointer-events-none" />

      {/* Hot-spot / Cinematic Light Glow */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Preloading Overlay */}
      {!isPreloadingComplete && (
        <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
          <span className="font-mono text-xs font-bold text-slate-500">{preloadProgress}%</span>
        </div>
      )}

      {/* Fallback Static Badge Alert (Displayed if frames failed but Ken Burns static panning active) */}
      {isPreloadingComplete && hasErrors && (
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[9px] font-bold text-slate-300 font-mono uppercase tracking-wider">
            Static Parallax Active
          </span>
        </div>
      )}

    </div>
  );
}
