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

interface LandingPageViewProps {
  onEnterDashboard: () => void;
  onStartRelease: () => void;
  onEnterAdmin?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterDashboard,
  onStartRelease,
  onEnterAdmin,
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
  // Clean URL routing: if any auth hash or path exists, cleanly keep on landing
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const curHash = window.location.hash.toLowerCase();
      const curPath = window.location.pathname.toLowerCase();
      if (
        ['#login', '#register', '#forgot-password'].includes(curHash) ||
        ['/login', '/register', '/forgot-password', '/auth/callback'].some((p) => curPath.startsWith(p))
      ) {
        window.history.replaceState(null, '', '/#landing');
      }
    }
  }, []);

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
            onClick={onEnterDashboard}
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
            onClick={onEnterDashboard}
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
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '70px 48px 100px',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '50px',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Background Ambient Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '5%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0) 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'heroGlowPulse 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '0%',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(53, 213, 255, 0.16) 0%, rgba(139, 92, 246, 0.12) 40%, rgba(53, 213, 255, 0) 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'heroGlowPulse 10s ease-in-out infinite alternate',
          }}
        />

        {/* Left Column Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Pill Announcement Badge */}
          <div className="hero-pill-badge">
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#35E59A',
                boxShadow: '0 0 10px #35E59A',
                animation: 'radarPing 2s infinite',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 700, color: '#35E59A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live V3.4
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 600 }}>
              Zero-Commission DSP Distribution Suite
            </span>
            <Sparkles size={13} style={{ color: '#D6B36A', marginLeft: '2px' }} />
          </div>

          <h1
            style={{
              fontSize: '62px',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              marginBottom: '22px',
            }}
          >
            Music distribution,
            <br />
            built around{' '}
            <span className="hero-gradient-text">
              the artist.
            </span>
          </h1>

          <p
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#F8FAFC',
              marginBottom: '14px',
              letterSpacing: '-0.015em',
            }}
          >
            Upload once. Distribute everywhere. Retain 100% of your rights.
          </p>

          <p
            style={{
              fontSize: '15.5px',
              lineHeight: 1.68,
              color: '#94A3B8',
              marginBottom: '36px',
              maxWidth: '560px',
            }}
          >
            Direct-to-DSP delivery across Spotify, Apple Music, TikTok, and 150+ platforms in under 24 hours. Manage master catalogs, monitor live stream telemetry, and receive daily automated royalty payouts.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '44px', flexWrap: 'wrap' }}>
            <button
              onClick={onEnterDashboard}
              className="hero-primary-btn"
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} style={{ transition: 'transform 0.2s ease' }} />
            </button>

            {/* Watch Demo - Opens Interactive Walkthrough Modal */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="hero-secondary-btn"
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)',
                }}
              >
                <Play size={12} fill="#ffffff" style={{ marginLeft: '2px' }} />
              </div>
              <span>Watch 60s Demo</span>
            </button>
          </div>

          {/* 4 Feature Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px',
              paddingTop: '10px',
            }}
          >
            <div className="hero-stat-card">
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>150+</div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', fontWeight: 500 }}>Global DSPs</div>
            </div>

            <div className="hero-stat-card">
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#35E59A', letterSpacing: '-0.02em' }}>0%</div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', fontWeight: 500 }}>We Take 0% Rights</div>
            </div>

            <div className="hero-stat-card">
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#35D5FF', letterSpacing: '-0.02em' }}>24h</div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', fontWeight: 500 }}>Fast-Track Ingestion</div>
            </div>

            <div className="hero-stat-card">
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#D6B36A', letterSpacing: '-0.02em' }}>100%</div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', fontWeight: 500 }}>Royalties Kept</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Graphic with Multi-Layered Floating Glass Cards */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
          {/* Ambient Glow Behind Graphic */}
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(53, 213, 255, 0.2) 40%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              borderRadius: '40px',
            }}
          />

          {/* Main Visual Centerpiece with Floating Animation */}
          <div
            style={{
              width: '470px',
              height: '530px',
              borderRadius: '32px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 60px rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              animation: 'heroVisualFloat 9s ease-in-out infinite',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
              alt="Artist Studio Master Recording"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Studio Backlight & Vignette Gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.25) 0%, rgba(8, 9, 11, 0.2) 40%, rgba(8, 9, 11, 0.8) 100%)',
              }}
            />

            {/* Subtle Inner Glass Highlight */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '32px',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Floating UI Widget 1: Top-Right Live DSP Sync */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '-18px',
              background: 'rgba(17, 20, 29, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '999px',
              padding: '9px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(53, 229, 154, 0.2)',
              animation: 'floatBadge1 5.5s ease-in-out infinite',
              zIndex: 3,
            }}
          >
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#35E59A',
                boxShadow: '0 0 10px #35E59A',
                animation: 'radarPing 1.8s infinite',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Live DSP Sync • 184 Countries
            </span>
          </div>

          {/* Floating UI Widget 2: Animated Stream Telemetry Card */}
          <div
            style={{
              position: 'absolute',
              top: '90px',
              right: '-36px',
              background: 'rgba(18, 22, 33, 0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '18px 22px',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.25)',
              width: '210px',
              animation: 'floatBadge2 6.5s ease-in-out infinite alternate',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>1.28M</span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#35E59A',
                  fontWeight: 700,
                  background: 'rgba(53, 229, 154, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(53, 229, 154, 0.3)',
                }}
              >
                +24.8%
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8' }} />
              <span>Real-time Stream Telemetry</span>
            </div>

            {/* Live Animated Equalizer Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '40px', paddingBottom: '2px' }}>
              {[
                { anim: 'eqBounce1', dur: '1.1s', bg: 'linear-gradient(180deg, #35D5FF 0%, #2563EB 100%)' },
                { anim: 'eqBounce2', dur: '0.85s', bg: 'linear-gradient(180deg, #38BDF8 0%, #6366F1 100%)' },
                { anim: 'eqBounce3', dur: '1.25s', bg: 'linear-gradient(180deg, #818CF8 0%, #8B5CF6 100%)' },
                { anim: 'eqBounce4', dur: '0.95s', bg: 'linear-gradient(180deg, #A855F7 0%, #8B5CF6 100%)' },
                { anim: 'eqBounce5', dur: '1.4s', bg: 'linear-gradient(180deg, #C084FC 0%, #9333EA 100%)' },
                { anim: 'eqBounce6', dur: '0.9s', bg: 'linear-gradient(180deg, #8B5CF6 0%, #35D5FF 100%)' },
                { anim: 'eqBounce7', dur: '1.15s', bg: 'linear-gradient(180deg, #35D5FF 0%, #35E59A 100%)' },
                { anim: 'eqBounce8', dur: '0.8s', bg: 'linear-gradient(180deg, #35E59A 0%, #10B981 100%)' },
              ].map((bar, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: bar.bg,
                    borderRadius: '4px',
                    animation: `${bar.anim} ${bar.dur} ease-in-out infinite alternate`,
                    boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating UI Widget 3: Now Playing Vinyl & Master Audio */}
          <div
            style={{
              position: 'absolute',
              bottom: '48px',
              left: '-28px',
              background: 'rgba(18, 22, 33, 0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(53, 213, 255, 0.2)',
              animation: 'floatBadge3 7s ease-in-out infinite alternate',
              zIndex: 3,
            }}
          >
            {/* Spinning Vinyl Graphic with Album Cover */}
            <div style={{ position: 'relative', width: '48px', height: '48px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '12px',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #2A2E3D 20%, #11131A 40%, #1E2330 60%, #0A0C10 80%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                  animation: 'vinylSpin 10s linear infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8B5CF6' }} />
              </div>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"
                alt="Release Artwork"
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  zIndex: 2,
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>Midnight Resonance</div>
              <div style={{ fontSize: '11px', color: '#A78BFA', fontWeight: 600 }}>FLAC 24-bit / 96kHz Lossless</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: '#35E59A', fontWeight: 700, background: 'rgba(53, 229, 154, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                  APPROVED
                </span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>DDEX ERN 4.3</span>
              </div>
            </div>
          </div>

          {/* Floating UI Widget 4: Instant Royalty Settlement */}
          <div
            style={{
              position: 'absolute',
              bottom: '-22px',
              right: '20px',
              background: 'rgba(18, 22, 33, 0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '999px',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(214, 179, 106, 0.2)',
              animation: 'floatBadge4 6s ease-in-out infinite alternate',
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900,
              }}
            >
              $
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#F8FAFC' }}>
                Settled to Stripe • <span style={{ color: '#35E59A' }}>+$14,820.40</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY LOGO STRIP WITH INTERACTIVE DSP CHIPS */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(17, 20, 29, 0.7) 0%, rgba(10, 12, 17, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '28px 48px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span>Trusted by 120,000+ independent artists and record labels globally</span>
          <span style={{ color: '#D6B36A', fontSize: '12px' }}>★★★★★</span>
        </div>

        {/* DSP Partner Badges with Branded SVGs & Hover Lighting */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Spotify */}
          <div className="dsp-chip" style={{ '--hover-color': '#1DB954' } as React.CSSProperties}>
            <svg style={{ width: '18px', height: '18px', fill: '#1DB954' }} viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
            </svg>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>Spotify</span>
          </div>

          {/* Apple Music */}
          <div className="dsp-chip">
            <svg style={{ width: '17px', height: '17px', fill: '#FA243C' }} viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
            </svg>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>Apple Music</span>
          </div>

          {/* YouTube Music */}
          <div className="dsp-chip">
            <svg style={{ width: '18px', height: '18px', fill: '#FF0000' }} viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>YouTube Music</span>
          </div>

          {/* Amazon Music */}
          <div className="dsp-chip">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.02em' }}>amazon</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>music</span>
          </div>

          {/* TIDAL */}
          <div className="dsp-chip">
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              <div style={{ width: '7px', height: '7px', background: '#35D5FF', transform: 'rotate(45deg)' }} />
              <div style={{ width: '7px', height: '7px', background: '#FFFFFF', transform: 'rotate(45deg)' }} />
              <div style={{ width: '7px', height: '7px', background: '#FFFFFF', transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '0.06em' }}>TIDAL</span>
          </div>

          {/* TikTok */}
          <div className="dsp-chip">
            <svg style={{ width: '16px', height: '16px', fill: '#FFFFFF' }} viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>TikTok</span>
          </div>

          {/* Deezer */}
          <div className="dsp-chip">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
              <span style={{ width: '2px', height: '6px', background: '#FF0092', borderRadius: '1px' }} />
              <span style={{ width: '2px', height: '14px', background: '#A855F7', borderRadius: '1px' }} />
              <span style={{ width: '2px', height: '10px', background: '#38BDF8', borderRadius: '1px' }} />
              <span style={{ width: '2px', height: '8px', background: '#35E59A', borderRadius: '1px' }} />
            </div>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>Deezer</span>
          </div>

          {/* JioSaavn */}
          <div className="dsp-chip">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2BC5B4', boxShadow: '0 0 8px #2BC5B4' }} />
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>JioSaavn</span>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: 4-STEP RELEASE PIPELINE ================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '100px 48px 80px', position: 'relative' }}>
        {/* Subtle Ambient Background Light */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(53, 213, 255, 0.06) 50%, transparent 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
          <div className="hero-pill-badge" style={{ marginBottom: '16px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#35D5FF',
                boxShadow: '0 0 8px #35D5FF',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 700, color: '#35D5FF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Deterministic Ingestion
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 600 }}>
              99.98% First-Pass Approval Rate
            </span>
          </div>

          <h2 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            The Release Pipeline,{' '}
            <span className="hero-gradient-text">Perfected.</span>
          </h2>
          <p style={{ fontSize: '16.5px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            A zero-error, 7-step automated compliance gate that transforms raw masters into store-ready DDEX packages within seconds.
          </p>
        </div>

        {/* 4 Pipeline Step Cards with Connected Glow Beam */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Animated Connecting Flow Beam (Desktop) */}
          <div
            style={{
              position: 'absolute',
              top: '44px',
              left: '80px',
              right: '80px',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(53, 213, 255, 0.2) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(214, 179, 106, 0.2) 100%)',
              zIndex: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '35%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, #35D5FF, #8B5CF6, transparent)',
                boxShadow: '0 0 12px #35D5FF',
                animation: 'pipelineFlowGlow 4s linear infinite',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative', zIndex: 1 }}>
            {[
              {
                step: '01',
                title: 'Master Audio & Art',
                desc: 'Lossless WAV 24-bit/48kHz validation with integrated ITU-R BS.1770 LUFS check and 3000×3000px RGB artwork inspection.',
                icon: Upload,
                accent: '#35D5FF',
                glow: 'rgba(53, 213, 255, 0.25)',
                badge: 'AUDIO & ART',
                tags: ['WAV 24-bit/48kHz', '-14 LUFS', 'RGB 3000px'],
              },
              {
                step: '02',
                title: 'Metadata & Split Sheets',
                desc: 'Instant ISRC and UPC generation, explicit parental rating validation, and immutable contributor royalty split sheets.',
                icon: FileCode,
                accent: '#35E59A',
                glow: 'rgba(53, 229, 154, 0.25)',
                badge: 'RIGHTS & SPLITS',
                tags: ['Auto ISRC / UPC', 'Explicit Flag', '100% Splits'],
              },
              {
                step: '03',
                title: 'DDEX ERN 4.3 Batching',
                desc: 'Standardized digital packaging compiled into XML payloads and transmitted directly to Apple, Spotify, Amazon, and JioSaavn.',
                icon: Globe,
                accent: '#8B5CF6',
                glow: 'rgba(139, 92, 246, 0.25)',
                badge: 'STORE DELIVERY',
                tags: ['DDEX ERN 4.3', 'Direct API', 'Instant Sync'],
              },
              {
                step: '04',
                title: 'Telemetry & Payouts',
                desc: 'Real-time streaming telemetry, transparent playlist reporting, and ledger-backed daily payouts direct to your bank account.',
                icon: DollarSign,
                accent: '#D6B36A',
                glow: 'rgba(214, 179, 106, 0.25)',
                badge: 'ROYALTIES & STATS',
                tags: ['Live Streams', 'Daily Payouts', 'Ledger Backed'],
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="pipeline-card"
                  style={
                    {
                      '--card-accent': `linear-gradient(90deg, ${item.accent}, #8B5CF6)`,
                      '--card-glow': item.glow,
                      '--card-accent-solid': item.accent,
                    } as React.CSSProperties
                  }
                >
                  <div>
                    {/* Header Row: Icon + Step Mono Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                      <div className="pipeline-icon-box" style={{ color: item.accent }}>
                        <Icon size={22} />
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: item.accent,
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: `0 0 10px ${item.glow}`,
                        }}
                      >
                        STEP {item.step}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '10px', color: '#FFFFFF', letterSpacing: '-0.015em' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 600,
                          color: '#CBD5E1',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global DSP Grid (Redesigned with Official Logos, Hover Glows & Badges) */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(20, 24, 34, 0.75) 0%, rgba(12, 14, 20, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            padding: '42px 36px',
            marginTop: '64px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Glow inside container */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '180px',
              background: 'radial-gradient(ellipse, rgba(53, 213, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Your music on 150+ streaming platforms worldwide.
            </h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#94A3B8' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#35E59A', boxShadow: '0 0 8px #35E59A' }} />
              <span style={{ fontWeight: 600, color: '#35E59A' }}>All Direct DSP Pipelines Active</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span>Average store ingestion: &lt; 18 hours</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', position: 'relative', zIndex: 1 }}>
            {[
              {
                name: 'Spotify',
                color: '#1DB954',
                glow: 'rgba(29, 185, 84, 0.35)',
                tag: '24h Ingestion',
                svg: (
                  <svg style={{ width: '22px', height: '22px', fill: '#1DB954' }} viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.73-6.392-2.122-10.587-1.163-.406.094-.814-.158-.908-.564-.094-.406.158-.814.564-.908 4.595-1.05 8.536-.612 11.712 1.349.356.217.47.677.252 1.034zm1.468-3.264c-.274.444-.858.587-1.302.313-3.24-1.993-8.18-2.569-12.012-1.405-.499.151-1.025-.133-1.176-.632-.151-.499.133-1.025.632-1.176 4.38-1.33 9.824-.69 13.545 1.6.444.274.587.858.313 1.302zm.126-3.41c-3.886-2.308-10.298-2.52-14.01-1.393-.596.18-1.228-.157-1.408-.753-.18-.596.157-1.228.753-1.408 4.267-1.296 11.344-1.053 15.82 1.606.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
                  </svg>
                ),
              },
              {
                name: 'Apple Music',
                color: '#FA243C',
                glow: 'rgba(250, 36, 60, 0.35)',
                tag: 'Spatial Audio',
                svg: (
                  <svg style={{ width: '21px', height: '21px', fill: '#FA243C' }} viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.03-.5 2.64-1.23z" />
                  </svg>
                ),
              },
              {
                name: 'YouTube Music',
                color: '#FF0000',
                glow: 'rgba(255, 0, 0, 0.35)',
                tag: 'Content ID',
                svg: (
                  <svg style={{ width: '22px', height: '22px', fill: '#FF0000' }} viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ),
              },
              {
                name: 'Amazon Music',
                color: '#00A8E1',
                glow: 'rgba(0, 168, 225, 0.35)',
                tag: 'HD / Ultra HD',
                svg: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#00A8E1', letterSpacing: '-0.02em' }}>amazon</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#FFFFFF' }}>music</span>
                  </div>
                ),
              },
              {
                name: 'JioSaavn',
                color: '#2BC5B4',
                glow: 'rgba(43, 197, 180, 0.35)',
                tag: 'South Asia Direct',
                svg: (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2BC5B4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A' }} />
                  </div>
                ),
              },
              {
                name: 'TIDAL',
                color: '#35D5FF',
                glow: 'rgba(53, 213, 255, 0.35)',
                tag: 'HiFi Plus FLAC',
                svg: (
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', background: '#35D5FF', transform: 'rotate(45deg)' }} />
                    <div style={{ width: '6px', height: '6px', background: '#FFFFFF', transform: 'rotate(45deg)' }} />
                    <div style={{ width: '6px', height: '6px', background: '#FFFFFF', transform: 'rotate(45deg)' }} />
                  </div>
                ),
              },
              {
                name: 'Deezer',
                color: '#FF0092',
                glow: 'rgba(255, 0, 146, 0.35)',
                tag: 'Lossless Audio',
                svg: (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
                    <span style={{ width: '3px', height: '8px', background: '#FF0092', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '18px', background: '#A855F7', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '13px', background: '#38BDF8', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '10px', background: '#35E59A', borderRadius: '1px' }} />
                  </div>
                ),
              },
              {
                name: 'Wynk Music',
                color: '#EB1C24',
                glow: 'rgba(235, 28, 36, 0.35)',
                tag: 'Airtel Network',
                svg: (
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#EB1C24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '11px' }}>
                    W
                  </div>
                ),
              },
              {
                name: 'Gaana',
                color: '#E72C30',
                glow: 'rgba(231, 44, 48, 0.35)',
                tag: 'Direct Ingestion',
                svg: (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E72C30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '10px' }}>
                    G
                  </div>
                ),
              },
              {
                name: 'Instagram',
                color: '#E1306C',
                glow: 'rgba(225, 48, 108, 0.35)',
                tag: 'Reels & Stories',
                svg: (
                  <svg style={{ width: '20px', height: '20px', fill: '#E1306C' }} viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ),
              },
              {
                name: 'TikTok',
                color: '#FE2C55',
                glow: 'rgba(254, 44, 85, 0.35)',
                tag: 'Viral Sound Sync',
                svg: (
                  <svg style={{ width: '20px', height: '20px', fill: '#FFFFFF' }} viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                ),
              },
              {
                name: 'Facebook Audio',
                color: '#1877F2',
                glow: 'rgba(24, 119, 242, 0.35)',
                tag: 'Meta Sound Catalog',
                svg: (
                  <svg style={{ width: '20px', height: '20px', fill: '#1877F2' }} viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ),
              },
            ].map((p) => (
              <div
                key={p.name}
                className="platform-grid-card"
                style={
                  {
                    '--p-color': p.color,
                    '--p-glow': p.glow,
                    '--p-border': p.color,
                  } as React.CSSProperties
                }
              >
                <div className="platform-icon-wrap">{p.svg}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{p.name}</div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', fontWeight: 500 }}>{p.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: PRICING ================= */}
      <section
        id="pricing"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '80px 48px 120px',
          position: 'relative',
        }}
      >
        {/* Ambient Center Glow behind PRO Card */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(53, 213, 255, 0.1) 45%, transparent 70%)',
            filter: 'blur(95px)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'heroGlowPulse 8s ease-in-out infinite alternate',
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 1 }}>
          <div className="hero-pill-badge" style={{ marginBottom: '16px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#D6B36A',
                boxShadow: '0 0 8px #D6B36A',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 700, color: '#D6B36A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Transparent Pricing
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 600 }}>
              Keep 100% Ownership & Royalties
            </span>
          </div>

          <h2 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            Simple, transparent pricing
            <br />
            for every <span className="hero-gradient-text">artist's journey.</span>
          </h2>
          <p style={{ fontSize: '16.5px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Distribute your music worldwide without signing away your rights. Upgrade, downgrade, or cancel anytime with single-click ease.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '999px',
              padding: '5px',
              marginTop: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '8px 22px',
                borderRadius: '999px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.25s ease',
                boxShadow: billingCycle === 'monthly' ? '0 4px 14px rgba(139, 92, 246, 0.4)' : 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #8B5CF6 0%, #35D5FF 100%)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '8px 22px',
                borderRadius: '999px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
                transition: 'all 0.25s ease',
                boxShadow: billingCycle === 'yearly' ? '0 4px 16px rgba(53, 213, 255, 0.4)' : 'none',
              }}
            >
              <span>Yearly</span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  background: 'rgba(53, 229, 154, 0.25)',
                  color: '#35E59A',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(53, 229, 154, 0.4)',
                  letterSpacing: '0.04em',
                }}
              >
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Card 1: FREE / STARTER */}
          <div className="pricing-card-base">
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(53, 213, 255, 0.1)',
                    border: '1px solid rgba(53, 213, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#35D5FF',
                  }}
                >
                  <Disc size={22} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#35D5FF',
                    background: 'rgba(53, 213, 255, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid rgba(53, 213, 255, 0.18)',
                  }}
                >
                  STARTER
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Free Tier
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
                Ideal for emerging independent creators publishing their first tracks.
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '46px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>₹0</span>
                <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>/forever</span>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  'Global DSP Distribution (Spotify, Apple, 30+ stores)',
                  'Lossless Audio Ingestion (16-bit / 44.1kHz FLAC & WAV)',
                  '100% Master Ownership (0% Commission Taken)',
                  'Release & Metadata Manager',
                  'Standard Monthly Royalty Reporting (CSV)',
                  'Community & Help Center Support',
                ].map((f) => (
                  <div key={f} className="pricing-feature-row">
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(53, 229, 154, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Check size={12} color="#35E59A" />
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#CBD5E1' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onEnterDashboard}
              className="pricing-btn-secondary"
              style={{ marginTop: '36px' }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: PRO / ARTIST ACCELERATOR (Most Popular) */}
          <div className="pricing-card-pro">
            {/* Top Floating Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-13px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #8B5CF6 0%, #35D5FF 100%)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '5px 16px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 18px rgba(139, 92, 246, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={12} />
              <span>Most Popular • 10x Velocity</span>
            </div>

            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A78BFA',
                  }}
                >
                  <Sparkles size={22} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#DDD6FE',
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  }}
                >
                  PRO ARTIST
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Artist Accelerator
              </h3>
              <p style={{ fontSize: '13.5px', color: '#CBD5E1', marginBottom: '24px', lineHeight: 1.5 }}>
                For dedicated independent artists aiming for algorithmic discovery & rapid global release velocity.
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                  ₹{billingCycle === 'yearly' ? '799' : '999'}
                </span>
                <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>
                  /month {billingCycle === 'yearly' ? '(billed annually)' : ''}
                </span>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ★ Everything in Free, plus:
                </div>
                {[
                  'Priority 24-Hour Fast-Track Store Ingestion',
                  '24-bit/96kHz Lossless & Dolby Atmos Audio',
                  'Automated Collaborator Split Sheets (Zero disputes)',
                  'AI Release Radar Pitching & SmartLinks Generator',
                  'Real-Time Live Streaming Velocity & Country Telemetry',
                  'Instant Store Re-delivery & Catalog Metadata Updates',
                  '24/7 Dedicated VIP Artist Support',
                ].map((f) => (
                  <div key={f} className="pricing-feature-row">
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(53, 213, 255, 0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        boxShadow: '0 0 8px rgba(53, 213, 255, 0.3)',
                      }}
                    >
                      <Check size={12} color="#35D5FF" />
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#FFFFFF', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onEnterDashboard}
              className="pricing-btn-primary"
              style={{ marginTop: '36px' }}
            >
              <span>Get Started Pro</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: LABEL / ENTERPRISE */}
          <div className="pricing-card-base">
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(214, 179, 106, 0.12)',
                    border: '1px solid rgba(214, 179, 106, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D6B36A',
                  }}
                >
                  <Building2 size={22} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#D6B36A',
                    background: 'rgba(214, 179, 106, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid rgba(214, 179, 106, 0.25)',
                  }}
                >
                  ENTERPRISE
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Record Label Suite
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
                Full-scale distribution, multi-artist catalog management & white-label accounting for record labels and agencies.
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '46px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                  ₹{billingCycle === 'yearly' ? '2,499' : '2,999'}
                </span>
                <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>
                  /month {billingCycle === 'yearly' ? '(billed annually)' : ''}
                </span>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#D6B36A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ★ Everything in Pro, plus:
                </div>
                {[
                  'Unlimited Artist Rosters & Manager Sub-Accounts',
                  'Direct DDEX ERN 4.3 Label Feed Integration',
                  'Multi-Tier Royalty Ledger & Automated Contributor Payouts',
                  'Custom Branded SmartLinks & White-Label Portals',
                  'Bulk Catalog Migration Concierge Service',
                  'Dedicated Enterprise Account Director & Custom SLA',
                ].map((f) => (
                  <div key={f} className="pricing-feature-row">
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(214, 179, 106, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Check size={12} color="#D6B36A" />
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#CBD5E1' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowContactSalesModal(true)}
              className="pricing-btn-secondary"
              style={{ marginTop: '36px' }}
            >
              <span>Contact Label Sales</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Guarantee & Trust Badges Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '60px',
            padding: '24px 32px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(53, 229, 154, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#35E59A' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>0% Commission</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Keep 100% of master royalties</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(53, 213, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#35D5FF' }}>
              <CheckCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Cancel Anytime</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>No lock-ins or penalty fees</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Globe size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>DDEX Certified</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Full store ingestion compliance</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(214, 179, 106, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6B36A' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Direct Bank Payouts</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Automated daily settlements</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: FOR LABELS ================= */}
      <section
        id="labels"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '110px 48px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
        }}
      >
        {/* Ambient Gold & Violet Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(214, 179, 106, 0.12) 0%, rgba(214, 179, 106, 0) 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '5%',
            width: '550px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, rgba(53, 213, 255, 0.08) 50%, transparent 70%)',
            filter: 'blur(95px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div className="hero-pill-badge" style={{ background: 'rgba(214, 179, 106, 0.08)', borderColor: 'rgba(214, 179, 106, 0.28)', marginBottom: '16px' }}>
              <Building2 size={13} style={{ color: '#D6B36A' }} />
              <span style={{ fontWeight: 800, color: '#D6B36A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Enterprise & Record Labels
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 600 }}>
                High-Volume DDEX Ingestion
              </span>
            </div>

            <h2 style={{ fontSize: '46px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: '20px' }}>
              Multi-Artist Operations,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FDE68A 0%, #D6B36A 50%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Unified.
              </span>
            </h2>

            <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.65, marginBottom: '36px', maxWidth: '580px' }}>
              Scale your record label with enterprise-grade DDEX ERN 4.3 ingestion feeds, automated contributor revenue split sheets, and role-based permissions for A&R, Marketing, and Royalties.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
              {[
                {
                  title: 'Unlimited Artist Rosters',
                  desc: 'Manage isolated artist catalogs, sub-accounts, and custom contracts under one unified executive umbrella.',
                  tag: 'Multi-Tenant',
                  icon: UserCheck,
                },
                {
                  title: 'Automated Split Sheets',
                  desc: 'Deterministic ledger payouts to songwriters, producers, and publishers with zero manual arithmetic.',
                  tag: 'Smart Splits',
                  icon: Scale,
                },
                {
                  title: 'Custom DDEX ERN Feeds',
                  desc: 'Proprietary SFTP/S3 bulk pipes delivering directly to DSP ingestion engines with your own label P-Line.',
                  tag: 'DDEX 4.3',
                  icon: Globe,
                },
                {
                  title: 'Consolidated Statements',
                  desc: 'Single-click monthly audit-ready accounting statements, exportable to QuickBooks, Xero, or CSV.',
                  tag: 'Audit Ready',
                  icon: FileCode,
                },
              ].map((feat) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={feat.title} className="label-feature-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(214, 179, 106, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D6B36A',
                          }}
                        >
                          <FeatIcon size={18} />
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: '#D6B36A',
                            background: 'rgba(214, 179, 106, 0.08)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(214, 179, 106, 0.2)',
                          }}
                        >
                          {feat.tag}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF', marginBottom: '6px' }}>{feat.title}</div>
                      <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5 }}>{feat.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowContactSalesModal(true)}
              className="label-gold-btn"
            >
              <span>Book Executive Consultation</span>
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Visual Showcase: Live Executive Label Terminal */}
          <div style={{ position: 'relative' }}>
            {/* Ambient Backlight for Console */}
            <div
              style={{
                position: 'absolute',
                inset: '-15px',
                background: 'radial-gradient(circle, rgba(214, 179, 106, 0.25) 0%, rgba(139, 92, 246, 0.18) 50%, transparent 70%)',
                filter: 'blur(45px)',
                borderRadius: '32px',
                pointerEvents: 'none',
              }}
            />

            {/* Main Console Box */}
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(20, 24, 34, 0.9) 0%, rgba(12, 14, 20, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '26px',
                padding: '28px',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(24px)',
                zIndex: 1,
              }}
            >
              {/* Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D6B36A 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#08090B',
                      fontWeight: 900,
                      fontSize: '15px',
                    }}
                  >
                    M
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>Monolith Sonic Recordings (UK)</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#35E59A' }} />
                      <span>42 Active Catalog Artists • Primary Feed Online</span>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    background: 'rgba(214, 179, 106, 0.15)',
                    color: '#D6B36A',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    border: '1px solid rgba(214, 179, 106, 0.3)',
                    letterSpacing: '0.04em',
                  }}
                >
                  LABEL TIER
                </span>
              </div>

              {/* Telemetry Summary Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MTD Revenue</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#35E59A', marginTop: '2px' }}>$48,290.40</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Streams</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>2.19M</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>DDEX Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#35D5FF', marginTop: '5px' }}>✓ Compliant 4.3</div>
                </div>
              </div>

              {/* 4 Interactive Release Rows with Album Art, Stream Telemetry & Split Meters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    name: 'Neon Nights (Deluxe)',
                    artist: 'Aria Cruz',
                    streams: '1.28M',
                    growth: '+24%',
                    share: '85% Artist / 15% Label',
                    splitPct: 85,
                    art: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'After Dark — EP',
                    artist: 'Gautam Giri',
                    streams: '420K',
                    growth: '+18%',
                    share: '80% Artist / 20% Label',
                    splitPct: 80,
                    art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'Lost in the Frequencies',
                    artist: 'The Kinetic Project',
                    streams: '180K',
                    growth: '+12%',
                    share: '90% Artist / 10% Label',
                    splitPct: 90,
                    art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'Midnight Drive (VIP Mix)',
                    artist: 'Solace Beats',
                    streams: '310K',
                    growth: '+31%',
                    share: '100% Direct Release',
                    splitPct: 100,
                    art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=100&q=80',
                  },
                ].map((item) => (
                  <div key={item.name} className="label-track-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.art}
                        alt={item.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#FFFFFF' }}>{item.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>{item.artist}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '13.5px' }}>{item.streams}</span>
                        <span style={{ fontSize: '10px', color: '#35E59A', fontWeight: 700, background: 'rgba(53, 229, 154, 0.1)', padding: '1px 5px', borderRadius: '4px' }}>
                          {item.growth}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#D6B36A', marginTop: '2px', fontWeight: 600 }}>
                        {item.share}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Live Settlement Chip */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-16px',
                background: 'rgba(18, 22, 33, 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(214, 179, 106, 0.3)',
                borderRadius: '999px',
                padding: '8px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(214, 179, 106, 0.25)',
                animation: 'floatBadge3 7s ease-in-out infinite alternate',
                zIndex: 3,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#35E59A', boxShadow: '0 0 8px #35E59A' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                $18,420 Paid Out to 14 Collaborators Today
              </span>
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
          position: 'relative',
        }}
      >
        {/* Ambient atmospheric glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '400px',
            background: 'radial-gradient(ellipse 65% 50% at 50% 25%, rgba(53, 213, 255, 0.07) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 80%)',
            pointerEvents: 'none',
            filter: 'blur(50px)',
            zIndex: 0,
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: '56px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(53, 213, 255, 0.08)',
              border: '1px solid rgba(53, 213, 255, 0.25)',
              color: '#35D5FF',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              marginBottom: '18px',
              boxShadow: '0 0 20px rgba(53, 213, 255, 0.15)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#35D5FF',
                boxShadow: '0 0 8px #35D5FF',
                animation: 'heroPulseGlow 2s ease-in-out infinite',
              }}
            />
            <BookOpen size={14} />
            <span>KNOWLEDGE & INDUSTRY STANDARDS</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.2vw, 48px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 16px',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #35D5FF 70%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Mastering & Distribution Guides
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Everything you need to deliver studio-grade masters conforming to international streaming specs, DDEX ERN 4.3 protocols, and universal rights registries.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px', position: 'relative', zIndex: 1 }}>
          {[
            {
              id: 'ddex' as const,
              title: 'DDEX ERN 4.3 Architecture',
              tag: 'Protocol Spec',
              liveStatus: 'Active XML Standard',
              desc: 'Learn how SONVÉRA packages your release metadata, party identifiers, contributor splits, and distribution deals into standard XML.',
              specs: ['XML Schema ERN 4.3', 'Instant DSP Handshake', 'Zero Metadata Loss'],
              icon: FileCode,
              accentColor: '#35D5FF',
              glowColor: 'rgba(53, 213, 255, 0.25)',
              bgStyle: {
                '--guide-accent': '#35D5FF',
                '--guide-glow': 'rgba(53, 213, 255, 0.2)',
              } as React.CSSProperties,
            },
            {
              id: 'lufs' as const,
              title: 'Master Audio Standards (-14 LUFS)',
              tag: 'Audio Engineering',
              liveStatus: 'ITU-R BS.1770-4',
              desc: 'Best practices for 24-bit/48kHz WAV audio mastering, true-peak sample rate conversion, and avoiding DSP lossy transcode clipping.',
              specs: ['ITU-R BS.1770-4 Norm', 'Lossless 24-Bit / 48kHz', 'True-Peak ≤ -1.0 dBTP'],
              icon: Volume2,
              accentColor: '#35E59A',
              glowColor: 'rgba(53, 229, 154, 0.25)',
              bgStyle: {
                '--guide-accent': '#35E59A',
                '--guide-glow': 'rgba(53, 229, 154, 0.2)',
              } as React.CSSProperties,
            },
            {
              id: 'isrc' as const,
              title: 'ISRC & UPC Registry Guide',
              tag: 'Rights & Metadata',
              liveStatus: 'ISO 3901 Standard',
              desc: 'How International Standard Recording Codes and Universal Product Codes track your digital performance, mechanical splits, and global royalties.',
              specs: ['ISO 3901 Standard', 'Universal Barcode Sync', 'Automated Checksums'],
              icon: Disc,
              accentColor: '#A78BFA',
              glowColor: 'rgba(167, 139, 250, 0.25)',
              bgStyle: {
                '--guide-accent': '#A78BFA',
                '--guide-glow': 'rgba(167, 139, 250, 0.2)',
              } as React.CSSProperties,
            },
          ].map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.id}
                className="resource-guide-card"
                style={res.bgStyle}
                onClick={() => setSelectedSpecModal(res.id)}
              >
                <div>
                  {/* Top Bar: Badge & Icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: `rgba(255, 255, 255, 0.05)`,
                          color: res.accentColor,
                          border: `1px solid rgba(255, 255, 255, 0.1)`,
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: res.accentColor,
                            boxShadow: `0 0 8px ${res.accentColor}`,
                          }}
                        />
                        {res.tag}
                      </span>
                    </div>

                    <div
                      className="resource-icon-box"
                      style={{
                        background: `rgba(255, 255, 255, 0.04)`,
                        color: res.accentColor,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      margin: '0 0 10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {res.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#94A3B8',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                    }}
                  >
                    {res.desc}
                  </p>

                  {/* Micro Specs List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {res.specs.map((spec, sIdx) => (
                      <span key={sIdx} className="resource-spec-chip">
                        <CheckCircle2 size={12} style={{ color: res.accentColor }} />
                        <span>{spec}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer interactive link */}
                <div
                  style={{
                    marginTop: '28px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: res.accentColor,
                      fontSize: '13.5px',
                      fontWeight: 700,
                    }}
                  >
                    <span>Read Full Specification</span>
                    <ArrowRight size={15} className="resource-read-arrow" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#64748B',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Interactive
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry & Engineering Quality Ribbon */}
        <div
          className="resource-telemetry-ribbon"
          style={{
            marginTop: '44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[
            { label: 'DDEX ERN Ingestion', value: '100% Automated', desc: 'Pre-flight XML validation against ERN 4.3 schema' },
            { label: 'Loudness Target', value: '-14.0 LUFS', desc: 'Studio true-peak normalization across all DSPs' },
            { label: 'Rights Architecture', value: 'ISO 3901', desc: 'Universal ISRC & barcode performance sync' },
            { label: 'Direct Pipe Velocity', value: '150+ Ingestions', desc: 'Lossless delivery to DSP endpoints worldwide' },
          ].map((metric, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {metric.label}
              </div>
              <div style={{ fontSize: '19px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
                {metric.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER & PRODUCTION LEGAL ARCHITECTURE SUITE */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(180deg, #07090E 0%, #030406 100%)',
          padding: '80px 48px 48px',
          color: '#E2E8F0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient top light beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1280px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(53, 213, 255, 0.4) 25%, rgba(167, 139, 250, 0.4) 75%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient subtle background glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '5%',
            width: '500px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto 52px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            textAlign: 'left',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Column 1: Brand & Blueprint */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  background: 'linear-gradient(135deg, #FFFFFF 40%, #D6B36A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SONVÉRA
              </span>
              <span
                style={{
                  background: 'rgba(214, 179, 106, 0.15)',
                  color: '#E0C078',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  border: '1px solid rgba(214, 179, 106, 0.35)',
                  boxShadow: '0 0 10px rgba(214, 179, 106, 0.15)',
                  letterSpacing: '0.04em',
                }}
              >
                PROD v1.0
              </span>
            </div>

            <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#94A3B8', marginBottom: '20px' }}>
              Authoritative music distribution architecture. Automated DDEX ERN 4.3 XML ingestion to 150+ digital service providers worldwide with cryptographic royalty accounting.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => openTrustCenterWithTab('status')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  background: 'rgba(53, 229, 154, 0.08)',
                  border: '1px solid rgba(53, 229, 154, 0.35)',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  color: '#35E59A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'fit-content',
                  boxShadow: '0 0 16px rgba(53, 229, 154, 0.12)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(53, 229, 154, 0.16)';
                  e.currentTarget.style.borderColor = '#35E59A';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(53, 229, 154, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(53, 229, 154, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#35E59A',
                    boxShadow: '0 0 8px #35E59A',
                    animation: 'heroPulseGlow 2s infinite',
                  }}
                />
                <span>All Systems Operational (99.98% SLA)</span>
              </button>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                {[
                  { name: 'OWASP ASVS 5.0 L2', color: '#35D5FF' },
                  { name: 'DPDP Act 2023', color: '#A78BFA' },
                  { name: 'DMCA §512', color: '#D6B36A' },
                ].map((badge, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '4px 9px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#94A3B8',
                      letterSpacing: '0.02em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: badge.color }} />
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Legal Pillar (Section 17 & 19) */}
          <div>
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgba(167, 139, 250, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                }}
              >
                <Scale size={13} color="#A78BFA" />
              </div>
              <span>Legal Policies & Rights</span>
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    className="footer-link-btn"
                  >
                    <span className="footer-bullet" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li style={{ marginTop: '6px' }}>
                <button
                  onClick={() => setSelectedPolicySlug('terms-of-service')}
                  style={{
                    background: 'rgba(167, 139, 250, 0.08)',
                    border: '1px solid rgba(167, 139, 250, 0.25)',
                    color: '#A78BFA',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(167, 139, 250, 0.16)';
                    e.currentTarget.style.borderColor = '#A78BFA';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.25)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>View All 20 Policies</span>
                  <ArrowRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Security & Infrastructure Pillar */}
          <div>
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgba(53, 213, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(53, 213, 255, 0.25)',
                }}
              >
                <ShieldCheck size={13} color="#35D5FF" />
              </div>
              <span>Trust & Security</span>
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('status')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>Public Status Page (status.sonvera.com)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('subprocessors')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>Authorized Sub-processors Registry</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrustCenterWithTab('security')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>Security Center (sonvera.com/trust)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('royalty-payment-terms')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>Immutable Royalty Ledger Terms</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('retention-deletion-policy')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>7-Year Statutory Ledger Retention</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicySlug('incident-response-policy')}
                  className="footer-link-btn"
                >
                  <span className="footer-bullet" />
                  <span>Incident Response (72h SLA)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Privacy Rights & Dedicated Support Intake */}
          <div>
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgba(214, 179, 106, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(214, 179, 106, 0.25)',
                }}
              >
                <Lock size={13} color="#E0C078" />
              </div>
              <span>Rights & Dedicated Channels</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Privacy Tile */}
              <button
                onClick={() => setShowPrivacyRights(true)}
                className="footer-action-tile footer-action-tile-privacy"
                style={{
                  borderLeft: '3px solid #35E59A',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ color: '#35E59A', fontSize: '13px', fontWeight: 800 }}>
                    Privacy & Data Rights Center
                  </span>
                  <ArrowRight size={13} color="#35E59A" />
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4 }}>
                  Self-service JSON catalog export & deletion
                </div>
              </button>

              {/* Cookie Preferences Tile */}
              <button
                onClick={() => setShowCookiePreferences(true)}
                className="footer-action-tile footer-action-tile-cookies"
                style={{
                  borderLeft: '3px solid #E0C078',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ color: '#E0C078', fontSize: '13px', fontWeight: 800 }}>
                    Cookie Preferences Center
                  </span>
                  <ArrowRight size={13} color="#E0C078" />
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4 }}>
                  Manage telemetry & zero-ad policy
                </div>
              </button>

              {/* DMCA Tile */}
              <button
                onClick={() => openReportingWithType('copyright')}
                className="footer-action-tile footer-action-tile-dmca"
                style={{
                  borderLeft: '3px solid #A78BFA',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800 }}>
                    Report Copyright / DMCA Notice
                  </span>
                  <ArrowRight size={13} color="#A78BFA" />
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4 }}>
                  Expedited legal infringement channel
                </div>
              </button>

              {/* Secondary Quick Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button
                  onClick={() => openReportingWithType('vulnerability')}
                  className="footer-secondary-btn"
                >
                  <Shield size={12} color="#35D5FF" />
                  <span>Report Vulnerability</span>
                </button>
                <button
                  onClick={() => openReportingWithType('royalty_dispute')}
                  className="footer-secondary-btn"
                >
                  <Scale size={12} color="#E0C078" />
                  <span>Royalty Dispute</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal compliance line */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
            textAlign: 'center',
            fontSize: '13px',
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              SONVÉRA Global Distribution Platform
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => openTrustCenterWithTab('status')}
              style={{
                background: 'none',
                border: 'none',
                color: '#35E59A',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#35E59A' }} />
              <span>System Status</span>
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => openTrustCenterWithTab('security')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Trust Center
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setShowPrivacyRights(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Privacy & Data Rights
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setShowCookiePreferences(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Cookie Preferences
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              onClick={() => setSelectedPolicySlug('accessibility-statement')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Accessibility Statement
            </button>
          </div>

          <div style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.6 }}>
            © 2026 SONVÉRA Inc. All rights reserved. MAKE MUSIC. MOVE CULTURE. Studio-grade distribution infrastructure & cryptographic accounting.
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
