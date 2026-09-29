import React from 'react';

interface AuthBrandProps {
  size?: 'normal' | 'large';
  showTagline?: boolean;
}

export const AuthBrand: React.FC<AuthBrandProps> = ({
  size = 'normal',
  showTagline = true,
}) => {
  return (
    <div className="flex flex-col select-none">
      <div className="flex items-center space-x-2">
        <span
          className={`font-display font-extrabold tracking-[0.2em] text-[#F5F3EE] uppercase ${
            size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
          style={{ letterSpacing: '0.22em' }}
        >
          SONVÉRA
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
      </div>
      {showTagline && (
        <span
          className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[#969AA3] uppercase mt-1"
          style={{ letterSpacing: '0.25em' }}
        >
          MAKE MUSIC. MOVE CULTURE.
        </span>
      )}
    </div>
  );
};
