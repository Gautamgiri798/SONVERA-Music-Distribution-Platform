import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export interface LoginSectionProps {
  onSuccess?: (email: string) => void;
  onSwitchToSignup?: () => void;
  onForgotPassword?: () => void;
  onEnterAdmin?: () => void;
  showTabs?: boolean;
  className?: string;
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  onSuccess,
  onSwitchToSignup,
  onForgotPassword,
  onEnterAdmin,
  showTabs = true,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Status & Validation
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3D Parallax Tilt with physics dampening
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-3deg', '3deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    setStatus('loading');

    setTimeout(() => {
      // Check admin passkey credentials
      if (password === 'admin2026' || (email.toLowerCase().includes('admin') && password.length >= 6)) {
        if (onEnterAdmin) {
          setStatus('success');
          setTimeout(() => onEnterAdmin(), 350);
          return;
        }
      }

      setStatus('success');
      setTimeout(() => {
        onSuccess?.(email.trim());
      }, 400);
    }, 600);
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess?.(provider === 'google' ? 'artist@gmail.com' : 'artist@icloud.com');
      }, 350);
    }, 450);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-[420px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(12, 15, 26, 0.82)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
        }}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative w-full rounded-[24px] p-6 sm:p-7 select-none overflow-hidden ${className}`}
      >
        {/* Subtle Top Specular Rim */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25) 50%, transparent)',
          }}
        />

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center space-y-1 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-400 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <div className="flex items-center gap-[2px] h-3">
                <span className="w-[2px] h-1.5 bg-white rounded-full" />
                <span className="w-[2px] h-2.5 bg-white rounded-full" />
                <span className="w-[2px] h-3 bg-white rounded-full" />
                <span className="w-[2px] h-2.5 bg-white rounded-full" />
                <span className="w-[2px] h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <span
              className="text-[19px] font-black text-white tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SONVÉRA
            </span>
          </div>
          <div className="text-[10px] tracking-[0.25em] text-[#94A3B8] uppercase font-semibold">
            ARTIST CONSOLE
          </div>
        </div>

        {/* Segmented Pill Switcher [ Sign In | Create Account ] */}
        {showTabs && (
          <div className="w-full bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] flex items-center mb-4 h-10 relative z-10">
            <button
              type="button"
              className="flex-1 h-full flex items-center justify-center text-[12.5px] font-semibold rounded-lg bg-white/[0.12] text-white shadow-sm cursor-default transition-all"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="flex-1 h-full flex items-center justify-center text-[12.5px] font-medium text-[#94A3B8] hover:text-white rounded-lg transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Heading & Subtitle */}
        <div className="text-center space-y-0.5 pb-3.5 relative z-10">
          <h2
            className="text-[21px] font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome back
          </h2>
          <p className="text-[12px] text-[#94A3B8]">
            Enter your email and password to access your catalog
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-2 relative z-10">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={status === 'loading'}
            className="h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-white flex items-center justify-center space-x-2 px-3 transition-all duration-150 cursor-pointer disabled:opacity-50 text-[12px] font-medium"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('apple')}
            disabled={status === 'loading'}
            className="h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-white flex items-center justify-center space-x-2 px-3 transition-all duration-150 cursor-pointer disabled:opacity-50 text-[12px] font-medium"
          >
            <svg className="w-3.5 h-3.5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1 .08 2.08-.52 2.69-1.27z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-3 space-x-3 select-none relative z-10">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[9.5px] tracking-[0.2em] text-[#64748B] uppercase font-semibold">
            OR WITH EMAIL
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11.5px] text-rose-300 flex items-start space-x-2 mb-3 relative z-10">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#CBD5E1]">
              Email address
            </label>
            <div className="relative">
              <Mail
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                  emailFocused ? 'text-violet-400' : 'text-[#64748B]'
                }`}
              />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-[13px] placeholder-[#475569] focus:outline-none focus:border-violet-500/80 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#CBD5E1]">
              Password
            </label>
            <div className="relative">
              <Lock
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                  passwordFocused ? 'text-violet-400' : 'text-[#64748B]'
                }`}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-11 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-[13px] placeholder-[#475569] focus:outline-none focus:border-violet-500/80 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/30 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5 text-[11px]">
            <div
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center space-x-2 cursor-pointer select-none group"
            >
              <div
                className={`w-3.5 h-3.5 rounded-[4px] flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-violet-600 text-white shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                    : 'bg-white/5 border border-white/20 group-hover:border-white/40'
                }`}
              >
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 stroke-white stroke-3 fill-none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[#94A3B8] group-hover:text-white transition-colors">
                Remember me
              </span>
            </div>

            <button
              type="button"
              onClick={onForgotPassword}
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Primary CTA */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500 text-white font-semibold text-[13.5px] shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_26px_rgba(124,58,237,0.55)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="w-4 h-4 stroke-3 text-white" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-3 text-[11.5px] text-[#94A3B8] relative z-10">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-violet-400 hover:text-violet-300 font-semibold hover:underline underline-offset-2 transition-colors ml-0.5 cursor-pointer"
          >
            Create account
          </button>
        </div>

        {/* Security Seal */}
        <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-1 border-t border-white/[0.06] text-[10px] text-[#64748B] relative z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted • DDEX ERN 4.3 Node</span>
        </div>
      </motion.div>
    </div>
  );
};
