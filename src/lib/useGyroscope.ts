'use client';

import { useEffect, useState } from 'react';

export interface GyroTilt {
  x: number;
  y: number;
}

export function useGyroscope(): GyroTilt {
  const [tilt, setTilt] = useState<GyroTilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      setTilt({
        x: Math.max(-1, Math.min(1, beta / 30)),
        y: Math.max(-1, Math.min(1, gamma / 30)),
      });
    };

    // Check if iOS requires permission (iOS 13+)
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const needsPermission = typeof DOE.requestPermission === 'function';

    if (!needsPermission) {
      // Android / desktop — listen directly, no permission needed
      window.addEventListener('deviceorientation', handler);
      return () => window.removeEventListener('deviceorientation', handler);
    }

    // iOS — wait for permission granted via GyroPermissionBanner
    const onPermitted = () => {
      window.addEventListener('deviceorientation', handler);
    };
    window.addEventListener('gyro:permitted', onPermitted);

    return () => {
      window.removeEventListener('gyro:permitted', onPermitted);
      window.removeEventListener('deviceorientation', handler);
    };
  }, []);

  return tilt;
}
