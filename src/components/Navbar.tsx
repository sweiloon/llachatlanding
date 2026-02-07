'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Agents', href: '#agents' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#050505]/70 backdrop-blur-2xl border-b border-white/[0.04]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00f3ff] to-[#0284c7] flex items-center justify-center text-black font-bold text-sm"
            >
              L
            </motion.div>
            <span className="font-heading font-bold text-lg tracking-tight">
              LLa<span className="text-[#00f3ff]">chat</span>
              <span className="text-white/15 ml-1 text-[9px] font-mono tracking-widest">AI</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <a href={l.href} className="relative px-3.5 py-2 text-white/35 hover:text-white/80 text-[13px] font-medium transition-colors duration-300 group">
                  {l.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#00f3ff] transition-all duration-300 group-hover:w-2/3 rounded-full" />
                </a>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <a href="#agents" className="ml-3 px-5 py-2 rounded-full text-[13px] font-bold text-black bg-[#00f3ff] hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] transition-all duration-300 font-heading">
                Try Now
              </a>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden relative w-10 h-10 flex items-center justify-center" onClick={() => setOpen(!open)}>
            <div className="relative w-5 h-3.5">
              <span className={`absolute left-0 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-5 top-1/2 -translate-y-1/2 rotate-45' : 'w-5 top-0'}`} />
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-3 opacity-100'}`} />
              <span className={`absolute left-0 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-5 top-1/2 -translate-y-1/2 -rotate-45' : 'w-5 bottom-0'}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/[0.98] backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href={l.href} onClick={() => setOpen(false)} className="block text-3xl sm:text-4xl font-heading font-bold text-white/50 hover:text-white py-3 transition-colors">
                  {l.label}
                </a>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8"
            >
              <a href="#agents" onClick={() => setOpen(false)} className="px-8 py-3.5 rounded-full text-base font-heading font-bold text-black bg-[#00f3ff]">
                Try Now
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
