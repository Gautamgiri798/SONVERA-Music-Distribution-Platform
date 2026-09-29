import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.97 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative w-full max-w-[420px] rounded-2xl p-7 sm:p-8 select-none overflow-hidden ${className}`}
      style={{
        background: 'rgba(8, 10, 17, 0.84)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          '0 30px 80px -12px rgba(0, 0, 0, 0.9), 0 0 60px -15px rgba(139, 92, 246, 0.2)',
      }}
    >
      {/* Top Specular Rim */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.2) 50%, transparent 95%)',
        }}
      />

      {/* Centered Brand Wordmark */}
      <div className="text-center pb-4">
        <span
          className="text-[12px] font-bold text-[#F8F7F4]/90 tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          S O N V É R A
        </span>
      </div>

      {children}
    </motion.div>
  );
};
