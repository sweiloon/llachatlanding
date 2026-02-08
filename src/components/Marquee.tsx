'use client';

import { motion } from 'framer-motion';

const items = [
  'Human-Like AI',
  '◈',
  '97% Trust Score',
  '◈',
  'WhatsApp Native',
  '◈',
  'Real-Time Empathy',
  '◈',
  'Zero Friction',
  '◈',
  '24/7 Available',
  '◈',
  'Domain Trained',
  '◈',
  'Self-Evolving',
  '◈',
];

export default function Marquee() {
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
