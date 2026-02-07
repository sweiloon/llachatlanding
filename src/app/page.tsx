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

      {/* Vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.55)_0%,rgba(5,5,5,0.1)_50%,rgba(5,5,5,0.5)_100%)]" />
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#050505]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050505]/80 to-transparent" />
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
