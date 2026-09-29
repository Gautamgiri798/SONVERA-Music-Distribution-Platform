import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { SocialButton } from './SocialButton';
import { AuthDivider } from './AuthDivider';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';

interface LoginPageProps {
  onSuccess: (userEmail: string) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onEnterAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onEnterAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Validation
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validate = (): boolean => {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage(null);

    setTimeout(() => {
      // Staff / Admin passkey check
      if (password === 'admin2026' || (email.toLowerCase().includes('admin') && password.length >= 6)) {
        if (onEnterAdmin) {
          setStatus('success');
          setTimeout(() => onEnterAdmin(), 350);
          return;
        }
      }

      // Successful authentication
      setStatus('success');
      setTimeout(() => {
        onSuccess(email);
      }, 400);
    }, 600);
  };

  return (
    <AuthCard>
      {/* Title & Subtitle */}
      <div className="text-center space-y-1 pb-5">
        <h2
          className="text-[24px] sm:text-[26px] font-bold tracking-tight text-[#F8F7F4]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome back
        </h2>
        <p className="text-[13px] text-[#A7A9B3] font-normal">
          Sign in to your artist workspace.
        </p>
      </div>

      {/* Social Logins: Stacked vertically */}
      <div className="space-y-2.5">
        <SocialButton
          provider="google"
          label="Continue with Google"
          onClick={() => onSuccess('gautam@sonvera.io')}
        />
        <SocialButton
          provider="apple"
          label="Continue with Apple"
          onClick={() => onSuccess('gautam@sonvera.io')}
        />
      </div>

      {/* Divider */}
      <AuthDivider label="OR" />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-start space-x-2 mb-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <AuthInput
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          error={emailError}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          error={passwordError}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-[12px]">
          <label className="flex items-center space-x-2 cursor-pointer select-none text-[#A7A9B3] hover:text-[#D1D5DB] transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-white/15 bg-white/5 text-violet-600 focus:ring-violet-500/40 focus:ring-offset-0 cursor-pointer accent-violet-600"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-[12px] font-medium text-[#A855F7] hover:text-[#C084FC] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            Forgot password?
          </button>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            label="SIGN IN"
            loadingLabel="SIGNING IN..."
            successLabel="✓ AUTHENTICATED"
            status={status}
          />
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pt-5 text-[12px] text-[#A7A9B3]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onNavigateRegister}
          className="text-[#A855F7] hover:text-[#C084FC] font-semibold underline decoration-violet-500/30 hover:decoration-violet-400 underline-offset-2 transition-colors ml-0.5"
        >
          Create account
        </button>
      </div>

      {/* Discreet Staff Trigger */}
      {onEnterAdmin && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onEnterAdmin}
            className="text-[10px] text-[#3E4250] hover:text-[#6B7084] transition-colors tracking-tight font-mono"
          >
            Authorized Staff Portal
          </button>
        </div>
      )}
    </AuthCard>
  );
};
