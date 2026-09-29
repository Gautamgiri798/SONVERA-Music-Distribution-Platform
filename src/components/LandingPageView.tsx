import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Shield,
  Upload,
  CheckCircle2,
  Globe,
  Radio,
  TrendingUp,
  Disc,
  Layers,
  FileCode,
  ShieldCheck,
  Building2,
  BookOpen,
  DollarSign,
  X,
  UserCheck,
  ExternalLink,
  Sliders,
  Volume2,
  CheckCheck,
  Copy,
  Scale,
  Lock,
} from 'lucide-react';
import { LegalPoliciesModal } from './LegalPoliciesModal';
import { TrustCenterModal } from './TrustCenterModal';
import { CookiePreferencesModal } from './CookiePreferencesModal';
import { UserPrivacyRightsModal } from './UserPrivacyRightsModal';
import { DedicatedReportingModal } from './DedicatedReportingModal';
import { AuthView, AuthMode } from './auth/AuthView';

interface LandingPageViewProps {
  onEnterDashboard: () => void;
  onStartRelease: () => void;
  onEnterAdmin?: () => void;
  initialAuthMode?: AuthMode | null;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterDashboard,
  onStartRelease,
  onEnterAdmin,
  initialAuthMode,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPolicySlug, setSelectedPolicySlug] = useState<string | null>(null);

  // Trust, Security & Compliance Modals state
  const [showTrustCenter, setShowTrustCenter] = useState<boolean>(false);
  const [trustCenterTab, setTrustCenterTab] = useState<'status' | 'subprocessors' | 'security'>('status');
  const [showCookiePreferences, setShowCookiePreferences] = useState<boolean>(false);
  const [showPrivacyRights, setShowPrivacyRights] = useState<boolean>(false);
  const [showReportingModal, setShowReportingModal] = useState<boolean>(false);
  const [reportingType, setReportingType] = useState<'copyright' | 'vulnerability' | 'royalty_dispute'>('copyright');
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sonvera_cookie_consent') === null;
    } catch {
      return false;
    }
  });

  // Modals state
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(() => {
    if (initialAuthMode) return initialAuthMode;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const path = window.location.pathname.toLowerCase().replace('/', '');
      if (path === 'register' || hash === 'register') return 'register';
      if (path === 'forgot-password' || hash === 'forgot-password') return 'forgot-password';
      if (path === 'login' || hash === 'login') return 'login';
    }
    return 'login';
  });
  const showAuthModal = authMode !== null;
  const setShowAuthModal = (show: boolean) => setAuthMode(show ? 'login' : null);

  // URL routing synchronization for auth routes
  React.useEffect(() => {
    if (authMode) {
      const target = `/${authMode}`;
      if (window.location.pathname !== target && window.location.hash !== `#${authMode}`) {
        window.history.replaceState(null, '', target);
      }
    }
  }, [authMode]);

  const [showContactSalesModal, setShowContactSalesModal] = useState<boolean>(false);
  const [selectedSpecModal, setSelectedSpecModal] = useState<'ddex' | 'lufs' | 'isrc' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Discreet Staff / Admin access state (never shown to general public)
  const [showStaffPrompt, setShowStaffPrompt] = useState<boolean>(false);
  const [adminPasskey, setAdminPasskey] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  // Label Form state
  const [labelForm, setLabelForm] = useState({
    name: '',
    email: '',
    labelName: '',
    catalogSize: '10-50 releases',
    notes: '',
  });

  // Demo modal active tab
  const [demoTab, setDemoTab] = useState<'audio' | 'ddex' | 'analytics' | 'royalties'>('audio');

  const openTrustCenterWithTab = (tab: 'status' | 'subprocessors' | 'security') => {
    setTrustCenterTab(tab);
    setShowTrustCenter(true);
  };

  const openReportingWithType = (type: 'copyright' | 'vulnerability' | 'royalty_dispute') => {
    setReportingType(type);
    setShowReportingModal(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const platforms = [
    { name: 'Spotify', color: '#1db954', icon: '🎧' },
    { name: 'Apple Music', color: '#fc3c44', icon: '🍎' },
    { name: 'YouTube Music', color: '#ff0000', icon: '▶️' },
    { name: 'Amazon Music', color: '#00a8e1', icon: '📦' },
    { name: 'JioSaavn', color: '#2bc5b4', icon: '🎵' },
    { name: 'TIDAL', color: '#000000', icon: '🌊' },
    { name: 'Deezer', color: '#ff0092', icon: '⚡' },
    { name: 'Wynk', color: '#eb1c24', icon: '📱' },
    { name: 'Gaana', color: '#e72c30', icon: '📻' },
    { name: 'Instagram', color: '#e1306c', icon: '📸' },
    { name: 'TikTok', color: '#000000', icon: '🎬' },
    { name: 'Facebook', color: '#1877f2', icon: '👥' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        background: '#08090B',
        color: '#F5F3EE',
        fontFamily: 'var(--font-sans)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Toast Notification (Luxury HUD styling) */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'rgba(21, 24, 29, 0.95)',
            backdropFilter: 'blur(16px)',
            color: '#35E59A',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 600,
            border: '1px solid rgba(53, 229, 154, 0.35)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle2 size={16} color="#35E59A" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#969AA3', cursor: 'pointer', padding: '0 0 0 6px', display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Public Navbar */}
      <header
        style={{
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          background: 'rgba(8, 9, 11, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Radio size={19} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F3EE',
            }}
          >
            SONVÉRA
          </span>
        </div>

        {/* Center Links with smooth scrolling */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', color: '#969AA3' }}>
          <a
            href="#product"
            onClick={(e) => handleSmoothScroll(e, 'product')}
            style={{ color: '#F5F3EE', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
          >
            Product
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleSmoothScroll(e, 'pricing')}
            style={{ color: '#969AA3', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
          >
            Pricing
          </a>
          <a
            href="#labels"
            onClick={(e) => handleSmoothScroll(e, 'labels')}
            style={{ color: '#969AA3', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
          >
            For Labels
          </a>
          <a
            href="#resources"
            onClick={(e) => handleSmoothScroll(e, 'resources')}
            style={{ color: '#969AA3', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
          >
            Resources
          </a>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setAuthMode('login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Log In
          </button>

          <button
            onClick={() => setAuthMode('register')}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(139, 92, 246, 0.4)',
              outline: 'none',
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ================= SECTION 1: HERO ================= */}
      <section
        id="product"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '80px 48px 90px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left Column Content */}
        <div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}
          >
            Music distribution,
            <br />
            built around{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #8B5CF6 0%, #35D5FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              the artist.
            </span>
          </h1>

          <p
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#F5F3EE',
              marginBottom: '14px',
            }}
          >
            Upload once. Distribute everywhere. Own your music.
          </p>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#969AA3',
              marginBottom: '32px',
              maxWidth: '540px',
            }}
          >
            Release your music to global streaming platforms, manage your catalog, track performance, and collect your royalties — all in one intelligent workspace.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 30px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(139, 92, 246, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </button>

            {/* Watch Demo - Opens Video/Interactive Walkthrough Modal */}
            <button
              onClick={() => setShowDemoModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '14px 26px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3 Metric Pills */}
          <div style={{ display: 'flex', gap: '36px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '28px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5F3EE' }}>30+</div>
              <div style={{ fontSize: '12.5px', color: '#969AA3', marginTop: '2px' }}>Platforms</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5F3EE' }}>0%</div>
              <div style={{ fontSize: '12.5px', color: '#969AA3', marginTop: '2px' }}>We don't take your rights</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5F3EE' }}>100%</div>
              <div style={{ fontSize: '12.5px', color: '#969AA3', marginTop: '2px' }}>You keep your earnings</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Graphic with Floating Glass Cards */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '460px',
              height: '520px',
              borderRadius: '28px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(139, 92, 246, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
              alt="Artist with microphone"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.2) 0%, rgba(8, 9, 11, 0.7) 100%)',
              }}
            />
          </div>

          {/* Floating UI Widget 1: Distribute Badge */}
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '-10px',
              background: 'rgba(21, 24, 29, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '14px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#35E59A' }} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Distribute</span>
          </div>

          {/* Floating UI Widget 2: Streams Graph Card */}
          <div
            style={{
              position: 'absolute',
              top: '90px',
              right: '-30px',
              background: 'rgba(21, 24, 29, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '18px',
              padding: '16px 20px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
              width: '180px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>1.28M</span>
              <span style={{ fontSize: '11px', color: '#35E59A', fontWeight: 700 }}>+24%</span>
            </div>
            <div style={{ fontSize: '11px', color: '#969AA3', marginBottom: '10px' }}>Total streams</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px' }}>
              {[30, 45, 60, 40, 85, 95, 75, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i >= 5 ? '#8B5CF6' : '#35D5FF',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating UI Widget 3: Album Card */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '-20px',
              background: 'rgba(21, 24, 29, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"
              alt="cover"
              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Your Music.</div>
              <div style={{ fontSize: '11px', color: '#8B5CF6' }}>Everywhere.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY LOGO STRIP */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(21, 24, 29, 0.6)',
          padding: '24px 48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
            color: '#969AA3',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Trusted by independent artists and record labels globally
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {['Spotify', 'Apple Music', 'YouTube Music', 'amazon music', 'JioSaavn', 'TIDAL', 'deezer'].map((name) => (
            <span key={name} style={{ fontSize: '16px', fontWeight: 700, color: '#969AA3' }}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ================= SECTION 2: 4-STEP RELEASE PIPELINE ================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '100px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            The Release Pipeline, Perfected.
          </h2>
          <p style={{ fontSize: '16px', color: '#969AA3', maxWidth: '600px', margin: '0 auto' }}>
            A deterministic 7-step quality gate ensuring 100% DSP compliance and instant store delivery.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Master Audio & Art',
              desc: 'Lossless WAV 24-bit/48kHz validation with integrated LUFS check and 3000x3000px artwork inspection.',
              icon: Upload,
            },
            {
              step: '02',
              title: 'Metadata & Split Sheets',
              desc: 'Automatic ISRC generation, explicit rating check, and immutable 100% contributor split sheets.',
              icon: FileCode,
            },
            {
              step: '03',
              title: 'DDEX ERN 4.3 Batching',
              desc: 'Standardized digital packaging transmitted directly to Apple, Spotify, Amazon, and JioSaavn.',
              icon: Globe,
            },
            {
              step: '04',
              title: 'Telemetry & Payouts',
              desc: 'Live streaming telemetry, transparent reporting, and ledger-backed payouts to your bank.',
              icon: DollarSign,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                style={{
                  background: '#15181D',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(139, 92, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8B5CF6',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#969AA3', fontWeight: 700 }}>
                      {item.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#969AA3', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global DSP Grid */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '36px',
            marginTop: '60px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
            Your music on the platforms that matter worldwide.
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {platforms.map((p) => (
              <div
                key={p.name}
                style={{
                  background: '#1C2027',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '20px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '22px' }}>{p.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: PRICING ================= */}
      <section
        id="pricing"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '60px 48px 100px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Simple, transparent pricing
            <br />
            for every artist's journey.
          </h2>
          <p style={{ fontSize: '15px', color: '#969AA3' }}>
            Choose a plan that fits your goals. No hidden fees. You keep 100% of your royalties.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
              padding: '4px',
              marginTop: '28px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? '#8B5CF6' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? '#8B5CF6' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                outline: 'none',
              }}
            >
              <span>Yearly</span>
              <span
                style={{
                  fontSize: '10.5px',
                  background: 'rgba(53, 229, 154, 0.2)',
                  color: '#35E59A',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          {/* Card 1: FREE */}
          <div
            style={{
              background: '#15181D',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                FREE
              </h3>
              <p style={{ fontSize: '13px', color: '#969AA3', marginBottom: '24px' }}>
                For emerging artists
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px' }}>
                <span style={{ fontSize: '38px', fontWeight: 800 }}>₹0</span>
                <span style={{ fontSize: '13px', color: '#969AA3' }}>/forever</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#cbd5e1' }}>
                {['Music distribution', 'Basic analytics', 'Catalog management', 'Royalty reporting', 'Community support'].map(
                  (f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Check size={16} color="#35E59A" />
                      <span>{f}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                marginTop: '36px',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* Card 2: PRO (Most Popular) */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(21, 24, 29, 0.95) 100%)',
              border: '2px solid #8B5CF6',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(139, 92, 246, 0.25)',
              transform: 'scale(1.02)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                right: '32px',
                background: 'linear-gradient(90deg, #8B5CF6 0%, #35D5FF 100%)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Most Popular
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', color: '#a5b4fc' }}>
                PRO
              </h3>
              <p style={{ fontSize: '13px', color: '#969AA3', marginBottom: '24px' }}>
                For serious independent artists
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px' }}>
                <span style={{ fontSize: '38px', fontWeight: 800 }}>
                  ₹{billingCycle === 'yearly' ? '799' : '999'}
                </span>
                <span style={{ fontSize: '13px', color: '#969AA3' }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#ffffff' }}>
                {[
                  'Everything in Free',
                  'Advanced analytics',
                  'AI distribution assistant',
                  'Campaign tools',
                  'Priority support',
                ].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={16} color="#35E59A" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                marginTop: '36px',
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
                outline: 'none',
              }}
            >
              Get Started Pro
            </button>
          </div>

          {/* Card 3: LABEL */}
          <div
            style={{
              background: '#15181D',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                LABEL
              </h3>
              <p style={{ fontSize: '13px', color: '#969AA3', marginBottom: '24px' }}>
                For labels and management
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px' }}>
                <span style={{ fontSize: '38px', fontWeight: 800 }}>
                  ₹{billingCycle === 'yearly' ? '2,499' : '2,999'}
                </span>
                <span style={{ fontSize: '13px', color: '#969AA3' }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#cbd5e1' }}>
                {[
                  'Multiple artists',
                  'Unlimited releases',
                  'Team members',
                  'Advanced royalty management',
                  'Label dashboard',
                  'Dedicated support',
                ].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={16} color="#35E59A" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowContactSalesModal(true)}
              style={{
                marginTop: '36px',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: FOR LABELS ================= */}
      <section
        id="labels"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '100px 48px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D6B36A', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
              <Building2 size={16} />
              <span>ENTERPRISE & RECORD LABELS</span>
            </div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '20px' }}>
              Multi-Artist Operations, Unified.
            </h2>
            <p style={{ fontSize: '15.5px', color: '#969AA3', lineHeight: 1.6, marginBottom: '28px' }}>
              Scale your record label with consolidated distribution pipes, automated artist revenue splits, role-based team management (A&R, Marketing, Finance), and high-volume DDEX ERN 4.3 XML batching.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '36px' }}>
              {[
                { title: 'Unlimited Artist Rosters', desc: 'Manage separate artist identities, catalogs, and contracts in one unified workspace.' },
                { title: 'Automated Split Sheets', desc: 'Direct ledger payouts to songwriters, producers, and publishers without manual math.' },
                { title: 'Custom DDEX Feeds', desc: 'Proprietary SFTP/S3 pipes for rapid release ingestion with your own label P-Line.' },
                { title: 'Consolidated Statements', desc: 'Single-click monthly accounting statements with immutable audit trail.' },
              ].map((feat) => (
                <div key={feat.title} style={{ background: '#15181D', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#F5F3EE', marginBottom: '4px' }}>{feat.title}</div>
                  <div style={{ fontSize: '12px', color: '#969AA3', lineHeight: 1.4 }}>{feat.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowContactSalesModal(true)}
              style={{
                background: '#D6B36A',
                color: '#08090B',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '999px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 4px 18px rgba(214, 179, 106, 0.3)',
              }}
            >
              Book Label Consultation
            </button>
          </div>

          {/* Visual Showcase Card */}
          <div
            style={{
              background: '#15181D',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Monolith Sonic Recordings (UK)</div>
              <span style={{ background: 'rgba(214, 179, 106, 0.2)', color: '#D6B36A', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                LABEL TIER
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Neon Nights', artist: 'Gautam Giri', streams: '1.28M', share: '85% / 15% Split' },
                { name: 'After Dark (EP)', artist: 'Gautam Giri', streams: '420K', share: '80% / 20% Split' },
                { name: 'Lost Again', artist: 'Gautam Giri', streams: '180K', share: '90% / 10% Split' },
                { name: 'Midnight Drive', artist: 'Gautam Giri', streams: '310K', share: '100% Artist Direct' },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: '#1C2027',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#969AA3' }}>{item.artist}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#35E59A' }}>{item.streams}</div>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>{item.share}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: RESOURCES & STANDARDS ================= */}
      <section
        id="resources"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '100px 48px 120px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#35D5FF', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            <BookOpen size={16} />
            <span>KNOWLEDGE & INDUSTRY STANDARDS</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800 }}>Mastering & Distribution Guides</h2>
          <p style={{ fontSize: '15px', color: '#969AA3', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to deliver studio-grade masters conforming to international streaming specs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              id: 'ddex' as const,
              title: 'DDEX ERN 4.3 Architecture',
              desc: 'Learn how SONVÉRA packages your release metadata, party identifiers, and distribution deals into standard XML.',
              tag: 'Protocol Spec',
              icon: FileCode,
              accentColor: '#35D5FF',
            },
            {
              id: 'lufs' as const,
              title: 'Master Audio Standards (-14 LUFS)',
              desc: 'Best practices for 24-bit/48kHz WAV audio mastering, sample rate conversion, and avoiding DSP compression artifacts.',
              tag: 'Audio Engineering',
              icon: Volume2,
              accentColor: '#35E59A',
            },
            {
              id: 'isrc' as const,
              title: 'ISRC & UPC Registry Guide',
              desc: 'How International Standard Recording Codes and Universal Product Codes track your digital performance and royalties globally.',
              tag: 'Rights & Metadata',
              icon: Disc,
              accentColor: '#8B5CF6',
            },
          ].map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.id}
                style={{
                  background: '#15181D',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedSpecModal(res.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: res.accentColor,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {res.tag}
                    </span>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: res.accentColor,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0 10px' }}>{res.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#969AA3', lineHeight: 1.5 }}>{res.desc}</p>
                </div>

                <div
                  style={{
                    marginTop: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: res.accentColor,
                    fontSize: '13.5px',
                    fontWeight: 700,
                  }}
                >
                  <span>Read Full Specification</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER & PRODUCTION LEGAL ARCHITECTURE SUITE */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          background: '#040507',
          padding: '64px 48px 44px',
          color: '#E2E8F0',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto 44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '36px',
            textAlign: 'left',
          }}
        >
          {/* Column 1: Brand & Blueprint */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.08em', color: '#FFFFFF' }}>
                SONVÉRA
              </span>
              <span
                style={{
                  background: 'rgba(214, 179, 106, 0.2)',
                  color: '#E0C078',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(214, 179, 106, 0.35)',
                }}
              >
                PROD v1.0
              </span>
            </div>
            <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#CBD5E1', marginBottom: '18px' }}>
              Authoritative music distribution architecture. DDEX ERN 4.3 XML delivery to 150+ digital service providers worldwide with cryptographic royalty accounting.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => openTrustCenterWithTab('status')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(53, 229, 154, 0.12)',
                  border: '1px solid rgba(53, 229, 154, 0.45)',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  color: '#35E59A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'fit-content',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#35E59A', boxShadow: '0 0 10px #35E59A' }} />
                <span>All Systems Operational (99.98% SLA)</span>
              </button>
              <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5, fontWeight: 500 }}>
                Governed by OWASP ASVS 5.0 L2, DPDP Act 2023 & DMCA §512
              </div>
            </div>
          </div>

          {/* Column 2: Legal Pillar (Section 17 & 19) */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={14} color="#A78BFA" />
              <span>Legal Policies & Rights</span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              {[
                { slug: 'terms-of-service', label: 'Terms of Service' },
                { slug: 'privacy-policy', label: 'Privacy Policy (DPDP & GDPR)' },
                { slug: 'artist-distribution-agreement', label: 'Artist Distribution Agreement' },
                { slug: 'record-label-agreement', label: 'Record Label Master Terms' },
                { slug: 'content-policy', label: 'Content & Audio Standards' },
                { slug: 'ai-usage-policy', label: 'AI Usage & Training Policy' },
                { slug: 'pricing-and-fees', label: 'Pricing, Fees & Splits' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => setSelectedPolicySlug(item.slug)}
                    style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li style={{ marginTop: '4px' }}>
                <button
                  onClick={() => setSelectedPolicySlug('terms-of-service')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>View All 20 Policies →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Security & Infrastructure Pillar */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#35D5FF" />
              <span>Trust & Security</span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('status')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Public Status Page (status.sonvera.com)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('subprocessors')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Authorized Sub-processors Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('security')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Security Center (sonvera.com/trust)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('royalty-payment-terms')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Immutable Royalty Ledger Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('retention-deletion-policy')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  7-Year Statutory Ledger Retention
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('incident-response-policy')}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, fontSize: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#D1D5DB')}
                >
                  Incident Response (72h SLA)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Privacy Rights & Dedicated Support Intake */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} color="#E0C078" />
              <span>Rights & Dedicated Channels</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setShowPrivacyRights(true)}
                style={{
                  background: '#141822',
                  border: '1px solid rgba(53, 229, 154, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#35E59A';
                  e.currentTarget.style.background = '#181E2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(53, 229, 154, 0.3)';
                  e.currentTarget.style.background = '#141822';
                }}
              >
                <div style={{ color: '#35E59A', fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
                  Privacy & Data Rights Center
                </div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  Self-service JSON catalog export & deletion
                </div>
              </button>

              <button
                onClick={() => setShowCookiePreferences(true)}
                style={{
                  background: '#141822',
                  border: '1px solid rgba(214, 179, 106, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D6B36A';
                  e.currentTarget.style.background = '#181E2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(214, 179, 106, 0.3)';
                  e.currentTarget.style.background = '#141822';
                }}
              >
                <div style={{ color: '#E0C078', fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
                  Cookie Preferences Center
                </div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  Manage telemetry & zero-ad policy
                </div>
              </button>

              <button
                onClick={() => openReportingWithType('copyright')}
                style={{
                  background: '#141822',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#A78BFA';
                  e.currentTarget.style.background = '#181E2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.currentTarget.style.background = '#141822';
                }}
              >
                <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>
                  Report Copyright / DMCA Notice
                </div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  Expedited legal infringement channel
                </div>
              </button>

              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button
                  onClick={() => openReportingWithType('vulnerability')}
                  style={{
                    flex: 1,
                    background: '#171B26',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#E2E8F0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E2E8F0';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                  }}
                >
                  Report Vulnerability
                </button>
                <button
                  onClick={() => openReportingWithType('royalty_dispute')}
                  style={{
                    flex: 1,
                    background: '#171B26',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#E2E8F0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#E2E8F0';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                  }}
                >
                  Royalty Dispute
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '24px', textAlign: 'center', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>SONVÉRA Global Distribution Platform</span>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => openTrustCenterWithTab('status')}
              style={{ background: 'none', border: 'none', color: '#35E59A', cursor: 'pointer', padding: 0, fontWeight: 600, textDecoration: 'underline' }}
            >
              System Status
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => openTrustCenterWithTab('security')}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              Trust Center
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setShowPrivacyRights(true)}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              Privacy & Data Rights
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setShowCookiePreferences(true)}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              Cookie Preferences
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setSelectedPolicySlug('accessibility-statement')}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              Accessibility Statement
            </button>
          </div>
          <div style={{ color: '#94A3B8', fontSize: '12.5px', lineHeight: 1.5 }}>
            © 2026 SONVÉRA Inc. All rights reserved. MAKE MUSIC. MOVE CULTURE. Commercial platform policy architecture.
          </div>
        </div>
      </footer>

      {/* ================= MODAL: FULL SPECIFICATION READER ================= */}
      {selectedSpecModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#15181D',
              borderRadius: '24px',
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              color: '#F5F3EE',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span
                  style={{
                    background: 'rgba(53, 213, 255, 0.15)',
                    color: '#35D5FF',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedSpecModal === 'ddex' ? 'Standard Protocol ERN 4.3' : selectedSpecModal === 'lufs' ? 'Audio Engineering Standard' : 'Identifiers & Rights Registry'}
                </span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>
                  {selectedSpecModal === 'ddex' && 'DDEX ERN 4.3 Technical Specification'}
                  {selectedSpecModal === 'lufs' && 'Master Audio Quality & Loudness Standard (-14 LUFS)'}
                  {selectedSpecModal === 'isrc' && 'ISRC & UPC Identifier Architecture'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSpecModal(null)}
                style={{ background: '#1C2027', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, outline: 'none' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Content for DDEX */}
            {selectedSpecModal === 'ddex' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#969AA3', lineHeight: 1.6 }}>
                  SONVÉRA compiles every approved release into standard <strong>DDEX Electronic Release Notification (ERN) 4.3</strong> XML payloads. This guarantees automated ingestion into Spotify, Apple Music, YouTube Music, and Amazon without manual label intervention.
                </p>

                <div style={{ background: '#08090B', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#35D5FF' }}>release_feed_ern43.xml</span>
                    <button
                      onClick={() => showToast('DDEX sample copied to clipboard.')}
                      style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', outline: 'none' }}
                    >
                      <Copy size={12} />
                      <span>Copy Schema</span>
                    </button>
                  </div>
                  <pre style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#F5F3EE', lineHeight: 1.5, margin: 0, overflowX: 'auto' }}>
{`<?xml version="1.0" encoding="UTF-8"?>
<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/43" MessageSchemaVersionId="ern/43">
  <MessageHeader>
    <MessageThreadId>ERN43_SONVERA_793573194012</MessageThreadId>
    <MessageSender>
      <PartyId Namespace="PADPIDA">PADPIDA2026SONVERA01</PartyId>
      <PartyName><FullName>SONVÉRA Distribution Hub</FullName></PartyName>
    </MessageSender>
  </MessageHeader>
  <ResourceList>
    <SoundRecording>
      <SoundRecordingEdition>
        <TechnicalSoundRecordingDetails>
          <AudioCodecType>WAV</AudioCodecType>
          <SamplingRate UnitOfMeasure="Hz">48000</SamplingRate>
          <BitsPerSample>24</BitsPerSample>
        </TechnicalSoundRecordingDetails>
      </SoundRecordingEdition>
    </SoundRecording>
  </ResourceList>
</ern:NewReleaseMessage>`}
                  </pre>
                </div>

                <div style={{ background: '#1C2027', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Key Architecture Rules</h4>
                  <ul style={{ fontSize: '13px', color: '#969AA3', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
                    <li>All release identifiers use globally unique UPC/EAN barcodes.</li>
                    <li>Audio masters must accompany checksum verification (MD5 hash).</li>
                    <li>Deals specify territory availability (Worldwide WW or granular ISO-3166 codes).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Content for LUFS */}
            {selectedSpecModal === 'lufs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#969AA3', lineHeight: 1.6 }}>
                  Global streaming services normalize playback to provide a consistent listener experience. SONVÉRA automatically analyzes your WAV masters against streaming loudness targets.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div style={{ background: '#1C2027', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '12px', color: '#969AA3' }}>Spotify & YouTube</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#35E59A', margin: '4px 0' }}>-14.0 LUFS</div>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>True Peak: -1.0 dBTP</div>
                  </div>
                  <div style={{ background: '#1C2027', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '12px', color: '#969AA3' }}>Apple Music</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#35D5FF', margin: '4px 0' }}>-16.0 LUFS</div>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Apple Digital Masters 24-bit</div>
                  </div>
                  <div style={{ background: '#1C2027', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '12px', color: '#969AA3' }}>TIDAL & Amazon HD</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#D6B36A', margin: '4px 0' }}>-14.0 LUFS</div>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Lossless FLAC 96kHz / 24-bit</div>
                  </div>
                </div>

                <div style={{ background: '#1C2027', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Audio Upload Checklist</h4>
                  <ul style={{ fontSize: '13px', color: '#969AA3', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
                    <li>Sample rate: 44.1 kHz, 48 kHz, 88.2 kHz, 96 kHz, or 192 kHz.</li>
                    <li>Bit depth: 16-bit or 24-bit PCM WAV (MP3/AAC master files are automatically rejected).</li>
                    <li>Leave at least -1.0 dBTP headroom to prevent inter-sample clipping on lossy conversion.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Content for ISRC */}
            {selectedSpecModal === 'isrc' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '14.5px', color: '#969AA3', lineHeight: 1.6 }}>
                  An <strong>ISRC (International Standard Recording Code)</strong> is the digital fingerprint for your sound recordings. SONVÉRA automatically assigns authoritative ISRCs to every distributed track.
                </p>

                <div style={{ background: '#1C2027', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '12px', color: '#969AA3', marginBottom: '8px' }}>SONVÉRA ISRC ANATOMY</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: '#8B5CF6', marginBottom: '14px' }}>
                    US - SVR - 26 - 00101
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12px' }}>
                    <div style={{ background: '#15181D', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#35D5FF', fontWeight: 700 }}>US</span>: Country Code
                    </div>
                    <div style={{ background: '#15181D', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#8B5CF6', fontWeight: 700 }}>SVR</span>: Registrant (SONVÉRA)
                    </div>
                    <div style={{ background: '#15181D', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#35E59A', fontWeight: 700 }}>26</span>: Year of Reference (2026)
                    </div>
                    <div style={{ background: '#15181D', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#D6B36A', fontWeight: 700 }}>00101</span>: Unique Designation Code
                    </div>
                  </div>
                </div>

                <div style={{ background: '#1C2027', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>UPC / Barcode Rules</h4>
                  <p style={{ fontSize: '13px', color: '#969AA3', lineHeight: 1.5, margin: 0 }}>
                    Every Single, EP, and Album is allocated a 12-digit Universal Product Code (UPC). If you already own an existing ISRC or UPC from a previous distributor, you can enter it in Step 4 of the Release Builder to preserve historical stream counts and playlist placements.
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setSelectedSpecModal(null)}
                style={{
                  background: '#8B5CF6',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INTERACTIVE WATCH DEMO ================= */}
      {showDemoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#15181D',
              borderRadius: '24px',
              maxWidth: '880px',
              width: '100%',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              color: '#F5F3EE',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#8B5CF6', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                  <Play size={18} fill="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>SONVÉRA Interactive Product Tour</h3>
                  <p style={{ fontSize: '13px', color: '#969AA3' }}>See how music travels from your studio to 150+ global stores.</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                style={{ background: '#1C2027', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Demo Sub-Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              {[
                { id: 'audio', label: '1. Master Quality Gate' },
                { id: 'ddex', label: '2. DDEX ERN 4.3 Dispatch' },
                { id: 'analytics', label: '3. Streaming Telemetry' },
                { id: 'royalties', label: '4. Immutable Royalties' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDemoTab(t.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: demoTab === t.id ? '#8B5CF6' : 'transparent',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Audio Quality Gate */}
            {demoTab === 'audio' && (
              <div style={{ background: '#1C2027', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Lossless Master Verification</h4>
                <p style={{ fontSize: '13.5px', color: '#969AA3', marginBottom: '18px' }}>
                  SONVÉRA processes master audio in real-time, verifying bit-depth, true peak, and sample rate.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#15181D', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Format</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#35E59A' }}>WAV Lossless</div>
                  </div>
                  <div style={{ background: '#15181D', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Sample Rate</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#35E59A' }}>48,000 Hz</div>
                  </div>
                  <div style={{ background: '#15181D', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Loudness</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#35E59A' }}>-14.1 LUFS</div>
                  </div>
                  <div style={{ background: '#15181D', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#969AA3' }}>Artwork Check</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#35E59A' }}>3000×3000 RGB</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: DDEX Dispatch */}
            {demoTab === 'ddex' && (
              <div style={{ background: '#1C2027', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Standardized Global Delivery</h4>
                <p style={{ fontSize: '13.5px', color: '#969AA3', marginBottom: '18px' }}>
                  Releases are compiled into DDEX ERN 4.3 XML packages dispatched simultaneously to Spotify, Apple, Amazon, YouTube, and JioSaavn.
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', background: '#08090B', padding: '16px', borderRadius: '10px', color: '#35D5FF' }}>
                  {`<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/43">\n  <MessageHeader>\n    <MessageThreadId>ERN43_SONVERA_793573194012</MessageThreadId>\n    <PartyName>SONVÉRA Global Distribution Platform</PartyName>\n  </MessageHeader>\n</ern:NewReleaseMessage>`}
                </div>
              </div>
            )}

            {/* Tab 3: Streaming Analytics */}
            {demoTab === 'analytics' && (
              <div style={{ background: '#1C2027', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Daily Ingestion Telemetry</h4>
                <p style={{ fontSize: '13.5px', color: '#969AA3', marginBottom: '18px' }}>
                  Observe peak stream volumes, playlist placements, and geographic heatmaps in real time.
                </p>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#35E59A' }}>1,284,921</div>
                  <div style={{ fontSize: '13px', color: '#969AA3' }}>Monthly streams across Spotify, Apple Music, and YouTube Music (+24%)</div>
                </div>
              </div>
            )}

            {/* Tab 4: Royalties */}
            {demoTab === 'royalties' && (
              <div style={{ background: '#1C2027', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Immutable Royalty Ledger</h4>
                <p style={{ fontSize: '13.5px', color: '#969AA3', marginBottom: '18px' }}>
                  Zero hidden distributor fees. 100% of store payouts pass directly to your balance.
                </p>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#D6B36A', marginBottom: '6px' }}>$5,124.60 USD</div>
                <div style={{ fontSize: '12px', color: '#969AA3' }}>Ready for instant withdrawal via Stripe Direct or Bank Wire.</div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  onEnterDashboard();
                }}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Launch Live Artist Console →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCTION-GRADE CINEMATIC AUTH VIEW ================= */}
      {authMode && (
        <AuthView
          initialMode={authMode}
          onAuthSuccess={(userData) => {
            setAuthMode(null);
            showToast(`Welcome back, ${userData?.name || userData?.email || 'Artist'}!`);
            onEnterDashboard();
          }}
          onClose={() => setAuthMode(null)}
          onOpenPolicy={(slug) => setSelectedPolicySlug(slug)}
          onEnterAdmin={onEnterAdmin}
        />
      )}

      {/* ================= MODAL: CONTACT SALES ================= */}
      {showContactSalesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#15181D',
              borderRadius: '24px',
              maxWidth: '540px',
              width: '100%',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              color: '#F5F3EE',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Record Label & Enterprise Consultation</h3>
              <button
                onClick={() => setShowContactSalesModal(false)}
                style={{ background: '#1C2027', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#969AA3', marginBottom: '20px' }}>
              Speak with a SONVÉRA label specialist for custom DDEX feeds, catalog migration, and dedicated ingestion pipes.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Thank you! A label specialist will contact ${labelForm.email || 'you'} shortly.`);
                setShowContactSalesModal(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label style={{ fontSize: '12px', color: '#969AA3', display: 'block', marginBottom: '4px' }}>Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={labelForm.name}
                  onChange={(e) => setLabelForm({ ...labelForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1C2027', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#969AA3', display: 'block', marginBottom: '4px' }}>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="operations@recordlabel.com"
                  value={labelForm.email}
                  onChange={(e) => setLabelForm({ ...labelForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1C2027', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#969AA3', display: 'block', marginBottom: '4px' }}>Record Label / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monolith Sonic Recordings"
                  value={labelForm.labelName}
                  onChange={(e) => setLabelForm({ ...labelForm, labelName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1C2027', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#969AA3', display: 'block', marginBottom: '4px' }}>Catalog Size</label>
                <select
                  value={labelForm.catalogSize}
                  onChange={(e) => setLabelForm({ ...labelForm, catalogSize: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1C2027', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                >
                  <option value="1-10 releases">1 - 10 releases</option>
                  <option value="10-50 releases">10 - 50 releases</option>
                  <option value="50-200 releases">50 - 200 releases</option>
                  <option value="200+ releases">200+ releases (Enterprise Tier)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  background: '#D6B36A',
                  color: '#08090B',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Submit Consultation Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: LEGAL & PRIVACY POLICY SUITE ================= */}
      <LegalPoliciesModal
        isOpen={selectedPolicySlug !== null}
        initialSlug={selectedPolicySlug || 'terms-of-service'}
        onClose={() => setSelectedPolicySlug(null)}
        onOpenTrustCenter={() => openTrustCenterWithTab('status')}
        onOpenCookiePreferences={() => setShowCookiePreferences(true)}
        onOpenPrivacyRights={() => setShowPrivacyRights(true)}
        onOpenReporting={(m) => {
          const mappedType: 'copyright' | 'vulnerability' | 'royalty_dispute' =
            m === 'vulnerability' ? 'vulnerability' : m === 'dispute' ? 'royalty_dispute' : 'copyright';
          openReportingWithType(mappedType);
        }}
      />

      {/* ================= MODAL: TRUST CENTER & STATUS PAGE ================= */}
      <TrustCenterModal
        isOpen={showTrustCenter}
        initialTab={trustCenterTab}
        onClose={() => setShowTrustCenter(false)}
      />

      {/* ================= MODAL: COOKIE PREFERENCES CENTER ================= */}
      <CookiePreferencesModal
        isOpen={showCookiePreferences}
        onClose={() => setShowCookiePreferences(false)}
      />

      {/* ================= MODAL: USER PRIVACY & DATA RIGHTS CENTER ================= */}
      <UserPrivacyRightsModal
        isOpen={showPrivacyRights}
        onClose={() => setShowPrivacyRights(false)}
      />

      {/* ================= MODAL: DEDICATED REPORTING & INTAKE ================= */}
      <DedicatedReportingModal
        isOpen={showReportingModal}
        initialType={reportingType}
        onClose={() => setShowReportingModal(false)}
      />

      {/* ================= PERSISTENT COOKIE & TRACKING CONSENT BANNER ================= */}
      {showCookieBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            width: '90%',
            maxWidth: '680px',
            background: 'rgba(15, 17, 21, 0.95)',
            border: '1px solid rgba(214, 179, 106, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
            color: '#F5F3EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(214, 179, 106, 0.15)', color: '#D6B36A', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                PRIVACY TRANSPARENCY
              </span>
              <span style={{ fontSize: '11px', color: '#969AA3' }}>Zero Advertising Pixels</span>
            </div>
            <p style={{ fontSize: '12px', color: '#B0B4BC', margin: 0, lineHeight: 1.5 }}>
              SONVÉRA uses strictly essential tokens for DDEX dispatch and secure auth. We never sell your data or deploy cross-site marketing trackers.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setShowCookiePreferences(true)}
              style={{
                background: '#1C2027',
                border: '1px solid #262B35',
                color: '#969AA3',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Preferences
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.setItem('sonvera_cookie_consent', 'accepted_all');
                } catch {}
                setShowCookieBanner(false);
              }}
              style={{
                background: '#D6B36A',
                color: '#08090B',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Accept Essential
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
