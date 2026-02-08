'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export default function Marquee() {
  const { t } = useLanguage();
  const items: string[] = [];
  t.marquee.forEach((item) => {
    items.push(item, '◈');
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative z-10 py-5 sm:py-6 overflow-hidden border-y border-white/[0.03]"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`mx-3 sm:mx-5 text-[10px] sm:text-xs tracking-[0.25em] uppercase ${
              item === '◈' ? 'text-[#a78bfa]/20' : 'text-white/[0.06] font-mono'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
