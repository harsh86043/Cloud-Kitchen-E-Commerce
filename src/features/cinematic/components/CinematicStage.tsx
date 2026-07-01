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
        objectFit="cover"
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
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full animate-ping" />
            {/* Spinning ring */}
            <div className="absolute inset-0 border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            <span className="font-mono text-[10px] font-bold text-orange-400">{preloadProgress}%</span>
          </div>
          
          <div className="mt-6 space-y-1.5">
            <h4 className="text-sm font-black text-slate-100 tracking-wide uppercase">
              Formulating Cinematic 3D Layer
            </h4>
            <p className="text-xs text-slate-400 max-w-xs leading-normal">
              Loading interactive high-density culinary vectors for real-time scroll rendering...
            </p>
          </div>
        </div>
      )}

      {/* Fallback Static Badge Alert (Displayed if frames failed but Ken Burns static panning active) */}
      {isPreloadingComplete && hasErrors && (
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[9px] font-bold text-slate-300 font-mono uppercase tracking-wider">
            Static 3D Parallax Active
          </span>
        </div>
      )}

      {/* Live Stage Frame Identifier for Tech Vibe (Aesthetic metadata) */}
      <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] text-slate-500 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>STAGE ACTIVE • FRAME_{Math.min(frameSet.frameCount, Math.max(1, Math.round(progress * (frameSet.frameCount - 1) + 1))).toString().padStart(4, '0')}</span>
      </div>

    </div>
  );
}
