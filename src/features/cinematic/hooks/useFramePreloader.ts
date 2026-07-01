/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { CinematicFrameSet } from '../types/cinematic.types';
import { buildFrameUrl } from '../lib/frameUrl';

interface PreloaderResult {
  loadedFrames: HTMLImageElement[];
  isPreloadingComplete: boolean;
  preloadProgress: number;
  hasErrors: boolean;
  posterImage: HTMLImageElement | null;
}

export function useFramePreloader(
  frameSet: CinematicFrameSet,
  screenWidth: number,
  fallbackImageUrl?: string
): PreloaderResult {
  const [loadedFrames, setLoadedFrames] = useState<HTMLImageElement[]>([]);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloadingComplete, setIsPreloadingComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [posterImage, setPosterImage] = useState<HTMLImageElement | null>(null);

  const prevFrameSetId = useRef<string | null>(null);

  useEffect(() => {
    if (prevFrameSetId.current !== frameSet.id) {
      setLoadedFrames([]);
      setPreloadProgress(0);
      setIsPreloadingComplete(false);
      setHasErrors(false);
      setPosterImage(null);
      prevFrameSetId.current = frameSet.id;
    }

    let isCancelled = false;

    // Load poster image
    const posterImg = new Image();
    posterImg.referrerPolicy = 'no-referrer';
    posterImg.crossOrigin = 'anonymous';
    posterImg.src = frameSet.posterUrl;
    posterImg.onload = () => {
      if (!isCancelled) {
        setPosterImage(posterImg);
      }
    };
    posterImg.onerror = () => {
      console.warn(`[Cinematic Preloader] Failed to load poster url: ${frameSet.posterUrl}`);
      if (fallbackImageUrl) {
        const fallbackImg = new Image();
        fallbackImg.referrerPolicy = 'no-referrer';
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.src = fallbackImageUrl;
        fallbackImg.onload = () => {
          if (!isCancelled) {
            setPosterImage(fallbackImg);
          }
        };
        fallbackImg.onerror = () => {
          console.warn(`[Cinematic Preloader] Failed to load fallback image url: ${fallbackImageUrl}`);
        };
      }
    };

    let basePath = frameSet.basePath;
    let format = frameSet.format;
    let frameCount = frameSet.frameCount;

    if (screenWidth < 640 && frameSet.mobile) {
      basePath = frameSet.mobile.basePath;
      format = frameSet.mobile.format;
      frameCount = frameSet.mobile.frameCount;
    } else if (screenWidth < 1024 && frameSet.tablet) {
      basePath = frameSet.tablet.basePath;
      format = frameSet.tablet.format;
      frameCount = frameSet.tablet.frameCount;
    } else if (frameSet.desktop) {
      basePath = frameSet.desktop.basePath;
      format = frameSet.desktop.format;
      frameCount = frameSet.desktop.frameCount;
    }

    const totalFrames = frameCount;
    let loadedCount = 0;

    const loadFrame = (index: number) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        img.crossOrigin = 'anonymous';
        img.src = buildFrameUrl({
          basePath,
          filePrefix: frameSet.filePrefix,
          frameNumber: index + 1,
          padLength: frameSet.padLength,
          format,
          frameCount,
        });

        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          reject(new Error(`Frame ${index + 1} missing`));
        };
      });
    };

    const loadSequence = async () => {
      const tempFrames: HTMLImageElement[] = new Array(totalFrames);
      
      const loadPromises = Array.from({ length: totalFrames }).map(async (_, idx) => {
        try {
          const img = await loadFrame(idx);
          if (isCancelled) return;
          tempFrames[idx] = img;
          loadedCount++;
          setPreloadProgress(Math.round((loadedCount / totalFrames) * 100));
        } catch (e) {
          if (isCancelled) return;
          // In dev we warn once or twice, but don't flood logs
          if (idx === 0) {
            console.warn('[Cinematic Preloader] Frames missing. Fallback to poster rendering active.', e);
          }
        }
      });

      await Promise.allSettled(loadPromises);

      if (isCancelled) return;

      const validFrames = tempFrames.filter(Boolean) as HTMLImageElement[];
      
      if (validFrames.length === 0) {
        setHasErrors(true);
      } else {
        setLoadedFrames(tempFrames);
      }
      setIsPreloadingComplete(true);
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, [frameSet, screenWidth]);

  return {
    loadedFrames,
    isPreloadingComplete,
    preloadProgress,
    hasErrors,
    posterImage,
  };
}
