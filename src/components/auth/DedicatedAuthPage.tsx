import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Globe, DollarSign, ShieldCheck } from 'lucide-react';
import { ThreeAudioRibbonCanvas } from './ThreeAudioRibbonCanvas';
import { LoginSection } from './LoginSection';
import { SignupSection } from './SignupSection';

interface DedicatedAuthPageProps {
  onEnterDashboard?: (email?: string) => void;
  onBackToLanding?: () => void;
  initialTab?: 'login' | 'register';
  onEnterAdmin?: () => void;
}

export const DedicatedAuthPage: React.FC<DedicatedAuthPageProps> = ({
  onEnterDashboard,
  onBackToLanding,
  initialTab = 'login',
  onEnterAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Artist avatars for social proof
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  ];

  // Sync escape key to close back to landing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBackToLanding) {
        onBackToLanding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToLanding]);

  const handleLoginSuccess = (email: string) => {
    onEnterDashboard?.(email);
  };

  const handleSignupSuccess = (data: { email: string; firstName: string; lastName: string }) => {
    onEnterDashboard?.(data.email);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070B] text-[#F8F7F4] font-sans select-none flex flex-col overflow-y-auto">
      {/* ================= FULL-BLEED SEAMLESS CINEMATIC BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Continuous Singer Photography framed smoothly across the left-center */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/auth/sonvera_artist_singer.jpg')",
            backgroundPosition: '32% center',
            filter: 'brightness(0.85) contrast(1.18) saturate(1.22)',
          }}
        />

        {/* Soft, Continuous Directional Vignette (Smooth gradient without harsh dividing split) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6,7,11,0.96) 0%, rgba(6,7,11,0.85) 30%, rgba(6,7,11,0.3) 52%, rgba(6,7,11,0.88) 72%, #06070B 98%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,7,11,0.85) 0%, rgba(6,7,11,0.1) 25%, rgba(6,7,11,0.35) 75%, #06070B 100%)',
          }}
        />

        {/* Real-Time Three.js Soundwave Filaments */}
        <div className="absolute inset-0 opacity-70">
          <ThreeAudioRibbonCanvas />
        </div>

        {/* Ambient Studio Glows */}
        <div
          className="absolute top-1/4 right-[25%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(124, 58, 237, 0.15)' }}
        />
        <div
          className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(56, 189, 248, 0.12)' }}
        />
      </div>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="w-full h-[72px] px-6 sm:px-10 xl:px-14 flex items-center justify-between border-b border-white/[0.08] bg-[#06070B]/80 backdrop-blur-2xl sticky top-0 z-50 shrink-0">
        {/* Brand */}
        <div
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Back to Landing Page"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-400 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-transform">
            <div className="flex items-center gap-[2.5px] h-3.5">
              <span className="w-[2px] h-2 bg-white rounded-full animate-pulse" />
              <span className="w-[2px] h-3.5 bg-white rounded-full" />
              <span className="w-[2px] h-4 bg-white rounded-full" />
              <span className="w-[2px] h-3 bg-white rounded-full" />
              <span className="w-[2px] h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <span
            className="text-[20px] font-black tracking-wider text-white uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SONVÉRA
          </span>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#94A3B8]">
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-white hover:text-white transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            type="button"
            onClick={onBackToLanding}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={onBackToLanding}
            className="hover:text-white transition-colors cursor-pointer"
          >
            For Labels
          </button>
          <button
            type="button"
            onClick={onBackToLanding}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Resources
          </button>
        </nav>

        {/* Right CTA & Close Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`text-[13.5px] font-medium transition-colors cursor-pointer ${
              activeTab === 'login' ? 'text-white font-semibold' : 'text-[#D1D5DB] hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500 text-white text-[13px] font-semibold shadow-[0_4px_16px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_24px_rgba(124,58,237,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </button>

          {/* Dismiss Back to Landing */}
          <button
            type="button"
            onClick={onBackToLanding}
            className="p-2 rounded-full text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            title="Close and return to Landing Page (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= MAIN BALANCED STAGE ================= */}
      <div className="flex-1 w-full max-w-[1500px] mx-auto px-6 sm:px-10 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center min-h-[calc(100vh-130px)] py-8 relative z-10">
        {/* ================= LEFT EDITORIAL SHOWCASE (Cols 1-7) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 max-w-[540px]">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11.5px] font-bold text-violet-200 tracking-wider uppercase">
              Official Artist Workspace
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1
              className="text-[44px] sm:text-[54px] xl:text-[62px] font-black text-white tracking-tight leading-[0.96]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MUSIC<br />
              WITHOUT<br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #38BDF8 100%)',
                  filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.65))',
                }}
              >
                LIMITS.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-1.5"
          >
            <p className="text-[16px] text-[#E2E8F0] font-semibold leading-relaxed">
              Distribute worldwide to 150+ digital streaming platforms.
            </p>
            <p className="text-[14px] text-[#94A3B8] leading-relaxed">
              Retain 100% of your royalties, sound recording copyrights, and creative autonomy with automated DDEX ERN 4.3 delivery.
            </p>
          </motion.div>

          {/* Feature Highlight Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-2 gap-3 pt-1"
          >
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-sky-400 text-[12px] font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>150+ DSP Partners</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1 leading-snug">
                Spotify, Apple Music, TikTok, Tidal, Amazon & YouTube.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>100% Royalties</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1 leading-snug">
                Keep all streaming revenue with direct split payouts.
              </div>
            </div>
          </motion.div>

          {/* Social Proof & Live Metrics */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {avatars.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-[#06070B] object-cover shadow-md"
                  />
                ))}
              </div>
              <div className="text-[12px] leading-tight">
                <span className="font-bold text-white block">Trusted by 50,000+ Artists</span>
                <span className="text-[#94A3B8] font-normal">$14.8M+ Distributed in 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-[#CBD5E1]">Daily Velocity:</span>
              <span className="text-[11px] font-black text-emerald-400">^ +248%</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT AUTH CARD (Cols 8-12) ================= */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login-section"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <LoginSection
                  onSuccess={handleLoginSuccess}
                  onSwitchToSignup={() => setActiveTab('register')}
                  onEnterAdmin={onEnterAdmin}
                  showTabs={true}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup-section"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <SignupSection
                  onSuccess={handleSignupSuccess}
                  onSwitchToLogin={() => setActiveTab('login')}
                  showTabs={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= FOOTER: DSP PARTNER TICKER ================= */}
      <footer className="w-full h-14 px-6 sm:px-12 border-t border-white/[0.08] bg-[#06070B]/90 backdrop-blur-md flex items-center justify-between text-[#94A3B8] shrink-0 z-40 relative">
        <div className="flex items-center gap-6 sm:gap-9 text-xs">
          {/* Spotify */}
          <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-4 h-4 fill-current text-[#1DB954]" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
            </svg>
            <span className="font-semibold text-white">Spotify</span>
          </div>

          {/* Apple Music */}
          <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
            </svg>
            <span className="font-semibold text-white">Apple Music</span>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-4 h-3.5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="font-semibold text-white">YouTube</span>
          </div>

          {/* Amazon Music */}
          <div className="hover:text-white transition-colors cursor-default font-semibold text-xs tracking-tight text-[#E2E8F0]">
            amazon music
          </div>

          {/* Deezer */}
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-default">
            <div className="flex items-end gap-[1.5px] h-3">
              <span className="w-[1.5px] h-1.5 bg-[#FF0092] rounded-full" />
              <span className="w-[1.5px] h-3 bg-[#A855F7] rounded-full" />
              <span className="w-[1.5px] h-2 bg-[#38BDF8] rounded-full" />
            </div>
            <span className="font-semibold text-white">deezer</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#64748B]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>DDEX ERN 4.3 Production Ingestion Active</span>
        </div>
      </footer>
    </div>
  );
};
