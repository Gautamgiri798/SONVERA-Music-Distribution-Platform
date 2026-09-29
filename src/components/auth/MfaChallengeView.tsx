import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { AuthBrand } from './AuthBrand';

interface MfaChallengeViewProps {
  email: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export const MfaChallengeView: React.FC<MfaChallengeViewProps> = ({
  email,
  onSuccess,
  onBackToLogin,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`mfa-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 900);
  };

  return (
    <div className="w-full space-y-6 text-center">
      <div className="flex justify-center">
        <AuthBrand size="normal" showTagline={false} />
      </div>

      {/* Shield Icon */}
      <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mx-auto shadow-lg shadow-[#8B5CF6]/20">
        <ShieldCheck className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-[#969AA3] max-w-sm mx-auto">
          Enter the 6-digit TOTP verification code from your authenticator app for{' '}
          <span className="text-white font-mono">{email}</span>.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        {/* 6-Digit Code Grid */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-3">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`mfa-digit-${i}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-[#111318] border border-white/[0.12] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 text-center text-lg font-bold font-mono text-white focus:outline-none transition"
            />
          ))}
        </div>

        {error && <p className="text-xs text-[#ef4444]">{error}</p>}

        <button
          type="submit"
          disabled={loading || code.some((d) => !d)}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>VERIFYING CODE...</span>
            </>
          ) : (
            <>
              <span>VERIFY & SIGN IN</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-xs text-[#969AA3] pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="hover:text-white transition flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Use different account</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Hardware Security Key prompt simulated (WebAuthn FIDO2).')}
            className="text-[#8B5CF6] hover:text-[#B794F4] transition flex items-center space-x-1 font-medium"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Use Passkey / FIDO2</span>
          </button>
        </div>
      </form>
    </div>
  );
};
