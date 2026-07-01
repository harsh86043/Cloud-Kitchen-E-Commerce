/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export interface DeviceCapabilities {
  hasCanvas: boolean;
  connectionSpeed?: 'slow' | 'fast';
  deviceMemory?: number; // GB
  isLowEnd: boolean;
  screenWidth: number;
}

export function useDeviceCapability(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasCanvas: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    isLowEnd: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check canvas support
    const canvas = document.createElement('canvas');
    const hasCanvas = !!(canvas.getContext && canvas.getContext('2d'));

    // Check network speed
    let connectionSpeed: 'slow' | 'fast' = 'fast';
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      if (conn.saveData || /slow-2g|2g|3g/.test(conn.effectiveType || '')) {
        connectionSpeed = 'slow';
      }
    }

    // Check device memory
    const deviceMemory = (navigator as any).deviceMemory; // in GB

    // Determine if low end
    const isLowEnd = 
      !hasCanvas || 
      connectionSpeed === 'slow' || 
      (deviceMemory !== undefined && deviceMemory < 4);

    const handleResize = () => {
      setCapabilities(prev => ({
        ...prev,
        screenWidth: window.innerWidth,
      }));
    };

    window.addEventListener('resize', handleResize);

    setCapabilities({
      hasCanvas,
      connectionSpeed,
      deviceMemory,
      isLowEnd,
      screenWidth: window.innerWidth,
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return capabilities;
}
