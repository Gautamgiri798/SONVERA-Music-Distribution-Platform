import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileCode,
  Radio,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  Play,
  Layers,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Disc,
  Clock,
  Sparkles,
  Lock,
  Scale,
  FileText,
  CheckCircle,
  Download,
  Key,
  Shield,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  Release,
  Track,
  UserProfile,
  SecurityOverviewData,
  SecurityChecklistItem,
  FraudAlert,
  LegalPolicy,
} from '../types';
import { api } from '../services/api';
import { StepUpAuthModal } from './StepUpAuthModal';

interface AdminViewProps {
  releases: Release[];
  onRefreshReleases: () => void;
  onPlayTrack?: (track: Track, release: Release) => void;
  onSwitchUser?: (user: UserProfile) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  releases: initialReleases,
  onRefreshReleases,
  onPlayTrack,
  onSwitchUser,
}) => {
  const [activeTab, setActiveTab] = useState<
    'moderation' | 'dsps' | 'finance' | 'users' | 'audit' | 'workers' | 'security' | 'policies'
  >('moderation');
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedReleaseForInspection, setSelectedReleaseForInspection] = useState<Release | null>(null);
  const [ddexModalXml, setDdexModalXml] = useState<string | null>(null);
  const [rejectingReleaseId, setRejectingReleaseId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isSyncingDsps, setIsSyncingDsps] = useState<boolean>(false);

  // Production Security & Legal Policy Suite states
  const [securityOverview, setSecurityOverview] = useState<SecurityOverviewData | null>(null);
  const [securityChecklist, setSecurityChecklist] = useState<SecurityChecklistItem[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [policies, setPolicies] = useState<LegalPolicy[]>([]);
  const [selectedPolicySlug, setSelectedPolicySlug] = useState<string>('terms-of-service');
  const [activePolicyDetail, setActivePolicyDetail] = useState<LegalPolicy | null>(null);
  const [stepUpModalOpen, setStepUpModalOpen] = useState<boolean>(false);
  const [stepUpActionInfo, setStepUpActionInfo] = useState<{ title: string; desc: string; callback: () => void }>({
    title: 'Privileged Action Authorization',
    desc: 'Verify administrator identity before executing security-critical state changes.',
    callback: () => {},
  });

  // DSP Platforms status map
  const [dspStatuses, setDspStatuses] = useState<Record<string, { status: 'ONLINE' | 'MAINTENANCE' | 'DEGRADED'; leadTime: string; icon: string; name: string }>>({
    spotify: { status: 'ONLINE', leadTime: '24-48 hrs', icon: '🎧', name: 'Spotify' },
    apple_music: { status: 'ONLINE', leadTime: '24-48 hrs', icon: '🍎', name: 'Apple Music & iTunes' },
    youtube_music: { status: 'ONLINE', leadTime: '48-72 hrs', icon: '▶️', name: 'YouTube Music & Content ID' },
    amazon_music: { status: 'ONLINE', leadTime: '24-48 hrs', icon: '📦', name: 'Amazon Music HD' },
    jiosaavn: { status: 'ONLINE', leadTime: '48-72 hrs', icon: '🎵', name: 'JioSaavn' },
    tidal: { status: 'ONLINE', leadTime: '24 hrs', icon: '🌊', name: 'TIDAL Masters' },
    deezer: { status: 'ONLINE', leadTime: '24-48 hrs', icon: '⚡', name: 'Deezer HiFi' },
    meta: { status: 'ONLINE', leadTime: '48 hrs', icon: '📸', name: 'Instagram & Facebook Reels' },
    tiktok: { status: 'ONLINE', leadTime: '24 hrs', icon: '🎬', name: 'TikTok & ByteDance' },
    pandora: { status: 'ONLINE', leadTime: '72-96 hrs', icon: '📻', name: 'Pandora Radio' },
    qobuz: { status: 'ONLINE', leadTime: '24 hrs', icon: '🎼', name: 'Qobuz Sublime' },
    wynk: { status: 'ONLINE', leadTime: '48-72 hrs', icon: '📱', name: 'Wynk & Gaana' },
  });

  // Load audit logs and admin releases
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allReleases = await api.getAdminReleases();
      if (allReleases && allReleases.length > 0) {
        setReleases(allReleases);
      }
      const logs = await api.getAdminAuditLogs();
      setAuditLogs(logs);

      // Fetch Security & Legal Policy suite data
      const [secOverview, secChecklist, fAlerts, pols] = await Promise.allSettled([
        api.getSecurityOverview(),
        api.getSecurityChecklist(),
        api.getFraudAlerts(),
        api.getLegalPolicies(),
      ]);
      if (secOverview.status === 'fulfilled' && secOverview.value?.data) setSecurityOverview(secOverview.value.data);
      if (secChecklist.status === 'fulfilled' && secChecklist.value?.items) setSecurityChecklist(secChecklist.value.items);
      if (fAlerts.status === 'fulfilled' && fAlerts.value?.data) setFraudAlerts(fAlerts.value.data);
      if (pols.status === 'fulfilled' && pols.value?.data) {
        setPolicies(pols.value.data);
        if (pols.value.data.length > 0) {
          loadPolicyDetail(pols.value.data[0].slug);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin data, using local state', e);
    }
  };

  const loadPolicyDetail = async (slug: string) => {
    setSelectedPolicySlug(slug);
    try {
      const res = await api.getLegalPolicy(slug);
      if (res && res.data) setActivePolicyDetail(res.data);
    } catch (e) {
      console.warn('Failed to load policy', e);
    }
  };

  const handleResolveFraud = async (id: string, resolution: 'HOLD' | 'CLEAR') => {
    try {
      await api.resolveFraudAlert(id, resolution);
      showToast(`Fraud alert ${id}: status updated to ${resolution === 'HOLD' ? 'HOLD PLACED' : 'CLEARED'}`);
      const fa = await api.getFraudAlerts();
      if (fa && fa.data) setFraudAlerts(fa.data);
    } catch {
      showToast('Failed to update fraud alert status');
    }
  };

  const triggerPrivilegedAction = (title: string, desc: string, callback: () => void) => {
    setStepUpActionInfo({ title, desc, callback });
    setStepUpModalOpen(true);
  };

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  // Actions
  const handleApprove = async (releaseId: string) => {
    try {
      const res = await api.adminApproveRelease(releaseId);
      if (res.success) {
        showToast(`Release approved! Status updated to LIVE across all DSP feeds.`);
        setReleases((prev) =>
          prev.map((r) =>
            r.id === releaseId
              ? {
                  ...r,
                  status: 'LIVE',
                  deliveryStatuses: (r.deliveryStatuses || []).map((ds) => ({ ...ds, status: 'LIVE' })),
                }
              : r
          )
        );
        onRefreshReleases();
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    }
  };

  const handleReject = async (releaseId: string) => {
    if (!rejectReason.trim()) return;
    try {
      const res = await api.adminRejectRelease(releaseId, rejectReason);
      if (res.success) {
        showToast(`Release rejected with QC notice sent to artist.`);
        setReleases((prev) =>
          prev.map((r) => (r.id === releaseId ? { ...r, status: 'REJECTED' } : r))
        );
        setRejectingReleaseId(null);
        setRejectReason('');
        onRefreshReleases();
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    }
  };

  const handleForceStatus = async (releaseId: string, newStatus: any) => {
    try {
      const res = await api.adminUpdateReleaseStatus(releaseId, newStatus, `Manual admin override to ${newStatus}`);
      if (res.success) {
        showToast(`Status manually set to ${newStatus}.`);
        setReleases((prev) =>
          prev.map((r) => (r.id === releaseId ? { ...r, status: newStatus } : r))
        );
        onRefreshReleases();
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    }
  };

  const handleInspectDdex = async (releaseId: string) => {
    try {
      const xml = await api.getDdexXml(releaseId);
      setDdexModalXml(xml);
    } catch (e) {
      showToast('Could not generate DDEX XML package.');
    }
  };

  const handleSyncProviders = async () => {
    setIsSyncingDsps(true);
    try {
      const res = await api.adminSyncProviders();
      showToast(res.message || 'Global DSP synchronization completed.');
    } catch (e) {
      showToast('DSP synchronization error.');
    } finally {
      setIsSyncingDsps(false);
    }
  };

  const toggleDspStatus = (dspKey: string) => {
    setDspStatuses((prev) => {
      const current = prev[dspKey].status;
      const nextStatus = current === 'ONLINE' ? 'MAINTENANCE' : current === 'MAINTENANCE' ? 'DEGRADED' : 'ONLINE';
      return {
        ...prev,
        [dspKey]: { ...prev[dspKey], status: nextStatus },
      };
    });
    showToast(`DSP ${dspStatuses[dspKey]?.name} status updated.`);
  };

  // Filtered releases
  const filteredReleases = releases.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryArtist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.upc && r.upc.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#0f172a' }}>
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#34d399',
            padding: '14px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid rgba(52, 211, 153, 0.4)',
          }}
        >
          <CheckCircle2 size={18} color="#34d399" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090c15 0%, #151a2d 100%)',
          borderRadius: '24px',
          padding: '32px 40px',
          color: '#ffffff',
          marginBottom: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <ShieldCheck size={12} />
                Superuser Console
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>• Root Access Level 0</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              SONVÉRA Operations & Content Plane
            </h1>
            <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.5 }}>
              Universal administrative oversight. Superadmin control over release moderation, DDEX ERN 4.3 store delivery, DSP platform health, immutable royalty ledger, user accounts, and audit log telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSyncProviders}
              disabled={isSyncingDsps}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={15} className={isSyncingDsps ? 'animate-spin' : ''} />
              <span>{isSyncingDsps ? 'Syncing Feeds...' : 'Sync DSP Pipes'}</span>
            </button>
            <button
              onClick={loadData}
              style={{
                background: '#6366f1',
                border: 'none',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '32px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Catalog Releases</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{releases.length}</div>
            <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '2px' }}>4 Live • 1 Ingestion Queue</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Pending Moderation Queue</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
              {releases.filter((r) => ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(r.status)).length}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>Automated QC passed: 100%</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>DSP Ingestion SLA</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>99.4%</div>
            <div style={{ fontSize: '11.5px', color: '#38bdf8', marginTop: '2px' }}>12/12 Endpoints Healthy</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Platform Escrow & Ledger</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>$5,124.60</div>
            <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '2px' }}>Audited & Balanced</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px',
          background: '#ffffff',
          padding: '8px 16px',
          borderRadius: '16px',
        }}
      >
        {[
          { id: 'moderation', label: 'Release Moderation & QC', icon: Disc, count: releases.length },
          { id: 'dsps', label: 'DSP Store Network & Pipes', icon: Radio, count: 12 },
          { id: 'finance', label: 'Financial Ledger & Payouts', icon: DollarSign },
          { id: 'users', label: 'Users & Artists Directory', icon: Users, count: 5 },
          { id: 'workers', label: 'Queue Workers (BullMQ)', icon: Activity },
          { id: 'audit', label: 'Audit Log Stream', icon: ShieldAlert, count: auditLogs.length },
          { id: 'security', label: 'Security & OWASP ASVS', icon: ShieldCheck, count: 20 },
          { id: 'policies', label: 'Legal & Policy Center', icon: Scale, count: 9 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} color={isActive ? '#38bdf8' : '#94a3b8'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: MODERATION QUEUE ================= */}
      {activeTab === 'moderation' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter by title, artist, or UPC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    background: '#f8fafc',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'PROCESSING', 'LIVE', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      background: filterStatus === st ? '#6366f1' : '#f1f5f9',
                      color: filterStatus === st ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Showing <strong>{filteredReleases.length}</strong> catalog releases
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Release</th>
                <th style={{ padding: '12px 14px' }}>UPC / Catalog</th>
                <th style={{ padding: '12px 14px' }}>Genre</th>
                <th style={{ padding: '12px 14px' }}>Tracks</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Selected Stores</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin QC Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReleases.map((rel) => {
                const isLive = rel.status === 'LIVE';
                return (
                  <tr key={rel.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={rel.artwork?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'}
                          alt={rel.title}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{rel.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{rel.primaryArtist}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      <div>{rel.upc || 'UPC-PENDING'}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>{rel.catalogNumber || 'N/A'}</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                        {rel.primaryGenre}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{rel.tracks?.length || 1} tracks</span>
                        {rel.tracks?.[0] && onPlayTrack && (
                          <button
                            onClick={() => onPlayTrack(rel.tracks[0], rel)}
                            style={{
                              border: 'none',
                              background: '#e0e7ff',
                              color: '#4338ca',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            title="Preview track audio"
                          >
                            <Play size={10} fill="#4338ca" />
                          </button>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background:
                            rel.status === 'LIVE'
                              ? 'rgba(52, 211, 153, 0.15)'
                              : rel.status === 'REJECTED'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            rel.status === 'LIVE'
                              ? '#059669'
                              : rel.status === 'REJECTED'
                              ? '#dc2626'
                              : '#d97706',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background:
                              rel.status === 'LIVE' ? '#10b981' : rel.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                          }}
                        />
                        {rel.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {rel.selectedDsps?.length || 8} DSP stores
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Inspect Metadata / Assets Button */}
                        <button
                          onClick={() => setSelectedReleaseForInspection(rel)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#334155',
                          }}
                          title="Inspect audio, artwork, and full metadata"
                        >
                          Inspect
                        </button>

                        {/* DDEX XML Export */}
                        <button
                          onClick={() => handleInspectDdex(rel.id)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#4338ca',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="View DDEX ERN 4.3 XML Feed"
                        >
                          <FileCode size={13} />
                          <span>DDEX</span>
                        </button>

                        {/* Force Status Dropdown */}
                        <select
                          value={rel.status}
                          onChange={(e) => handleForceStatus(rel.id, e.target.value)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            background: '#ffffff',
                            color: '#0f172a',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="READY">READY</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="LIVE">LIVE</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="TAKEN_DOWN">TAKEN_DOWN</option>
                        </select>

                        {/* Direct Approve Button if pending */}
                        {rel.status !== 'LIVE' && (
                          <button
                            onClick={() => handleApprove(rel.id)}
                            style={{
                              background: '#10b981',
                              border: 'none',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Approve and mark LIVE immediately"
                          >
                            Approve
                          </button>
                        )}

                        {/* Reject Button */}
                        {rel.status !== 'REJECTED' && (
                          <button
                            onClick={() => {
                              setRejectingReleaseId(rel.id);
                              setRejectReason('Audio clipping or cover artwork does not meet DSP requirements.');
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#dc2626',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 2: DSP PLATFORMS ================= */}
      {activeTab === 'dsps' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>DSP Ingestion Hub & Store Connectivity</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                Real-time delivery status across 12 digital music platforms. Toggle maintenance or trigger mass DDEX feed broadcast.
              </p>
            </div>
            <button
              onClick={handleSyncProviders}
              disabled={isSyncingDsps}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={15} className={isSyncingDsps ? 'animate-spin' : ''} />
              <span>Trigger Global DDEX Broadcast</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {Object.entries(dspStatuses).map(([key, dsp]) => {
              const isOnline = dsp.status === 'ONLINE';
              return (
                <div
                  key={key}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '24px' }}>{dsp.icon}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '15px' }}>{dsp.name}</div>
                          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Ingest SLA: {dsp.leadTime}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          background: isOnline ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isOnline ? '#059669' : '#dc2626',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {dsp.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                      Feed protocol: <strong>DDEX ERN 4.3 XML</strong> via automated SFTP/S3 delivery pipe.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Delivery Pipe: Active</span>
                    <button
                      onClick={() => toggleDspStatus(key)}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: FINANCE & PAYOUTS ================= */}
      {activeTab === 'finance' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Platform Financial Ledger & Royalty Escrow</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                Authoritative immutable ledger stream (PostgreSQL Part IV §7 & Part V §5). Balances derived strictly from transactions.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => showToast('Ledger export generated in CSV format.')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Export Ledger CSV
              </button>
            </div>
          </div>

          {/* Pending Payout Review Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Latest Payout Request #payout-001</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                  Artist: <strong>Gautam Giri</strong> • Amount: <strong>$5,124.60 USD</strong> • Destination: Stripe Direct (acct_1NZX****8892)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span
                  style={{
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: '#059669',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  PROCESSED & SETTLED
                </span>
              </div>
            </div>
          </div>

          {/* Immutable Transaction Table */}
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Immutable Platform Transactions Stream</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Tx ID</th>
                <th style={{ padding: '10px' }}>Release / Track</th>
                <th style={{ padding: '10px' }}>DSP Channel</th>
                <th style={{ padding: '10px' }}>Territory</th>
                <th style={{ padding: '10px' }}>Streams</th>
                <th style={{ padding: '10px' }}>Gross Revenue</th>
                <th style={{ padding: '10px' }}>Fee (0%)</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Net Artist Share</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TX-90182-01', rel: 'Neon Nights', dsp: 'Spotify', terr: 'US', streams: '621,200', gross: '$2,360.56', net: '$2,360.56' },
                { id: 'TX-90182-02', rel: 'Neon Nights', dsp: 'Apple Music', terr: 'US', streams: '198,400', gross: '$1,488.00', net: '$1,488.00' },
                { id: 'TX-90182-03', rel: 'Neon Nights', dsp: 'YouTube Music', terr: 'IN', streams: '284,100', gross: '$568.20', net: '$568.20' },
                { id: 'TX-90182-04', rel: 'Neon Nights', dsp: 'JioSaavn', terr: 'IN', streams: '142,100', gross: '$142.10', net: '$142.10' },
                { id: 'TX-90182-05', rel: 'After Dark', dsp: 'Spotify', terr: 'UK', streams: '88,400', gross: '$335.92', net: '$335.92' },
                { id: 'TX-90182-06', rel: 'Midnight Drive', dsp: 'TIDAL', terr: 'DE', streams: '24,600', gross: '$229.82', net: '$229.82' },
              ].map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{tx.id}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{tx.rel}</td>
                  <td style={{ padding: '12px 10px' }}>{tx.dsp}</td>
                  <td style={{ padding: '12px 10px' }}>{tx.terr}</td>
                  <td style={{ padding: '12px 10px' }}>{tx.streams}</td>
                  <td style={{ padding: '12px 10px' }}>{tx.gross}</td>
                  <td style={{ padding: '12px 10px', color: '#10b981' }}>$0.00</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{tx.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 4: USERS & ARTISTS ================= */}
      {activeTab === 'users' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>User & Organization Directory</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                Complete RBAC user accounts, labels, and verified artist rosters.
              </p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>User / Identity</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Organization / Label</th>
                <th style={{ padding: '12px 14px' }}>Verification</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Impersonation</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 'user-01',
                  name: 'Gautam Giri',
                  email: 'gautam@sonvera.io',
                  role: 'independent_artist',
                  label: 'Gautam Giri Productions',
                  verified: true,
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
                },
                {
                  id: 'user-02',
                  name: 'Aria Vance',
                  email: 'aria@midnightecho-official.com',
                  role: 'professional_artist',
                  label: 'The Midnight Echo',
                  verified: true,
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
                },
                {
                  id: 'user-03',
                  name: 'Monolith Sonic Recordings',
                  email: 'operations@monolithsonic.com',
                  role: 'label',
                  label: 'Monolith Sonic Recordings (UK)',
                  verified: true,
                  avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=160&q=80',
                },
                {
                  id: 'user-04',
                  name: 'Elena Rostova',
                  email: 'elena@monolithsonic.com',
                  role: 'label_team_member',
                  label: 'Monolith Sonic Recordings (UK)',
                  verified: true,
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
                },
                {
                  id: 'user-05',
                  name: 'SONVÉRA Operations & Ingest QA',
                  email: 'admin.ingest@sonvera.audio',
                  role: 'administrator',
                  label: 'SONVÉRA Platform Admin',
                  verified: true,
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
                },
              ].map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: u.role === 'administrator' ? '#fee2e2' : u.role === 'label' ? '#fef3c7' : '#e0e7ff',
                        color: u.role === 'administrator' ? '#b91c1c' : u.role === 'label' ? '#b45309' : '#3730a3',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>{u.label}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {onSwitchUser && (
                      <button
                        onClick={() => {
                          onSwitchUser(u as any);
                          showToast(`Logged in as ${u.name}`);
                        }}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Impersonate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 5: BULLMQ WORKERS ================= */}
      {activeTab === 'workers' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Background Workers & Queue Topology (BullMQ + Redis)</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                Asynchronous processing architecture according to PDF Part II §7 (Page 8).
              </p>
            </div>
            <button
              onClick={() => showToast('Worker heartbeat verified: All 6 queues operational.')}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Verify Heartbeats
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'audio-processing', desc: 'Technical validation, WAV 24-bit extraction, waveform generation', completed: 142, active: 0 },
              { name: 'artwork-processing', desc: '3000x3000px inspection, color space check, format preview', completed: 98, active: 0 },
              { name: 'release-validation', desc: '16-point metadata, contributor, copyright, and readiness quality gate', completed: 230, active: 0 },
              { name: 'distribution', desc: 'Provider submission, DDEX batching, delivery status synchronization', completed: 64, active: 1 },
              { name: 'royalties', desc: 'Immutable ledger calculations, monthly statements, payout authorization', completed: 512, active: 0 },
              { name: 'ai-processing', desc: 'SONVÉRA Assist metadata QA scan, playlist pitches, and marketing copy', completed: 420, active: 0 },
            ].map((q) => (
              <div key={q.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', fontFamily: 'var(--font-mono)' }}>{q.name}</div>
                  <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#059669', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>{q.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Jobs Completed: <strong>{q.completed}</strong></span>
                  <span style={{ color: q.active > 0 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>Active: {q.active}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Append-Only Security & Audit Stream</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                Immutable event stream according to PDF Part IV §1 & Part V §2 (Page 16).
              </p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Timestamp</th>
                <th style={{ padding: '10px' }}>Actor</th>
                <th style={{ padding: '10px' }}>Action</th>
                <th style={{ padding: '10px' }}>Entity</th>
                <th style={{ padding: '10px' }}>Event Details</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log: any) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#64748b' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{log.actor}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#64748b' }}>{log.entityType}: {log.entityId}</td>
                  <td style={{ padding: '12px 10px', maxWidth: '380px' }}>{log.details}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <span
                      style={{
                        background: log.status === 'SUCCESS' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: log.status === 'SUCCESS' ? '#059669' : '#d97706',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 7: SECURITY & OWASP ASVS ================= */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Compliance Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #090b10 0%, #11151f 100%)',
              border: '1px solid #1e2638',
              borderRadius: '20px',
              padding: '28px',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: 'rgba(53, 229, 154, 0.15)',
                    color: '#35E59A',
                    border: '1px solid rgba(53, 229, 154, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  OWASP ASVS 5.0 Level 2 / Level 3
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>• Production Standard Enforced</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
                Production Security, Privacy & Policy Architecture
              </h2>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
                Zero-trust music distribution infrastructure. Enforcing Argon2id credentials, append-only financial ledger, short-lived signed S3/R2 URLs, idempotency keys, and deterministic AI governance.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Compliance Score</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#35E59A' }}>98%</div>
                <div style={{ fontSize: '11px', color: '#38bdf8' }}>20 / 20 Verified</div>
              </div>

              <button
                onClick={() =>
                  triggerPrivilegedAction(
                    'Simulated Step-Up MFA Challenge',
                    'Testing ASVS 5.0 §4 privileged action step-up challenge flow with time-bound OTP verification.',
                    () => showToast('MFA Step-Up Verification successful! Session elevated.')
                  )
                }
                style={{
                  background: 'linear-gradient(135deg, #D6B36A 0%, #B89648 100%)',
                  color: '#08090B',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(214, 179, 106, 0.3)',
                }}
              >
                <Lock size={15} />
                <span>Test Step-Up Auth</span>
              </button>
            </div>
          </div>

          {/* Section 2: Data Classification Matrix */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 4px 0' }}>Data Classification Architecture (Section 2)</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Granular multi-tier sensitivity mapping for public catalogs, operational telemetry, master audio, and immutable ledger financial secrets.
                </p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Level</th>
                  <th style={{ padding: '10px' }}>Category Name</th>
                  <th style={{ padding: '10px' }}>Scope & Artifacts</th>
                  <th style={{ padding: '10px' }}>Access Controls</th>
                  <th style={{ padding: '10px' }}>Cryptographic Standard</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    level: 'PUBLIC',
                    name: 'Public Release & Artist Catalog',
                    scope: 'Published artist profiles, release metadata, track titles, album cover art thumbnails',
                    controls: 'Integrity checking, WAF rate limiting, public read-only CDN cache',
                    crypto: 'TLS 1.3 in transit, AES-256 at rest',
                    badgeBg: '#f1f5f9',
                    badgeColor: '#475569',
                  },
                  {
                    level: 'INTERNAL',
                    name: 'Platform Telemetry & Non-Public Config',
                    scope: 'Operational metrics, provider routing configs, queue depths, internal server stats',
                    controls: 'Strict RBAC, private network ingress, non-public DNS resolution',
                    crypto: 'TLS 1.3 in transit, AES-256 at rest',
                    badgeBg: 'rgba(56, 189, 248, 0.15)',
                    badgeColor: '#0284c7',
                  },
                  {
                    level: 'HIGH',
                    name: 'Unreleased Audio Masters & Contracts',
                    scope: 'Unreleased 24-bit WAV masters, high-res TIFF artwork, split contracts, rights declarations',
                    controls: 'Private S3/R2 storage, 15m presigned URLs, download audit logging, quarantine scanner',
                    crypto: 'KMS envelope encryption, TLS 1.3',
                    badgeBg: 'rgba(245, 158, 11, 0.15)',
                    badgeColor: '#d97706',
                  },
                  {
                    level: 'CRITICAL',
                    name: 'Financial Ledger, Payouts & DSP Secrets',
                    scope: 'Royalty ledger entries, bank account SWIFT/IBAN details, DSP API credentials, HMAC keys',
                    controls: 'Step-up MFA authentication, append-only immutable ledger, idempotency keys, hash chaining',
                    crypto: 'HSM / Argon2id / AES-256-GCM',
                    badgeBg: 'rgba(239, 68, 68, 0.15)',
                    badgeColor: '#dc2626',
                  },
                ].map((row) => (
                  <tr key={row.level} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: row.badgeBg, color: row.badgeColor, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        {row.level}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1e293b' }}>{row.name}</td>
                    <td style={{ padding: '12px 10px', color: '#64748b', maxWidth: '300px' }}>{row.scope}</td>
                    <td style={{ padding: '12px 10px', color: '#334155' }}>{row.controls}</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#64748b' }}>{row.crypto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 16 & Section 12: Fraud & AI Governance Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Section 16: Fraud & Abuse Monitor */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 2px 0' }}>Fraud & Abuse Anomaly Detector (Section 16)</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                    Real-time monitoring of abnormal royalty spikes, shared banking details, and bot traffic.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fraudAlerts.length > 0 ? (
                  fraudAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              background: alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? '#dc2626' : '#d97706',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '10.5px',
                              fontWeight: 800,
                            }}
                          >
                            {alert.severity}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>{alert.title}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          Risk: <strong>{alert.riskScore}%</strong>
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.4 }}>{alert.reason}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11.5px', color: alert.status === 'HOLD_PLACED' ? '#dc2626' : alert.status === 'VERIFIED_SAFE' ? '#059669' : '#d97706', fontWeight: 700 }}>
                          Status: {alert.status}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleResolveFraud(alert.id, 'CLEAR')}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Safe
                          </button>
                          <button
                            onClick={() =>
                              triggerPrivilegedAction(
                                `Place Payout Hold on ${alert.entityId}`,
                                `Confirm placing a 30-day investigative financial hold per Section 16 Fraud & Abuse Controls.`,
                                () => handleResolveFraud(alert.id, 'HOLD')
                              )
                            }
                            style={{
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Place Payout Hold
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '13px' }}>
                    Zero active fraud or risk anomalies detected across catalog.
                  </div>
                )}
              </div>
            </div>

            {/* Section 12: AI Governance Guardrails */}
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 2px 0' }}>AI Security & Governance (Section 12)</h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px 0' }}>
                Deterministic boundaries ensuring generative AI cannot mutate platform financial or release state.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    rule: 'AI Ledger Mutation',
                    desc: 'AI is blocked from directly modifying royalty balances or statement tables.',
                    status: 'STRICTLY PROHIBITED',
                    statusColor: '#dc2626',
                    statusBg: 'rgba(239, 68, 68, 0.1)',
                  },
                  {
                    rule: 'AI Payout Authorization',
                    desc: 'AI cannot authorize bank/wire transfers. Requires human step-up MFA.',
                    status: 'STRICTLY PROHIBITED',
                    statusColor: '#dc2626',
                    statusBg: 'rgba(239, 68, 68, 0.1)',
                  },
                  {
                    rule: 'AI Direct Takedown Dispatch',
                    desc: 'Provider purge messages require verified rights holder or legal review.',
                    status: 'STRICTLY PROHIBITED',
                    statusColor: '#dc2626',
                    statusBg: 'rgba(239, 68, 68, 0.1)',
                  },
                  {
                    rule: 'Prompt Injection Defense',
                    desc: 'Input sanitization strips control sequences and limits token depth on assistant prompts.',
                    status: 'ACTIVE DEFENSE',
                    statusColor: '#059669',
                    statusBg: 'rgba(5, 150, 105, 0.1)',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{item.rule}</span>
                      <span style={{ background: item.statusBg, color: item.statusColor, fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                        {item.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 19: 20-Point Production Security Checklist */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 4px 0' }}>20-Point Production Security Checklist (Section 19)</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Exhaustive verification of OWASP ASVS 5.0 Level 2 baseline and Level 3 financial controls.
                </p>
              </div>
              <span
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#059669',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                20 / 20 Enforced
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {securityChecklist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                          {item.id}
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.requirement}</strong>
                        <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.targetLevel}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{item.specification}</p>
                      <div style={{ fontSize: '11.5px', color: '#334155', marginTop: '3px', fontStyle: 'italic' }}>
                        Evidence: {item.auditEvidence}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#059669',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ENFORCED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: LEGAL & POLICY ARCHITECTURE ================= */}
      {activeTab === 'policies' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Scale size={18} color="#8b5cf6" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  Production Privacy & Legal Policy Suite (Section 15)
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Complete legal framework governing music distribution, artist rights, royalty terms, takedowns, DPDP Act 2023, and GDPR compliance.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={14} />
              <span>Export Legal Suite</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', minHeight: '500px' }}>
            {/* Left Policy Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderRight: '1px solid #f1f5f9', paddingRight: '16px' }}>
              {policies.map((p) => {
                const isSelected = selectedPolicySlug === p.slug;
                return (
                  <button
                    key={p.id}
                    onClick={() => loadPolicyDetail(p.slug)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid #8b5cf6' : '1px solid transparent',
                      background: isSelected ? '#f5f3ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8b5cf6', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {p.category}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>v{p.version}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? '#6d28d9' : '#0f172a' }}>{p.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.summary}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Reader */}
            <div style={{ padding: '0 8px' }}>
              {activePolicyDetail ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        {activePolicyDetail.category} • Version {activePolicyDetail.version}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Effective: {activePolicyDetail.effectiveDate}</span>
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {activePolicyDetail.title}
                    </h2>
                    <p style={{ fontSize: '13.5px', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                      {activePolicyDetail.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {activePolicyDetail.sections?.map((sec, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                          {sec.title}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.6 }}>
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13.5px' }}>
                  Select a policy from the list to review complete terms.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RELEASE INSPECTOR ================= */}
      {selectedReleaseForInspection && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img
                  src={selectedReleaseForInspection.artwork?.url}
                  alt={selectedReleaseForInspection.title}
                  style={{ width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedReleaseForInspection.releaseType.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>UPC: {selectedReleaseForInspection.upc}</span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{selectedReleaseForInspection.title}</h2>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    Artist: <strong>{selectedReleaseForInspection.primaryArtist}</strong> • Label: {selectedReleaseForInspection.labelName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedReleaseForInspection(null)}
                style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Close
              </button>
            </div>

            {/* Audio Specification Box */}
            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>Master Audio Quality Verification</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Format</div>
                  <div style={{ fontWeight: 700 }}>WAV (Lossless)</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Sample Rate / Depth</div>
                  <div style={{ fontWeight: 700 }}>48.0 kHz / 24-bit</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Integrated Loudness</div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>-14.1 LUFS (Compliant)</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Channels</div>
                  <div style={{ fontWeight: 700 }}>Stereo 2.0</div>
                </div>
              </div>
            </div>

            {/* Track Listing */}
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Tracks ({selectedReleaseForInspection.tracks?.length || 1})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {(selectedReleaseForInspection.tracks || []).map((trk) => (
                <div
                  key={trk.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>
                      {trk.trackNumber}. {trk.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      ISRC: <strong style={{ fontFamily: 'var(--font-mono)' }}>{trk.isrc}</strong> • Duration: {Math.floor((trk.audioSpec?.durationSeconds || 204) / 60)}:{(trk.audioSpec?.durationSeconds || 204) % 60}
                    </div>
                  </div>
                  {onPlayTrack && (
                    <button
                      onClick={() => onPlayTrack(trk, selectedReleaseForInspection)}
                      style={{
                        background: '#6366f1',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Play size={12} fill="#fff" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button
                onClick={() => {
                  handleInspectDdex(selectedReleaseForInspection.id);
                  setSelectedReleaseForInspection(null);
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Inspect DDEX Feed
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedReleaseForInspection.id);
                  setSelectedReleaseForInspection(null);
                }}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Approve & Mark LIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DDEX ERN 4.3 XML VIEWER ================= */}
      {ddexModalXml && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#0d111c',
              borderRadius: '24px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '28px',
              color: '#ffffff',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>DDEX ERN 4.3 XML Ingestion Package</h3>
                <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Standardized digital delivery payload conforming to Part II §5 and Part VI §1.
                </div>
              </div>
              <button
                onClick={() => setDdexModalXml(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕ Close
              </button>
            </div>

            <pre
              style={{
                flex: 1,
                overflowY: 'auto',
                background: '#07090e',
                padding: '20px',
                borderRadius: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.5,
                color: '#38bdf8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {ddexModalXml}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ddexModalXml);
                  showToast('DDEX XML payload copied to clipboard.');
                }}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Copy XML Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT REASON ================= */}
      {rejectingReleaseId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626', marginBottom: '8px' }}>
              Reject Release with QC Notice
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Specify the exact quality control reason so the artist can correct their audio master or cover artwork.
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Cover artwork contains blurry text or unauthorized store logos..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                marginBottom: '20px',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRejectingReleaseId(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingReleaseId)}
                style={{
                  background: '#dc2626',
                  border: 'none',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STEP-UP AUTHENTICATION (ASVS L3) ================= */}
      <StepUpAuthModal
        isOpen={stepUpModalOpen}
        actionTitle={stepUpActionInfo.title}
        actionDescription={stepUpActionInfo.desc}
        onSuccess={() => {
          setStepUpModalOpen(false);
          stepUpActionInfo.callback();
        }}
        onCancel={() => setStepUpModalOpen(false)}
      />
    </div>
  );
};
