'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useGyroscope } from '@/lib/useGyroscope';

const stats = [
  { value: '97', suffix: '%', label: 'Human-likeness', desc: 'Blind tester score' },
  { value: '3.2', suffix: 'x', label: 'Conversion Lift', desc: 'vs traditional bots' },
  { value: '0.5', prefix: '<', suffix: 's', label: 'Response Time', desc: 'Natural pace' },
  { value: '24', suffix: '/7', label: 'Availability', desc: 'Never sleeps' },
];

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

interface GyroTilt { x: number; y: number; }

function StatCard({ stat, index, tilt }: { stat: typeof stats[0]; index: number; tilt: GyroTilt }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const count = useCounter(parseFloat(stat.value), isInView);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x * 6}deg) rotateY(${tilt.y * 6}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
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

      <div className="relative z-10">
        <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {stat.prefix || ''}{count}{stat.suffix}
        </div>
        <div className="mt-1.5 text-xs sm:text-sm text-white/40 group-hover:text-[#a78bfa]/50 transition-colors duration-500 font-medium">{stat.label}</div>
        <div className="mt-0.5 font-mono text-[9px] sm:text-[10px] text-white/15">{stat.desc}</div>
      </div>
    </motion.div>
  );
}

const ASCII_ART = `
  ╔══════════════════════════════╗
  ║  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐     ║
  ║  │▓├─┤▒├─┤░├─┤▒├─┤▓│     ║
  ║  └┬┘ └┬┘ └┬┘ └┬┘ └┬┘     ║
  ║   ├───┼───┼───┼───┤       ║
  ║  ┌┴┐ ┌┴┐ ┌┴┐ ┌┴┐ ┌┴┐     ║
  ║  │░├─┤▓├─┤▒├─┤▓├─┤░│     ║
  ║  └─┘ └─┘ └─┘ └─┘ └─┘     ║
  ║                             ║
  ║   N E U R A L  T R U S T   ║
  ║       E N G I N E          ║
  ╚══════════════════════════════╝
`;

export default function About() {
  const asciiRef = useRef(null);
  const isAsciiInView = useInView(asciiRef, { once: true });
  const tilt = useGyroscope();

  return (
    <section id="about" className="relative z-10 py-16 sm:py-24 md:py-32 px-5 sm:px-8">
      <div className="section-line max-w-6xl mx-auto mb-16 sm:mb-24" />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a78bfa]/30 tracking-[0.3em] uppercase">002</span>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px flex-1 bg-gradient-to-r from-[#a78bfa]/10 to-transparent origin-left" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight"
            >
              The Trust<br />
              <span className="text-gradient">Problem.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-6 sm:mt-8 space-y-4 text-white/35 text-sm sm:text-[15px] leading-relaxed"
            >
              <p>
                <span className="text-white/65 font-medium">68% of customers abandon conversations</span> the moment they realize they&apos;re talking to a chatbot.
              </p>
              <p>
                For businesses in finance, healthcare, and luxury, this isn&apos;t friction —{' '}
                <span className="text-white/65 font-medium">it&apos;s revenue left on the table.</span>
              </p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="my-6 p-4 sm:p-5 rounded-xl card-liquid-glass !border-l-2 !border-l-[#a78bfa]/20"
              >
                <p className="text-white/45 text-xs sm:text-sm italic">
                  &ldquo;Our engine doesn&apos;t generate responses — it{' '}
                  <span className="text-[#a78bfa]/60 not-italic font-medium">understands emotion</span>,{' '}
                  <span className="text-[#a78bfa]/60 not-italic font-medium">mirrors patterns</span>, and{' '}
                  <span className="text-[#a78bfa]/60 not-italic font-medium">adapts in real-time</span>.&rdquo;
                </p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div ref={asciiRef} className="hidden md:flex justify-center items-center">
            <pre className="text-[9px] lg:text-[10px] font-mono leading-relaxed select-none">
              {ASCII_ART.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={isAsciiInView ? { opacity: ch === ' ' || ch === '\n' ? 1 : 0.12 } : {}}
                  transition={{ duration: 0.02, delay: i * 0.002 }}
                  className="text-[#a78bfa] hover:opacity-50 transition-opacity"
                >
                  {ch}
                </motion.span>
              ))}
            </pre>
          </motion.div>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} tilt={tilt} />
          ))}
        </div>
      </div>
    </section>
  );
}
