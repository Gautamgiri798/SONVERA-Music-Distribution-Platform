import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicLeftPanel } from './CinematicLeftPanel';

interface AuthLayoutProps {
  mode: 'login' | 'register' | 'forgot-password' | 'callback';
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ mode, children }) => {
  const isRegister = mode === 'register';

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden font-sans select-none"
      style={{
        backgroundColor: '#05060A',
        color: '#F8F7F4',
      }}
    >
      {/* ================= CINEMATIC BACKGROUND WITH CROSS-FADE ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Login Background: Female Singer in Neon Studio */}
        <motion.div
          animate={{ opacity: isRegister ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/auth/sonvera_artist_singer.jpg')",
            filter: 'brightness(0.55) contrast(1.15) saturate(1.2)',
          }}
        />

        {/* Register Background: Producer at Mixing Console */}
        <motion.div
          animate={{ opacity: isRegister ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/auth/sonvera_studio_producer.jpg')",
            filter: 'brightness(0.55) contrast(1.15) saturate(1.2)',
          }}
        />

        {/* Gradient Overlays - Creates Seamless Left Visual to Right Dark Composition */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,6,10,0.7) 0%, rgba(5,6,10,0.05) 30%, rgba(5,6,10,0.15) 60%, rgba(5,6,10,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,6,10,0.25) 0%, rgba(5,6,10,0.1) 20%, rgba(5,6,10,0.55) 45%, rgba(5,6,10,0.92) 60%, #05060A 80%)',
          }}
        />

        {/* Ambient Studio Light Nebula Glows */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-[22%] w-[480px] h-[480px] rounded-full blur-[140px]"
          style={{ background: 'rgba(139, 92, 246, 0.18)' }}
        />
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
          className="absolute bottom-1/4 right-[12%] w-[420px] h-[420px] rounded-full blur-[130px]"
          style={{ background: 'rgba(53, 213, 255, 0.1)' }}
        />

        {/* Floating light sparks */}
        <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-mote" />
        <div className="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-cyan-400/35 animate-mote [animation-delay:4s]" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-violet-300/30 animate-mote [animation-delay:7s]" />
      </div>

      {/* ================= MAIN VIEWPORT (48% LEFT / 52% RIGHT) ================= */}
      <div className="relative z-20 w-full min-h-screen flex">
        <div className="w-full max-w-[1440px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT PANEL: Editorial Content + Visual (hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 h-full">
            <CinematicLeftPanel mode={isRegister ? 'register' : 'login'} />
          </div>

          {/* RIGHT PANEL: Auth Card */}
          <div className="col-span-1 lg:col-span-7 xl:col-span-7 min-h-screen flex flex-col justify-center items-center px-5 py-8 sm:px-8 lg:px-14 xl:px-20">
            {/* Mobile-only Header: Logo & Tagline */}
            <div className="lg:hidden text-center pb-8 space-y-1.5">
              <div className="text-xl font-bold text-[#F8F7F4] tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                S O N V É R A
              </div>
              <div className="text-[9px] font-mono tracking-[0.3em] text-[#A7A9B3] uppercase font-semibold">
                MAKE MUSIC. MOVE CULTURE.
              </div>
            </div>

            {/* Floating Auth Card with AnimatePresence */}
            <AnimatePresence mode="wait">
              <div key={mode} className="w-full flex justify-center">
                {children}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
