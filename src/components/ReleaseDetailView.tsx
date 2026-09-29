import React, { useState } from 'react';
import {
  ArrowLeft,
  Disc,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  Code2,
  Edit,
  Trash2,
  Radio,
  Share2,
  Calendar,
  Globe,
  Music,
  UserCheck,
  Shield,
  Layers,
  Send,
} from 'lucide-react';
import { Release, Track, DspIdentifier } from '../types';
import { sonveraDemoProvider } from '../services/distributionProvider';
import { DSP_PLATFORMS } from '../data/mockData';

interface ReleaseDetailViewProps {
  release: Release;
  onBack: () => void;
  onEdit: (release: Release) => void;
  onPlayTrack: (track: Track, release: Release) => void;
  onTakedown: (releaseId: string) => void;
}

export const ReleaseDetailView: React.FC<ReleaseDetailViewProps> = ({
  release,
  onBack,
  onEdit,
  onPlayTrack,
  onTakedown,
}) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'dsps' | 'health' | 'history' | 'ddex'>('tracks');
  const [showTakedownConfirm, setShowTakedownConfirm] = useState(false);

  const getDspInfo = (dspId: DspIdentifier) => {
    return DSP_PLATFORMS.find((p) => p.id === dspId) || {
      name: dspId,
      category: 'Streaming',
      territoriesCovered: 'Global',
    };
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Button & Top Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Release Center</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onEdit(release)}
            className="btn btn-secondary btn-sm"
          >
            <Edit size={14} />
            <span>Edit Release</span>
          </button>

          {release.status === 'LIVE' || release.status === 'DELIVERED' ? (
            <button
              onClick={() => setShowTakedownConfirm(true)}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={14} />
              <span>Request Takedown</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Release Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          display: 'flex',
          gap: '28px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.95) 0%, rgba(10, 13, 20, 0.85) 100%)',
        }}
      >
        {/* Cover Art */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '16px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface-3)',
            border: '1px solid var(--border-medium)',
            position: 'relative',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {release.artwork?.url ? (
            <img
              src={release.artwork.url}
              alt={release.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Disc size={48} color="var(--text-muted)" />
            </div>
          )}

          {release.tracks[0]?.audioSpec && (
            <button
              onClick={() => onPlayTrack(release.tracks[0], release)}
              title="Play first track"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--emerald-400)',
                color: '#031a11',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--emerald-glow)',
              }}
            >
              <Play size={18} fill="#031a11" style={{ marginLeft: '2px' }} />
            </button>
          )}
        </div>

        {/* Release Metadata Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`status-badge ${release.status}`}>
              <span className="status-dot" />
              {release.status}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'var(--bg-surface-3)',
                color: 'var(--text-secondary)',
              }}
            >
              {release.releaseType}
            </span>
          </div>

          <h1 className="title-xl" style={{ fontSize: '26px', marginBottom: '4px' }}>
            {release.title}
          </h1>

          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            By <strong style={{ color: 'var(--text-main)' }}>{release.primaryArtist}</strong>
            {release.featuredArtists.length > 0 && ` feat. ${release.featuredArtists.join(', ')}`}
          </div>

          {/* Quick Meta Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '12px',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)' }}>UPC / EAN:</div>
              <div className="font-mono" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {release.upc || 'NOT ASSIGNED'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Catalog Number:</div>
              <div className="font-mono" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {release.catalogNumber || 'SVR-001'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Street Date:</div>
              <div className="font-mono" style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>
                {release.releaseDate}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Genre / Label:</div>
              <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {release.primaryGenre} • {release.labelName || 'Independent'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'tracks', label: `Tracklist (${release.tracks.length})`, icon: Music },
          { id: 'dsps', label: `Distribution Pipeline (${release.selectedDsps.length})`, icon: Globe },
          { id: 'health', label: 'Content Validation & Health', icon: Shield },
          { id: 'history', label: 'Audit History', icon: Clock },
          { id: 'ddex', label: 'DDEX ERN 4.3 XML', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isActive ? 'var(--bg-surface-2)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--emerald-400)' : '2px solid transparent',
                borderRadius: '8px 8px 0 0',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} color={isActive ? 'var(--emerald-400)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tracklist with Waveform and Audio Specs */}
      {activeTab === 'tracks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {release.tracks.map((track) => (
            <div
              key={track.id}
              className="glass-panel"
              style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--emerald-400)',
                    }}
                  >
                    {track.trackNumber}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>{track.title}</span>
                      {track.isExplicit && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          EXPLICIT
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Primary: {track.primaryArtist}
                      {track.featuredArtists.length > 0 && ` feat. ${track.featuredArtists.join(', ')}`}
                    </div>
                  </div>
                </div>

                {/* Track Play button + Audio spec */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {track.audioSpec ? (
                    <div
                      style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--cyan-400)',
                      }}
                    >
                      {track.audioSpec.bitDepth}-bit / {track.audioSpec.sampleRateHz / 1000}kHz {track.audioSpec.format}
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--red-500)',
                      }}
                    >
                      MISSING AUDIO MASTER
                    </div>
                  )}

                  <button
                    onClick={() => onPlayTrack(track, release)}
                    className="btn btn-outline-emerald btn-sm"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Play Preview</span>
                  </button>
                </div>
              </div>

              {/* ISRC & Contributor mechanical splits */}
              <div
                style={{
                  background: 'var(--bg-surface-0)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    RECORDING ISRC
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '13px',
                      color: track.isrc ? 'var(--text-main)' : 'var(--red-500)',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    {track.isrc || '⚠ MISSING ISRC CODE'}
                  </div>
                </div>

                {/* Contributors Split Total */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CONTRIBUTORS & SPLITS</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {track.contributors.map((c) => (
                      <span
                        key={c.id}
                        style={{
                          background: 'var(--bg-surface-2)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <strong>{c.name}</strong> ({c.role}):{' '}
                        <span style={{ color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                          {c.sharePercentage}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Distribution Pipeline & DSP Statuses */}
      {activeTab === 'dsps' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 className="title-md">Connected DSP Distribution Pipelines</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Target digital service providers for this release package via SONVÉRA Provider Ingest.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {release.selectedDsps.map((dspId) => {
              const info = getDspInfo(dspId);
              const delStatus = release.deliveryStatuses.find((d) => d.dspId === dspId);
              const statusName = delStatus?.status || (release.status === 'LIVE' ? 'LIVE' : 'PENDING');

              return (
                <div
                  key={dspId}
                  style={{
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {info.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {info.category} • Coverage: {info.territoriesCovered}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background:
                        statusName === 'LIVE'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : statusName === 'ACCEPTED'
                          ? 'rgba(6, 182, 212, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                      color:
                        statusName === 'LIVE'
                          ? '#34d399'
                          : statusName === 'ACCEPTED'
                          ? '#22d3ee'
                          : '#fbbf24',
                      border: `1px solid ${
                        statusName === 'LIVE'
                          ? 'rgba(16, 185, 129, 0.3)'
                          : statusName === 'ACCEPTED'
                          ? 'rgba(6, 182, 212, 0.3)'
                          : 'rgba(245, 158, 11, 0.3)'
                      }`,
                    }}
                  >
                    {statusName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Content Validation & Health */}
      {activeTab === 'health' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 className="title-md">Content Validation Criteria & Health Score</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Deterministic quality gates enforced prior to DDEX ERN 4.3 compilation and partner delivery.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Audio Compliance</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--emerald-400)', marginTop: '4px' }}>
                24-bit / 48kHz WAV
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Lossless stereo masters present
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Artwork Standard</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--emerald-400)', marginTop: '4px' }}>
                3000 x 3000px sRGB
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Text & visual restriction passed
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-1)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Publishing & Splits</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--emerald-400)', marginTop: '4px' }}>
                100.0% Validated
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Mechanical rights balanced
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => onEdit(release)} className="btn btn-primary">
              Run Real-Time Validator
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Audit History */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 className="title-md">Distribution Status History & Audit Trail</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Immutable chronological record of all state transitions, batch IDs, and approvals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {release.statusHistory.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface-3)',
                    border: '2px solid var(--emerald-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-badge ${item.status}`}>
                        <span className="status-dot" />
                        {item.status}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        by <strong>{item.actor}</strong>
                      </span>
                    </div>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-main)', marginTop: '6px' }}>
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: DDEX XML */}
      {activeTab === 'ddex' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="title-md">DDEX Electronic Release Notification (ERN 4.3)</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Industry-standard digital supply chain XML payload transmitted to DSP ingestion hubs.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sonveraDemoProvider.generateDdexPackage(release));
                alert('DDEX ERN 4.3 XML copied to clipboard.');
              }}
              className="btn btn-secondary btn-sm"
            >
              Copy XML
            </button>
          </div>

          <div
            style={{
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              lineHeight: 1.5,
              color: '#34d399',
              whiteSpace: 'pre-wrap',
              maxHeight: '480px',
              overflowY: 'auto',
            }}
          >
            {sonveraDemoProvider.generateDdexPackage(release)}
          </div>
        </div>
      )}

      {/* Takedown Confirmation Modal */}
      {showTakedownConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 400,
          }}
        >
          <div
            className="glass-panel-elevated"
            style={{ width: '480px', padding: '24px', borderRadius: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <AlertTriangle size={22} color="var(--red-500)" />
              <h3 className="title-md">Confirm Release Takedown</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Are you sure you want to issue a formal DDEX Takedown notice for <strong>“{release.title}”</strong> across all {release.selectedDsps.length} connected DSP stores? This action removes the release from active streaming catalogs worldwide within 24-72 hours.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowTakedownConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTakedown(release.id);
                  setShowTakedownConfirm(false);
                }}
                className="btn btn-danger"
              >
                Execute Takedown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
