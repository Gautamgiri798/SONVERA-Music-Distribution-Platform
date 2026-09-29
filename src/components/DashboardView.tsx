import React, { useState } from 'react';
import {
  Disc,
  Send,
  Radio,
  TrendingUp,
  Globe,
  ArrowRight,
  Play,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Release, Track, UserProfile } from '../types';

interface DashboardViewProps {
  releases: Release[];
  currentUser: UserProfile;
  onOpenRelease: (release: Release) => void;
  onEditRelease: (release: Release) => void;
  onNewRelease: () => void;
  onNavigateTab: (tab: 'releases' | 'distribution' | 'royalties' | 'analytics') => void;
  onPlayTrack: (track: Track, release: Release) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  releases,
  currentUser,
  onOpenRelease,
  onEditRelease,
  onNewRelease,
  onNavigateTab,
  onPlayTrack,
}) => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  // Chart data matching screenshot
  const chartPoints = [
    { label: 'Oct 01', value: 20 },
    { label: 'Oct 08', value: 35 },
    { label: 'Oct 15', value: 65 },
    { label: 'Oct 18', value: 92, tooltip: '152,421' },
    { label: 'Oct 22', value: 78 },
    { label: 'Oct 30', value: 88 },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Header (Matching Screen 4) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Good evening, {currentUser.name.split(' ')[0]}.</span>
            <span>👋</span>
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px' }}>
            Here's what's happening with your music.
          </p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Calendar size={14} color="#64748b" />
            <span>{timeRange}</span>
            <ChevronDown size={14} color="#94a3b8" />
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards (Matching Screen 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        {/* Card 1: Active Releases */}
        <div
          onClick={() => onNavigateTab('releases')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Active Releases</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(236, 72, 153, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Disc size={18} color="#ec4899" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>12</div>
          <div style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
            +2 this month
          </div>
        </div>

        {/* Card 2: Distributing in progress */}
        <div
          onClick={() => onNavigateTab('distribution')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Distributing</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={18} color="#06b6d4" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>8</div>
          <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
            In progress
          </div>
        </div>

        {/* Card 3: Platforms Connected */}
        <div
          onClick={() => onNavigateTab('distribution')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Platforms</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={18} color="#6366f1" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>31</div>
          <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
            Connected
          </div>
        </div>

        {/* Card 4: Total Streams */}
        <div
          onClick={() => onNavigateTab('analytics')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Total Streams</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>1.28M</div>
          <div style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
            +24%
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching Screen 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '24px' }}>
        {/* LEFT: Recent Releases Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Recent Releases</h2>
            <button
              onClick={() => onNavigateTab('releases')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              See all
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Release Details
                </th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Distributions
                </th>
                <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Streams
                </th>
              </tr>
            </thead>
            <tbody>
              {releases.map((rel) => {
                const isLive = rel.status === 'LIVE' || rel.status === 'DELIVERED';
                const isProcessing = rel.status === 'PROCESSING';

                const streamsDisplay =
                  rel.id === 'rel-neon-nights'
                    ? '324.1K'
                    : rel.id === 'rel-after-dark'
                    ? '612.4K'
                    : rel.id === 'rel-midnight-drive'
                    ? '421.8K'
                    : '—';

                const ingestRatio =
                  rel.id === 'rel-neon-nights'
                    ? '8/8'
                    : rel.id === 'rel-after-dark'
                    ? '7/8'
                    : rel.id === 'rel-lost-again'
                    ? '3/8'
                    : '8/8';

                return (
                  <tr
                    key={rel.id}
                    onClick={() => onOpenRelease(rel)}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={rel.artwork?.url}
                          alt={rel.title}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                            {rel.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {rel.releaseType === 'single' ? 'Single' : rel.releaseType === 'ep' ? 'EP' : 'Album'} • {rel.releaseDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: isLive
                            ? 'rgba(16, 185, 129, 0.12)'
                            : isProcessing
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'rgba(245, 158, 11, 0.12)',
                          color: isLive ? '#059669' : isProcessing ? '#2563eb' : '#d97706',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: isLive ? '#10b981' : isProcessing ? '#3b82f6' : '#f59e0b',
                          }}
                        />
                        {isLive ? 'Live' : isProcessing ? 'Processing' : rel.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                      {ingestRatio}
                    </td>

                    <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      {streamsDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Streams Overview Chart & Top Platforms */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Streams Overview</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Last 30 days</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>1,284,921</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>+26%</span>
            </div>

            {/* Simulated Smooth Area Sparkline with Tooltip */}
            <div style={{ position: 'relative', height: '110px', marginBottom: '24px' }}>
              <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M 10 80 Q 70 65, 120 40 T 180 15 T 240 30 T 290 20 L 290 95 L 10 95 Z"
                  fill="url(#areaGradient)"
                />
                {/* Line */}
                <path
                  d="M 10 80 Q 70 65, 120 40 T 180 15 T 240 30 T 290 20"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Peak point with glow */}
                <circle cx="180" cy="15" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* Tooltip on peak matching screenshot */}
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '52%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
              >
                152,421
              </div>

              {/* X axis labels */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  color: '#94a3b8',
                  marginTop: '6px',
                }}
              >
                <span>Oct 01</span>
                <span>Oct 08</span>
                <span>Oct 15</span>
                <span>Oct 22</span>
                <span>Oct 30</span>
              </div>
            </div>

            {/* Top Platforms List (Matching Screen 4) */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Top Platforms
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Spotify', streams: '621.2K', color: '#1db954' },
                  { name: 'YouTube Music', streams: '284.1K', color: '#ff0000' },
                  { name: 'Apple Music', streams: '198.4K', color: '#fc3c44' },
                  { name: 'JioSaavn', streams: '142.1K', color: '#2bc5b4' },
                ].map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                      <span style={{ fontWeight: 600, color: '#334155' }}>{p.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      {p.streams}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
