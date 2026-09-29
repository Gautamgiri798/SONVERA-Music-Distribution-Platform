// SONVÉRA Core Type Definitions

export type ReleaseType = 'single' | 'ep' | 'album';

export type DistributionStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'VALIDATION_FAILED'
  | 'READY'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PROCESSING'
  | 'DELIVERED'
  | 'LIVE'
  | 'REJECTED'
  | 'TAKEDOWN_REQUESTED'
  | 'TAKEN_DOWN';

export type UserRole =
  | 'independent_artist'
  | 'professional_artist'
  | 'label'
  | 'label_team_member'
  | 'administrator';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  labelName?: string;
  managedArtists?: string[];
  verified: boolean;
}

export type ContributorRole =
  | 'Primary Artist'
  | 'Featured Artist'
  | 'Producer'
  | 'Songwriter / Composer'
  | 'Lyricist'
  | 'Mixing Engineer'
  | 'Mastering Engineer'
  | 'Publisher'
  | 'Remixer';

export interface Contributor {
  id: string;
  name: string;
  role: ContributorRole;
  ipnOrIpi?: string;
  sharePercentage: number; // Mechanical / royalty split %
  isVerified?: boolean;
}

export interface AudioFileSpec {
  fileName: string;
  fileSizeBytes: number;
  format: 'WAV' | 'FLAC' | 'AIFF';
  sampleRateHz: number; // e.g., 44100, 48000, 96000
  bitDepth: 16 | 24 | 32;
  channels: 'Stereo' | 'Mono' | 'Dolby Atmos';
  durationSeconds: number;
  peakLufs: number;
  waveformSample?: number[]; // normalized heights 0-1 for visualizer
  audioUrl?: string; // tone or preview url
}

export interface Track {
  id: string;
  trackNumber: number;
  title: string;
  versionTitle?: string; // e.g. "Radio Edit", "Acoustic", "Club Mix"
  primaryArtist: string;
  featuredArtists: string[];
  isrc: string; // International Standard Recording Code
  isExplicit: boolean;
  isInstrumental: boolean;
  language: string;
  audioSpec?: AudioFileSpec;
  contributors: Contributor[];
  previewStartTimeSec: number;
  lyricsSnippet?: string;
}

export interface ArtworkSpec {
  url: string;
  width: number; // min 3000
  height: number; // min 3000
  colorSpace: 'RGB' | 'CMYK';
  format: 'JPEG' | 'PNG' | 'TIFF';
  sizeBytes: number;
  hasTextRestrictionsPassed: boolean;
}

export type DspIdentifier =
  | 'spotify'
  | 'apple_music'
  | 'youtube_music'
  | 'amazon_music'
  | 'tidal'
  | 'deezer'
  | 'jiosaavn'
  | 'tiktok'
  | 'meta'
  | 'pandora'
  | 'qobuz'
  | 'tencent';

export interface DspPlatform {
  id: DspIdentifier;
  name: string;
  category: 'Streaming' | 'Social / Sync' | 'Hi-Res' | 'Regional';
  icon: string;
  territoriesCovered: string;
  leadTimeHours: number;
  audioRequirement: string;
  losslessSupported: boolean;
  active: boolean;
}

export interface DspDeliveryStatus {
  dspId: DspIdentifier;
  dspName: string;
  status: 'PENDING' | 'INGESTING' | 'ACCEPTED' | 'LIVE' | 'FAILED' | 'TAKEDOWN';
  deliveryBatchId?: string;
  deliveredAt?: string;
  liveAt?: string;
  dspReleaseUrl?: string;
  errorReason?: string;
}

export interface StatusHistoryItem {
  id: string;
  status: DistributionStatus;
  timestamp: string;
  note: string;
  actor: string;
  batchId?: string;
}

export interface ValidationIssue {
  id: string;
  category: 'Audio' | 'Artwork' | 'Metadata' | 'Copyright' | 'Contributors' | 'Distribution';
  severity: 'error' | 'warning' | 'info';
  field: string;
  trackId?: string;
  message: string;
  recommendation: string;
  fixActionStep?: number; // 1 to 7 corresponding to wizard steps
}

