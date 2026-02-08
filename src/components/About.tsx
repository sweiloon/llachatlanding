'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useGyroscope } from '@/lib/useGyroscope';
import { useLanguage } from '@/lib/i18n';

/* ─── Floating Particles ─── */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: (7 + ((i * 37 + 13) % 86)),
  y: (5 + ((i * 53 + 7) % 90)),
  size: 1 + (i % 3),
  dur: 3 + (i % 5),
  delay: (i * 0.4) % 3,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], opacity: [0, 0.35, 0] }}
          transition={{ repeat: Infinity, duration: p.dur, delay: p.delay, ease: 'easeInOut' }}
          className="absolute rounded-full bg-[#a78bfa]"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            boxShadow: `0 0 ${p.size * 3}px rgba(167,139,250,0.2)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Neural Network Visualization ─── */
const NODES = [
  { x: 15, y: 15 }, { x: 50, y: 8 }, { x: 85, y: 18 },
  { x: 10, y: 48 }, { x: 42, y: 42 }, { x: 72, y: 52 },
  { x: 20, y: 82 }, { x: 55, y: 88 }, { x: 88, y: 78 },
];
const EDGES = [
  [0,1],[0,3],[0,4],[1,2],[1,4],[1,5],[2,5],[3,4],[3,6],[4,5],[4,7],[5,8],[6,7],[7,8],
];

function NeuralNetwork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full aspect-square max-w-[280px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connections */}
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="rgba(167,139,250,0.08)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
          />
        ))}
        {/* Data pulses along edges */}
        {EDGES.map(([a, b], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="0.8"
            fill="#a78bfa"
            initial={{ opacity: 0 }}
            animate={isInView ? {
              cx: [NODES[a].x, NODES[b].x],
              cy: [NODES[a].y, NODES[b].y],
              opacity: [0, 0.5, 0],
            } : {}}
            transition={{
              repeat: Infinity,
              duration: 2 + (i % 3) * 0.5,
              delay: 1.5 + i * 0.3,
              ease: 'linear',
            }}
          />
        ))}
        {/* Nodes */}
        {NODES.map((n, i) => (
          <g key={`node-${i}`}>
            {/* Glow */}
            <motion.circle
              cx={n.x} cy={n.y} r="3"
              fill="none"
              stroke="rgba(167,139,250,0.15)"
              strokeWidth="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: [1, 1.5, 1], opacity: [0.15, 0.3, 0.15] } : {}}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.2 }}
            />
            {/* Core */}
            <motion.circle
              cx={n.x} cy={n.y} r="1.5"
              fill="rgba(167,139,250,0.3)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
            />
          </g>
        ))}
      </svg>
      {/* Center label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="font-mono text-[7px] sm:text-[8px] text-[#a78bfa]/15 tracking-[0.3em] uppercase">Neural Trust</span>
      </motion.div>
    </div>
  );
}

/* ─── Signal Waveform ─── */
function SignalWave() {
  return (
    <div className="w-full h-8 flex items-center justify-center gap-[2px] mt-4">
      {Array.from({ length: 32 }, (_, i) => {
        const h = 0.2 + Math.abs(Math.sin((i / 32) * Math.PI * 3)) * 0.8;
        return (
          <motion.div
            key={i}
            animate={{ scaleY: [h, h * 0.3, h * 1.2, h] }}
            transition={{ repeat: Infinity, duration: 1.5 + (i % 4) * 0.2, delay: i * 0.05, ease: 'easeInOut' }}
            className="w-[2px] rounded-full origin-center bg-gradient-to-t from-[#a78bfa]/5 to-[#a78bfa]/20"
            style={{ height: '100%' }}
          />
        );
      })}
    </div>
  );
}

/* ─── Counter Hook ─── */
function useCounter(target: number, isInView: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const isFloat = target % 1 !== 0;
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      setCount(isFloat ? parseFloat(val.toFixed(1)) : Math.round(val));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  return count;
}

/* ─── Stat Card ─── */
interface GyroTilt { x: number; y: number; }

function StatCard({ stat, index, tilt }: { stat: { value: string; suffix: string; prefix: string; label: string; desc: string }; index: number; tilt: GyroTilt }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const count = useCounter(parseFloat(stat.value), isInView);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <div style={{
      transform: `perspective(1000px) rotateX(${tilt.x * 6}deg) rotateY(${tilt.y * 6}deg)`,
      transition: 'transform 0.3s ease-out',
    }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setHovering(true);
        }}
        onMouseLeave={() => setHovering(false)}
        className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl card-liquid-glass overflow-hidden cursor-default group"
      >
        {/* Spotlight */}
        {hovering && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
            style={{
              background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.07), transparent 60%)`,
            }}
          />
        )}
        {/* Pulse ring on hover */}
        <motion.div
          animate={hovering ? { scale: [1, 1.5], opacity: [0.15, 0] } : { opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute inset-0 rounded-[inherit] border border-[#a78bfa]/20 pointer-events-none"
        />

        <div className="relative z-10">
          <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {stat.prefix || ''}{count}{stat.suffix}
          </div>
          <div className="mt-1.5 text-xs sm:text-sm text-white/40 group-hover:text-[#a78bfa]/50 transition-colors duration-500 font-medium">{stat.label}</div>
          <div className="mt-0.5 font-mono text-[9px] sm:text-[10px] text-white/15">{stat.desc}</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main About Section ─── */
export default function About() {
  const tilt = useGyroscope();
  const { t } = useLanguage();

  return (
    <section id="about" className="relative z-10 py-16 sm:py-24 md:py-32 px-5 sm:px-8">
      <div className="section-line max-w-6xl mx-auto mb-16 sm:mb-24" />

      <div className="max-w-6xl mx-auto relative">
        {/* Floating particles */}
        <FloatingParticles />

        {/* Section number + line */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a78bfa]/30 tracking-[0.3em] uppercase">{t.about.num}</span>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px flex-1 bg-gradient-to-r from-[#a78bfa]/10 to-transparent origin-left" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left: Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight"
            >
              {t.about.title}<br />
              <span className="text-gradient">{t.about.titleAccent}</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-6 sm:mt-8 space-y-4 text-white/35 text-sm sm:text-[15px] leading-relaxed"
            >
              <p>
                {t.about.p1a}
                <span className="text-white/65 font-medium">{t.about.p1Highlight}</span>
                {t.about.p1b}
              </p>
              <p>
                {t.about.p2a}
                <span className="text-white/65 font-medium">{t.about.p2Highlight}</span>
              </p>

              {/* Glass Quote Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="my-6 relative group/quote"
              >
                <div className="p-4 sm:p-5 rounded-xl card-liquid-glass !border-l-2 !border-l-[#a78bfa]/20 overflow-hidden">
                  {/* Inner glow */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a78bfa]/[0.02] to-transparent pointer-events-none"
                  />
                  <p className="relative text-white/45 text-xs sm:text-sm italic">
                    &ldquo;{t.about.quoteStart}
                    <span className="text-[#a78bfa]/60 not-italic font-medium">{t.about.quoteEmotion}</span>,{' '}
                    <span className="text-[#a78bfa]/60 not-italic font-medium">{t.about.quotePatterns}</span>
                    {t.about.quoteAnd}
                    <span className="text-[#a78bfa]/60 not-italic font-medium">{t.about.quoteAdapts}</span>.&rdquo;
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Visualization */}
          <div className="hidden md:flex flex-col items-center justify-center gap-6">
            <NeuralNetwork />
            <SignalWave />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {t.about.stats.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} tilt={tilt} />
          ))}
        </div>
      </div>
    </section>
  );
}
