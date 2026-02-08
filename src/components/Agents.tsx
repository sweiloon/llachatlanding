'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

const agents = [
  {
    name: 'Eva',
    role: 'Customer Engagement Specialist',
    type: 'EMPATHY_ENGINE',
    personality: 'Warm, empathetic, and deeply knowledgeable. Eva builds genuine rapport — your customers will feel truly heard.',
    specialties: ['Customer Support', 'Sales Conversion', 'Lead Qualification', 'After-Sales Care'],
    photo: '/eva.jpg',
    number: '60176967269',
    chat: [
      { from: 'user', text: 'Hi, not sure this product is right for me...' },
      { from: 'agent', text: "Hey! I totally get that — tell me what you need and I'll give my honest take 😊" },
      { from: 'user', text: 'That would be great!' },
    ],
  },
  {
    name: 'Ashly',
    role: 'Lifestyle & Companion Agent',
    type: 'CONVERSION_EXPERT',
    personality: 'Fun, witty, and perceptive. Ashly feels like chatting with your most interesting friend — always on point.',
    specialties: ['Lifestyle Advice', 'Companion Chat', 'Recommendations', 'Brand Ambassador'],
    photo: '/ashly.jpg',
    number: '60174035203',
    chat: [
      { from: 'user', text: 'Heyy what do you think about this combo?' },
      { from: 'agent', text: "Okay I love where you're going! But try swapping the shoes? 👀" },
      { from: 'user', text: 'Omg yes you\'re right!' },
    ],
  },
];

function AgentCard({ agent, index }: { agent: typeof agents[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className="group relative rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-colors duration-700 hover:border-white/[0.1]"
    >
      {/* Spotlight glow following cursor */}
      {hovering && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167,139,250,0.06), transparent 60%)`,
          }}
        />
      )}

      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-[#a78bfa]/15 transition-all duration-700" />

      <div className="relative z-10 p-5 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 sm:gap-5 mb-5">
          {/* Circular photo */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#a78bfa]/15 ring-offset-2 ring-offset-[#050505]"
          >
            <Image src={agent.photo} alt={agent.name} fill className="object-cover" sizes="80px" />
            {/* Online dot */}
            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
            </div>
          </motion.div>

          <div className="min-w-0 pt-1">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">{agent.name}</h3>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#a78bfa]/30 tracking-[0.15em] mt-0.5">{agent.type}</p>
            <p className="text-xs sm:text-sm text-white/25 mt-1">{agent.role}</p>
          </div>
        </div>

        <p className="text-white/30 text-xs sm:text-sm leading-relaxed mb-4">{agent.personality}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {agent.specialties.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] bg-white/[0.03] text-white/25 border border-white/[0.05] hover:border-[#a78bfa]/15 hover:text-[#a78bfa]/50 transition-all duration-300 cursor-default"
            >
              {s}
            </motion.span>
          ))}
        </div>

        {/* Chat preview */}
        <div className="rounded-xl bg-black/20 border border-white/[0.04] p-3 sm:p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/20 animate-pulse" />
            <span className="font-mono text-[8px] sm:text-[9px] text-white/10 tracking-[0.2em] uppercase">Live Preview</span>
          </div>
          <div className="space-y-2">
            {agent.chat.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.from === 'user' ? 20 : -20, scale: 0.95 }}
                animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-[11px] sm:text-xs leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-white/[0.06] text-white/35 rounded-br-md'
                    : 'bg-[#a78bfa]/[0.04] text-white/40 rounded-bl-md border border-[#a78bfa]/[0.06]'
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {/* Typing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.8 }}
              className="flex gap-1 px-3 py-1.5"
            >
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/15 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* WhatsApp CTA — Glossy style */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl sm:rounded-2xl overflow-hidden"
        >
          <a
            href={`https://wa.me/${agent.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glossy group/btn relative flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 font-heading font-semibold text-xs sm:text-sm overflow-hidden"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with {agent.name}
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>→</motion.span>
            <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover/btn:left-[200%] transition-all duration-700" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Agents() {
  return (
    <section id="agents" className="relative z-10 py-16 sm:py-24 md:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#a78bfa]/30 tracking-[0.3em] uppercase">001</span>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px flex-1 bg-gradient-to-r from-[#a78bfa]/10 to-transparent origin-left" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight"
        >
          Meet the <span className="text-gradient">Agents</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-white/20 text-sm sm:text-base max-w-lg mt-3 mb-10 sm:mb-14"
        >
          Chat with them on WhatsApp — see if you can tell the difference.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {agents.map((a, i) => (
            <AgentCard key={a.name} agent={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
