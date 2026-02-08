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

    let active = false;

    const handler = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      setTilt({
        x: Math.max(-1, Math.min(1, beta / 30)),
        y: Math.max(-1, Math.min(1, gamma / 30)),
      });
    };

    const requestPermission = async () => {
      if (active) return;
      try {
        if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
          const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (response === 'granted') {
            active = true;
            window.addEventListener('deviceorientation', handler);
          }
        } else {
          active = true;
          window.addEventListener('deviceorientation', handler);
        }
      } catch {
        /* permission denied */
      }
    };

    requestPermission();
    const onTouch = () => { if (!active) requestPermission(); };
    window.addEventListener('touchstart', onTouch, { once: true });

    return () => {
      window.removeEventListener('deviceorientation', handler);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return tilt;
}
