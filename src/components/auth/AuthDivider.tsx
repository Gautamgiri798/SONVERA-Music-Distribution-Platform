import React from 'react';

export const AuthDivider: React.FC<{ label?: string }> = ({ label = 'OR' }) => {
  return (
    <div className="flex items-center my-3.5 space-x-3 select-none">
      <div className="flex-1 h-px bg-white/8" />
      <span className="text-[10px] font-mono tracking-[0.15em] text-[#6B7084] uppercase font-medium">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/8" />
    </div>
  );
};
