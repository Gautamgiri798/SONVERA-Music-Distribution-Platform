import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Send,
  Layers,
  Check,
  Disc,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Release, DspPlatform } from '../types';
import { DSP_PLATFORMS } from '../data/mockData';

interface DistributionViewProps {
  releases: Release[];
  onOpenRelease: (release: Release) => void;
}

export const DistributionView: React.FC<DistributionViewProps> = ({ releases, onOpenRelease }) => {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(
    releases[0]?.id || 'rel-neon-nights'
  );

  const currentRelease = releases.find((r) => r.id === selectedReleaseId) || releases[0];

  // Specific platform statuses matching Screen 10
  const platformStatuses = [
    { name: 'Spotify', status: 'Live', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🎧' },
    { name: 'Apple Music', status: 'Live', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🍎' },
    { name: 'YouTube Music', status: 'Processing', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: '▶️' },
    { name: 'Amazon Music', status: 'Processing', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: '📦' },
    { name: 'JioSaavn', status: 'Live', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🎵' },
    { name: 'Deezer', status: 'In queue', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: '⚡' },
    { name: 'TIDAL', status: 'Processing', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: '🌊' },
    { name: 'Instagram', status: 'Live', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '📸' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Release Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Distribution Status</h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px' }}>
            Real-time track delivery monitoring across connected DSP ingestion endpoints.
          </p>
        </div>

        <select
          value={selectedReleaseId}
          onChange={(e) => setSelectedReleaseId(e.target.value)}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0f172a',
            cursor: 'pointer',
          }}
        >
          {releases.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title} ({r.releaseType.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Main Release Hero Card (Matching Screen 10) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <img
          src={currentRelease.artwork?.url}
          alt={currentRelease.title}
          style={{ width: '74px', height: '74px', borderRadius: '12px', objectFit: 'cover' }}
        />
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{currentRelease.title}</h2>
          <div style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px' }}>
            {currentRelease.primaryArtist} • Single • {currentRelease.releaseDate}
          </div>
        </div>
      </div>

      {/* Two Column Layout (Matching Screen 10) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Left Column: Vertical Ingestion Pipeline Tracker */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
            Distribution Lifecycle
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {/* Connecting line */}
            <div
              style={{
                position: 'absolute',
                left: '13px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                background: '#e2e8f0',
                zIndex: 1,
              }}
            />

            {[
              { title: 'Submitted', time: 'Oct 18, 2026, 10:24 AM', state: 'completed' },
              { title: 'Validation', time: 'Completed', state: 'completed' },
              { title: 'SONVÉRA Review', time: 'Completed', state: 'completed' },
              { title: 'Distribution', time: 'In progress', state: 'active' },
              { title: 'Platform Processing', time: 'Active', state: 'active' },
              { title: 'Live', time: 'Scheduled for worldwide stores', state: 'pending' },
            ].map((step, i) => (
              <div key={step.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background:
                      step.state === 'completed'
                        ? '#10b981'
                        : step.state === 'active'
                        ? '#6366f1'
                        : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: step.state === 'active' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  {step.state === 'completed' ? (
                    <Check size={14} strokeWidth={3} />
                  ) : step.state === 'active' ? (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                  ) : (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Status Grid (Matching Screen 10) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Platform Status</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>8 Connected Stores</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {platformStatuses.map((p) => (
              <div
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{p.icon}</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{p.name}</span>
                </div>

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: p.bg,
                    color: p.color,
                  }}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
