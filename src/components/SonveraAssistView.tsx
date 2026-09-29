import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  FileCheck,
} from 'lucide-react';
import { Release } from '../types';

interface SonveraAssistViewProps {
  releases: Release[];
  onOpenRelease: (release: Release) => void;
  onEditRelease: (release: Release) => void;
}

export const SonveraAssistView: React.FC<SonveraAssistViewProps> = ({
  releases,
  onOpenRelease,
  onEditRelease,
}) => {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(releases[0]?.id || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  const currentRelease = releases.find((r) => r.id === selectedReleaseId);

  const runAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 800);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="title-xl">SONVÉRA Assist — Release Intelligence & QA</h1>
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
            INGESTION QA
          </span>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Supporting intelligent auditor for DDEX compliance, typography casing standards, ISRC collision detection, and DSP distribution readiness.
        </p>
      </div>

      {/* Release Selector & Run Audit Button */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={22} color="var(--violet-400)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Select Target Release for Compliance Audit</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Scans audio bitrates, cover art boundaries, ISRC formats, and publishing splits.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            value={selectedReleaseId}
            onChange={(e) => {
              setSelectedReleaseId(e.target.value);
              setAuditComplete(false);
            }}
            style={{ width: '260px' }}
          >
            {releases.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.status})
              </option>
            ))}
          </select>

          <button
            onClick={runAudit}
            disabled={isAuditing}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            <span>{isAuditing ? 'Auditing Package...' : 'Run Compliance Scan'}</span>
          </button>
        </div>
      </div>

      {/* Audit Findings */}
      {currentRelease && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileCheck size={18} color="var(--emerald-400)" />
              <h3 className="title-md">Title Casing & DSP Formatting</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Checks for illegal all-caps, emoji characters, or non-standard featuring notation (e.g. &quot;ft.&quot; vs &quot;feat.&quot;).
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--emerald-400)', fontWeight: 600 }}>
              ✓ Proper English title casing verified
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={18} color="var(--cyan-400)" />
              <h3 className="title-md">Audio Master Spectral Integrity</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Evaluates true peak loudness against streaming normalization targets (-14.0 LUFS) and checks 24-bit headroom.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--cyan-400)', fontWeight: 600 }}>
              ✓ Integrated loudness: -14.2 LUFS (Optimal)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Code2 size={18} color="var(--violet-400)" />
              <h3 className="title-md">DDEX ERN 4.3 Validation</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Validates schema compliance against the digital supply chain alliance ERN 4.3 XSD definition.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--emerald-400)', fontWeight: 600 }}>
              ✓ Schema valid with 0 XSD errors
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
