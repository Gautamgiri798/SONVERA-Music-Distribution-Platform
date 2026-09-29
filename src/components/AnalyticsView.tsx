import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Radio,
  Play,
  ArrowUpRight,
  Disc,
} from 'lucide-react';
import { Release } from '../types';
import { MOCK_STREAMING_PERFORMANCE } from '../data/mockData';

interface AnalyticsViewProps {
  releases: Release[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ releases }) => {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('all');

  const performance = MOCK_STREAMING_PERFORMANCE['rel-01'];

  const dspShares = [
    { name: 'Spotify', share: 62, streams: '1,144,024', color: '#10b981' },
    { name: 'Apple Music', share: 21, streams: '387,492', color: '#06b6d4' },
    { name: 'YouTube Music & Content ID', share: 13, streams: '239,876', color: '#f43f5e' },
    { name: 'TIDAL & Others', share: 4, streams: '73,808', color: '#8b5cf6' },
  ];

  const territoryShares = [
    { country: 'United States', streams: '645,820', pct: '35%' },
    { country: 'Germany', streams: '313,684', pct: '17%' },
    { country: 'United Kingdom', streams: '258,328', pct: '14%' },
    { country: 'India & South Asia', streams: '221,424', pct: '12%' },
    { country: 'Japan', streams: '147,616', pct: '8%' },
    { country: 'Rest of World', streams: '258,328', pct: '14%' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="title-xl">Streaming Analytics & Telemetry</h1>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--violet-400)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              DSP DATA FEED
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live performance metrics ingested from global streaming networks, connected directly to your distributed releases.
          </p>
        </div>

        <select
          className="form-select"
          value={selectedReleaseId}
          onChange={(e) => setSelectedReleaseId(e.target.value)}
          style={{ width: '220px' }}
        >
          <option value="all">All Distributed Releases</option>
          {releases
            .filter((r) => r.status === 'LIVE' || r.status === 'DELIVERED')
            .map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.releaseType.toUpperCase()})
              </option>
            ))}
        </select>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            TOTAL MANAGED STREAMS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            1,845,200
          </div>
          <div style={{ fontSize: '12px', color: 'var(--emerald-400)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} />
            <span>+18.4% vs previous 30 days</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            28-DAY UNIQUE LISTENERS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>
            382,400
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Across 184 active territories
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            EDITORIAL PLAYLIST ADDS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--violet-400)', marginTop: '4px' }}>
            47 Placements
          </div>
          <div style={{ fontSize: '12px', color: 'var(--emerald-400)', marginTop: '2px' }}>
            Synthwave Chill, Electronic Focus
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STREAM-TO-ROYALTY CONVERSION
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            $0.00448 avg
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Blended gross DSP rate
          </div>
        </div>
      </div>

      {/* Two Columns: DSP Market Share & Territories */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* DSP Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 className="title-md" style={{ marginBottom: '6px' }}>Streaming Share by Platform</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Relative distribution of streams across connected streaming services
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dspShares.map((dsp) => (
              <div key={dsp.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{dsp.name}</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {dsp.streams} streams ({dsp.share}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${dsp.share}%`,
                      background: dsp.color,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Territory Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 className="title-md" style={{ marginBottom: '6px' }}>Geographic Ingestion Reach</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Top listener territories reporting playback telemetry
          </p>

          <table className="sonvera-table">
            <thead>
              <tr>
                <th>Territory</th>
                <th>Audited Streams</th>
                <th style={{ textAlign: 'right' }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {territoryShares.map((t) => (
                <tr key={t.country}>
                  <td style={{ fontWeight: 600 }}>{t.country}</td>
                  <td className="font-mono">{t.streams}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--emerald-400)' }}>
                    {t.pct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
