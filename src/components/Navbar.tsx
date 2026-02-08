'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Lang } from '@/lib/i18n';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const links = [
    { label: t.nav.agents, href: '#agents' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.how, href: '#how' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggleLang = () => setLang(lang === 'en' ? 'zh' : 'en');

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#050505]/70 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo — text only */}
          <a href="#" className="flex items-center gap-1 group">
            <span className="font-display font-bold text-xl tracking-tight">
              LLa<span className="text-gradient">chat</span>
              <span className="text-white/15 ml-1.5 text-[9px] font-mono tracking-widest align-super">AI</span>
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
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#a78bfa] transition-all duration-300 group-hover:w-2/3 rounded-full" />
                </a>
              </motion.div>
            ))}

            {/* Language toggle — segmented control */}
            <LanguageToggle lang={lang} toggleLang={toggleLang} delay={0.55} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <a href="#agents" className="ml-3 px-5 py-2 rounded-full text-[13px] font-bold text-white btn-glossy font-heading">
                {t.nav.tryNow}
              </a>
            </motion.div>
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle lang={lang} toggleLang={toggleLang} delay={0.3} />
            <button className="relative w-10 h-10 flex items-center justify-center" onClick={() => setOpen(!open)}>
              <div className="relative w-5 h-3.5">
                <span className={`absolute left-0 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-5 top-1/2 -translate-y-1/2 rotate-45' : 'w-5 top-0'}`} />
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-3 opacity-100'}`} />
                <span className={`absolute left-0 h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-5 top-1/2 -translate-y-1/2 -rotate-45' : 'w-5 bottom-0'}`} />
              </div>
            </button>
          </div>
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
              <a href="#agents" onClick={() => setOpen(false)} className="px-8 py-3.5 rounded-full text-base font-heading font-bold text-white btn-glossy">
                {t.nav.tryNow}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Language Toggle (Apple-style segmented control) ─── */
function LanguageToggle({ lang, toggleLang, delay }: { lang: Lang; toggleLang: () => void; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <button
        onClick={toggleLang}
        className="relative flex items-center gap-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] p-[3px] backdrop-blur-sm hover:border-white/[0.15] transition-all duration-300"
      >
        <span className={`px-2 py-1 rounded-full text-[10px] font-mono font-medium transition-all duration-300 ${
          lang === 'en' ? 'bg-[#a78bfa]/20 text-white/70 shadow-sm shadow-[#a78bfa]/10' : 'text-white/25'
        }`}>
          EN
        </span>
        <span className={`px-2 py-1 rounded-full text-[10px] font-mono font-medium transition-all duration-300 ${
          lang === 'zh' ? 'bg-[#a78bfa]/20 text-white/70 shadow-sm shadow-[#a78bfa]/10' : 'text-white/25'
        }`}>
          中
        </span>
      </button>
    </motion.div>
  );
}
