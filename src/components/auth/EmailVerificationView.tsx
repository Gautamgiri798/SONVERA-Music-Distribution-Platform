import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';
import { AuthBrand } from './AuthBrand';

interface EmailVerificationViewProps {
  email: string;
  onVerified: () => void;
  onChangeEmail: () => void;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  email,
  onVerified,
  onChangeEmail,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  const handleResend = () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSent(true);
      setSecondsLeft(45);
      setTimeout(() => setResendSent(false), 3000);
    }, 800);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full text-center space-y-6">
      <div className="flex justify-center">
        <AuthBrand size="normal" showTagline={false} />
      </div>

      {/* Glowing Neon Purple Envelope Visual Matching Screenshot */}
      <div className="relative mx-auto my-4 w-28 h-28 flex items-center justify-center">
        {/* Glow Layers */}
        <div className="absolute inset-0 rounded-3xl bg-[#8B5CF6]/20 blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1C172B] via-[#12111A] to-[#0A0C10] border border-[#8B5CF6]/50 shadow-[0_0_40px_rgba(139,92,246,0.35)] flex items-center justify-center text-[#8B5CF6]">
          <Mail className="w-10 h-10" />
          
          {/* Ambient Corner Sparkles */}
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#35D5FF] shadow-[0_0_8px_#35D5FF]" />
        </div>
      </div>

      {/* Text Details */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Verify your email
        </h2>
        <p className="text-sm text-[#969AA3] max-w-sm mx-auto leading-relaxed">
          We&apos;ve sent a verification link to{' '}
          <span className="text-[#F5F3EE] font-medium font-mono block mt-1 break-all bg-white/[0.04] py-1 px-2.5 rounded-lg border border-white/[0.08]">
            {email || 'creator@example.com'}
          </span>
        </p>
      </div>

      {resendSent && (
        <div className="p-3 rounded-xl bg-[#35E59A]/15 border border-[#35E59A]/30 text-xs text-[#35E59A] flex items-center justify-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>New verification link dispatched. Check your spam folder if delayed.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => {
            // Open user's default webmail or trigger verification
            const domain = email.split('@')[1] || '';
            if (domain.includes('gmail')) {
              window.open('https://mail.google.com', '_blank');
            } else if (domain.includes('outlook') || domain.includes('hotmail')) {
              window.open('https://outlook.live.com', '_blank');
            } else if (domain.includes('icloud')) {
              window.open('https://www.icloud.com/mail', '_blank');
            } else {
              window.open('mailto:', '_blank');
            }
          }}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2"
        >
          <span>Open Email</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0 || resending}
          className="w-full py-3 px-6 rounded-xl font-medium text-xs bg-[#111318] hover:bg-[#171A21] border border-white/[0.08] text-[#969AA3] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          <span>
            {secondsLeft > 0 ? `Resend Email (${formatTimer(secondsLeft)})` : 'Resend Email'}
          </span>
        </button>

        <div className="pt-2 flex items-center justify-center space-x-4 text-xs">
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-[#969AA3] hover:text-white transition underline underline-offset-2"
          >
            Change Email
          </button>
          <span className="text-white/20">•</span>
          <button
            type="button"
            onClick={onVerified}
            className="text-[#35E59A] hover:text-[#5cfbb5] font-semibold transition flex items-center space-x-1"
          >
            <span>I&apos;ve verified my email</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
