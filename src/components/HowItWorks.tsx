'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Gradient border card (same pattern as Features) ─── */
function GradientCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
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
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className={`group relative p-px rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}
    >
      {/* Rotating border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="absolute inset-[-80%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'conic-gradient(from 0deg, transparent 30%, rgba(167,139,250,0.2) 38%, transparent 45%, rgba(129,140,248,0.12) 55%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 rounded-[inherit] border border-white/[0.06] group-hover:border-transparent transition-colors duration-500 pointer-events-none" />

      <div className="relative bg-[#080808] rounded-[inherit] h-full">
        {hovering && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.05), transparent 55%)`,
            }}
          />
        )}
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Animated connecting line (SVG) ─── */
function ConnectorLine({ delay }: { delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="hidden lg:flex items-center justify-center w-12 xl:w-16">
      <svg viewBox="0 0 50 20" className="w-full h-5" fill="none">
        <motion.path
          d="M0 10 H50"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
        <motion.circle
          cx="48"
          cy="10"
          r="2"
          fill="#a78bfa"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ delay: delay + 0.6 }}
        />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.15)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Step 1 Visual: Agent selector (cycling avatars) ─── */
function AgentSelector() {
  return (
    <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
      <div className="flex items-center -space-x-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, i === 1 ? 1.2 : 1.05, 1],
              borderColor: [
                'rgba(255,255,255,0.06)',
                i === 1 ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.06)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.8 }}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex items-center justify-center"
            style={{ zIndex: i === 1 ? 10 : 0 }}
          >
            <span className="text-[10px] sm:text-xs text-white/20 font-heading font-bold">
              {['E', 'A', '?'][i]}
            </span>
            {i === 1 && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border border-[#a78bfa]/20"
              />
            )}
          </motion.div>
        ))}
      </div>
      {/* Selection indicator */}
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#a78bfa]/40"
      />
    </div>
  );
}

/* ─── Step 2 Visual: Phone with WhatsApp opening ─── */
function PhoneMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full h-20 sm:h-24 flex items-center justify-center">
      <div className="relative w-14 h-[4.5rem] sm:w-16 sm:h-20 rounded-xl border border-white/[0.08] bg-black/40 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-white/[0.06]" />
        {/* WhatsApp header */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          className="absolute top-3 inset-x-1 h-3 bg-[#25D366]/15 rounded-sm origin-top"
        />
        {/* Chat lines */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.3 }}
            className={`absolute inset-x-1.5 h-[3px] rounded-full origin-left ${
              i % 2 === 0 ? 'bg-[#a78bfa]/8' : 'bg-white/[0.04] ml-auto w-2/3'
            }`}
            style={{ top: `${2.2 + i * 0.65}rem` }}
          />
        ))}
        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 1, 0] } : {}}
          transition={{ delay: 1.5, repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-2 left-1.5 flex gap-[2px]"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-[2px] h-[2px] rounded-full bg-[#a78bfa]/20" />
          ))}
        </motion.div>
      </div>
      {/* Glow behind phone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-20 h-20 rounded-full bg-[#25D366]/20 blur-xl"
        />
      </div>
    </div>
  );
}

/* ─── Step 3 Visual: Live chat bubbles ─── */
function ChatBubbles() {
  return (
    <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
      <div className="w-full max-w-[140px] space-y-1.5 px-2">
        {[
          { align: 'left', w: 'w-[70%]', color: 'bg-[#a78bfa]/[0.06]', delay: 0 },
          { align: 'right', w: 'w-[55%]', color: 'bg-white/[0.04]', delay: 0.4 },
          { align: 'left', w: 'w-[60%]', color: 'bg-[#a78bfa]/[0.06]', delay: 0.8 },
        ].map((b, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [b.align === 'left' ? -8 : 8, 0, 0, b.align === 'left' ? -8 : 8],
              scale: [0.85, 1, 1, 0.85],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              delay: b.delay,
              times: [0, 0.15, 0.75, 1],
            }}
            className={`flex ${b.align === 'right' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`${b.w} h-2.5 sm:h-3 ${b.color} rounded-full`} />
          </motion.div>
        ))}
        {/* Typing dots */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
          className="flex gap-[3px] pt-0.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
              className="w-1 h-1 rounded-full bg-[#a78bfa]/20"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
const steps = [
  {
    num: '01',
    title: 'Choose Your Agent',
    desc: 'Select the AI agent that matches your needs. Each one is domain-trained with a unique personality.',
    Visual: AgentSelector,
  },
  {
    num: '02',
    title: 'Open WhatsApp',
    desc: 'Click the chat button — instant redirect to WhatsApp. No sign-ups, no apps, no friction.',
    Visual: PhoneMockup,
  },
  {
    num: '03',
    title: 'Start Talking',
    desc: 'Say hello and experience the difference. Natural conversations that feel genuinely human.',
    Visual: ChatBubbles,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section id="how" className="relative z-10 py-16 sm:py-24 md:py-32 px-5 sm:px-8">
      <div className="section-line max-w-6xl mx-auto mb-16 sm:mb-24" />

      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a78bfa]/30 tracking-[0.3em] uppercase">004</span>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px flex-1 bg-gradient-to-r from-[#a78bfa]/10 to-transparent origin-left" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight"
        >
          How It <span className="text-gradient">Works</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/20 text-sm sm:text-base max-w-lg mt-3 mb-10 sm:mb-16"
        >
          Three steps. Zero friction. Instant conversations.
        </motion.p>

        {/* ── Steps row (horizontal on desktop, vertical on mobile) ── */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col lg:flex-row lg:items-stretch lg:flex-1">
              {/* Card */}
              <GradientCard delay={i * 0.15} className="flex-1">
                <div className="relative p-5 sm:p-6 md:p-7 h-full flex flex-col">
                  {/* BG number watermark */}
                  <div className="absolute top-3 right-4 font-heading text-[60px] sm:text-[80px] font-extrabold text-white/[0.015] leading-none select-none pointer-events-none">
                    {step.num}
                  </div>

                  {/* Visual */}
                  <div className="relative z-10 mb-4">
                    <step.Visual />
                  </div>

                  {/* Step badge */}
                  <div className="relative z-10 inline-flex items-center gap-2 mb-3">
                    <motion.div
                      animate={isInView ? { scale: [0, 1] } : {}}
                      transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 300 }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#a78bfa]/[0.06] border border-[#a78bfa]/[0.1] flex items-center justify-center font-heading text-xs sm:text-sm font-bold text-[#a78bfa]/50"
                    >
                      {step.num}
                    </motion.div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#a78bfa]/80 transition-colors duration-500">
                      {step.title}
                    </h3>
                  </div>

                  <p className="relative z-10 text-[11px] sm:text-xs text-white/20 leading-relaxed group-hover:text-white/30 transition-colors duration-500 flex-1">
                    {step.desc}
                  </p>
                </div>
              </GradientCard>

              {/* Connector (not after last card) */}
              {i < steps.length - 1 && (
                <>
                  {/* Desktop: horizontal connector */}
                  <ConnectorLine delay={0.6 + i * 0.2} />
                  {/* Mobile: vertical connector */}
                  <div className="lg:hidden flex justify-center py-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                      className="w-px h-6 bg-gradient-to-b from-[#a78bfa]/15 to-transparent origin-top"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom CTA bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-2 text-white/15 text-xs font-mono">
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/30"
            />
            Ready in under 60 seconds
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#agents"
              className="btn-glass group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-heading font-bold text-white/50 hover:text-white transition-all duration-500"
            >
              Get Started
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
