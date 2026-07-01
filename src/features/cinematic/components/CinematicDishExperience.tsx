"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useFramePreloader } from '../hooks/useFramePreloader';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import CinematicStage from './CinematicStage';
import { Dish } from '../../../types';
import { CinematicDishConfig, CinematicFrameSet } from '../types/cinematic.types';
import { ArrowLeft, Sparkles, Check, Info } from 'lucide-react';
import { useAppStore } from '../../../store';

// Custom interface for the new layout
interface CinematicDishExperienceProps {
  dish: Dish;
  config: CinematicDishConfig;
  frameSet: CinematicFrameSet;
  onBack: () => void;
  handleAddToCart: () => void;
  grandTotal: number;
}

export default function CinematicDishExperience({
  dish,
  config,
  frameSet,
  onBack,
  handleAddToCart,
  grandTotal
}: CinematicDishExperienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { screenWidth } = useDeviceCapability();

  const {
    loadedFrames,
    isPreloadingComplete,
    preloadProgress,
    hasErrors,
    posterImage
  } = useFramePreloader(frameSet, screenWidth, dish.imageUrl);

  useEffect(() => {
    let triggerInstance: any;
    let killed = false;

    async function initScrollTrigger() {
      if (!containerRef.current || !stageRef.current) return;
      
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      if (killed) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      triggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: stageRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }

    if (isPreloadingComplete) {
      initScrollTrigger();
    }

    return () => {
      killed = true;
      if (triggerInstance) {
        triggerInstance.kill();
      }
    };
  }, [isPreloadingComplete]);

  // Determine active section
  const activeSection = config.sections.find(
    s => scrollProgress >= s.startProgress && scrollProgress <= s.endProgress
  );

  let responsiveZoom = 1.15; // desktop
  if (screenWidth < 768) {
    responsiveZoom = 1.9; // mobile
  } else if (screenWidth < 1024) {
    responsiveZoom = 1.4; // tablet
  }

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-[#050505] text-white font-sans overflow-x-hidden">
      <div ref={stageRef} className="w-full h-screen overflow-hidden relative flex flex-col justify-center items-center">
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-50 flex justify-between items-start">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customize Instead</span>
          </button>
        </div>

        {/* 3D Canvas Layer */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <CinematicStage
            frameSet={frameSet}
            progress={scrollProgress}
            loadedFrames={loadedFrames}
            posterImage={posterImage}
            isPreloadingComplete={isPreloadingComplete}
            preloadProgress={preloadProgress}
            hasErrors={hasErrors}
            zoom={responsiveZoom}
          />
        </div>

        {/* Desktop / Tablet Left & Right Text Overlay */}
        <div className="hidden md:flex absolute inset-0 z-10 w-full h-full pointer-events-none">
          <div className="max-w-[1440px] w-full mx-auto relative h-full">
            {config.sections.map((section) => {
              const isActive = scrollProgress >= section.startProgress && scrollProgress <= section.endProgress;
              
              // We'll place text at mid-screen vertically
              const isLeft = section.placement === 'left';
              return (
                <div 
                  key={section.id}
                  className={`absolute top-1/2 -translate-y-1/2 w-[260px] lg:w-[320px] transition-all duration-700 ease-out ${
                    isLeft ? 'left-8 lg:left-16' : 'right-8 lg:right-16'
                  } ${
                    isActive 
                      ? 'opacity-100 translate-x-0 blur-none' 
                      : `opacity-0 blur-sm ${isLeft ? '-translate-x-8' : 'translate-x-8'}`
                  }`}
                >
                  {section.badge && (
                    <div className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em] mb-3 font-mono">
                      {section.badge}
                    </div>
                  )}
                  <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Caption Overlay */}
        <div className="md:hidden absolute bottom-[120px] left-0 w-full z-10 pointer-events-none h-40 flex items-end justify-center">
          {config.sections.map((section) => {
            const isActive = scrollProgress >= section.startProgress && scrollProgress <= section.endProgress;
            return (
              <div 
                key={section.id}
                className={`absolute bottom-0 px-6 w-full text-center transition-all duration-500 ease-out ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                {section.badge && (
                  <div className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-2 font-mono">
                    {section.badge}
                  </div>
                )}
                <h2 className="text-2xl font-black mb-2 text-white shadow-black drop-shadow-md">
                  {section.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-[280px] mx-auto shadow-black drop-shadow-md">
                  {section.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Fixed CTA at bottom */}
        <div 
          className="fixed z-50 pointer-events-auto w-auto left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2"
          style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
        >
          <div className="w-full md:w-auto md:min-w-[360px]">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-between px-6 py-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] transition-all rounded-full shadow-[0_0_40px_rgba(234,88,12,0.3)] border border-orange-500/50"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-200">
                  Base Price
                </span>
                <span className="font-mono font-bold text-lg">
                  ${dish.price.toFixed(2)}
                </span>
              </div>
              <div className="font-bold text-base tracking-wide flex items-center gap-2">
                Add to Cart
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
