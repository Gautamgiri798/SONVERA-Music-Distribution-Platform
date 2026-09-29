import React from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  className?: string;
  isAnimated?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  className = '',
  isAnimated = true,
}) => {
  // Symmetrical waveform spectrum — peaks in center, tapers at edges
  const barHeights = [
    10, 14, 20, 28, 40, 30, 48, 65, 80, 68, 88, 100, 85, 100, 92, 95, 82, 70, 58, 65, 48, 38, 28, 20, 15, 12, 8,
  ];

  return (
    <div className={`flex items-center space-x-[3px] h-10 py-1 select-none opacity-90 ${className}`}>
      {barHeights.map((h, i) => (
        <motion.span
          key={i}
          animate={
            isAnimated
              ? {
                  scaleY: [0.6, 1.25, 0.4, 1.1, 0.6],
                  opacity: [0.7, 1, 0.65, 1, 0.7],
                }
              : { scaleY: 0.3, opacity: 0.3 }
          }
          transition={{
            duration: 1.15 + (i % 5) * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i * 0.04) % 0.55,
          }}
          className="w-[2px] rounded-full shrink-0"
          style={{
            height: `${h}%`,
            background:
              'linear-gradient(180deg, rgba(236,72,153,0.9) 0%, rgba(168,85,247,1) 50%, rgba(139,92,246,0.9) 100%)',
            boxShadow: '0 0 6px rgba(168,85,247,0.4)',
            transformOrigin: 'center center',
          }}
        />
      ))}
    </div>
  );
};
