'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface Props {
  shapeName: string;
}

/* ─── Character that scrambles on hover ─── */
function ScrambleChar({ char, index }: { char: string; index: number }) {
  const [display, setDisplay] = useState(char);
  const [hovering, setHovering] = useState(false);
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#◈◉⬡';

  useEffect(() => {
    if (!hovering) { setDisplay(char); return; }
    let frame = 0;
    const timer = setInterval(() => {
      if (frame < 5) {
        setDisplay(pool[Math.floor(Math.random() * pool.length)]);
      } else {
        setDisplay(char);
        clearInterval(timer);
      }
      frame++;
    }, 35);
    return () => clearInterval(timer);
  }, [hovering, char]);

  if (char === ' ') return <span className="inline-block w-[0.25em]" />;

  return (
    <motion.span
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.025, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -10,
        color: '#00f3ff',
        textShadow: '0 0 35px rgba(0,243,255,0.5), 0 0 70px rgba(0,243,255,0.2)',
        scale: 1.08,
        transition: { duration: 0.12 },
      }}
      className="inline-block cursor-default font-mono sm:font-heading"
    >
      {display}
    </motion.span>
  );
}

/* ─── Shimmer badge ─── */
function ShimmerBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative inline-flex rounded-full overflow-hidden mb-8 sm:mb-10 md:mb-12"
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ['-150%', '250%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-12 pointer-events-none"
      />
      <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inset-0 rounded-full bg-[#00f3ff] opacity-40" />
          <span className="relative rounded-full h-2 w-2 bg-[#00f3ff]" />
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] text-[#00f3ff]/45 tracking-[0.12em] uppercase">
          Neural Trust Engine v3.2
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Floating stat badge ─── */
function FloatingBadge({
  value,
  label,
  position,
  delay,
  floatDuration,
}: {
  value: string;
  label: string;
  position: string;
  delay: number;
  floatDuration: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute ${position} hidden xl:block z-20`}
    >
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: floatDuration, ease: 'easeInOut' }}
        className="group px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm hover:border-[#00f3ff]/15 transition-colors duration-500 cursor-default"
      >
        <div className="font-heading text-lg font-bold text-white group-hover:text-[#00f3ff]/80 transition-colors duration-300">{value}</div>
        <div className="font-mono text-[8px] text-white/15 tracking-[0.15em] uppercase mt-0.5">{label}</div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Floating mini chat card ─── */
function FloatingChat() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.7 }}
      className="absolute left-[4%] top-[38%] hidden xl:block z-20"
    >
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [-2, 1, -2] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="w-44 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
      >
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#00f3ff]/20 to-[#818cf8]/20 border border-white/[0.08]" />
          <span className="font-mono text-[8px] text-white/20 tracking-wider">EVA_AGENT</span>
          <span className="ml-auto w-1 h-1 rounded-full bg-emerald-400/50" />
        </div>
        <div className="space-y-1.5">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[85%] h-[6px] rounded-full bg-[#00f3ff]/[0.05]"
          />
          <div className="w-[55%] h-[6px] rounded-full bg-white/[0.03] ml-auto" />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="w-[70%] h-[6px] rounded-full bg-[#00f3ff]/[0.04]"
          />
        </div>
        <div className="flex gap-[3px] mt-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
              className="w-[3px] h-[3px] rounded-full bg-[#00f3ff]/30"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Floating ASCII decoration ─── */
function FloatingAscii() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      className="absolute right-[3%] bottom-[30%] hidden xl:block z-20"
    >
      <motion.pre
        animate={{ y: [5, -5, 5], rotate: [1, -1, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="text-[7px] text-[#00f3ff]/[0.06] font-mono leading-tight select-none cursor-default hover:text-[#00f3ff]/[0.12] transition-colors duration-500"
      >
{`┌─────────────────┐
│  ◈ TRUST: 97%   │
│  ◈ MODE: HUMAN  │
│  ◈ LATENCY: OK  │
└─────────────────┘`}
      </motion.pre>
    </motion.div>
  );
}

/* ─── Main Hero ─── */
const line1 = 'AI That Feels';
const line2 = 'Human.';

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

  const mag = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>, mx: MotionValue<number>, my: MotionValue<number>, s = 0.2) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * s);
    my.set((e.clientY - rect.top - rect.height / 2) * s);
  };

  const resetMag = (mx: MotionValue<number>, my: MotionValue<number>) => {
    mx.set(0); my.set(0);
  };

  const allChars = (line1 + ' ' + line2).split('');
  const line1Len = line1.length;

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-8 z-10 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f3ff]/[0.015] rounded-full blur-[180px] pointer-events-none" />

      {/* Floating elements (XL screens only) */}
      <FloatingBadge value="97%" label="Trust Score" position="top-[28%] right-[8%]" delay={2} floatDuration={5} />
      <FloatingBadge value="<0.5s" label="Response" position="bottom-[32%] right-[12%]" delay={2.3} floatDuration={6} />
      <FloatingBadge value="3.2x" label="Conversion" position="top-[22%] left-[6%]" delay={2.6} floatDuration={5.5} />
      <FloatingChat />
      <FloatingAscii />

      {/* Badge */}
      <ShimmerBadge />

      {/* Title */}
      <h1 className="font-heading font-extrabold text-center leading-[0.88] tracking-[-0.045em] select-none">
        {/* Line 1 */}
        <span className="block text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem] text-white">
          {line1.split('').map((ch, i) => (
            <ScrambleChar key={`l1-${i}`} char={ch} index={i} />
          ))}
        </span>
        {/* Line 2 — gradient */}
        <span className="block text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] xl:text-[10rem] mt-[-0.05em]">
          {line2.split('').map((ch, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.5 + (line1Len + 1 + i) * 0.025, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -10,
                scale: 1.08,
                textShadow: '0 0 40px rgba(0,243,255,0.4), 0 0 80px rgba(129,140,248,0.2)',
                transition: { duration: 0.12 },
              }}
              className="inline-block cursor-default text-gradient"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </h1>

      {/* Gradient divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-12 sm:w-20 h-px mt-6 sm:mt-8 origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent, #00f3ff40, #818cf830, transparent)',
        }}
      />

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
            className="group relative inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-[#00f3ff] text-black font-heading font-bold rounded-full text-sm sm:text-[15px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,243,255,0.35)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Meet Our Agents
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>→</motion.span>
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
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm text-white/35 border border-white/[0.08] hover:text-white/60 hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500 font-medium"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
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
            transition={{ delay: 2.6 + i * 0.1 }}
            className="flex items-center gap-1.5 group cursor-default"
          >
            <span className="text-[#00f3ff]/20 text-[10px] group-hover:text-[#00f3ff]/40 transition-colors">{t.icon}</span>
            <span className="font-mono text-[9px] sm:text-[10px] text-white/[0.12] group-hover:text-white/25 transition-colors tracking-wider">{t.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Shape label */}
      <motion.div
        key={shapeName}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/[0.06] text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-mono"
      >
        <span className="w-5 h-px bg-white/[0.04]" />
        {shapeName}
        <span className="w-5 h-px bg-white/[0.04]" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-4 sm:bottom-14 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/[0.05] flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 0.1, 0.5], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[2px] h-[6px] bg-[#00f3ff]/15 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
