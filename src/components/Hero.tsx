'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface Props {
  shapeName: string;
}

/* ─── Per-character with gradient color + hover glow ─── */
function HeroChar({ char, index, total }: { char: string; index: number; total: number }) {
  const [scramble, setScramble] = useState(char);
  const [hovering, setHovering] = useState(false);
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%◈◉⬡';

  useEffect(() => {
    if (!hovering) { setScramble(char); return; }
    let frame = 0;
    const timer = setInterval(() => {
      if (frame < 6) {
        setScramble(pool[Math.floor(Math.random() * pool.length)]);
      } else {
        setScramble(char);
        clearInterval(timer);
      }
      frame++;
    }, 30);
    return () => clearInterval(timer);
  }, [hovering, char]);

  if (char === ' ') return <span className="inline-block w-[0.28em]" />;

  // Gradient flow: cyan → blue → purple across the title
  const t = total > 1 ? index / (total - 1) : 0;
  const h = 185 + t * 75; // hue from 185 (cyan) to 260 (purple)
  const color = `hsl(${h}, 80%, 70%)`;
  const glowColor = `hsla(${h}, 85%, 65%, 0.5)`;

  return (
    <motion.span
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 60, filter: 'blur(14px)', scale: 0.7 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.3 + index * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -14,
        scale: 1.18,
        textShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}, 0 4px 20px rgba(0,0,0,0.4)`,
        transition: { type: 'spring', stiffness: 400, damping: 12 },
      }}
      className="inline-block cursor-default font-display"
      style={{
        color,
        textShadow: `0 0 20px hsla(${h}, 80%, 60%, 0.15)`,
      }}
    >
      {scramble}
    </motion.span>
  );
}

/* ─── Shimmer badge ─── */
function ShimmerBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative inline-flex rounded-full overflow-hidden mb-8 sm:mb-10"
    >
      <motion.div
        animate={{ x: ['-150%', '250%'] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', delay: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -skew-x-12 pointer-events-none"
      />
      <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inset-0 rounded-full bg-[#00f3ff] opacity-50" />
          <span className="relative rounded-full h-2 w-2 bg-[#00f3ff]" />
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] text-[#00f3ff]/50 tracking-[0.12em] uppercase">
          Neural Trust Engine v3.2
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Hero ─── */
const title = 'AI That Feels Human.';

export default function Hero({ shapeName }: Props) {
  // Magnetic CTA
  const btnRef = useRef<HTMLDivElement>(null);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const sbx = useSpring(bx, { stiffness: 120, damping: 18 });
  const sby = useSpring(by, { stiffness: 120, damping: 18 });

  // Second CTA
  const btn2Ref = useRef<HTMLDivElement>(null);
  const b2x = useMotionValue(0);
  const b2y = useMotionValue(0);
  const sb2x = useSpring(b2x, { stiffness: 150, damping: 20 });
  const sb2y = useSpring(b2y, { stiffness: 150, damping: 20 });

  const mag = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>,
    mx: MotionValue<number>,
    my: MotionValue<number>,
    s = 0.2,
  ) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * s);
    my.set((e.clientY - rect.top - rect.height / 2) * s);
  };

  const resetMag = (mx: MotionValue<number>, my: MotionValue<number>) => {
    mx.set(0);
    my.set(0);
  };

  const triggerMorph = () => {
    window.dispatchEvent(new Event('particle:morph'));
  };

  const chars = title.split('');

  return (
    <section
      onClick={triggerMorph}
      className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-8 z-10 overflow-hidden cursor-crosshair"
    >
      {/* Badge */}
      <ShimmerBadge />

      {/* One-liner Title */}
      <h1 className="font-display font-bold text-center leading-[0.92] tracking-[-0.04em] select-none text-[2.4rem] sm:text-[3.6rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem]">
        {chars.map((ch, i) => (
          <HeroChar key={i} char={ch} index={i} total={chars.length} />
        ))}
      </h1>

      {/* Shape indicator — clickable pill */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          triggerMorph();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-6 sm:mt-8 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#00f3ff]/25 transition-all duration-500 group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="text-[#00f3ff]/40 text-xs"
        >
          ◈
        </motion.span>
        <motion.span
          key={shapeName}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] sm:text-xs text-white/25 tracking-[0.15em] uppercase group-hover:text-white/50 transition-colors"
        >
          {shapeName}
        </motion.span>
        <span className="font-mono text-[7px] sm:text-[8px] text-white/10 tracking-wider uppercase ml-1 group-hover:text-white/20 transition-colors">
          Tap to morph
        </span>
      </motion.button>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className="mt-5 sm:mt-6 text-[13px] sm:text-base md:text-lg text-white/25 text-center max-w-md sm:max-w-xl leading-relaxed px-2"
      >
        Next-generation conversational AI so natural,{' '}
        <span className="text-white/40">your customers won&apos;t know the difference.</span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.9 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Primary — magnetic */}
        <motion.div
          ref={btnRef}
          style={{ x: sbx, y: sby }}
          onMouseMove={(e) => mag(e, btnRef, bx, by, 0.2)}
          onMouseLeave={() => resetMag(bx, by)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <a
            href="#agents"
            className="group relative inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-[#00f3ff] text-black font-heading font-bold rounded-full text-sm sm:text-[15px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,243,255,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Meet Our Agents
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </span>
            <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:left-[200%] transition-all duration-700" />
          </a>
        </motion.div>

        {/* Secondary — magnetic ghost */}
        <motion.div
          ref={btn2Ref}
          style={{ x: sb2x, y: sb2y }}
          onMouseMove={(e) => mag(e, btn2Ref, b2x, b2y, 0.15)}
          onMouseLeave={() => resetMag(b2x, b2y)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm text-white/35 border border-white/[0.08] hover:text-white/60 hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.04)] transition-all duration-500 font-medium"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
        className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {[
          { icon: '◈', label: 'No sign-up required' },
          { icon: '◉', label: 'Free to try' },
          { icon: '⏣', label: 'Enterprise ready' },
        ].map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 + i * 0.1 }}
            className="flex items-center gap-1.5 group cursor-default"
          >
            <span className="text-[#00f3ff]/25 text-[10px] group-hover:text-[#00f3ff]/50 transition-colors">
              {t.icon}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-white/[0.15] group-hover:text-white/30 transition-colors tracking-wider">
              {t.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[7px] text-white/10 tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/[0.06] flex justify-center pt-2">
            <motion.div
              animate={{ opacity: [0.6, 0.1, 0.6], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-[2px] h-[6px] bg-[#00f3ff]/20 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
