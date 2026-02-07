'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface Props {
  shapeName: string;
}

/* ─── Word with gradient color + hover ─── */
const WORDS = [
  { text: 'AI', color: '#00f3ff', glow: '0,243,255' },
  { text: 'That', color: '#38bdf8', glow: '56,189,248' },
  { text: 'Feels', color: '#818cf8', glow: '129,140,248' },
  { text: 'Human.', color: '#c084fc', glow: '192,132,252' },
];

function HeroWord({ word, index }: { word: typeof WORDS[number]; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.8,
        delay: 0.4 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -10,
        scale: 1.06,
        textShadow: `0 0 50px rgba(${word.glow},0.5), 0 0 100px rgba(${word.glow},0.25), 0 4px 20px rgba(0,0,0,0.3)`,
        transition: { type: 'spring', stiffness: 300, damping: 15 },
      }}
      className="inline-block mr-[0.22em] last:mr-0 cursor-default"
      style={{
        color: word.color,
        textShadow: `0 0 30px rgba(${word.glow},0.15)`,
      }}
    >
      {word.text}
    </motion.span>
  );
}

/* ─── Shimmer badge ─── */
function ShimmerBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.1 }}
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
export default function Hero({ shapeName }: Props) {
  const btnRef = useRef<HTMLDivElement>(null);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const sbx = useSpring(bx, { stiffness: 120, damping: 18 });
  const sby = useSpring(by, { stiffness: 120, damping: 18 });

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

  return (
    <section
      onClick={triggerMorph}
      className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-8 z-10 overflow-hidden"
    >
      {/* Subtle dark backdrop behind text for readability */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[800px] h-[200px] bg-[#050505]/25 rounded-full blur-[100px] pointer-events-none" />

      {/* Badge */}
      <ShimmerBadge />

      {/* Title — word-by-word gradient */}
      <h1 className="relative font-display font-bold text-center leading-[0.88] tracking-[-0.045em] select-none text-[2.6rem] sm:text-[4.2rem] md:text-[6rem] lg:text-[8rem] xl:text-[9.5rem] 2xl:text-[10.5rem]">
        {WORDS.map((w, i) => (
          <HeroWord key={w.text} word={w} index={i} />
        ))}
      </h1>

      {/* Shape indicator — clickable */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); triggerMorph(); }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="mt-5 sm:mt-7 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#00f3ff]/20 transition-all duration-500 group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="text-[#00f3ff]/35 text-xs"
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
        <span className="hidden sm:inline font-mono text-[7px] text-white/10 tracking-wider uppercase ml-1 group-hover:text-white/20 transition-colors">
          Click to morph
        </span>
      </motion.button>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="mt-5 sm:mt-6 text-[13px] sm:text-base md:text-lg text-white/20 text-center max-w-md sm:max-w-xl leading-relaxed px-2"
      >
        Next-generation conversational AI so natural,{' '}
        <span className="text-white/35">your customers won&apos;t know the difference.</span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.8 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
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
            className="group relative inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-[#00f3ff] text-black font-heading font-bold rounded-full text-sm sm:text-[15px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,243,255,0.35)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Meet Our Agents
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>→</motion.span>
            </span>
            <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:left-[200%] transition-all duration-700" />
          </a>
        </motion.div>

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
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm text-white/30 border border-white/[0.08] hover:text-white/55 hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500 font-medium"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
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
            transition={{ delay: 2.3 + i * 0.1 }}
            className="flex items-center gap-1.5 group cursor-default"
          >
            <span className="text-[#00f3ff]/20 text-[10px] group-hover:text-[#00f3ff]/45 transition-colors">{t.icon}</span>
            <span className="font-mono text-[9px] sm:text-[10px] text-white/[0.12] group-hover:text-white/25 transition-colors tracking-wider">{t.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
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
              animate={{ opacity: [0.5, 0.1, 0.5], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-[2px] h-[6px] bg-[#00f3ff]/15 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
