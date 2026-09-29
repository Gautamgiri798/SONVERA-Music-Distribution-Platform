import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Lock, Check, X, Sliders, Info, Save } from 'lucide-react';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true and locked
    functional: true,
    analytics: false,
    marketing: false, // Disabled by default, SONVÉRA never sells artist data
  });
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sonvera_cookie_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        // use default
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('sonvera_cookie_preferences', JSON.stringify(preferences));
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleAcceptAll = () => {
    const all = { essential: true, functional: true, analytics: true, marketing: false };
    setPreferences(all);
    localStorage.setItem('sonvera_cookie_preferences', JSON.stringify(all));
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleRejectNonEssential = () => {
    const min = { essential: true, functional: false, analytics: false, marketing: false };
    setPreferences(min);
    localStorage.setItem('sonvera_cookie_preferences', JSON.stringify(min));
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F1115] border border-[#262B35] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F5F3EE]">
        {/* Glow header */}
        <div className="h-1 bg-gradient-to-r from-[#D6B36A] via-[#8B5CF6] to-[#35D5FF]" />

        {/* Top Header */}
        <div className="p-6 border-b border-[#1C2027] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B5CF6] font-semibold">
                  Privacy by Design • Section 8 Framework
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Cookie & Tracking Preferences Center
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#969AA3] hover:text-white p-1 rounded-lg hover:bg-[#1C2027] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <p className="text-xs text-[#969AA3] leading-relaxed">
            SONVÉRA respects your digital sovereignty. We never sell your personal data or stream statistics to third-party ad brokers. Configure your preferences below in accordance with India\'s DPDP Act 2023 and EU ePrivacy/GDPR regulations.
          </p>

          {/* Category 1: Strictly Necessary */}
          <div className="p-4 bg-[#15181D] border border-[#262B35] rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#35E59A]" />
                <span className="text-sm font-bold text-white">Strictly Necessary Cookies</span>
                <span className="text-[10px] font-mono font-bold bg-[#35E59A]/15 text-[#35E59A] px-2 py-0.5 rounded-full border border-[#35E59A]/30">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-[#969AA3] leading-relaxed">
                Essential for platform security, user authentication (HttpOnly JWT sessions), CSRF prevention, and DDoS edge defense. These cannot be disabled.
              </p>
            </div>
            <div className="pt-1">
              <input type="checkbox" checked disabled className="w-4 h-4 accent-[#35E59A] cursor-not-allowed opacity-75" />
            </div>
          </div>

          {/* Category 2: Functional & Workflow */}
          <div className="p-4 bg-[#15181D] border border-[#262B35] rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#35D5FF]" />
                <span className="text-sm font-bold text-white">Functional & Workflow Preferences</span>
              </div>
              <p className="text-xs text-[#969AA3] leading-relaxed">
                Remembers your artist workspace settings, dark theme parameters, language selections, and audio player volume levels across page refreshes.
              </p>
            </div>
            <div className="pt-1">
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
              />
            </div>
          </div>

          {/* Category 3: Analytics & Ingestion Telemetry */}
          <div className="p-4 bg-[#15181D] border border-[#262B35] rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />
                <span className="text-sm font-bold text-white">Performance & Anonymized Telemetry</span>
              </div>
              <p className="text-xs text-[#969AA3] leading-relaxed">
                Collects aggregated, pseudonymous performance metrics (API latency, audio upload speeds) to optimize our global DDEX distribution network.
              </p>
            </div>
            <div className="pt-1">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
              />
            </div>
          </div>

          {/* Category 4: Cross-Site Behavioral Tracking */}
          <div className="p-4 bg-[#15181D] border border-[#262B35] rounded-xl flex items-start justify-between gap-4 opacity-60">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#EF4444]" />
                <span className="text-sm font-bold text-white">Third-Party Advertising & Cross-Site Tracking</span>
                <span className="text-[10px] font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded-full border border-red-800">
                  Disabled on SONVÉRA
                </span>
              </div>
              <p className="text-xs text-[#969AA3] leading-relaxed">
                SONVÉRA never loads third-party advertising cookies or cross-platform tracking pixels. This category is permanently disabled.
              </p>
            </div>
            <div className="pt-1">
              <input type="checkbox" checked={false} disabled className="w-4 h-4 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#0A0C10] border-t border-[#1C2027] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleRejectNonEssential}
            className="px-4 py-2 bg-[#15181D] hover:bg-[#1C2027] border border-[#262B35] rounded-xl text-xs font-semibold text-[#969AA3] hover:text-white transition"
          >
            Reject Non-Essential
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-[#1C2027] hover:bg-[#262B35] border border-[#8B5CF6]/40 rounded-xl text-xs font-bold text-white transition"
            >
              Accept All
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:brightness-110 text-white font-bold rounded-xl text-xs shadow-lg shadow-[#8B5CF6]/20 flex items-center space-x-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save My Preferences</span>
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#35E59A] text-[#08090B] font-bold px-4 py-2 rounded-xl text-xs shadow-2xl flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
