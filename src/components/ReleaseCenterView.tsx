import React, { useState } from 'react';
import {
  Disc,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  Edit,
  Code2,
  Trash2,
  Play,
  ArrowRight,
  ShieldAlert,
  Radio,
  Share2,
} from 'lucide-react';
import { Release, Track, DistributionStatus, ReleaseType } from '../types';
import { sonveraDemoProvider } from '../services/distributionProvider';

interface ReleaseCenterViewProps {
  releases: Release[];
  onOpenRelease: (release: Release) => void;
  onEditRelease: (release: Release) => void;
  onNewRelease: () => void;
  onPlayTrack: (track: Track, release: Release) => void;
  onTakedownRelease: (releaseId: string) => void;
}

export const ReleaseCenterView: React.FC<ReleaseCenterViewProps> = ({
  releases,
  onOpenRelease,
  onEditRelease,
  onNewRelease,
  onPlayTrack,
  onTakedownRelease,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedReleaseForDdex, setSelectedReleaseForDdex] = useState<Release | null>(null);

  // Status categories
  const filteredReleases = releases.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryArtist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.upc.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTION_NEEDED'
        ? r.status === 'VALIDATION_FAILED' || r.status === 'REJECTED'
        : r.status === statusFilter);

    const matchesType = typeFilter === 'ALL' || r.releaseType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getHealthBadge = (release: Release) => {
    if (release.status === 'LIVE' || release.status === 'READY' || release.status === 'DELIVERED') {
      return (
        <span className="health-pill perfect">
          <CheckCircle size={12} />
          100% HEALTH
        </span>
      );
    }
    if (release.status === 'VALIDATION_FAILED') {
      return (
        <span className="health-pill critical">
          <AlertTriangle size={12} />
          ACTION REQUIRED
        </span>
      );
    }
    if (release.status === 'PROCESSING' || release.status === 'UNDER_REVIEW') {
      return (
        <span className="health-pill warning">
          <Clock size={12} />
          92% IN REVIEW
        </span>
      );
    }
    return (
      <span className="health-pill warning">
        DRAFT
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="title-xl">Release Center</h1>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--emerald-400)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              CORE ENGINE
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage, validate, package, and distribute your singles, EPs, and albums to global streaming stores.
          </p>
        </div>

        <button onClick={onNewRelease} className="btn btn-primary" id="btn-release-center-create">
          <Plus size={16} strokeWidth={2.5} />
          <span>Create New Release</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, artist, UPC, or ISRC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Releases' },
            { id: 'LIVE', label: 'Live Worldwide' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'PROCESSING', label: 'In Ingestion' },
            { id: 'READY', label: 'Ready to Submit' },
            { id: 'ACTION_NEEDED', label: 'Action Required', highlight: true },
            { id: 'DRAFT', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background:
                  statusFilter === tab.id
                    ? tab.highlight
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'var(--bg-surface-3)'
                    : 'transparent',
                border:
                  statusFilter === tab.id
                    ? tab.highlight
                      ? '1px solid rgba(239, 68, 68, 0.4)'
                      : '1px solid var(--border-medium)'
                    : '1px solid transparent',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                color:
                  statusFilter === tab.id
                    ? tab.highlight
                      ? '#fca5a5'
                      : '#ffffff'
                    : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Format:</span>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: '130px', padding: '6px 10px', fontSize: '12px' }}
          >
            <option value="ALL">All Formats</option>
            <option value="single">Single (1 Track)</option>
            <option value="ep">EP (2-6 Tracks)</option>
            <option value="album">Album (7+ Tracks)</option>
          </select>
        </div>
      </div>

      {/* Release List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredReleases.map((release) => {
          const firstTrack = release.tracks[0];
          return (
            <div
              key={release.id}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'border-color 0.2s ease, transform 0.15s ease',
              }}
            >
              {/* Left Column: Artwork + Play Button + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '380px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'var(--bg-surface-3)',
                    border: '1px solid var(--border-medium)',
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
                      <Disc size={28} color="var(--text-muted)" />
                    </div>
                  )}

                  {firstTrack?.audioSpec && (
                    <button
                      onClick={() => onPlayTrack(firstTrack, release)}
                      title="Play master audio preview"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <Play size={24} fill="#fff" />
                    </button>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3
                      onClick={() => onOpenRelease(release)}
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        letterSpacing: '-0.01em',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--emerald-400)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                    >
                      {release.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-surface-3)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {release.releaseType}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {release.primaryArtist}
                    {release.featuredArtists.length > 0 && ` feat. ${release.featuredArtists.join(', ')}`}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <span>Genre: <strong style={{ color: 'var(--text-secondary)' }}>{release.primaryGenre}</strong></span>
                    <span>•</span>
                    <span>Tracks: <strong style={{ color: 'var(--text-secondary)' }}>{release.tracks.length}</strong></span>
                    <span>•</span>
                    <span>UPC: <strong className="font-mono" style={{ color: 'var(--text-secondary)' }}>{release.upc || 'PENDING'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Release Health & Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`status-badge ${release.status}`}>
                    <span className="status-dot" />
                    {release.status}
                  </span>
                  {getHealthBadge(release)}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Street Date:{' '}
                  <span className="font-mono" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    {release.releaseDate}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                  Target DSPs: {release.selectedDsps.length} stores
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setSelectedReleaseForDdex(release)}
                  className="btn btn-secondary btn-sm"
                  title="Inspect DDEX ERN 4.3 XML package"
                >
                  <Code2 size={14} />
                  <span>DDEX XML</span>
                </button>

                <button
                  onClick={() => onEditRelease(release)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit size={14} />
                  <span>Edit / Fix</span>
                </button>

                <button
                  onClick={() => onOpenRelease(release)}
                  className="btn btn-primary btn-sm"
                >
                  <span>Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredReleases.length === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <Disc size={40} color="var(--text-muted)" />
            <h3 className="title-md">No releases match your current filters</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px' }}>
              Try adjusting your search terms or status filters, or start a new music release now.
            </p>
            <button onClick={onNewRelease} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Release</span>
            </button>
          </div>
        )}
      </div>

      {/* DDEX ERN 4.3 XML Inspection Modal */}
      {selectedReleaseForDdex && (
        <div
          onClick={() => setSelectedReleaseForDdex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 350,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-elevated"
            style={{
              width: '840px',
              maxWidth: '92vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 size={18} color="var(--cyan-400)" />
                  <h3 className="title-md">DDEX ERN 4.3 Ingestion Feed Preview</h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Electronic Release Notification for “{selectedReleaseForDdex.title}” (UPC: {selectedReleaseForDdex.upc})
                </p>
              </div>
              <button
                onClick={() => setSelectedReleaseForDdex(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                lineHeight: 1.5,
                color: '#34d399',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {sonveraDemoProvider.generateDdexPackage(selectedReleaseForDdex)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Valid schema: DDEX ERN 4.3 Profile / Automated SONVÉRA Provider Serialization
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sonveraDemoProvider.generateDdexPackage(selectedReleaseForDdex));
                  alert('DDEX ERN 4.3 XML copied to clipboard.');
                }}
                className="btn btn-secondary btn-sm"
              >
                Copy Raw XML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
