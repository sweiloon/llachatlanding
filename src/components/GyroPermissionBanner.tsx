'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export default function GyroPermissionBanner() {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Only show on iOS 13+ where DeviceOrientationEvent.requestPermission exists
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === 'function') {
      setShow(true);
    }
  }, []);

  const handleClick = () => {
    // MUST call requestPermission synchronously from click handler for iOS
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission: () => Promise<string>;
    };
    DOE.requestPermission()
      .then((response: string) => {
        if (response === 'granted') {
          window.dispatchEvent(new Event('gyro:permitted'));
        }
        setShow(false);
      })
      .catch(() => setShow(false));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]"
        >
          <button
            onClick={handleClick}
            className="btn-glass flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-medium text-white/50 hover:text-white/70 transition-colors"
          >
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="text-base"
            >
              ◇
            </motion.span>
            {t.gyro.enable}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