export interface ReleaseHealthScore {
  overallScore: number; // 0 - 100
  breakdown: {
    audio: number; // max 20
    artwork: number; // max 20
    metadata: number; // max 20
    copyright: number; // max 15
    contributors: number; // max 15
    distributionReadiness: number; // max 10
  };
  passedChecks: number;
  totalChecks: number;
}

export interface ValidationResult {
  isValid: boolean;
  canSubmit: boolean;
  issues: ValidationIssue[];
  healthScore: ReleaseHealthScore;
  evaluatedAt: string;
}

export interface Release {
  id: string;
  title: string;
  releaseType: ReleaseType;
  primaryArtist: string;
  featuredArtists: string[];
  labelName: string;
  catalogNumber: string;
  upc: string; // Universal Product Code / EAN
  primaryGenre: string;
  secondaryGenre?: string;
  language: string;
  explicitRating: 'clean' | 'explicit' | 'not_applicable';
  
  // Dates
  releaseDate: string; // YYYY-MM-DD
  preOrderDate?: string;
  originalReleaseDate?: string;
  isRemaster: boolean;

  // Assets
  artwork?: ArtworkSpec;
  tracks: Track[];

  // Rights & Territories
  cLineYear: number;
  cLineOwner: string;
  pLineYear: number;
  pLineOwner: string;
  territoryOption: 'worldwide' | 'custom';
  selectedTerritories: string[]; // ISO 2-letter codes or 'WW'

  // Distribution
  selectedDsps: DspIdentifier[];
  status: DistributionStatus;
  statusHistory: StatusHistoryItem[];
  deliveryStatuses: DspDeliveryStatus[];
  
  // Validation
  validationResult?: ValidationResult;

  // Metadata
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  liveAt?: string;
}

// Royalties & Accounting Types
export interface RoyaltyLedgerEntry {
  id: string;
  releaseId: string;
  releaseTitle: string;
  trackTitle: string;
  dsp: string;
  territory: string;
  period: string; // e.g. "2026-08"
  streams: number;
  grossAmount: number;
  distributorFee: number;
  netArtistShare: number;
  currency: 'USD' | 'EUR' | 'GBP';
  payoutStatus: 'unprocessed' | 'ready_for_payout' | 'paid';
}

export interface RoyaltyStatement {
  id: string;
  periodName: string;
  accountingPeriod: string;
  totalStreams: number;
  grossEarnings: number;
  netEarnings: number;
  retainedMargin: number;
  status: 'AUDITED' | 'PROCESSING' | 'PAID';
  issuedAt: string;
  pdfUrl?: string;
  csvUrl?: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  currency: string;
  method: 'Stripe Direct' | 'Wire Transfer (SWIFT)' | 'Wise' | 'PayPal';
  requestedAt: string;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
  accountReference: string;
}

export interface StreamingPerformance {
  releaseId: string;
  totalStreams: number;
  streamsLast7Days: number;
  streamsChangePct: number;
  topDsp: string;
  topTerritory: string;
  listeners28Days: number;
  playlistPlacements: number;
}

// Distribution Provider Abstraction
export interface DeliveryBatch {
  batchId: string;
  releaseId: string;
  submittedAt: string;
  targetDsps: DspIdentifier[];
  ddexMessageId: string;
  status: 'QUEUED' | 'TRANSMITTING' | 'INGESTED' | 'COMPLETED' | 'FAILED';
  rawXmlDdexUrl?: string;
  logSummary: string[];
}

export interface DistributionProvider {
  name: string;
  providerId: string;
  isDemo: boolean;
  version: string;
  validateRelease(release: Release): Promise<ValidationResult>;
  submitRelease(release: Release, dspIds: DspIdentifier[]): Promise<DeliveryBatch>;
  getStatus(releaseId: string): Promise<DistributionStatus>;
  updateMetadata(releaseId: string, updates: Partial<Release>): Promise<boolean>;
  takeDownRelease(releaseId: string, reason: string): Promise<boolean>;
  getDeliveryStatus(releaseId: string): Promise<DspDeliveryStatus[]>;
  generateDdexPackage(release: Release): string;
}

