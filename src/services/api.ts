import { Release, DspIdentifier } from '../types';

const API_V1 = '/api/v1';

export const api = {
  // 1. Health & telemetry
  async checkHealth() {
    try {
      const res = await fetch(`${API_V1}/health`);
      return await res.json();
    } catch (e) {
      console.warn('Backend server offline or booting', e);
      return null;
    }
  },

  // 2. Releases (Part III, Section 3)
  async getReleases(status?: string, type?: string, search?: string): Promise<Release[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'ALL') params.append('status', status);
      if (type && type !== 'ALL') params.append('type', type);
      if (search) params.append('q', search);

      const res = await fetch(`${API_V1}/releases?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Failed to fetch from /api/v1/releases:', e);
      return [];
    }
  },

  async getRelease(id: string): Promise<Release | null> {
    try {
      const res = await fetch(`${API_V1}/releases/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Failed to fetch release detail:', e);
      return null;
    }
  },

  async createRelease(release: Partial<Release>): Promise<Release> {
    const res = await fetch(`${API_V1}/releases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(release),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async updateRelease(id: string, updates: Partial<Release>): Promise<Release> {
    const res = await fetch(`${API_V1}/releases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  // 3. Validation & Distribution (Page 10, 11)
  async validateRelease(id: string) {
    const res = await fetch(`${API_V1}/releases/${id}/validate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async submitRelease(id: string, dsps?: DspIdentifier[]) {
    const res = await fetch(`${API_V1}/releases/${id}/distribution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dsps }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getDeliveryStatus(id: string) {
    const res = await fetch(`${API_V1}/releases/${id}/distribution/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async takedownRelease(id: string, reason?: string) {
    const res = await fetch(`${API_V1}/releases/${id}/takedown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getDdexXml(id: string): Promise<string> {
    const res = await fetch(`${API_V1}/releases/${id}/ddex`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  },

  // 4. Asset Uploads (Page 8, 11)
  async presignAsset(filename: string, mimeType: string) {
    const res = await fetch(`${API_V1}/assets/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, mimeType }),
    });
    return await res.json();
  },

  async completeAsset(assetId: string, filename: string) {
    const res = await fetch(`${API_V1}/assets/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId, filename }),
    });
    return await res.json();
  },

  async uploadAudio(file: File) {
    const formData = new FormData();
    formData.append('audio', file);
    const res = await fetch(`${API_V1}/upload/audio`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async uploadArtwork(file: File) {
    const formData = new FormData();
    formData.append('artwork', file);
    const res = await fetch(`${API_V1}/upload/artwork`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // 5. Analytics (Page 11)
  async getAnalyticsOverview() {
    const res = await fetch(`${API_V1}/analytics/overview`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // 6. Royalties & Payouts (Part III, Section 3; Part IV, Section 7)
  async getRoyaltyTransactions() {
    const res = await fetch(`${API_V1}/royalties/transactions`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getRoyaltyStatements() {
    const res = await fetch(`${API_V1}/royalties/statements`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async requestPayout(amount: number, method: string, accountReference: string) {
    const res = await fetch(`${API_V1}/payouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method, accountReference }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // 7. AI & Assist (Page 8, 10)
  async runAiAudit(releaseId: string) {
    const res = await fetch(`${API_V1}/ai/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ releaseId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async runAiAssist(payload: { action: string; releaseTitle?: string; genre?: string; artistName?: string }) {
    const res = await fetch(`${API_V1}/ai/assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // 8. Admin & Operations Control Plane (PDF Part I §4, Part III §1, Part IV)
  async getAdminOverview() {
    const res = await fetch(`${API_V1}/admin/overview`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getAdminReleases(): Promise<Release[]> {
    const res = await fetch(`${API_V1}/admin/releases`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  },

  async adminUpdateReleaseStatus(id: string, status: string, note?: string) {
    const res = await fetch(`${API_V1}/admin/releases/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async adminApproveRelease(id: string) {
    const res = await fetch(`${API_V1}/admin/releases/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async adminRejectRelease(id: string, reason: string) {
    const res = await fetch(`${API_V1}/admin/releases/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getAdminAuditLogs() {
    const res = await fetch(`${API_V1}/admin/audit-logs`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  },

  async adminSyncProviders() {
    const res = await fetch(`${API_V1}/admin/sync-providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // 9. Production Security, Privacy & Policy Suite (OWASP ASVS 5.0 L2/L3)
  async getSecurityOverview() {
    try {
      const res = await fetch(`${API_V1}/security/overview`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch security overview:', e);
      return null;
    }
  },

  async getSecurityChecklist() {
    try {
      const res = await fetch(`${API_V1}/security/checklist`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch security checklist:', e);
      return null;
    }
  },

  async getFraudAlerts() {
    try {
      const res = await fetch(`${API_V1}/security/fraud-alerts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch fraud alerts:', e);
      return { count: 0, data: [] };
    }
  },

  async resolveFraudAlert(id: string, resolution: 'HOLD' | 'CLEAR') {
    const res = await fetch(`${API_V1}/security/fraud-alerts/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async requestStepUpChallenge(action: string, email?: string) {
    const res = await fetch(`${API_V1}/auth/step-up/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, email }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async verifyStepUpCode(challengeId: string, code: string) {
    const res = await fetch(`${API_V1}/auth/step-up/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, code }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  async getLegalPolicies() {
    try {
      const res = await fetch(`${API_V1}/security/policies`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch legal policies:', e);
      return { totalPolicies: 0, data: [] };
    }
  },

  async getLegalPolicy(slug: string) {
    try {
      const res = await fetch(`${API_V1}/security/policies/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`Failed to fetch policy ${slug}:`, e);
      return null;
    }
  },

  // 10. Trust Center, Status & Subprocessors (§13, §14)
  async getTrustOverview() {
    try {
      const res = await fetch(`${API_V1}/trust/overview`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch trust overview:', e);
      return null;
    }
  },

  async getSystemStatus() {
    try {
      const res = await fetch(`${API_V1}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch system status:', e);
      return null;
    }
  },

  async getSubprocessors() {
    try {
      const res = await fetch(`${API_V1}/subprocessors`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch subprocessors:', e);
      return { count: 0, data: [] };
    }
  },

  // 11. User Privacy & Data Rights Self-Service (§12)
  async submitPrivacyRequest(requestType: string, userEmail: string, details?: string) {
    const res = await fetch(`${API_V1}/privacy/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType, userEmail, details }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async getPrivacyRequests() {
    try {
      const res = await fetch(`${API_V1}/privacy/requests`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch privacy requests:', e);
      return { data: [] };
    }
  },

  // 12. Dedicated Support & Reporting Channels (§3, §4, §9)
  async reportCopyrightInfringement(data: {
    complainantName: string;
    email: string;
    affectedWork: string;
    infringingReleaseId?: string;
    evidenceUrl?: string;
    perjuryDeclaration: boolean;
  }) {
    const res = await fetch(`${API_V1}/support/report-copyright`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  async reportVulnerability(data: {
    reporterName: string;
    contactEmail: string;
    severity: string;
    endpointAffected?: string;
    description: string;
    proofOfConcept?: string;
  }) {
    const res = await fetch(`${API_V1}/support/report-vulnerability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async submitRoyaltyDispute(data: {
    statementId?: string;
    releaseTitle: string;
    dsp: string;
    disputedAmount?: string;
    reason: string;
  }) {
    const res = await fetch(`${API_V1}/support/royalty-dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
};


