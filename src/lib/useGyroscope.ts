'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export interface GyroTilt {
  x: number;
  y: number;
}

export function useGyroscope(): GyroTilt {
  const [tilt, setTilt] = useState<GyroTilt>({ x: 0, y: 0 });
  const latestRef = useRef<GyroTilt>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const flush = useCallback(() => {
    setTilt({ x: latestRef.current.x, y: latestRef.current.y });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const THROTTLE = 50; // ~20fps for smooth perf

    const handler = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      latestRef.current.x = Math.max(-1, Math.min(1, beta / 30));
      latestRef.current.y = Math.max(-1, Math.min(1, gamma / 30));

      const now = Date.now();
      if (now - lastUpdateRef.current < THROTTLE) return;
      lastUpdateRef.current = now;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(flush);
    };

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    const needsPermission = typeof DOE.requestPermission === 'function';

    if (!needsPermission) {
      window.addEventListener('deviceorientation', handler);
      return () => {
        window.removeEventListener('deviceorientation', handler);
        cancelAnimationFrame(rafRef.current);
      };
    }

    const onPermitted = () => {
      window.addEventListener('deviceorientation', handler);
    };
    window.addEventListener('gyro:permitted', onPermitted);

    return () => {
      window.removeEventListener('gyro:permitted', onPermitted);
      window.removeEventListener('deviceorientation', handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [flush]);

  return tilt;
}
