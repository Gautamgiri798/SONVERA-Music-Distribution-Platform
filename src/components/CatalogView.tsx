import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Music,
  Play,
  Copy,
  Check,
  Disc,
  Radio,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Release, Track } from '../types';

interface CatalogViewProps {
  releases: Release[];
  onPlayTrack: (track: Track, release: Release) => void;
  onOpenRelease: (release: Release) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  releases,
  onPlayTrack,
  onOpenRelease,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIsrc, setCopiedIsrc] = useState<string | null>(null);

  // Flatten tracks across all releases
  const allTracksWithRelease = releases.flatMap((r) =>
    r.tracks.map((t) => ({ track: t, release: r }))
  );

  const filtered = allTracksWithRelease.filter(
    ({ track, release }) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.primaryArtist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.isrc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIsrc(text);
    setTimeout(() => setCopiedIsrc(null), 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="title-xl">Master Catalog & Track Vault</h1>
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
              METADATA VAULT
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Permanent repository of registered sound recordings, ISRCs, mechanical split allocations, and lossless master assets.
          </p>
        </div>

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
            placeholder="Search by track, artist, or ISRC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="sonvera-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>Track & Release</th>
              <th>ISRC Code</th>
              <th>Audio Master Spec</th>
              <th>Contributors & Splits</th>
              <th>Duration</th>
              <th>Release Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ track, release }, idx) => {
              const spec = track.audioSpec;
              const mins = Math.floor((spec?.durationSeconds || 180) / 60);
              const secs = (spec?.durationSeconds || 180) % 60;

              return (
                <tr key={`${release.id}-${track.id}`}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {idx + 1}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={release.artwork?.url}
                        alt={release.title}
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{track.title}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {track.primaryArtist} • From{' '}
                          <span
                            onClick={() => onOpenRelease(release)}
                            style={{ color: 'var(--cyan-400)', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {release.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: track.isrc ? 'var(--text-main)' : 'var(--red-500)' }}>
                        {track.isrc || 'UNASSIGNED'}
                      </span>
                      {track.isrc && (
                        <button
                          onClick={() => copyToClipboard(track.isrc)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title="Copy ISRC"
                        >
                          {copiedIsrc === track.isrc ? <Check size={13} color="var(--emerald-400)" /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>
                  </td>

                  <td>
                    {spec ? (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--cyan-400)',
                          background: 'rgba(6, 182, 212, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {spec.bitDepth}-bit / {spec.sampleRateHz / 1000}kHz {spec.format}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--red-500)', fontFamily: 'var(--font-mono)' }}>
                        MISSING
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {track.contributors.map((c) => (
                        <span
                          key={c.id}
                          style={{
                            fontSize: '11px',
                            background: 'var(--bg-surface-2)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {c.name} ({c.sharePercentage}%)
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {mins}:{secs < 10 ? '0' : ''}{secs}
                  </td>

                  <td>
                    <span className={`status-badge ${release.status}`}>
                      <span className="status-dot" />
                      {release.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onPlayTrack(track, release)}
                      className="btn btn-outline-emerald btn-sm"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Preview</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
