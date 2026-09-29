import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  autoComplete?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  icon,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-[12px] font-medium text-[#B8BAC4]">
          {label}
        </label>
        {error && <span className="text-[10px] text-red-400 font-normal">{error}</span>}
      </div>

      <div className="relative w-full">
        {/* Left Icon */}
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '13px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7084',
              zIndex: 10,
            }}
          >
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={id}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            height: '44px',
            paddingLeft: icon ? '42px' : '14px',
            paddingRight: isPassword ? '42px' : '14px',
            borderRadius: '11px',
            background: 'rgba(255, 255, 255, 0.035)',
            border: error
              ? '1px solid rgba(239, 68, 68, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.07)',
            color: '#F8F7F4',
            fontSize: '13px',
            width: '100%',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          className="focus:border-[#8B5CF6]/70 focus:ring-1 focus:ring-[#8B5CF6]/25 placeholder:text-[#50546A]"
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
            className="text-[#6B7084] hover:text-[#F8F7F4] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
