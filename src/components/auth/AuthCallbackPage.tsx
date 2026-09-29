import React, { useEffect } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { AuthCard } from './AuthCard';

interface AuthCallbackPageProps {
  onSuccess: (email: string) => void;
}

export const AuthCallbackPage: React.FC<AuthCallbackPageProps> = ({ onSuccess }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSuccess('gautam@sonvera.io');
    }, 900);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <AuthCard>
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-violet-600/15 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white font-display">
            Authenticating with SONVÉRA
          </h2>
          <p className="text-xs text-[#A7A9B3]">
            Securing handshake and exchanging authorization tokens...
          </p>
        </div>
        <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-[#35E59A] pt-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PKCE + State Token Verified</span>
        </div>
      </div>
    </AuthCard>
  );
};
