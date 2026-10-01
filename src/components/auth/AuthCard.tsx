import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register' | 'forgot-password' | 'callback';
  onTabChange?: (tab: 'login' | 'register') => void;
  className?: string;
  showTabs?: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  activeTab = 'login',
  onTabChange,
  className = '',
  showTabs = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-[430px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(12, 14, 25, 0.84)',
          backdropFilter: 'blur(34px)',
          WebkitBackdropFilter: 'blur(34px)',
          border: '1px solid rgba(168, 85, 247, 0.42)',
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.92), 0 0 55px rgba(168, 85, 247, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`relative w-full rounded-[28px] p-7 sm:p-8 select-none overflow-hidden ${className}`}
      >
        {/* Dynamic Specular Glare following mouse in 3D */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300 group-hover:opacity-60"
          style={{
            background: `radial-gradient(circle 280px at ${glareX} ${glareY}, rgba(168, 85, 247, 0.35), transparent 70%)`,
          }}
        />

        {/* Top Specular Rim */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(168, 85, 247, 0.8) 50%, transparent 95%)',
          }}
        />

        {/* Centered Brand Header matching reference image */}
        <div className="flex flex-col items-center justify-center space-y-1 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-[0_0_18px_rgba(168,85,247,0.55)]">
              {/* Waveform icon: 5 vertical sound bars */}
              <div className="flex items-center gap-[2.5px] h-3.5">
                <span className="w-[2.5px] h-2 bg-white rounded-full" />
                <span className="w-[2.5px] h-3 bg-white rounded-full" />
                <span className="w-[2.5px] h-3.5 bg-white rounded-full" />
                <span className="w-[2.5px] h-3 bg-white rounded-full" />
                <span className="w-[2.5px] h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <span
              className="text-[21px] font-black text-white tracking-[0.05em] uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SONVÉRA
            </span>
          </div>
          <div className="text-[10px] tracking-[0.25em] text-[#94A3B8] uppercase font-semibold pt-0.5">
            YOUR MUSIC. GLOBAL REACH.
          </div>
        </div>

        {/* Segmented Pill Switcher [ Log In | Sign Up ] matching reference image */}
        {showTabs && (activeTab === 'login' || activeTab === 'register') && (
          <div className="w-full bg-[#0E101D] p-1 rounded-full border border-white/10 flex items-center mb-5 h-11">
            <button
              type="button"
              onClick={() => onTabChange?.('login')}
              className={`flex-1 h-full flex items-center justify-center text-[13px] font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => onTabChange?.('register')}
              className={`flex-1 h-full flex items-center justify-center text-[13px] font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
};
