import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  FileText,
  Lock,
} from 'lucide-react';
import { api } from '../services/api';

export type ReportType = 'copyright' | 'vulnerability' | 'royalty_dispute';

interface DedicatedReportingModalProps {
  isOpen: boolean;
  initialType?: ReportType;
  onClose: () => void;
}

export const DedicatedReportingModal: React.FC<DedicatedReportingModalProps> = ({
  isOpen,
  initialType = 'copyright',
  onClose,
}) => {
  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ id: string; msg: string } | null>(null);

  // Form states - Copyright
  const [copyrightForm, setCopyrightForm] = useState({
    name: '',
    email: '',
    affectedWork: '',
    releaseId: '',
    evidenceUrl: '',
    perjuryChecked: false,
  });

  // Form states - Vulnerability
  const [vulnForm, setVulnForm] = useState({
    name: '',
    email: '',
    severity: 'MEDIUM',
    endpoint: '',
    description: '',
    poc: '',
  });

  // Form states - Royalty Dispute
  const [disputeForm, setDisputeForm] = useState({
    statementId: 'stmt-2026-09',
    releaseTitle: 'Neon Nights',
    dsp: 'Spotify',
    amount: '42.50',
    reason: '',
  });

  if (!isOpen) return null;

  const handleCopyrightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyrightForm.perjuryChecked) return;
    setSubmitting(true);
    try {
      const res = await api.reportCopyrightInfringement({
        complainantName: copyrightForm.name,
        email: copyrightForm.email,
        affectedWork: copyrightForm.affectedWork,
        infringingReleaseId: copyrightForm.releaseId,
        evidenceUrl: copyrightForm.evidenceUrl,
        perjuryDeclaration: copyrightForm.perjuryChecked,
      });
      setSuccessResult({ id: res.reportId, msg: res.message });
    } catch (err: any) {
      alert(err.message || 'Failed to submit copyright claim.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVulnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.reportVulnerability({
        reporterName: vulnForm.name,
        contactEmail: vulnForm.email,
        severity: vulnForm.severity,
        endpointAffected: vulnForm.endpoint,
        description: vulnForm.description,
        proofOfConcept: vulnForm.poc,
      });
      setSuccessResult({ id: res.reportId, msg: res.message });
    } catch (err: any) {
      alert(err.message || 'Failed to submit vulnerability report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitRoyaltyDispute({
        statementId: disputeForm.statementId,
        releaseTitle: disputeForm.releaseTitle,
        dsp: disputeForm.dsp,
        disputedAmount: disputeForm.amount,
        reason: disputeForm.reason,
      });
      setSuccessResult({ id: res.disputeId, msg: res.message });
    } catch (err: any) {
      alert(err.message || 'Failed to submit dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F1115] border border-[#262B35] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F5F3EE]">
        {/* Glow Header */}
        <div className="h-1 bg-gradient-to-r from-[#D6B36A] via-[#8B5CF6] to-[#35E59A]" />

        {/* Top Header */}
        <div className="p-6 border-b border-[#1C2027] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6B36A]/15 border border-[#D6B36A]/30 flex items-center justify-center text-[#D6B36A]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D6B36A] font-semibold">
                  Dedicated Intake & Escalation Channels
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Legal, Security & Accounting Incident Intake
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#969AA3] hover:text-white p-1 rounded-lg hover:bg-[#1C2027] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Tabs */}
        {!successResult && (
          <div className="px-6 py-2.5 bg-[#0D0F14] border-b border-[#1C2027] flex items-center space-x-2">
            {[
              { id: 'copyright', label: 'Copyright / DMCA Notice (§3)', icon: Scale },
              { id: 'vulnerability', label: 'Vulnerability Disclosure (§9)', icon: ShieldAlert },
              { id: 'royalty_dispute', label: 'Royalty Dispute (§4)', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = reportType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setReportType(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#1C2027] text-white border border-[#D6B36A]/40'
                      : 'text-[#969AA3] hover:text-white hover:bg-[#15181D]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6B36A]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {successResult ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#35E59A]/15 border border-[#35E59A]/30 text-[#35E59A] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Notice Successfully Logged</h3>
              <p className="text-xs text-[#969AA3] max-w-md mx-auto leading-relaxed">
                {successResult.msg}
              </p>
              <div className="p-3 bg-[#15181D] rounded-xl font-mono text-xs text-[#35D5FF] max-w-xs mx-auto border border-[#262B35]">
                Reference ID: {successResult.id}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1C2027] hover:bg-[#262B35] text-white font-bold rounded-xl text-xs transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              {/* FORM 1: COPYRIGHT DMCA */}
              {reportType === 'copyright' && (
                <form onSubmit={handleCopyrightSubmit} className="space-y-4 animate-fade-in text-xs">
                  <div className="p-3.5 bg-[#15181D] border border-[#262B35] rounded-xl space-y-1">
                    <p className="text-[#969AA3] leading-relaxed">
                      Formal Notice of Infringement under 17 U.S.C. § 512 and global copyright treaties. Notices are routed directly to Legal Review within 24 hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">Your Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe / Legal Representative"
                        value={copyrightForm.name}
                        onChange={(e) => setCopyrightForm({ ...copyrightForm, name: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#D6B36A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">Official Contact Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="rights-holder@label.com"
                        value={copyrightForm.email}
                        onChange={(e) => setCopyrightForm({ ...copyrightForm, email: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#D6B36A] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#969AA3] mb-1 font-semibold">Affected Copyrighted Work (Title, ISRC, or Registration #) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 'Midnight Horizon' - US-ABC-24-00101"
                      value={copyrightForm.affectedWork}
                      onChange={(e) => setCopyrightForm({ ...copyrightForm, affectedWork: e.target.value })}
                      className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#D6B36A] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">Infringing Release / UPC on SONVÉRA</label>
                      <input
                        type="text"
                        placeholder="e.g. UPC 793573194012"
                        value={copyrightForm.releaseId}
                        onChange={(e) => setCopyrightForm({ ...copyrightForm, releaseId: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#D6B36A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">Link to Supporting Evidence / Registration</label>
                      <input
                        type="url"
                        placeholder="https://copyright.gov/..."
                        value={copyrightForm.evidenceUrl}
                        onChange={(e) => setCopyrightForm({ ...copyrightForm, evidenceUrl: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#D6B36A] outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 border border-[#262B35] rounded-xl flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="dmca-perjury"
                      required
                      checked={copyrightForm.perjuryChecked}
                      onChange={(e) => setCopyrightForm({ ...copyrightForm, perjuryChecked: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-[#D6B36A] cursor-pointer"
                    />
                    <label htmlFor="dmca-perjury" className="text-[11px] text-[#969AA3] cursor-pointer leading-relaxed">
                      I declare under penalty of perjury that I am the copyright owner or authorized representative, that the use is not authorized, and that the information provided is accurate.
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !copyrightForm.perjuryChecked}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#D6B36A] to-[#B89648] text-[#08090B] font-bold rounded-xl flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Transmitting Notice...' : 'Submit Formal DMCA Notice'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORM 2: VULNERABILITY DISCLOSURE */}
              {reportType === 'vulnerability' && (
                <form onSubmit={handleVulnSubmit} className="space-y-4 animate-fade-in text-xs">
                  <div className="p-3.5 bg-[#15181D] border border-[#262B35] rounded-xl">
                    <p className="text-[#969AA3] leading-relaxed">
                      Safe Harbor is active for researchers following responsible disclosure guidelines (§9).
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-[#969AA3] mb-1 font-semibold">Severity</label>
                      <select
                        value={vulnForm.severity}
                        onChange={(e) => setVulnForm({ ...vulnForm, severity: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white focus:border-[#8B5CF6] outline-none"
                      >
                        <option value="CRITICAL">Critical (P1)</option>
                        <option value="HIGH">High (P2)</option>
                        <option value="MEDIUM">Medium (P3)</option>
                        <option value="LOW">Low (P4)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[#969AA3] mb-1 font-semibold">Endpoint / Asset Affected</label>
                      <input
                        type="text"
                        placeholder="e.g. POST /api/v1/releases/:id/ddex"
                        value={vulnForm.endpoint}
                        onChange={(e) => setVulnForm({ ...vulnForm, endpoint: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#8B5CF6] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#969AA3] mb-1 font-semibold">Vulnerability Description & Impact</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Explain the vulnerability mechanism and potential security impact..."
                      value={vulnForm.description}
                      onChange={(e) => setVulnForm({ ...vulnForm, description: e.target.value })}
                      className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#8B5CF6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#969AA3] mb-1 font-semibold">Proof of Concept / Reproduction Steps</label>
                    <textarea
                      rows={2}
                      placeholder="Step-by-step reproduction instructions or curl command..."
                      value={vulnForm.poc}
                      onChange={(e) => setVulnForm({ ...vulnForm, poc: e.target.value })}
                      className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white font-mono text-[11px] placeholder:text-[#525763] focus:border-[#8B5CF6] outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold rounded-xl flex items-center space-x-1.5 transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Logging Report...' : 'Submit Secure Vulnerability Report'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORM 3: ROYALTY DISPUTE */}
              {reportType === 'royalty_dispute' && (
                <form onSubmit={handleDisputeSubmit} className="space-y-4 animate-fade-in text-xs">
                  <div className="p-3.5 bg-[#15181D] border border-[#262B35] rounded-xl">
                    <p className="text-[#969AA3] leading-relaxed">
                      Submit formal accounting discrepancy claims within 60 days of statement issuance (§4). Our finance team will cross-reference raw DSP delivery logs.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">Statement Period</label>
                      <input
                        type="text"
                        value={disputeForm.statementId}
                        onChange={(e) => setDisputeForm({ ...disputeForm, statementId: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white focus:border-[#35E59A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#969AA3] mb-1 font-semibold">DSP Store</label>
                      <select
                        value={disputeForm.dsp}
                        onChange={(e) => setDisputeForm({ ...disputeForm, dsp: e.target.value })}
                        className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white focus:border-[#35E59A] outline-none"
                      >
                        <option value="Spotify">Spotify</option>
                        <option value="Apple Music">Apple Music</option>
                        <option value="YouTube Music">YouTube Music</option>
                        <option value="JioSaavn">JioSaavn</option>
                        <option value="Amazon Music">Amazon Music</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#969AA3] mb-1 font-semibold">Discrepancy Details & Expected Calculation</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify the stream count discrepancy or missing country payout..."
                      value={disputeForm.reason}
                      onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                      className="w-full bg-[#15181D] border border-[#262B35] rounded-lg p-2.5 text-white placeholder:text-[#525763] focus:border-[#35E59A] outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#35E59A] to-[#059669] text-[#08090B] font-bold rounded-xl flex items-center space-x-1.5 transition"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Submitting Dispute...' : 'File Royalty Audit Dispute'}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
