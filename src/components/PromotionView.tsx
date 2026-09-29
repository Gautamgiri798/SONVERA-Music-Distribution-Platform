import React, { useState } from 'react';
import {
  Megaphone,
  Share2,
  Calendar,
  Sparkles,
  Link,
  Copy,
  Check,
  Disc,
  ExternalLink,
} from 'lucide-react';
import { Release } from '../types';

interface PromotionViewProps {
  releases: Release[];
}

export const PromotionView: React.FC<PromotionViewProps> = ({ releases }) => {
  const eligibleReleases = releases.filter((r) => r.status !== 'DRAFT');
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(
    eligibleReleases[0]?.id || ''
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const currentRelease = eligibleReleases.find((r) => r.id === selectedReleaseId);

  const smartUrl = `https://sonvera.to/${currentRelease?.primaryArtist.toLowerCase().replace(/[^a-z0-9]/g, '')}/${currentRelease?.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="title-xl">Release Promotion & Smart Links</h1>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              background: 'rgba(6, 182, 212, 0.12)',
              color: 'var(--cyan-400)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.25)',
            }}
          >
            SMART LINKS
          </span>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Generate global pre-save landing pages and prepare editorial pitching metadata for Spotify, Apple Music, and Amazon.
        </p>
      </div>

      {/* Select Target Release */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Select Release Campaign:</span>
        <select
          className="form-select"
          value={selectedReleaseId}
          onChange={(e) => setSelectedReleaseId(e.target.value)}
          style={{ width: '300px' }}
        >
          {eligibleReleases.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title} ({r.releaseType.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Two Column: Smart Link Live Preview & Editorial Pitch Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Smart Landing Page Mockup */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="title-md">SONVÉRA Smart Link Landing Page</h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--emerald-400)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              PRE-SAVE ACTIVE
            </span>
          </div>

          {currentRelease && (
            <div
              style={{
                width: '320px',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-medium)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <img
                src={currentRelease.artwork?.url}
                alt={currentRelease.title}
                style={{ width: '180px', height: '180px', borderRadius: '14px', objectFit: 'cover', marginBottom: '16px', boxShadow: 'var(--shadow-md)' }}
              />

              <h4 style={{ fontSize: '17px', fontWeight: 800 }}>{currentRelease.title}</h4>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: '14px' }}>
                {currentRelease.primaryArtist}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--cyan-400)',
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  marginBottom: '18px',
                }}
              >
                STREET DATE: {currentRelease.releaseDate}
              </div>

              {/* DSP Buttons */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Spotify Pre-Save', 'Apple Music Add', 'Amazon Music HD', 'TIDAL Masters'].map((dspName) => (
                  <button
                    key={dspName}
                    onClick={() => alert(`Pre-save simulated for ${dspName}!`)}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{dspName}</span>
                    <span style={{ color: 'var(--emerald-400)', fontSize: '11px' }}>Pre-Save</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shareable Link Box */}
          <div
            style={{
              marginTop: '20px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-1)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span className="font-mono" style={{ fontSize: '12px', color: 'var(--cyan-400)' }}>
              {smartUrl}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(smartUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 1500);
              }}
              className="btn btn-secondary btn-sm"
            >
              {copiedLink ? <Check size={13} color="var(--emerald-400)" /> : <Copy size={13} />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Right: DSP Editorial Pitching Preparation */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 className="title-md" style={{ marginBottom: '6px' }}>DSP Editorial Pitching Kit</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Ensure your release metadata meets Spotify for Artists and Apple Music editorial playlist requirements.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}>
                ✓ Lead Time Audit
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Release street date is scheduled with at least 14 days lead time for playlist curators.
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}>
                ✓ Primary Instrumentation & Mood Tagged
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Tagged as: Electronic / Synthwave • Ambient chillout • Upbeat / Focus.
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}>
                ✓ Mechanical Publishing Cleared
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                100% split balanced across credited composers and producers.
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '6px' }}>
              <label className="form-label">Curator Pitch Note (500 characters max)</label>
              <textarea
                className="form-textarea"
                rows={4}
                defaultValue="Blending analog synthesizers with cinematic atmospheres, this release represents a sonic evolution exploring themes of solitary reflection and futuristic momentum."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
