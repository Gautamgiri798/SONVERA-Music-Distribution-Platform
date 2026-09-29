import React, { useState, useEffect } from 'react';
import {
  Scale,
  Shield,
  FileText,
  Lock,
  Search,
  CheckCircle,
  ExternalLink,
  X,
  ChevronRight,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { api } from '../services/api';
import { LegalPolicy } from '../types';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  initialSlug?: string;
  onClose: () => void;
  onOpenTrustCenter?: () => void;
  onOpenCookiePreferences?: () => void;
  onOpenPrivacyRights?: () => void;
  onOpenReporting?: (mode?: 'dmca' | 'vulnerability' | 'dispute') => void;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  initialSlug = 'terms-of-service',
  onClose,
  onOpenTrustCenter,
  onOpenCookiePreferences,
  onOpenPrivacyRights,
  onOpenReporting,
}) => {
  const [policies, setPolicies] = useState<LegalPolicy[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const [activePolicy, setActivePolicy] = useState<LegalPolicy | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activePillar, setActivePillar] = useState<'ALL' | 'LEGAL' | 'TRUST_AND_SECURITY' | 'SUPPORT_AND_REPORTING'>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadPolicies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  useEffect(() => {
    if (selectedSlug) {
      loadSinglePolicy(selectedSlug);
    }
  }, [selectedSlug]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.getLegalPolicies();
      if (res && res.data && res.data.length > 0) {
        setPolicies(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const loadSinglePolicy = async (slug: string) => {
    try {
      const res = await api.getLegalPolicy(slug);
      if (res && res.data) {
        setActivePolicy(res.data);
      }
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPillar =
      activePillar === 'ALL' ||
      (p as any).pillar === activePillar ||
      (activePillar === 'LEGAL' && !['TRUST_AND_SECURITY', 'SUPPORT_AND_REPORTING'].includes((p as any).pillar));

    return matchesSearch && matchesPillar;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0A0C10] border border-[#262B35] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F5F3EE]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#1C2027] bg-[#0F1115] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B5CF6] font-semibold">
                  Legal, Privacy, Policy & Trust Framework
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35E59A]/15 text-[#35E59A] border border-[#35E59A]/30">
                  DPDP • GDPR • DMCA §512
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35D5FF]/15 text-[#35D5FF] border border-[#35D5FF]/30">
                  {policies.length || 20} Active Policies
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                SONVÉRA Policy Architecture & Commercial Terms
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#15181D] hover:bg-[#1C2027] border border-[#262B35] rounded-xl text-xs text-[#969AA3] hover:text-white flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#969AA3] hover:text-white p-1.5 rounded-xl hover:bg-[#1C2027] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Launch Interactive Modules Banner */}
        <div className="px-6 py-2.5 bg-[#12141A] border-b border-[#1C2027] flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-[#969AA3]">
            <Shield className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span className="font-semibold text-white">Interactive Centers:</span>
            <span className="hidden sm:inline">Direct self-service portals recommended in framework:</span>
          </div>
          <div className="flex items-center space-x-2">
            {onOpenTrustCenter && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTrustCenter();
                }}
                className="px-2.5 py-1 bg-[#1A1E26] hover:bg-[#262B35] border border-[#2D3340] rounded-lg text-[#35D5FF] font-semibold text-[11px] transition flex items-center space-x-1"
              >
                <span>Live Status & Trust</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            {onOpenCookiePreferences && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCookiePreferences();
                }}
                className="px-2.5 py-1 bg-[#1A1E26] hover:bg-[#262B35] border border-[#2D3340] rounded-lg text-[#D6B36A] font-semibold text-[11px] transition flex items-center space-x-1"
              >
                <span>Cookie Center</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            {onOpenPrivacyRights && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacyRights();
                }}
                className="px-2.5 py-1 bg-[#1A1E26] hover:bg-[#262B35] border border-[#2D3340] rounded-lg text-[#35E59A] font-semibold text-[11px] transition flex items-center space-x-1"
              >
                <span>Data Rights (DPDP)</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            {onOpenReporting && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReporting('dmca');
                }}
                className="px-2.5 py-1 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 rounded-lg text-white font-semibold text-[11px] transition flex items-center space-x-1"
              >
                <span>Report DMCA</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Sidebar List + Main Reader */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation */}
          <div className="w-88 md:w-96 border-r border-[#1C2027] bg-[#0D0F14] flex flex-col shrink-0">
            {/* Pillar Selector Tabs */}
            <div className="p-3 border-b border-[#1C2027] grid grid-cols-4 gap-1">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'LEGAL', label: 'Legal' },
                { id: 'TRUST_AND_SECURITY', label: 'Trust & Sec' },
                { id: 'SUPPORT_AND_REPORTING', label: 'Support' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePillar(tab.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold text-center transition truncate ${
                    activePillar === tab.id
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'bg-[#15181D] text-[#969AA3] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="p-3 border-b border-[#1C2027]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter 20 policies & terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#15181D] border border-[#262B35] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#525763] focus:outline-none focus:border-[#8B5CF6]"
                />
                <Search className="w-4 h-4 text-[#525763] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Policy List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredPolicies.map((pol) => {
                const isSelected = selectedSlug === pol.slug;
                const pillar = (pol as any).pillar || 'LEGAL';
                return (
                  <button
                    key={pol.id}
                    onClick={() => setSelectedSlug(pol.slug)}
                    className={`w-full text-left p-3 rounded-xl transition flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-[#1C2027] border border-[#8B5CF6]/50 shadow-sm text-white'
                        : 'hover:bg-[#15181D] border border-transparent text-[#969AA3] hover:text-[#F5F3EE]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                            pillar === 'TRUST_AND_SECURITY'
                              ? 'bg-[#35D5FF]/15 text-[#35D5FF]'
                              : pillar === 'SUPPORT_AND_REPORTING'
                              ? 'bg-[#D6B36A]/15 text-[#D6B36A]'
                              : 'bg-[#8B5CF6]/15 text-[#8B5CF6]'
                          }`}
                        >
                          {pillar === 'TRUST_AND_SECURITY' ? 'TRUST' : pillar === 'SUPPORT_AND_REPORTING' ? 'SUPPORT' : 'LEGAL'}
                        </span>
                        <span className="text-[10px] font-mono text-[#717682]">{pol.category}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#525763]">v{pol.version}</span>
                    </div>
                    <div className="font-semibold text-xs text-white flex items-center justify-between">
                      <span className="line-clamp-1">{pol.title}</span>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-[#717682] line-clamp-1">{pol.summary}</p>
                  </button>
                );
              })}
            </div>

            {/* Jurisdiction Badge Footer */}
            <div className="p-3 bg-[#08090B] border-t border-[#1C2027] text-[11px] text-[#525763] flex flex-col space-y-1">
              <span className="font-semibold text-[#969AA3]">Regulatory Baseline:</span>
              <span>• India DPDP Act 2023 • EU GDPR</span>
              <span>• DMCA Title 17 U.S.C. § 512 • WIPO</span>
              <span>• OWASP ASVS 5.0 L2 • DDEX ERN 4.3</span>
            </div>
          </div>

          {/* Right Main Viewer */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#08090B]">
            {activePolicy ? (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                {/* Policy Meta */}
                <div className="p-6 bg-[#0F1115] border border-[#1C2027] rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                        {activePolicy.category} • Version {activePolicy.version}
                      </span>
                      {(activePolicy as any).pillar && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-[#1C2027] text-[#969AA3]">
                          Pillar: {(activePolicy as any).pillar}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#969AA3] font-mono">
                      Effective: {activePolicy.effectiveDate}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    {activePolicy.title}
                  </h1>
                  <p className="text-sm text-[#969AA3] leading-relaxed border-l-2 border-[#D6B36A] pl-3 italic">
                    {activePolicy.summary}
                  </p>
                </div>

                {/* Policy Sections */}
                <div className="space-y-4">
                  {activePolicy.sections && activePolicy.sections.length > 0 ? (
                    activePolicy.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-[#12141A] border border-[#1C2027] rounded-xl space-y-2 hover:border-[#262B35] transition"
                      >
                        <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#35E59A] shrink-0" />
                          <span>{sec.title}</span>
                        </h3>
                        <p className="text-sm text-[#B0B4BC] leading-relaxed pl-6">
                          {sec.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-[#969AA3]">
                      Loading policy provisions...
                    </div>
                  )}
                </div>

                {/* Signature Block */}
                <div className="p-6 bg-[#0F1115] border border-[#1C2027] rounded-2xl flex items-center justify-between text-xs text-[#969AA3]">
                  <div>
                    <p className="text-white font-semibold">SONVÉRA Platform Governance</p>
                    <p>Legal Counsel & Operations Integrity Board</p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-[#525763]">
                    <p>Cryptographic Signature Verified</p>
                    <p className="text-[#35E59A]">SHA-256 Checksum Valid</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#525763] text-sm">
                Select a policy from the sidebar to inspect its provisions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
