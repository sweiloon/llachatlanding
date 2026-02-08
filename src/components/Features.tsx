'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useGyroscope } from '@/lib/useGyroscope';

interface GyroTilt { x: number; y: number; }

/* ─── Liquid Glass Card with gyroscope tilt ─── */
function GradientBorderCard({
  children,
  className = '',
  delay = 0,
  tilt,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tilt: GyroTilt;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x * 6}deg) rotateY(${tilt.y * 6}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className={`group relative p-px rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}
    >
      {/* Rotating gradient border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="absolute inset-[-80%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'conic-gradient(from 0deg, transparent 30%, rgba(167,139,250,0.2) 38%, transparent 45%, rgba(129,140,248,0.12) 55%, transparent 65%)',
        }}
      />

      {/* Static subtle border */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/[0.06] group-hover:border-transparent transition-colors duration-500 pointer-events-none" />

      {/* Card body — liquid glass */}
      <div className="relative rounded-[inherit] h-full card-liquid-glass !border-0">
        {/* Spotlight glow */}
        {hovering && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
            style={{
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.07), transparent 55%)`,
            }}
          />
        )}
        {children}
      </div>
    </motion.div>
  );
}

/* ─── SVG Circular Progress ─── */
function CircularProgress() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className="relative w-28 h-28 sm:w-36 sm:h-36">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="url(#progressGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={isInView ? { strokeDashoffset: c * 0.03 } : {}} transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="url(#progressGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={isInView ? { strokeDashoffset: c * 0.03 } : {}} transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} opacity={0.15} filter="blur(4px)" />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp target={97} isInView={isInView} className="font-heading text-2xl sm:text-3xl font-extrabold text-white" />
        <span className="text-[10px] text-white/25 font-mono mt-0.5">TRUST %</span>
      </div>
    </div>
  );
}

/* ─── Counter ─── */
function CountUp({ target, isInView, className }: { target: number; isInView: boolean; className?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const dur = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * e));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <span className={className}>{count}%</span>;
}

/* ─── EQ Meter ─── */
function EQMeter() {
  const bars = [0.5, 0.8, 0.4, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4];
  return (
    <div className="flex items-end gap-[3px] h-10 sm:h-12">
      {bars.map((h, i) => (
        <motion.div key={i} animate={{ scaleY: [h, 1, h * 0.3, h * 0.8, h] }} transition={{ repeat: Infinity, duration: 1.2 + Math.random() * 0.5, delay: i * 0.07, ease: 'easeInOut' }} className="w-[3px] sm:w-1 rounded-full origin-bottom bg-gradient-to-t from-[#a78bfa]/40 to-[#a78bfa]/10" style={{ height: '100%' }} />
      ))}
    </div>
  );
}

