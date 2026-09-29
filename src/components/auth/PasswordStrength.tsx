import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const getPasswordStrengthLevel = (pwd: string): {
  strength: 'weak' | 'fair' | 'strong';
  percent: number;
  label: string;
  color: string;
} => {
  if (!pwd) return { strength: 'weak', percent: 0, label: '', color: '#6F7280' };

  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (pwd.length >= 12) score += 15;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 20;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;

  if (score < 45) {
    return { strength: 'weak', percent: 33, label: 'Weak', color: '#EF4444' };
  } else if (score < 75) {
    return { strength: 'fair', percent: 66, label: 'Fair', color: '#F59E0B' };
  } else {
    return { strength: 'strong', percent: 100, label: 'Strong', color: '#35E59A' };
  }
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;
  const { percent, label, color } = getPasswordStrengthLevel(password);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#A7A9B3]">Password strength:</span>
        <span style={{ color }} className="font-semibold">{label}</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
