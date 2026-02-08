'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';

/* ─── Expanding concentric rings ─── */
function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [0.3, 1.2 + i * 0.25],
            opacity: [0.25, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5 + i * 0.4,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
          className="absolute rounded-full border border-[#a78bfa]/[0.08]"
          style={{ width: 80 + i * 70, height: 80 + i * 70 }}
        />
      ))}
    </div>
  );
}

/* ─── Floating gradient orbs ─── */
function FloatingOrbs() {
  const orbs = [
    { size: 120, x: '10%', y: '15%', dur: 7, color: '#a78bfa' },
    { size: 80, x: '85%', y: '25%', dur: 9, color: '#818cf8' },
    { size: 100, x: '70%', y: '75%', dur: 11, color: '#c4b5fd' },
    { size: 60, x: '20%', y: '80%', dur: 8, color: '#a78bfa' },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
          }}
          transition={{
            repeat: Infinity,
            duration: orb.dur,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}08, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      ))}
    </>
  );
}

/* ─── Animated sparkle particles ─── */
function Sparkles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: `${10 + Math.random() * 80}%`,
    y: `${10 + Math.random() * 80}%`,
    size: 1 + Math.random() * 2,
    dur: 2 + Math.random() * 3,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: p.dur,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-[#a78bfa] pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(167,139,250,0.15)`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Animated grid pattern BG ─── */
function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.015]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─── Main Footer ─── */
export default function Footer() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true });
  const btnRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  // Magnetic button
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const sbx = useSpring(bx, { stiffness: 120, damping: 20 });
  const sby = useSpring(by, { stiffness: 120, damping: 20 });

  const titleWords = ['Ready', 'to', 'Experience', 'the', 'Future?'];

  return (
    <footer className="relative z-10 pt-8 pb-8 sm:pb-10 px-5 sm:px-8">
      <div className="section-line max-w-6xl mx-auto mb-12 sm:mb-16" />

      <div className="max-w-6xl mx-auto">
        {/* ── CTA Section ── */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onMouseMove={(e) => {
            const rect = ctaRef.current?.getBoundingClientRect();
            if (!rect) return;
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setHovering(true);
          }}
          onMouseLeave={() => setHovering(false)}
          className="relative p-px rounded-2xl sm:rounded-3xl overflow-hidden mb-14 sm:mb-18"
        >
          {/* Animated gradient border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="absolute inset-[-80%]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 20%, rgba(167,139,250,0.15) 30%, transparent 40%, rgba(129,140,248,0.1) 55%, transparent 65%, rgba(196,181,253,0.12) 80%, transparent 90%)',
            }}
          />

          {/* Card body */}
          <div className="relative bg-[#080808] rounded-[inherit] overflow-hidden">
            {/* Spotlight */}
            {hovering && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.04), transparent 50%)`,
                }}
              />
            )}

            {/* Background effects */}
            <GridPattern />
            <FloatingOrbs />
            <PulseRings />
            <Sparkles />

            <div className="relative z-10 py-14 sm:py-20 md:py-28 px-6 sm:px-10 md:px-16 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 sm:mb-8"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/40"
                />
                <span className="font-mono text-[9px] sm:text-[10px] text-white/25 tracking-[0.15em] uppercase">No credit card required</span>
              </motion.div>

              {/* Title — word-by-word reveal */}
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4 sm:mb-5">
                {titleWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                    animate={isCtaInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-block mr-[0.22em] ${
                      word === 'Future?' ? 'text-gradient' : 'text-white'
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="text-white/20 max-w-md mx-auto mb-8 sm:mb-10 text-xs sm:text-sm leading-relaxed"
              >
                No sign-up required. Just start chatting and see if you can tell the difference.
              </motion.p>

              {/* Magnetic CTA button — Glossy */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={isCtaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  ref={btnRef}
                  style={{ x: sbx, y: sby, display: 'inline-block' }}
                  onMouseMove={(e) => {
                    const rect = btnRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    bx.set((e.clientX - rect.left - rect.width / 2) * 0.2);
                    by.set((e.clientY - rect.top - rect.height / 2) * 0.2);
                  }}
                  onMouseLeave={() => { bx.set(0); by.set(0); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#agents"
                    className="btn-glossy group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 sm:py-5 font-heading font-bold rounded-full text-sm sm:text-base overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Try It Now — Free
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>→</motion.span>
                    </span>
                    {/* Shine */}
                    <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:left-[200%] transition-all duration-700" />
                  </a>
                </motion.div>
              </motion.div>

              {/* Social proof strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isCtaInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
              >
                {[
                  { icon: '◈', text: 'No sign-up' },
                  { icon: '◉', text: '60s setup' },
                  { icon: '⏣', text: 'End-to-end encrypted' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    <span className="text-[#a78bfa]/25 text-[10px]">{item.icon}</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-white/15 tracking-wider">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Footer bottom ── */}
        <div className="border-t border-white/[0.04] pt-8 sm:pt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-start">
            {/* Brand — text-only logo */}
            <div className="col-span-2 md:col-span-1">
              <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-1 mb-3 cursor-default">
                <span className="font-display font-bold text-base tracking-tight">
                  LLa<span className="text-gradient">chat</span>
                  <span className="text-white/15 ml-1.5 text-[9px] font-mono tracking-widest align-super">AI</span>
                </span>
              </motion.div>
              <p className="text-[11px] text-white/12 leading-relaxed max-w-[220px]">
                AI conversations indistinguishable from human.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/12 mb-3">Product</h4>
                <div className="space-y-2">
                  {['Features', 'Agents', 'How It Works'].map((l) => (
                    <motion.div key={l} whileHover={{ x: 3 }}>
                      <a href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="block text-[11px] sm:text-xs text-white/18 hover:text-[#a78bfa]/40 transition-colors duration-300">{l}</a>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/12 mb-3">Company</h4>
                <div className="space-y-2">
                  {['About', 'Privacy', 'Contact'].map((l) => (
                    <motion.div key={l} whileHover={{ x: 3 }}>
                      <a href="#" className="block text-[11px] sm:text-xs text-white/18 hover:text-[#a78bfa]/40 transition-colors duration-300">{l}</a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 md:col-span-1 md:text-right">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] mb-3 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] text-white/20">All systems operational</span>
              </motion.div>
              <p className="text-[9px] text-white/8">&copy; 2025 LLachat AI. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* ASCII bottom signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <pre className="text-[5px] sm:text-[6px] text-white/[0.025] font-mono inline-block select-none">
{`════════════════════════════════════════════════════════════════
   ◈  Built with obsession for human-like AI  ◈  LLachat AI  ◈
════════════════════════════════════════════════════════════════`}
          </pre>
        </motion.div>
      </div>
    </footer>
  );
}
