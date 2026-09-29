import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AuthBrand } from './AuthBrand';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid account email.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <AuthBrand size="normal" showTagline={false} />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mt-4">
          Reset password
        </h2>
        <p className="text-sm text-[#969AA3]">
          Enter your account email to receive cryptographic password reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-5 rounded-2xl bg-[#111318] border border-white/[0.08] text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-[#35E59A]/15 text-[#35E59A] flex items-center justify-center mx-auto border border-[#35E59A]/40">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Reset instructions dispatched</h3>
            <p className="text-xs text-[#969AA3] leading-relaxed">
              If an account is associated with <span className="text-white font-mono">{email}</span>, a secure recovery link with a 15-minute expiry token has been sent.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3 rounded-xl bg-[#1C2027] hover:bg-[#262B35] text-white text-xs font-bold transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="p-3.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#f87171] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#F5F3EE]">
              Account email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#969AA3]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111318] border border-white/[0.08] hover:border-white/[0.16] text-sm text-white placeholder:text-[#525763] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DISPATCHING...</span>
              </>
            ) : (
              <>
                <span>SEND RESET LINK</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-2.5 text-center text-xs text-[#969AA3] hover:text-white transition flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </form>
      )}
    </div>
  );
};
