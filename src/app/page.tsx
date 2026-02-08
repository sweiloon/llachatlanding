'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Agents from '@/components/Agents';
import About from '@/components/About';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

const ParticleUniverse = dynamic(() => import('@/components/ParticleUniverse'), { ssr: false });

export default function Home() {
  const [shapeName, setShapeName] = useState('Cosmos');

  const handleShapeChange = useCallback((name: string) => {
    setShapeName(name);
  }, []);

  return (
    <main className="noise relative min-h-screen bg-[#050505]">
      {/* Cursor glow (desktop only) */}
      <CursorGlow />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* 3D Particle Background */}
      <ParticleUniverse onShapeChange={handleShapeChange} audioEnabled={false} />

      {/* Nebula aurora layer — animated gradient orbs behind particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="nebula-orb-1 absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.06)_0%,transparent_70%)] blur-[80px]" />
        <div className="nebula-orb-2 absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.05)_0%,transparent_70%)] blur-[100px]" />
        <div className="nebula-orb-3 absolute bottom-[15%] left-[30%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.04)_0%,transparent_65%)] blur-[90px]" />
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.2)_0%,rgba(5,5,5,0.02)_45%,rgba(5,5,5,0.35)_100%)]" />
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#050505]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#050505]/40 to-transparent" />
      </div>

      {/* Nav */}
      <Navbar />

      {/* Hero */}
      <Hero shapeName={shapeName} />

      {/* Marquee divider */}
      <div className="relative z-10">
        <Marquee />
      </div>

      {/* Sections */}
      <div className="relative z-10">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#050505]/95 pointer-events-none" />
        <div className="relative bg-[#050505]/[0.97]">
          <Agents />
          <About />
          <Features />
          <HowItWorks />
          <Footer />
        </div>
      </div>
    </main>
  );
}