/* ─── Orbiting dots ─── */
function OrbitDots() {
  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
      <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
      {[0, 120, 240].map((deg, i) => (
        <motion.div key={i} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4 + i, ease: 'linear' }} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: i === 0 ? '#a78bfa' : i === 1 ? '#818cf8' : '#c4b5fd', boxShadow: `0 0 8px ${i === 0 ? '#a78bfa' : i === 1 ? '#818cf8' : '#c4b5fd'}40` }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Lock icon animation ─── */
function LockPulse() {
  return (
    <motion.div animate={{ boxShadow: ['0 0 0px rgba(167,139,250,0)', '0 0 20px rgba(167,139,250,0.15)', '0 0 0px rgba(167,139,250,0)'] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center backdrop-blur-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </motion.div>
  );
}

/* ─── Infinity animation ─── */
function InfinityLoop() {
  return (
    <div className="relative w-14 h-8 sm:w-16 sm:h-10">
      <svg viewBox="0 0 80 40" className="w-full h-full" fill="none">
        <motion.path d="M20 20c0-8 8-15 16-15s16 7 16 15-8 15-16 15-16-7-16-15zm24 0c0-8 8-15 16-15s16 7 16 15-8 15-16 15-16-7-16-15z" stroke="url(#infGrad)" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} />
        <defs>
          <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Main Features Section ─── */
export default function Features() {
  const tilt = useGyroscope();

  return (
    <section id="features" className="relative z-10 py-16 sm:py-24 md:py-32 px-5 sm:px-8">
      <div className="section-line max-w-6xl mx-auto mb-16 sm:mb-24" />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a78bfa]/30 tracking-[0.3em] uppercase">003</span>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px flex-1 bg-gradient-to-r from-[#a78bfa]/10 to-transparent origin-left" />
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
          Why <span className="text-gradient">LLachat</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-white/20 text-sm sm:text-base max-w-lg mt-3 mb-10 sm:mb-14">
          Every feature engineered to make AI indistinguishable.
        </motion.p>

        {/* Hero feature card */}
        <GradientBorderCard className="mb-4 sm:mb-5" delay={0} tilt={tilt}>
          <div className="relative p-6 sm:p-8 md:p-10 overflow-hidden">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 font-heading text-[80px] sm:text-[120px] md:text-[160px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">01</div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 sm:gap-8 md:gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a78bfa]/[0.06] border border-[#a78bfa]/[0.1] mb-4 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/50" />
                  <span className="font-mono text-[9px] text-[#a78bfa]/50 tracking-[0.15em] uppercase">Core Technology</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 sm:mb-4">Indistinguishable</h3>
                <p className="text-white/30 text-sm sm:text-base leading-relaxed max-w-lg mb-5 sm:mb-6">Our proprietary model passes the conversational Turing test. Blind testers consistently rate our AI as human. Natural pauses, humor, empathy — all learned from millions of real conversations.</p>
                <div className="flex gap-6 sm:gap-8">
                  {[{ val: '97%', lab: 'Human-like' }, { val: '3.2x', lab: 'Conversion' }, { val: '<0.5s', lab: 'Response' }].map((s) => (
                    <div key={s.lab}>
                      <div className="font-heading text-lg sm:text-xl font-bold text-white">{s.val}</div>
                      <div className="text-[10px] text-white/20 font-mono">{s.lab}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center md:justify-end"><CircularProgress /></div>
            </div>
            <pre className="absolute bottom-4 right-6 text-[7px] sm:text-[8px] text-[#a78bfa]/[0.04] font-mono leading-tight select-none hidden md:block group-hover:text-[#a78bfa]/[0.08] transition-colors duration-700">
{`┌───────────────────────┐
│  H U M A N  ≡  A I   │
│  ████████████████ 97% │
│  TRUST SCORE: MAX     │
└───────────────────────┘`}
            </pre>
          </div>
        </GradientBorderCard>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <GradientBorderCard delay={0.08} tilt={tilt}>
            <div className="relative p-5 sm:p-6 md:p-7 h-full">
              <div className="absolute top-4 right-4 font-heading text-[50px] sm:text-[60px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">02</div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xl text-[#a78bfa]/40">◈</motion.div>
                  <EQMeter />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#a78bfa]/80 transition-colors duration-500 tracking-tight">Emotionally Aware</h3>
                <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed flex-1 group-hover:text-white/30 transition-colors duration-500">Detects sentiment shifts in real-time. Adjusts tone, pacing, and vocabulary like a real person would.</p>
              </div>
            </div>
          </GradientBorderCard>

          <GradientBorderCard delay={0.14} tilt={tilt}>
            <div className="relative p-5 sm:p-6 md:p-7 h-full">
              <div className="absolute top-4 right-4 font-heading text-[50px] sm:text-[60px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">03</div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <motion.div whileHover={{ rotate: 15, scale: 1.2 }} className="text-xl text-[#a78bfa]/40 cursor-default">⬡</motion.div>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/15 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  </motion.div>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#a78bfa]/80 transition-colors duration-500 tracking-tight">WhatsApp Native</h3>
                <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed flex-1 group-hover:text-white/30 transition-colors duration-500">Deployed directly on WhatsApp — zero downloads, zero friction. Meet customers where they are.</p>
              </div>
            </div>
          </GradientBorderCard>

          <GradientBorderCard delay={0.2} tilt={tilt}>
            <div className="relative p-5 sm:p-6 md:p-7 h-full">
              <div className="absolute top-4 right-4 font-heading text-[50px] sm:text-[60px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">04</div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <motion.div whileHover={{ rotate: 20, scale: 1.2 }} className="text-xl text-[#a78bfa]/40 cursor-default">◎</motion.div>
                  <OrbitDots />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#a78bfa]/80 transition-colors duration-500 tracking-tight">Multi-Domain Expert</h3>
                <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed flex-1 group-hover:text-white/30 transition-colors duration-500">Customer service, sales, healthcare, luxury — domain-trained for any industry.</p>
              </div>
            </div>
          </GradientBorderCard>

          <GradientBorderCard delay={0.26} className="sm:col-span-1 lg:col-span-1" tilt={tilt}>
            <div className="relative p-5 sm:p-6 md:p-7 h-full">
              <div className="absolute top-4 right-4 font-heading text-[50px] sm:text-[60px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">05</div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} className="text-xl text-[#a78bfa]/40">◬</motion.div>
                  <InfinityLoop />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#a78bfa]/80 transition-colors duration-500 tracking-tight">Self-Evolving</h3>
                <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed flex-1 group-hover:text-white/30 transition-colors duration-500">Gets smarter with every conversation. Continuously learning and adapting.</p>
              </div>
            </div>
          </GradientBorderCard>

          <GradientBorderCard delay={0.32} className="sm:col-span-2" tilt={tilt}>
            <div className="relative p-5 sm:p-6 md:p-7">
              <div className="absolute top-4 right-4 font-heading text-[50px] sm:text-[60px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">06</div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <LockPulse />
                <div className="flex-1">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#a78bfa]/80 transition-colors duration-500 tracking-tight">Enterprise Secure</h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-white/20 leading-relaxed group-hover:text-white/30 transition-colors duration-500">End-to-end encryption. Custom deployment. Built for businesses that demand military-grade security and full compliance.</p>
                </div>
                <pre className="text-[7px] text-[#a78bfa]/[0.04] font-mono leading-tight select-none hidden md:block group-hover:text-[#a78bfa]/[0.08] transition-colors duration-700">
{`╔═══════════════════╗
║  ◈ ENCRYPTED ◈   ║
║  AES-256 / TLS    ║
╚═══════════════════╝`}
                </pre>
              </div>
            </div>
          </GradientBorderCard>
        </div>
      </div>
    </section>
  );
}
