import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export type PasswordStrength = 'weak' | 'fair' | 'strong' | '';

export const getPasswordStrength = (pass: string): { strength: PasswordStrength; score: number; checks: { [key: string]: boolean } } => {
  if (!pass) {
    return {
      strength: '',
      score: 0,
      checks: { length: false, uppercase: false, number: false, symbol: false },
    };
  }

  const checks = {
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    symbol: /[^A-Za-z0-9]/.test(pass),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let strength: PasswordStrength = 'weak';
  if (passedCount >= 4 && pass.length >= 10) {
    strength = 'strong';
  } else if (passedCount >= 2 && pass.length >= 8) {
    strength = 'fair';
  }

  return { strength, score: passedCount, checks };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  if (!password) return null;

  const { strength, score } = getPasswordStrength(password);

  const colors = {
    weak: 'bg-[#ef4444]',
    fair: 'bg-[#D6B36A]',
    strong: 'bg-[#35E59A]',
    '': 'bg-white/10',
  };

  const labelText = {
    weak: 'Weak',
    fair: 'Fair',
    strong: 'Strong',
    '': '',
  };

  const labelColor = {
    weak: 'text-[#ef4444]',
    fair: 'text-[#D6B36A]',
    strong: 'text-[#35E59A]',
    '': 'text-white/40',
  };

  return (
    <div className="space-y-1.5 mt-2 animate-fade-in text-xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#969AA3] font-mono">Password strength</span>
        <span className={`text-[11px] font-mono font-bold uppercase ${labelColor[strength]}`}>
          {labelText[strength]}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => {
          const active = score >= step;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                active ? colors[strength] : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
