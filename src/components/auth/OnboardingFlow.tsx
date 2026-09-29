import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Sparkles,
  Music,
  Building2,
  Users,
  Sliders,
  Radio,
  Globe,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { AuthBrand } from './AuthBrand';

interface OnboardingFlowProps {
  initialName?: string;
  initialEmail?: string;
  onComplete: (workspaceData: {
    role: string;
    workspaceName: string;
    country: string;
    currency: string;
    avatarUrl?: string;
  }) => void;
  onBackToSignup?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialName = '',
  initialEmail = '',
  onComplete,
  onBackToSignup,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1, 2, 3 = onboarding, 4 = final "Account created!"

  // Form State
  const [selectedRole, setSelectedRole] = useState<'artist' | 'label' | 'manager' | 'producer' | 'other'>('artist');
  const [workspaceName, setWorkspaceName] = useState(initialName || 'Gautam Giri Music');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR (₹)');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  const roles = [
    {
      id: 'artist' as const,
      title: 'Artist',
      desc: 'I release my own music',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'label' as const,
      title: 'Label',
      desc: 'I run a record label',
      img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'manager' as const,
      title: 'Artist Manager',
      desc: 'I manage artists',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'producer' as const,
      title: 'Producer',
      desc: 'I produce music',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'other' as const,
      title: 'Other',
      desc: 'Other music professional',
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(url);
    }
  };

  const handleFinish = () => {
    onComplete({
      role: selectedRole,
      workspaceName: workspaceName.trim() || 'My Music Workspace',
      country,
      currency,
      avatarUrl: avatarPreview || undefined,
    });
  };

  return (
    <div className="w-full select-none">
      {/* Top Header with Progress Bar (Steps 1, 2, 3) */}
      {step < 4 && (
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if (step === 1 && onBackToSignup) {
                  onBackToSignup();
                } else if (step > 1) {
                  setStep((step - 1) as any);
                }
              }}
              className="p-1.5 rounded-lg text-[#969AA3] hover:text-white hover:bg-white/[0.06] transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <AuthBrand size="normal" showTagline={false} />
          </div>

          {/* Step Indicator & Bar */}
          <div className="flex items-center space-x-3">
            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#35D5FF] transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-[#8B5CF6]">{step}/3</span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ================= STEP 1: TELL US ABOUT YOURSELF ================= */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Tell us about yourself
              </h2>
              <p className="text-sm text-[#969AA3] mt-1">
                Choose the option that describes you best.
              </p>
            </div>

            {/* 5 Selectable Cards */}
            <div className="space-y-2.5">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left group ${
                      isSelected
                        ? 'bg-[#15181D] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/15'
                        : 'bg-[#111318] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#15181D]'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                        <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-[#F5F3EE]">
                          {r.title}
                        </div>
                        <div className="text-xs text-[#969AA3]">{r.desc}</div>
                      </div>
                    </div>

                    {/* Radio Checkmark */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/40'
                          : 'border border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ================= STEP 2: CREATE YOUR WORKSPACE ================= */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Create your workspace
              </h2>
              <p className="text-sm text-[#969AA3] mt-1">
                Set up your artist or label details.
              </p>
            </div>

            {/* Circular Avatar Upload Section */}
            <div className="flex flex-col items-center justify-center pt-2">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#8B5CF6]/60 p-1 group-hover:border-[#8B5CF6] transition shadow-lg shadow-[#8B5CF6]/15">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#111318] flex items-center justify-center text-[#969AA3]">
                      <Camera className="w-7 h-7" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                  <Camera className="w-6 h-6" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-[#969AA3] mt-2 font-medium">Add photo</span>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#F5F3EE]">
                  Artist / Label name
                </label>
                <input
                  type="text"
                  placeholder="Your artist or label name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-white/[0.08] hover:border-white/[0.16] text-sm text-white placeholder:text-[#525763] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition"
                />
              </div>

              {/* Country Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#F5F3EE]">Country</label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-white/[0.08] text-sm text-white appearance-none focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                  >
                    <option value="India">🇮🇳 India</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#969AA3] absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Preferred Currency */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#F5F3EE]">Preferred currency</label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-white/[0.08] text-sm text-white appearance-none focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                  >
                    <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                    <option value="USD ($)">USD ($) — United States Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                    <option value="JPY (¥)">JPY (¥) — Japanese Yen</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#969AA3] absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ================= STEP 3: COMPLETE SETUP ================= */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Complete setup
              </h2>
              <p className="text-sm text-[#969AA3] mt-1">
                You&apos;re almost ready to go.
              </p>
            </div>

            {/* Checklist items matching screenshot */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#111318] border border-white/[0.08]">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#35E59A]/15 text-[#35E59A] flex items-center justify-center border border-[#35E59A]/40">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">Account created</span>
                </div>
                <span className="text-xs font-mono text-[#35E59A]">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 border-t border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#35E59A]/15 text-[#35E59A] flex items-center justify-center border border-[#35E59A]/40">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">Profile configured</span>
                </div>
                <span className="text-xs font-mono text-[#35E59A]">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 border-t border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/40">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">Workspace ready</span>
                </div>
                <span className="text-xs font-mono text-[#8B5CF6]">Almost there</span>
              </div>
            </div>

            {/* Fan-Out Album Art Stack Visual matching screenshot */}
            <div className="relative h-32 flex items-center justify-center py-4">
              <div className="w-20 h-28 rounded-xl overflow-hidden border border-white/20 shadow-2xl -rotate-12 -translate-x-12 absolute brightness-75">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80"
                  alt="Release 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-22 h-30 rounded-xl overflow-hidden border border-white/20 shadow-2xl rotate-12 translate-x-12 absolute brightness-75">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80"
                  alt="Release 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#8B5CF6] shadow-2xl z-10 relative">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80"
                  alt="Release Core"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#35D5FF] text-white shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2"
            >
              <span>Enter SONVÉRA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ================= STEP 4: FINAL SUCCESS SCREEN ================= */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6 py-4"
          >
            <div className="flex justify-center">
              <AuthBrand size="normal" showTagline={false} />
            </div>

            {/* Glowing Neon Green Checkmark Visual Matching Bottom Right Screenshot */}
            <div className="relative mx-auto my-4 w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#35E59A]/20 blur-2xl animate-pulse" />
              <div className="relative w-28 h-28 rounded-full border-4 border-[#35E59A] flex items-center justify-center shadow-[0_0_50px_rgba(53,229,154,0.4)] bg-[#0A0C10]">
                <Check className="w-14 h-14 text-[#35E59A] stroke-[3]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                Account created!
              </h2>
              <p className="text-sm text-[#969AA3] max-w-xs mx-auto leading-relaxed">
                Welcome to SONVÉRA. Your workspace is ready. Let&apos;s make music move culture.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-xl shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
