import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioWaveform } from './AudioWaveform';

interface CinematicLeftPanelProps {
  mode: 'login' | 'register';
}

export const CinematicLeftPanel: React.FC<CinematicLeftPanelProps> = ({ mode }) => {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between px-10 py-10 xl:px-14 xl:py-12 select-none z-10">
      {/* ================= TOP: BRAND WORDMARK ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-1.5"
      >
        <div
          className="text-lg sm:text-xl xl:text-[22px] font-bold text-[#F8F7F4] tracking-[0.32em] uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          S O N V É R A
        </div>
        <div className="text-[9px] font-mono tracking-[0.28em] text-[#A7A9B3]/80 uppercase font-semibold">
          MAKE MUSIC. MOVE CULTURE.
        </div>
      </motion.div>

      {/* ================= CENTER: HERO EDITORIAL CONTENT ================= */}
      <div className="flex-1 flex flex-col justify-center max-w-lg py-6">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            /* ===== LOGIN: 01 MUSIC WITHOUT LIMITS ===== */
            <motion.div
              key="login-hero"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Index Tag */}
              <div className="flex items-center space-x-3 text-[11px] font-mono text-violet-400/90 font-semibold tracking-widest">
                <span>01</span>
                <span className="w-10 h-px bg-violet-500/40" />
              </div>

              {/* Headline */}
              <h1
                className="text-[42px] sm:text-[48px] xl:text-[56px] font-extrabold text-[#F8F7F4] tracking-tight leading-[1.05]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                MUSIC<br />
                WITHOUT<br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #A855F7, #C084FC, #8B5CF6)',
                    filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.45))',
                  }}
                >
                  LIMITS.
                </span>
              </h1>

              {/* Supporting Copy */}
              <div className="space-y-0.5">
                <p className="text-sm text-[#D0D2DC] font-normal">Distribute. Monetize. Grow.</p>
                <p className="text-sm text-[#A7A9B3]">All in one place.</p>
              </div>

              {/* Audio Waveform */}
              <div className="pt-1">
                <AudioWaveform isAnimated={true} />
              </div>
            </motion.div>
          ) : (
            /* ===== SIGNUP: 02 FOR CREATORS BY CREATORS ===== */
            <motion.div
              key="signup-hero"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Index Tag */}
              <div className="flex items-center space-x-3 text-[11px] font-mono text-violet-400/90 font-semibold tracking-widest">
                <span>02</span>
                <span className="w-10 h-px bg-violet-500/40" />
              </div>

              {/* Headline */}
              <h1
                className="text-[42px] sm:text-[48px] xl:text-[56px] font-extrabold text-[#F8F7F4] tracking-tight leading-[1.05]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                FOR<br />
                CREATORS<br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #A855F7, #C084FC, #8B5CF6)',
                    filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.45))',
                  }}
                >
                  BY CREATORS.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm text-[#D0D2DC] font-normal leading-relaxed">
                Join a global community of independent artists.
              </p>

              {/* 3 Floating Artist Cards */}
              <div className="flex items-center space-x-3 pt-1">
                {[
                  {
                    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80',
                    rotate: -3,
                  },
                  {
                    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
                    rotate: 0,
                  },
                  {
                    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80',
                    rotate: 3,
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6, scale: 1.06 }}
                    className="w-20 h-28 sm:w-[88px] sm:h-[120px] rounded-xl overflow-hidden shrink-0 relative group"
                    style={{
                      transform: `rotate(${card.rotate}deg)`,
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                      boxShadow: '0 8px 28px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <img
                      src={card.img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(8,10,16,0.85), transparent 60%)',
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Audio Waveform */}
              <div className="pt-1">
                <AudioWaveform isAnimated={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= BOTTOM: TRUST ROW ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-[9px] font-mono tracking-[0.15em] text-[#A7A9B3]/70 uppercase font-semibold">
          TRUSTED BY INDEPENDENT ARTISTS WORLDWIDE
        </div>
        <div className="flex items-center space-x-5 text-[11px] text-white/80 font-medium">
          {/* Spotify */}
          <span className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-3.5 h-3.5 fill-current text-[#1db954]" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
            </svg>
            <span>Spotify</span>
          </span>
          {/* Apple Music */}
          <span className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
            </svg>
            <span>Music</span>
          </span>
          {/* YouTube */}
          <span className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-default">
            <svg className="w-4 h-3 fill-current text-[#ff0000]" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </span>
          {/* Amazon Music */}
          <span className="hover:text-white transition-colors cursor-default font-semibold tracking-tight text-[10px] lowercase">
            amazon music
          </span>
        </div>
      </motion.div>
    </div>
  );
};
