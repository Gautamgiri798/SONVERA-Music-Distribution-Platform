import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

interface PrimaryButtonProps {
  type?: 'submit' | 'button';
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  status?: 'idle' | 'loading' | 'success' | 'error';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = 'submit',
  label,
  loadingLabel = 'PROCESSING...',
  successLabel = '✓ COMPLETED',
  status = 'idle',
  onClick,
  disabled = false,
  className = '',
}) => {
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading || isSuccess}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      style={{
        height: '48px',
        borderRadius: '9999px',
        background: isSuccess
          ? '#35E59A'
          : 'linear-gradient(90deg, #A855F7 0%, #8B5CF6 45%, #38BDF8 100%)',
        color: isSuccess ? '#080A10' : '#FFFFFF',
        boxShadow: isSuccess
          ? '0 0 30px rgba(53, 229, 154, 0.35)'
          : '0 0 25px rgba(168, 85, 247, 0.4), 0 6px 20px rgba(56, 189, 248, 0.2)',
      }}
      className={`relative w-full font-bold text-[13.5px] transition-all duration-300 flex items-center justify-center space-x-2 border-none cursor-pointer overflow-hidden group select-none ${className} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {/* Subtle Shimmer */}
      <div
        className="absolute inset-0 w-1/2 h-full pointer-events-none animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />

      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>{loadingLabel}</span>
        </div>
      ) : isSuccess ? (
        <div className="flex items-center space-x-2 font-extrabold">
          <Check className="w-4 h-4 stroke-3" />
          <span>{successLabel}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1.5 z-10 font-bold">
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      )}
    </motion.button>
  );
};
