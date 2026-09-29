import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface AuthVisualProps {
  mode: 'login' | 'register';
}

export const AuthVisual: React.FC<AuthVisualProps> = ({ mode }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Symmetrical dual-sided waveform heights matching Image 2
  // Tall in the center, tapering smoothly to ends
  const waveformBars = [
    14, 20, 28, 38, 50, 36, 58, 72, 85, 68, 92, 100, 88, 100, 94, 98, 86, 74, 62, 70, 52, 44, 34, 26, 20, 14, 10,
  ];

  return (
    <div className="w-full flex flex-col justify-center select-none py-2">
      {mode === 'login' ? (
        /* ================= LOGIN HERO EXPERIENCE (IMAGE 2) ================= */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8 max-w-xl"
        >
          {/* Main Headline matching Image 2 */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-display">
              INDEPENDENT <br />
              <span className="text-[#A855F7]">MUSIC.</span> GLOBAL REACH.
            </h1>
            <p className="text-sm sm:text-base text-[#C5C8D4] leading-relaxed max-w-lg font-normal">
              Distribute your music to the world&apos;s leading platforms. Keep your rights. Grow your audience.
            </p>
          </div>

          {/* Symmetrical Audio Waveform Player directly on artwork matching Image 2 */}
          <div className="flex items-center space-x-4 max-w-md py-1">
            {/* Circular purple play button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-[0_0_22px_rgba(168,85,247,0.5)] shrink-0 focus:outline-none"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </motion.button>

            {/* Timestamp 00:00 */}
            <span className="text-xs font-mono text-[#969AA3] shrink-0 font-medium">
              00:00
            </span>

            {/* Symmetrical Dual-Sided Waveform Visualizer */}
            <div className="flex-1 flex items-center justify-between space-x-1 h-12 px-2 overflow-hidden">
              {waveformBars.map((val, i) => {
                return (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            scaleY: [0.6, 1.35, 0.5, 1.15, 0.6],
                            opacity: [0.75, 1, 0.7, 1, 0.75],
                          }
                        : { scaleY: 0.25, opacity: 0.35 }
                    }
                    transition={{
                      duration: 1.0 + (i % 5) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (i * 0.04) % 0.6,
                    }}
                    className="w-[3px] rounded-full shrink-0"
                    style={{
                      height: `${val}%`,
                      background:
                        'linear-gradient(180deg, #EC4899 0%, #A855F7 50%, #8B5CF6 100%)',
                      boxShadow: isPlaying ? '0 0 8px rgba(168,85,247,0.5)' : 'none',
                      transformOrigin: 'center center',
                    }}
                  />
                );
              })}
            </div>

            {/* Timestamp 03:24 */}
            <span className="text-xs font-mono text-[#969AA3] shrink-0 font-medium">
              03:24
            </span>
          </div>

          {/* Industry Metrics Row matching Image 2 */}
          <div className="flex items-center space-x-8 max-w-lg pt-4 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">50K+</div>
              <div className="text-xs text-[#969AA3] mt-1 font-normal">Creators Worldwide</div>
            </div>

            <div className="pl-6 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">180+</div>
              <div className="text-xs text-[#969AA3] mt-1 font-normal">Countries</div>
            </div>

            <div className="pl-6 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">10M+</div>
              <div className="text-xs text-[#969AA3] mt-1 font-normal">Tracks Distributed</div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ================= REGISTER HERO EXPERIENCE (IMAGE 2) ================= */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8 max-w-xl"
        >
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-[#F5F3EE] font-serif tracking-wide">
              Music
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-widest uppercase font-display">
              WITHOUT LIMITS
            </h1>
          </div>

          {/* 5 Stacked Artist & Release Visual Cards matching Image 2 */}
          <div className="flex items-center space-x-3 pt-1 overflow-hidden">
            {[
              { name: 'Producer', genre: 'Synthwave', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=180&q=80' },
              { name: 'Vocalist', genre: 'R&B / Soul', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=180&q=80' },
              { name: 'DJ Set', genre: 'Electronic', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=180&q=80' },
              { name: 'Solo Act', genre: 'Ambient', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=180&q=80' },
              { name: 'Band', genre: 'Alt-Pop', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=180&q=80' },
            ].map((art, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.04 }}
                className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden border border-white/15 shadow-lg relative group shrink-0 transition-all duration-300"
              >
                <img src={art.img} alt={art.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>

          <div className="text-xs font-mono tracking-widest text-[#969AA3] uppercase font-semibold">
            JOIN A GLOBAL COMMUNITY OF CREATORS.
          </div>
        </motion.div>
      )}
    </div>
  );
};