// =============================================================
// PRODUCTION SECURITY, PRIVACY & POLICY TYPES
// (OWASP ASVS 5.0 L2 / L3 Compliance)
// =============================================================

export type SecurityRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'LABEL_OWNER'
  | 'LABEL_MANAGER'
  | 'ARTIST'
  | 'ARTIST_MANAGER'
  | 'FINANCE'
  | 'SUPPORT';

export type DataClassificationLevel = 'PUBLIC' | 'INTERNAL' | 'HIGH' | 'CRITICAL';

export interface DataClassificationEntry {
  level: DataClassificationLevel;
  name: string;
  scope: string;
  controls: string;
  encryption: string;
  accessPolicy: string;
}

export interface SecurityChecklistItem {
  id: string;
  sectionNumber: number;
  category: string;
  requirement: string;
  specification: string;
  status: 'ENFORCED' | 'COMPLIANT' | 'AUDITED';
  targetLevel: 'ASVS L2' | 'ASVS L3';
  lastAudited: string;
  auditEvidence: string;
}

export interface FraudAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  entityType: 'PAYOUT' | 'RELEASE' | 'ACCOUNT' | 'STREAM';
  entityId: string;
  riskScore: number;
  reason: string;
  recommendation: string;
  detectedAt: string;
  status: 'PENDING_REVIEW' | 'VERIFIED_SAFE' | 'HOLD_PLACED';
}

export interface PolicySection {
  title: string;
  content: string;
}

export type PolicyPillar = 'LEGAL' | 'TRUST_AND_SECURITY' | 'SUPPORT_AND_REPORTING';

export interface LegalPolicy {
  id: string;
  slug: string;
  title: string;
  pillar?: PolicyPillar;
  category: string;
  version: string;
  effectiveDate: string;
  summary: string;
  sections?: PolicySection[];
  sectionCount?: number;
}

export interface SubprocessorEntry {
  id: string;
  name: string;
  category: string;
  location: string;
  purpose: string;
  safeguard: string;
  dpaSigned: boolean;
}

export interface SystemStatusComponent {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED_PERFORMANCE' | 'PARTIAL_OUTAGE' | 'MAINTENANCE';
  uptimePct: number;
  latencyMs: number;
  description: string;
}

export interface StatusIncident {
  id: string;
  title: string;
  severity: string;
  impact: string;
  status: 'RESOLVED' | 'MONITORING' | 'INVESTIGATING';
  createdAt: string;
  resolvedAt: string;
  updates: { timestamp: string; message: string }[];
}

export interface PrivacyRequest {
  id: string;
  requestType: 'DATA_EXPORT' | 'DATA_CORRECTION' | 'DATA_DELETION' | 'REVOKE_CONSENT';
  userEmail: string;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED';
  details: string;
  submittedAt: string;
  downloadUrl?: string;
}

export interface TrustOverviewData {
  platform: string;
  trustScore: number;
  baselineStandard: string;
  dpdpAct2023Compliant: boolean;
  gdprCompliant: boolean;
  encryptionInTransit: string;
  encryptionAtRest: string;
  activeSubprocessorsCount: number;
  pciDssComplianceLevel: string;
  systemAvailability: string;
  securityContact: string;
  privacyContact: string;
  legalContact: string;
}

export interface SecurityOverviewData {
  standard: string;
  complianceScore: number;
  status: string;
  lastAudited: string;
  dataClassificationMatrix: DataClassificationEntry[];
  activeSessions: {
    id: string;
    user: string;
    role: string;
    device: string;
    ip: string;
    lastActive: string;
    mfaVerified: boolean;
  }[];
  encryption: {
    inTransit: string;
    atRest: string;
    passwords: string;
    tokens: string;
  };
  quarantineEngine: {
    status: string;
    cleanAudioScanned: number;
    quarantinedFiles: number;
    malwareDefinitionsDate: string;
  };
  auditRecordsCount: number;
}

