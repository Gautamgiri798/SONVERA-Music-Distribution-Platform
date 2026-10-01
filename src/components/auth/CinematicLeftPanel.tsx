import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Radio } from 'lucide-react';

interface CinematicLeftPanelProps {
  mode?: 'login' | 'register';
  onStartSignUp?: () => void;
}

export const CinematicLeftPanel: React.FC<CinematicLeftPanelProps> = ({
  onStartSignUp,
}) => {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <div className="relative w-full min-h-[580px] flex flex-col justify-between select-none z-20 py-2">
      {/* Top Hero Text Column */}
      <div className="space-y-5 max-w-[420px]">
        {/* Top Badge matching reference image */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091829]/90 border border-sky-400/35 backdrop-blur-md shadow-[0_0_18px_rgba(56,189,248,0.22)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[12px] font-semibold text-sky-200 tracking-wide">
            Empowering Independent Artists
          </span>
        </motion.div>

        {/* Huge Bold Headline matching reference image */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-0"
        >
          <h1
            className="text-[52px] sm:text-[60px] xl:text-[68px] font-black text-white tracking-tight leading-[0.96]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            MUSIC<br />
            WITHOUT<br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #A855F7 0%, #C084FC 45%, #EC4899 100%)',
                filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.65))',
              }}
            >
              LIMITS.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle matching reference image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-0.5 pt-1"
        >
          <p className="text-[15px] sm:text-[16px] text-[#D1D5DB] font-medium leading-relaxed">
            Distribute. Monetize. Grow.
          </p>
          <p className="text-[15px] sm:text-[16px] text-[#94A3B8] font-normal">
            All in one place.
          </p>
        </motion.div>

        {/* CTA Button: Get Started Now → matching reference image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="pt-2"
        >
          <button
            type="button"
            onClick={onStartSignUp}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#6366F1] text-white font-bold text-[14px] shadow-[0_0_28px_rgba(147,51,234,0.55)] hover:shadow-[0_0_38px_rgba(147,51,234,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>

        {/* Social Proof: Avatars & 50,000+ matching reference image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 pt-3"
        >
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
            <span className="font-bold text-white block">Trusted by 50,000+</span>
            <span className="text-[#94A3B8] font-normal">Artists Worldwide</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom DSP Partners Row matching reference image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-6 sm:gap-8 pt-8 text-[#94A3B8]"
      >
        {/* Spotify */}
        <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
          <svg className="w-4 h-4 fill-current text-[#1DB954]" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
          </svg>
          <span className="text-xs font-semibold tracking-tight text-white">Spotify</span>
        </div>

        {/* Apple Music */}
        <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
          <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
          </svg>
          <span className="text-xs font-semibold tracking-tight text-white">Music</span>
        </div>

        {/* YouTube */}
        <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
          <svg className="w-4 h-3.5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-xs font-semibold tracking-tight text-white">YouTube</span>
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
          <span className="text-xs font-semibold tracking-tight text-white">deezer</span>
        </div>
      </motion.div>
    </div>
  );
};

export const CardYourMusicEverywhere: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [-4, 4, -4],
      }}
      transition={{
        opacity: { duration: 0.6, delay: 0.3 },
        scale: { duration: 0.6, delay: 0.3 },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      className="w-[230px] rounded-2xl p-3.5 select-none transition-shadow duration-300"
      style={{
        background: 'rgba(11, 14, 24, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(139, 92, 246, 0.25)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]">
          <Radio className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[12px] font-bold text-white leading-tight">Your Music</div>
          <div className="text-[10px] text-[#94A3B8]">Everywhere</div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 px-1">
        {/* Spotify */}
        <div className="w-6 h-6 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 fill-[#1DB954]" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
          </svg>
        </div>
        {/* Apple */}
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
          </svg>
        </div>
        {/* YouTube */}
        <div className="w-6 h-6 rounded-full bg-[#FF0000]/20 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 fill-[#FF0000]" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        {/* Amazon */}
        <div className="w-6 h-6 rounded-full bg-[#00A8E1]/20 flex items-center justify-center">
          <span className="text-[11px] font-bold text-[#00A8E1]">a</span>
        </div>
        {/* Deezer */}
        <div className="w-6 h-6 rounded-full bg-[#FF0092]/20 flex items-center justify-center">
          <div className="flex items-end gap-[1.5px] h-2.5">
            <span className="w-[1.5px] h-1.5 bg-[#FF0092] rounded-full" />
            <span className="w-[1.5px] h-2.5 bg-[#FF0092] rounded-full" />
            <span className="w-[1.5px] h-2 bg-[#FF0092] rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CardStreamGrowth: React.FC = () => {
  const equalizerBars = [14, 18, 26, 20, 32, 24, 30, 42, 28, 48, 36, 54, 40, 60];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [4, -4, 4],
      }}
      transition={{
        opacity: { duration: 0.6, delay: 0.4 },
        scale: { duration: 0.6, delay: 0.4 },
        y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      className="w-[210px] rounded-2xl p-3.5 select-none transition-shadow duration-300"
      style={{
        background: 'rgba(11, 14, 24, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(52, 211, 153, 0.22)',
      }}
    >
      <div className="text-[11px] text-[#94A3B8] font-medium">Stream Growth</div>
      <div className="flex items-center gap-1.5 my-1">
        <span className="text-[13px] font-black text-[#34D399]">^ +248%</span>
      </div>
      {/* Equalizer Visualizer */}
      <div className="flex items-end justify-between h-8 pt-1 px-1">
        {equalizerBars.map((height, idx) => (
          <motion.div
            key={idx}
            animate={{
              height: [`${height * 0.45}%`, `${height}%`, `${height * 0.6}%`],
            }}
            transition={{
              duration: 1.2 + (idx % 4) * 0.25,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: (idx * 0.08) % 0.5,
            }}
            className="w-[5px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #EC4899 0%, #A855F7 60%, #6366F1 100%)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
