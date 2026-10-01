import React from 'react';

export const AuthDivider: React.FC<{ label?: string }> = ({ label = 'OR' }) => {
  return (
    <div className="flex items-center my-4 space-x-3 select-none">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] tracking-[0.2em] text-[#64748B] uppercase font-semibold">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
};
