import React, { useState } from 'react';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateLogin }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  return (
    <AuthCard>
      <div className="text-center space-y-1 pb-5">
        <h2
          className="text-[24px] sm:text-[26px] font-bold tracking-tight text-[#F8F7F4]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Reset password
        </h2>
        <p className="text-[13px] text-[#A7A9B3] font-normal">
          Enter your email to receive password recovery instructions.
        </p>
      </div>

      {status === 'success' ? (
        <div className="space-y-5 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-[#35E59A]/12 border border-[#35E59A]/25 flex items-center justify-center mx-auto text-[#35E59A]">
            <Check className="w-6 h-6 stroke-3" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Check your email</h3>
            <p className="text-[12px] text-[#A7A9B3]">
              We have sent a secure recovery link to <span className="text-white font-medium">{email}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-[12px] font-semibold text-[#A855F7] hover:text-[#C084FC] transition-colors underline underline-offset-4"
          >
            Return to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthInput
            id="forgot-email"
            label="Account email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            error={error}
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            required
          />

          <div className="pt-1">
            <PrimaryButton
              type="submit"
              label="SEND RESET LINK"
              loadingLabel="SENDING..."
              status={status}
            />
          </div>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="flex items-center justify-center space-x-1.5 w-full text-[12px] text-[#A7A9B3] hover:text-white transition-colors pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>
        </form>
      )}
    </AuthCard>
  );
};
