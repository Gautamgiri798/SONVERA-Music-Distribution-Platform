import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { SocialButton } from './SocialButton';
import { AuthDivider } from './AuthDivider';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';
import { PasswordStrength } from './PasswordStrength';

interface RegisterPageProps {
  onSuccess: (data: { email: string; firstName: string; lastName: string }) => void;
  onSocialSuccess?: (data: { email: string; name: string }) => void;
  onNavigateLogin: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onSocialSuccess,
  onNavigateLogin,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Validation
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!firstName.trim()) errs.firstName = 'First name required.';
    if (!lastName.trim()) errs.lastName = 'Last name required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms and Privacy Policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage(null);

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      }, 400);
    }, 600);
  };

  return (
    <AuthCard>
      {/* Title & Subtitle */}
      <div className="text-center space-y-1 pb-4">
        <h2
          className="text-[24px] sm:text-[26px] font-bold tracking-tight text-[#F8F7F4]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Create your account
        </h2>
        <p className="text-[13px] text-[#A7A9B3] font-normal">
          Start distributing your music with confidence.
        </p>
      </div>

      {/* Social Logins: Side by side */}
      <div className="grid grid-cols-2 gap-2.5">
        <SocialButton
          provider="google"
          label="Continue with Google"
          onClick={() => {
            if (onSocialSuccess) {
              onSocialSuccess({ email: 'creator@gmail.com', name: 'Alex Mercer' });
            } else {
              onSuccess({ email: 'creator@gmail.com', firstName: 'Alex', lastName: 'Mercer' });
            }
          }}
        />
        <SocialButton
          provider="apple"
          label="Continue with Apple"
          onClick={() => {
            if (onSocialSuccess) {
              onSocialSuccess({ email: 'artist@icloud.com', name: 'Elena Vance' });
            } else {
              onSuccess({ email: 'artist@icloud.com', firstName: 'Elena', lastName: 'Vance' });
            }
          }}
        />
      </div>

      {/* Divider */}
      <AuthDivider label="OR" />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-start space-x-2 mb-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        {/* First & Last Name - Two Column */}
        <div className="grid grid-cols-2 gap-2.5">
          <AuthInput
            id="register-first-name"
            label="First name"
            placeholder="John"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (errors.firstName) setErrors({ ...errors, firstName: '' });
            }}
            error={errors.firstName}
            icon={<User className="w-4 h-4" />}
            autoComplete="given-name"
            required
          />

          <AuthInput
            id="register-last-name"
            label="Last name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (errors.lastName) setErrors({ ...errors, lastName: '' });
            }}
            error={errors.lastName}
            icon={<User className="w-4 h-4" />}
            autoComplete="family-name"
            required
          />
        </div>

        {/* Email Address */}
        <AuthInput
          id="register-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div>
          <AuthInput
            id="register-password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={password} />
        </div>

        {/* Confirm Password */}
        <AuthInput
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
          }}
          error={errors.confirmPassword}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        {/* Terms Consent */}
        <div className="pt-0.5">
          <label className="flex items-start space-x-2.5 cursor-pointer text-[12px] text-[#A7A9B3] select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
              }}
              className="mt-0.5 w-3.5 h-3.5 rounded border-white/15 bg-white/5 text-violet-600 focus:ring-violet-500/40 focus:ring-offset-0 shrink-0 cursor-pointer accent-violet-600"
            />
            <span className="leading-snug">
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTerms?.();
                }}
                className="text-[#A855F7] hover:text-white underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPrivacy?.();
                }}
                className="text-[#A855F7] hover:text-white underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[10px] text-red-400 mt-0.5 pl-6">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Primary CTA */}
        <div className="pt-1.5">
          <PrimaryButton
            type="submit"
            label="CREATE ACCOUNT"
            loadingLabel="CREATING ACCOUNT..."
            successLabel="✓ ACCOUNT CREATED"
            status={status}
          />
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pt-4 text-[12px] text-[#A7A9B3]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="text-[#A855F7] hover:text-[#C084FC] font-semibold underline decoration-violet-500/30 hover:decoration-violet-400 underline-offset-2 transition-colors ml-0.5"
        >
          Sign in
        </button>
      </div>
    </AuthCard>
  );
};
