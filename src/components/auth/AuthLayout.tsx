import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CinematicLeftPanel,
  CardYourMusicEverywhere,
  CardStreamGrowth,
} from './CinematicLeftPanel';
import { ThreeAudioRibbonCanvas } from './ThreeAudioRibbonCanvas';

interface AuthLayoutProps {
  mode: 'login' | 'register' | 'forgot-password' | 'callback';
  children: React.ReactNode;
  onClose?: () => void;
  onNavigateMode?: (mode: 'login' | 'register') => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  mode,
  children,
  onClose,
  onNavigateMode,
}) => {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden font-sans select-none"
      style={{
        backgroundColor: '#06070B',
        color: '#F8F7F4',
      }}
    >
      {/* ================= FIXED TOP NAVBAR matching reference mock ================= */}
      <header className="fixed top-0 left-0 right-0 h-[70px] px-6 sm:px-12 xl:px-16 flex items-center justify-between border-b border-white/[0.06] bg-[#06070B]/80 backdrop-blur-xl z-50">
        {/* Left: Brand Logo & Wordmark */}
        <div
          onClick={onClose}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Back to SONVÉRA Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.55)] group-hover:scale-105 transition-transform">
            <div className="flex items-center gap-[2.5px] h-3.5">
              <span className="w-[2.5px] h-2 bg-white rounded-full" />
              <span className="w-[2.5px] h-3 bg-white rounded-full" />
              <span className="w-[2.5px] h-3.5 bg-white rounded-full" />
              <span className="w-[2.5px] h-3 bg-white rounded-full" />
              <span className="w-[2.5px] h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <span
            className="text-[20px] font-black tracking-wider text-white uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SONVÉRA
          </span>
        </div>

        {/* Center: Nav links matching reference mock */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#94A3B8]">
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-white transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-white transition-colors cursor-pointer"
          >
            For Labels
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Resources
          </button>
        </nav>

        {/* Right: Actions matching reference mock */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => onNavigateMode?.('login')}
            className={`text-[13.5px] font-medium transition-colors cursor-pointer ${
              mode === 'login' ? 'text-white font-semibold' : 'text-[#D1D5DB] hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => onNavigateMode?.('register')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#38BDF8] text-white text-[13px] font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ================= CINEMATIC BACKGROUND WITH 3D THREE.JS WEBGL VISUALIZER ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Background Singer Photo centered with microphone and face visible */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/assets/auth/sonvera_artist_singer.jpg')",
            backgroundPosition: '40% center',
            filter: 'brightness(0.88) contrast(1.12) saturate(1.22)',
          }}
        />

        {/* Left-to-right gradient: deep black behind left text, clear over singer, vignette on right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #06070B 0%, rgba(6,7,11,0.96) 24%, rgba(6,7,11,0.35) 48%, rgba(6,7,11,0.6) 72%, #06070B 98%)',
          }}
        />

        {/* Top and bottom vertical vignettes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,7,11,0.85) 0%, rgba(6,7,11,0.1) 25%, rgba(6,7,11,0.15) 75%, #06070B 100%)',
          }}
        />

        {/* ================= THREE.JS 3D AUDIO RIBBONS & PARTICLES CANVAS ================= */}
        <ThreeAudioRibbonCanvas />

        {/* Ambient Studio Light Glows */}
        <div
          className="absolute top-1/3 right-[22%] w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'rgba(139, 92, 246, 0.22)' }}
        />
        <div
          className="absolute bottom-1/4 right-[10%] w-[380px] h-[380px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'rgba(56, 189, 248, 0.12)' }}
        />
      </div>

      {/* ================= MAIN VIEWPORT: WIDESCREEN HERO & AUTH LAYOUT ================= */}
      <div className="relative z-20 w-full min-h-screen pt-20 pb-8 flex items-center justify-between px-6 sm:px-12 xl:px-20 max-w-[1560px] mx-auto">
        {/* LEFT COLUMN: Hero content & DSP logos */}
        <div className="hidden lg:block w-[420px] xl:w-[460px] shrink-0 z-30">
          <CinematicLeftPanel
            mode={mode === 'register' ? 'register' : 'login'}
            onStartSignUp={() => onNavigateMode?.('register')}
          />
        </div>

        {/* CENTER FLOATING CARDS (Positioned over the singer artwork, matching reference mock) */}
        <div className="hidden lg:block pointer-events-none z-30">
          {/* Card 1: Your Music Everywhere */}
          <div className="absolute left-[44%] xl:left-[46%] top-[48%] -translate-y-1/2 pointer-events-auto">
            <CardYourMusicEverywhere />
          </div>

          {/* Card 2: Stream Growth */}
          <div className="absolute left-[36%] xl:left-[38%] top-[72%] -translate-y-1/2 pointer-events-auto">
            <CardStreamGrowth />
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Card with 3D tilt */}
        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end z-30">
          <AnimatePresence mode="wait">
            <div key={mode} className="w-full max-w-[430px] flex justify-center lg:justify-end">
              {children}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
