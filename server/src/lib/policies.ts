// SONVÉRA Comprehensive Legal, Privacy, Policy & Trust Framework
// Complete Policy Stack conforming to Section 17 & 19 of the Commercial Architecture Blueprint

export interface PolicySection {
  title: string;
  content: string;
}

export type PolicyPillar = 'LEGAL' | 'TRUST_AND_SECURITY' | 'SUPPORT_AND_REPORTING';

export interface LegalPolicy {
  id: string;
  slug: string;
  title: string;
  pillar: PolicyPillar;
  category: string;
  version: string;
  effectiveDate: string;
  summary: string;
  sections: PolicySection[];
}

export interface SubprocessorEntry {
  id: string;
  name: string;
  category: 'Cloud Infrastructure' | 'Payment & Banking' | 'DSP Delivery Network' | 'Security & CDN' | 'Customer Communication';
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
  severity: 'P1 - Critical' | 'P2 - Major' | 'P3 - Minor' | 'P4 - Notice';
  impact: string;
  status: 'RESOLVED' | 'MONITORING' | 'INVESTIGATING';
  createdAt: string;
  resolvedAt: string;
  updates: { timestamp: string; message: string }[];
}

// 1. Authorized Subprocessors Registry (Section 13)
export const SUBPROCESSORS_REGISTRY: SubprocessorEntry[] = [
  {
    id: 'sub-aws',
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud Infrastructure',
    location: 'United States & Global Regions',
    purpose: 'S3 private object storage for lossless master WAV audio, KMS encryption, compute instances',
    safeguard: 'SOC 2 Type II, ISO 27001, AWS DPA with Standard Contractual Clauses (SCCs)',
    dpaSigned: true,
  },
  {
    id: 'sub-cloudflare',
    name: 'Cloudflare Inc.',
    category: 'Security & CDN',
    location: 'Global Edge Network (300+ Cities)',
    purpose: 'DDoS mitigation, Web Application Firewall (WAF), R2 distributed artwork storage, DNS',
    safeguard: 'ISO 27701, PCI-DSS Level 1, Cloudflare EU Standard Contractual Clauses',
    dpaSigned: true,
  },
  {
    id: 'sub-stripe',
    name: 'Stripe Payments Inc.',
    category: 'Payment & Banking',
    location: 'United States, India, Global',
    purpose: 'Direct artist payouts, debit/credit processing for subscription plans, 1099/W-8BEN tax forms',
    safeguard: 'PCI-DSS Level 1 Service Provider, Stripe Global DPA',
    dpaSigned: true,
  },
  {
    id: 'sub-spotify',
    name: 'Spotify AB & Partners',
    category: 'DSP Delivery Network',
    location: 'Sweden / Global',
    purpose: 'Direct ingestion of DDEX ERN 4.3 metadata and master audio for global streaming',
    safeguard: 'Commercial DSP Direct Distributor License & B2B Data Terms',
    dpaSigned: true,
  },
  {
    id: 'sub-apple',
    name: 'Apple Inc. (Apple Music & iTunes)',
    category: 'DSP Delivery Network',
    location: 'United States / Global',
    purpose: 'Music and artwork delivery via Apple Transporter and DDEX feeds',
    safeguard: 'Apple Authorized Music Distributor Agreement',
    dpaSigned: true,
  },
  {
    id: 'sub-google',
    name: 'Google LLC (YouTube Music & Content ID)',
    category: 'DSP Delivery Network',
    location: 'United States / Global',
    purpose: 'Sound recording delivery, Content ID audio fingerprinting, and YouTube Music streaming',
    safeguard: 'YouTube Direct Partner Agreement with Enterprise Content Hosting Terms',
    dpaSigned: true,
  },
];

// 2. Real-Time Status Components & Incidents (Section 14)
export const SYSTEM_STATUS_COMPONENTS: SystemStatusComponent[] = [
  {
    id: 'comp-platform',
    name: 'Platform Core & Web App',
    status: 'OPERATIONAL',
    uptimePct: 99.98,
    latencyMs: 42,
    description: 'Main artist portal, dashboard routing, and UI state synchronization',
  },
  {
    id: 'comp-auth',
    name: 'Authentication & MFA Engine',
    status: 'OPERATIONAL',
    uptimePct: 100.0,
    latencyMs: 65,
    description: 'Argon2id credential verification, step-up MFA challenge, JWT rotation',
  },
  {
    id: 'comp-upload',
    name: 'Master Audio Uploads & Quarantine Engine',
    status: 'OPERATIONAL',
    uptimePct: 99.95,
    latencyMs: 110,
    description: 'Presigned S3/R2 direct uploads, RIFF magic byte verification, malware scan',
  },
  {
    id: 'comp-dsp',
    name: 'DSP Ingestion & DDEX ERN 4.3 Pipes',
    status: 'OPERATIONAL',
    uptimePct: 99.92,
    latencyMs: 145,
    description: 'XML packaging and batch dispatch to 12 active DSP store connections',
  },
  {
    id: 'comp-analytics',
    name: 'Streaming Telemetry & Audience Insights',
    status: 'OPERATIONAL',
    uptimePct: 99.88,
    latencyMs: 85,
    description: 'Daily stream ingestion from Spotify, YouTube, Apple, JioSaavn, and Amazon',
  },
  {
    id: 'comp-ledger',
    name: 'Financial Ledger, Royalties & Payout Rails',
    status: 'OPERATIONAL',
    uptimePct: 100.0,
    latencyMs: 55,
    description: 'Immutable transaction-level ledger, monthly statement generation, Stripe/Wire payouts',
  },
];

export const HISTORICAL_STATUS_INCIDENTS: StatusIncident[] = [
  {
    id: 'INC-2026-08',
    title: 'Scheduled Maintenance: DDEX ERN 4.3 Schema Update',
    severity: 'P4 - Notice',
    impact: 'None. Ingestion queue paused for 12 minutes during provider feed sync.',
    status: 'RESOLVED',
    createdAt: '2026-08-15T02:00:00Z',
    resolvedAt: '2026-08-15T02:12:00Z',
    updates: [
      { timestamp: '2026-08-15T02:00:00Z', message: 'Initiated planned database schema migration for ERN 4.3 compliance.' },
      { timestamp: '2026-08-15T02:12:00Z', message: 'Migration completed smoothly. Queue resumed. All DSP pipes operational.' },
    ],
  },
  {
    id: 'INC-2026-07',
    title: 'Upstream Provider Delivery Latency (JioSaavn Feed)',
    severity: 'P3 - Minor',
    impact: 'Releases queued for JioSaavn experienced 4-hour ingestion delay.',
    status: 'RESOLVED',
    createdAt: '2026-07-22T14:10:00Z',
    resolvedAt: '2026-07-22T18:45:00Z',
    updates: [
      { timestamp: '2026-07-22T14:10:00Z', message: 'Investigating elevated 504 gateway response from external JioSaavn SFTP endpoint.' },
      { timestamp: '2026-07-22T18:45:00Z', message: 'JioSaavn network partner cleared server maintenance. All backlogged batches confirmed delivered.' },
    ],
  },
];

// 3. Complete Final Policy Stack (Section 17 & 19)
export const COMPLETE_POLICY_STACK: LegalPolicy[] = [
  // ===================== PILLAR 1: LEGAL POLICIES =====================
  {
    id: 'POL-01',
    slug: 'terms-of-service',
    title: 'Terms of Service',
    pillar: 'LEGAL',
    category: 'Commercial & Contractual',
    version: '1.4.0',
    effectiveDate: 'September 2026',
    summary: 'Binding contractual terms governing account registration, music distribution licenses, warranties, platform limitations, and liability.',
    sections: [
      {
        title: '1. Introduction & The SONVÉRA Service',
        content: 'These Terms of Service constitute a legally binding agreement between you (whether an individual artist, band, record label entity, or representative) and SONVÉRA Inc. SONVÉRA operates as a premier digital music aggregator, encoding, packaging, and dispatching sound recordings and associated metadata to Digital Service Providers worldwide.',
      },
      {
        title: '2. Grant of Distribution Authority',
        content: 'You grant SONVÉRA the non-exclusive, worldwide authorization to digitally transmit, stream, encode into lossy and lossless formats, generate previews, and deliver your master recordings and cover artwork to all stores selected during release submission. You retain 100% ownership of your copyrights, master sound recordings, and musical works.',
      },
      {
        title: '3. Artist Representations & Warranties',
        content: 'You explicitly warrant and covenant that: (a) You hold all required mechanical, synchronization, master, and publishing rights; (b) No recordings contain uncleared samples or unauthorized third-party intellectual property; (c) All contributor allocations, producer royalties, and songwriter splits entered into SONVÉRA are accurate; (d) You will not engage in artificial streaming manipulation.',
      },
      {
        title: '4. Fees, Deductions & Subscriptions',
        content: 'Distribution services are provided under chosen subscription plans (Starter, Pro, Enterprise Label). SONVÉRA passes through 100% of net royalties collected on eligible plans without taking commission cuts, subject only to third-party payment processing fees and mandatory statutory withholdings.',
      },
      {
        title: '5. Account Suspension, Takedowns & Termination',
        content: 'SONVÉRA reserves the right to suspend releases or accounts found in violation of our Content Policy, DMCA requirements, or artificial streaming rules. Upon termination, pending releases are removed via standard DDEX Purge, and financial ledgers are preserved for statutory tax and audit periods.',
      },
    ],
  },
  {
    id: 'POL-02',
    slug: 'privacy-policy',
    title: 'Privacy & Data Protection Policy',
    pillar: 'LEGAL',
    category: 'Privacy & Compliance',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Comprehensive transparency on personal data collection, DPDP Act 2023 compliance, GDPR rights, encryption standards, and sub-processors.',
    sections: [
      {
        title: '1. Personal Data Categories We Collect',
        content: 'We collect: (a) Account Identifiers: Name, artist moniker, email address, password hash (Argon2id); (b) Industry Identifiers: ISNI, IPI/CAE numbers, ISRC registrant codes; (c) Financial Data: Bank account routing/SWIFT, tax identification (PAN, GSTIN, W-8BEN/W-9) stored inside PCI-DSS vaults; (d) Usage & Ingestion Telemetry: IP addresses, audit logs, and DSP streaming numbers.',
      },
      {
        title: '2. Lawful Processing & Purpose Limitation',
        content: 'Your information is processed strictly for: (i) Executing music distribution contracts; (ii) Delivering DDEX ERN 4.3 release packages to DSPs; (iii) Accounting and distributing 100% of earned royalties; (iv) Preventing platform fraud, bot traffic, and copyright infringement; (v) Complying with financial and tax reporting laws.',
      },
      {
        title: '3. Data Security & Storage Architecture',
        content: 'Data is protected using AES-256 envelope encryption at rest and TLS 1.3 in transit. Master audio files are maintained in private object storage accessible only via 15-minute cryptographically signed URLs. Passwords are never stored in plaintext.',
      },
      {
        title: '4. Artist Rights (DPDP Act 2023 & GDPR)',
        content: 'You have the right to access your personal data, request correction of inaccurate records, download catalog exports in JSON/CSV format, and request account erasure subject to 7-year statutory financial ledger preservation obligations.',
      },
    ],
  },
  {
    id: 'POL-03',
    slug: 'cookie-policy',
    title: 'Cookie & Tracking Technologies Policy',
    pillar: 'LEGAL',
    category: 'Privacy & Compliance',
    version: '1.1.0',
    effectiveDate: 'September 2026',
    summary: 'Specifies strictly necessary session security cookies, user consent mechanisms, zero third-party ad tracking, and preference controls.',
    sections: [
      {
        title: '1. Use of Essential Cookies',
        content: 'SONVÉRA uses strictly necessary HttpOnly, Secure, SameSite=Strict cookies to verify user identity, prevent cross-site request forgery (CSRF), and maintain secure administrator and artist sessions.',
      },
      {
        title: '2. No Third-Party Advertising Pixels',
        content: 'SONVÉRA does not embed behavioral advertising trackers, data broker scripts, or third-party ad retargeting pixels inside authenticated platform workspaces. Your listening, distribution, and revenue habits are never sold.',
      },
      {
        title: '3. Interactive Cookie Preferences Center',
        content: 'Artists can customize and update their cookie preferences at any time via the Cookie Preferences Center accessible from the platform footer.',
      },
    ],
  },
  {
    id: 'POL-04',
    slug: 'acceptable-use-policy',
    title: 'Acceptable Use Policy',
    pillar: 'LEGAL',
    category: 'Platform Governance',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Prohibits artificial streaming, bot farms, reverse engineering, unauthorized API scraping, and abusive platform behavior.',
    sections: [
      {
        title: '1. Artificial Streaming & Fraud Prohibitions',
        content: 'You must never purchase, generate, or facilitate artificial streams, bot plays, click farms, or deceptive playlist placements. DSPs utilize sophisticated acoustic and behavioural telemetry to detect unnatural streaming. Releases engaged in stream manipulation will be immediately pulled, and associated revenues withheld.',
      },
      {
        title: '2. Platform Security & Reverse Engineering',
        content: 'Users are strictly prohibited from probing, scanning, or vulnerability-testing the platform without prior written authorization under our Vulnerability Disclosure Policy. Decompiling frontend code, bypassing rate limits, or forging HTTP headers is grounds for instant termination.',
      },
      {
        title: '3. Identity Integrity & Impersonation',
        content: 'Impersonating another artist, producer, record label, or distributor is strictly prohibited. Submitting music under another entity\'s artist profile without legal proof of authorization results in immediate account bans.',
      },
    ],
  },
  {
    id: 'POL-05',
    slug: 'content-policy',
    title: 'Content & Audio Quality Policy',
    pillar: 'LEGAL',
    category: 'Content & Rights',
    version: '1.5.0',
    effectiveDate: 'September 2026',
    summary: 'Comprehensive standards for studio-grade audio masters, 3000x3000px artwork, explicit content tagging, and synthetic voice guidelines.',
    sections: [
      {
        title: '1. Master Audio Engineering Baseline',
        content: 'Audio masters must be uncompressed 24-bit or 16-bit WAV, FLAC, or AIFF files at 44.1kHz or 48.0kHz. Recommended integrated loudness is -14 LUFS (±1.0 LUFS) with a maximum True Peak of -1.0 dBTP to avoid transcoding distortion on lossy streaming codecs.',
      },
      {
        title: '2. Cover Artwork Guidelines',
        content: 'Artwork must be a perfect square, minimum 3000 x 3000 pixels at 300 DPI, in RGB color space. Artwork cannot contain URLs, contact info, social handles, retailer logos, pricing, or misleading barcodes.',
      },
      {
        title: '3. Explicit Content Tagging',
        content: 'Any track containing explicit language, references to violence, drug abuse, or sexual themes must be correctly tagged as Explicit. Failure to tag explicit content results in store rejection.',
      },
      {
        title: '4. Synthetic Voices & Deepfakes',
        content: 'AI-generated voice clones mimicking established artists without verified legal license agreements are strictly prohibited and will be rejected during QC screening.',
      },
    ],
  },
  {
    id: 'POL-06',
    slug: 'copyright-policy',
    title: 'Copyright Policy',
    pillar: 'LEGAL',
    category: 'Content & Rights',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Affirms that artists retain 100% of copyrights, covers licensing requirements for covers, beats, and master recordings.',
    sections: [
      {
        title: '1. Retention of Creator Ownership',
        content: 'SONVÉRA does not acquire copyright ownership of your music, lyrics, musical compositions, or cover designs. You remain the legal owner or authorized licensee of your catalog at all times.',
      },
      {
        title: '2. Cover Songs & Compulsory Mechanical Licenses',
        content: 'Distributing cover versions of copyrighted musical works requires obtaining appropriate mechanical licenses for territories where required by law. Artists must indicate underlying songwriters and publishers in Step 5 of the Release Builder.',
      },
      {
        title: '3. Sample Clearance & Beat Licensing',
        content: 'All sampled recordings, loops, and purchased beats must have written commercial licenses permitting worldwide distribution and streaming monetization. Royalty-free pack licenses must allow commercial DSP distribution.',
      },
    ],
  },
  {
    id: 'POL-07',
    slug: 'copyright-takedown-policy',
    title: 'Copyright Takedown & DMCA Policy',
    pillar: 'LEGAL',
    category: 'Content & Rights',
    version: '1.4.0',
    effectiveDate: 'September 2026',
    summary: 'Prescribes the formal 6-stage notice and takedown workflow, counter-notice rights, repeat infringer enforcement, and provider purge propagation.',
    sections: [
      {
        title: '1. Dedicated Copyright Intake Channel',
        content: 'Copyright owners may submit formal infringement notices through our dedicated intake portal at copyright@sonvera.audio or via the interactive DMCA form. Generic support tickets are routed directly to the Rights & Legal Review team.',
      },
      {
        title: '2. Controlled 6-Stage Takedown Pipeline',
        content: 'Our takedown workflow proceeds strictly through: (1) Complaint Submission -> (2) Formal Verification -> (3) Legal Review -> (4) Provider Purge Dispatch via DDEX -> (5) Uploader Notification -> (6) Counter-Notice & Appeal window.',
      },
      {
        title: '3. Counter-Notification & Reinstatement',
        content: 'If an artist believes their release was removed due to mistake or misidentification, they may file a formal Counter-Notification within 14 business days, providing proof of authorization, sample clearance certificates, and consent to jurisdiction.',
      },
      {
        title: '4. Three-Strike Repeat Infringer Policy',
        content: 'In accordance with 17 U.S.C. § 512(i), accounts receiving three (3) distinct, unresolved, validated copyright strikes will have their memberships permanently terminated and their full catalog purged from DSP networks.',
      },
    ],
  },
  {
    id: 'POL-08',
    slug: 'artist-distribution-agreement',
    title: 'Artist Distribution Agreement',
    pillar: 'LEGAL',
    category: 'Artist & Label Agreements',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Standard master agreement defining distributor appointment, territory scope, 100% royalty pass-through, and warranties.',
    sections: [
      {
        title: '1. Appointment as Non-Exclusive Distributor',
        content: 'Artist appoints SONVÉRA as their non-exclusive digital distribution partner to deliver designated audio recordings, visual artwork, and metadata to Digital Service Providers worldwide.',
      },
      {
        title: '2. Term & Voluntary Removal',
        content: 'This Agreement remains in effect until terminated by either party. The artist may request takedown of any or all releases at any time through the Release Center, and SONVÉRA will dispatch DDEX purge notices within 24-48 business hours.',
      },
      {
        title: '3. Accounting & Pass-Through Rate',
        content: 'SONVÉRA credits 100% of Net Receipts received from DSPs directly to the artist\'s immutable balance, calculated in accordance with our Royalty & Payout Terms.',
      },
    ],
  },
  {
    id: 'POL-09',
    slug: 'label-management-agreement',
    title: 'Record Label & Aggregator Agreement',
    pillar: 'LEGAL',
    category: 'Artist & Label Agreements',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Governs multi-artist roster management, sub-account permissions, split sheet automation, and enterprise DDEX delivery.',
    sections: [
      {
        title: '1. Multi-Artist Roster Authority',
        content: 'Record labels warrant that they hold valid recording contracts or distribution agreements with each artist in their roster and possess full legal authority to distribute their works and collect revenues on their behalf.',
      },
      {
        title: '2. Sub-User Access & Role Permissions',
        content: 'Labels may provision sub-accounts for Label Managers, A&R scouts, and Finance Officers. The primary Label Owner remains strictly liable for all acts, releases, and payout requests executed under their account.',
      },
      {
        title: '3. Automated Split Sheets',
        content: 'Labels may configure automated mechanical and producer splits. Royalty splits are calculated and allocated automatically upon monthly statement ingestion.',
      },
    ],
  },
  {
    id: 'POL-10',
    slug: 'distribution-terms',
    title: 'Distribution Terms & Provider Delivery Rules',
    pillar: 'LEGAL',
    category: 'Commercial & Contractual',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Outlines DSP lead times, metadata freeze windows, pre-orders, editorial playlist pitching, and store takedown propagation.',
    sections: [
      {
        title: '1. DSP Delivery Lead Times',
        content: 'To ensure global delivery on your chosen release date and allow for DSP editorial playlist consideration, releases must be submitted at least 14 days in advance. Average ingestion windows: Spotify (24-48h), Apple Music (24-48h), YouTube Music (48-72h), JioSaavn (48-72h).',
      },
      {
        title: '2. Metadata Freeze Windows',
        content: 'Once a release has been approved and delivered to DSP stores, metadata updates (titles, artwork, ISRC) require submitting a DDEX Update package and can take 3 to 5 business days for stores to reflect.',
      },
      {
        title: '3. Territory Selectivity & Windowing',
        content: 'Artists can distribute worldwide or restrict specific ISO 3166-1 alpha-2 territory codes to comply with regional licensing arrangements.',
      },
    ],
  },
  {
    id: 'POL-11',
    slug: 'royalty-payment-terms',
    title: 'Royalty & Payout Terms',
    pillar: 'LEGAL',
    category: 'Financial Governance',
    version: '1.4.0',
    effectiveDate: 'September 2026',
    summary: 'Comprehensive financial rules detailing the 100% royalty model, Net-45/60 accounting cycles, $50 threshold, dispute procedures, and fraud hold protocols.',
    sections: [
      {
        title: '1. 100% Net Royalty Model & Transparent Pass-Through',
        content: 'SONVÉRA distributes 100% of net royalties received from digital streaming, permanent downloads, and social sync monetization. SONVÉRA does not extract commission percentages from artist royalties on eligible subscription plans.',
      },
      {
        title: '2. Reporting Delays & Accounting Periods',
        content: 'DSPs report and remit earnings on a Net-45 to Net-60 day delay (e.g. streaming activity in January is reported and payable in mid-March). Monthly statements are compiled into an immutable append-only ledger.',
      },
      {
        title: '3. Minimum Payout Thresholds & Payout Rails',
        content: 'Artists may request payouts once their available balance reaches $50.00 USD. Supported payout rails include Stripe Direct, SWIFT International Wire Transfer, Wise, and PayPal. Payment provider processing fees apply directly from the provider without platform markup.',
      },
      {
        title: '4. Royalty Disputes, Corrections & Fraud Holds',
        content: 'If an artist identifies a reporting discrepancy, they may submit a formal Royalty Dispute ticket within 60 days of statement issuance. If a DSP issues a penalty, clawback, or audit adjustment due to artificial bot streams, a temporary 30-day investigative hold will be applied to the affected balance.',
      },
      {
        title: '5. Post-Termination Balance Treatment',
        content: 'In the event of account closure, any remaining accrued balance exceeding the payout threshold will be remitted to the artist\'s verified bank account within 90 days following final DSP reconciliation.',
      },
    ],
  },
  {
    id: 'POL-12',
    slug: 'payment-billing-terms',
    title: 'Payment & Billing Terms',
    pillar: 'LEGAL',
    category: 'Financial Governance',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Details subscription plan billing, recurring charges, failed payment retry logic, and currency conversion.',
    sections: [
      {
        title: '1. Subscription Billing Cycles',
        content: 'Paid distribution plans (Pro Plan, Enterprise Label) are billed on a recurring monthly or annual basis via Stripe. Billing begins on the date of subscription and automatically renews unless cancelled prior to the renewal date.',
      },
      {
        title: '2. Payment Authorization & Retries',
        content: 'By providing a payment method, you authorize SONVÉRA to charge the applicable subscription fee. If a recurring payment fails, our billing engine attempts 3 retries over 7 business days before downgrading account capabilities.',
      },
      {
        title: '3. Taxes & Currency Conversion',
        content: 'Subscription prices do not include applicable local sales tax, VAT, or GST, which will be calculated and added at checkout based on your registered billing country.',
      },
    ],
  },
  {
    id: 'POL-13',
    slug: 'refund-cancellation-policy',
    title: 'Refund & Cancellation Policy',
    pillar: 'LEGAL',
    category: 'Financial Governance',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Fair refund window (14 days), cancellation procedures, non-refundable custom engineering fees, and chargeback dispute policies.',
    sections: [
      {
        title: '1. 14-Day Cooling-Off Refund Window',
        content: 'New subscribers may request a full refund of their initial subscription fee within fourteen (14) calendar days of purchase, provided no releases have been submitted for global DSP delivery during that period.',
      },
      {
        title: '2. Subscription Cancellation',
        content: 'You may cancel your recurring subscription at any time via Settings -> Subscription. Upon cancellation, your catalog remains live until the end of the current paid billing cycle.',
      },
      {
        title: '3. Chargebacks & Payment Disputes',
        content: 'Initiating an unverified bank chargeback without contacting SONVÉRA support first will result in immediate catalog freezing pending payment dispute resolution.',
      },
    ],
  },
  {
    id: 'POL-14',
    slug: 'ai-usage-policy',
    title: 'AI Usage & Governance Policy',
    pillar: 'LEGAL',
    category: 'Technology & AI Ethics',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Discloses assistive AI features (QA scans, playlist pitches), states zero user data training, prompt defense, and deterministic guardrails.',
    sections: [
      {
        title: '1. Purpose of Assistive AI Tools',
        content: 'SONVÉRA Assist provides assistive AI tools designed solely to assist artists with metadata QA validation, formatting DSP title cases, drafting editorial playlist pitches, and generating social marketing copy.',
      },
      {
        title: '2. Zero User Audio Training Commitment',
        content: 'SONVÉRA does NOT use artist master recordings, uploaded stems, visual artwork, or private metadata to train public foundation models or generative audio models.',
      },
      {
        title: '3. Deterministic Governance Guardrails',
        content: 'Per Section 12 of the Architecture Blueprint, AI agents and automated services are strictly barred from: (a) Directly approving or modifying financial payouts; (b) Mutating the immutable ledger; (c) Issuing takedowns; (d) Changing legal copyright ownership.',
      },
    ],
  },
  {
    id: 'POL-15',
    slug: 'legal-notice-ip',
    title: 'Legal Notice & Intellectual Property',
    pillar: 'LEGAL',
    category: 'Commercial & Contractual',
    version: '1.1.0',
    effectiveDate: 'September 2026',
    summary: 'Corporate identity, registered trademarks, software copyright notices, and third-party service disclaimers.',
    sections: [
      {
        title: '1. Corporate Identification',
        content: 'SONVÉRA is operated by SONVÉRA Inc. Official communications and legal notices may be served to: legal@sonvera.audio or SONVÉRA Corporate Legal Operations, Global Technology Hub.',
      },
      {
        title: '2. Trademark Notice',
        content: 'SONVÉRA, "MAKE MUSIC. MOVE CULTURE.", and the SONVÉRA logo are registered trademarks. Apple Music, Spotify, YouTube Music, Amazon Music, Tidal, Deezer, and JioSaavn are registered trademarks of their respective owners.',
      },
      {
        title: '3. Disclaimer of Third-Party Editorial Decisions',
        content: 'SONVÉRA guarantees technical delivery to DSP stores via standard DDEX ERN 4.3. However, SONVÉRA does not and cannot guarantee placement on DSP editorial playlists, which remain at the sole editorial discretion of each platform.',
      },
    ],
  },

  // ===================== PILLAR 2: TRUST & SECURITY =====================
  {
    id: 'POL-16',
    slug: 'account-security-policy',
    title: 'Account Security & MFA Policy',
    pillar: 'TRUST_AND_SECURITY',
    category: 'Security Architecture',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Prescribes Argon2id password hashing, mandatory MFA for privileged roles, step-up authentication, and session revocation.',
    sections: [
      {
        title: '1. Credential Encryption with Argon2id',
        content: 'Passwords are encrypted using Argon2id (m=65536, t=3, p=4) with unique per-user 16-byte cryptographically secure random salts. Plaintext or reversibly encrypted passwords are never stored.',
      },
      {
        title: '2. Multi-Factor & Step-Up Authentication',
        content: 'MFA is mandatory for all SUPER_ADMIN, ADMIN, and FINANCE roles. Step-up authentication challenges are required before executing high-risk mutations, including bank account updates, manual status overrides, and catalog takedowns.',
      },
      {
        title: '3. Session Management & Active Device Revocation',
        content: 'Authenticated sessions use short-lived JWT access tokens (15-minute expiry) with rotating refresh tokens stored in Redis. Artists can inspect active sessions and instantly revoke untrusted devices from Account Settings.',
      },
    ],
  },
  {
    id: 'POL-17',
    slug: 'vulnerability-disclosure-policy',
    title: 'Vulnerability Disclosure Policy',
    pillar: 'TRUST_AND_SECURITY',
    category: 'Security Architecture',
    version: '1.2.0',
    effectiveDate: 'September 2026',
    summary: 'Guidelines for security researchers, safe harbor protections, response timelines, and dedicated security contact.',
    sections: [
      {
        title: '1. Responsible Disclosure Program',
        content: 'SONVÉRA welcomes reports from independent security researchers. If you identify a vulnerability in our API, authentication flow, or distribution pipeline, please submit your findings to security@sonvera.audio.',
      },
      {
        title: '2. Safe Harbor Protections',
        content: 'SONVÉRA will not initiate legal action against researchers who: (a) Act in good faith to avoid privacy violations and service destruction; (b) Do not exfiltrate or modify artist master audio or financial data; (c) Give us reasonable time (up to 90 days) to remediate the vulnerability before public disclosure.',
      },
      {
        title: '3. Triage & Response Commitments',
        content: 'We commit to: Initial acknowledgment within 24 business hours; Vulnerability assessment and severity classification within 3 business days; Regular remediation status updates.',
      },
    ],
  },
  {
    id: 'POL-18',
    slug: 'incident-response-framework',
    title: 'Incident & Data Breach Response Framework',
    pillar: 'TRUST_AND_SECURITY',
    category: 'Security Architecture',
    version: '1.4.0',
    effectiveDate: 'September 2026',
    summary: 'Defines 6-phase incident response cycle, severity classification (P1-P4), evidence preservation, and 72-hour notification SLA.',
    sections: [
      {
        title: '1. Incident Response Lifecycle',
        content: 'Our security operations team follows the 6-phase incident lifecycle: (1) Detection & Verification -> (2) Triage & Severity Classification -> (3) Containment -> (4) Investigation & Eradication -> (5) Recovery & Health Checks -> (6) Post-Incident Postmortem.',
      },
      {
        title: '2. Severity Classification Matrix',
        content: 'P1 - Critical: Active unauthorized data breach or ledger balance tampering (SLA: < 15 min). P2 - Major: API distribution pipeline outage or single DSP feed failure (SLA: < 1 hour). P3 - Minor: Metadata QC validation discrepancy (SLA: < 4 hours). P4 - Notice: Non-impacting UI bug (SLA: < 24 hours).',
      },
      {
        title: '3. 72-Hour Statutory Breach Notification SLA',
        content: 'In compliance with the Digital Personal Data Protection framework and international standards, in the event of a confirmed personal data breach, SONVÉRA will notify affected data principals and regulators within 72 hours of verification.',
      },
    ],
  },
  {
    id: 'POL-19',
    slug: 'data-retention-deletion-policy',
    title: 'Data Retention & Deletion Schedule',
    pillar: 'TRUST_AND_SECURITY',
    category: 'Privacy & Compliance',
    version: '1.3.0',
    effectiveDate: 'September 2026',
    summary: 'Lifecycles for unreleased audio, active catalogs, draft releases, and 7-year statutory financial ledger preservation.',
    sections: [
      {
        title: '1. Active Catalog Masters',
        content: 'High-resolution 24-bit WAV masters and cover artwork for active, live releases are retained across redundant private S3/R2 storage for the duration of the distribution agreement to support DSP updates and format upgrades.',
      },
      {
        title: '2. Quarantine & Incomplete Drafts',
        content: 'Temporary upload artifacts, quarantined files, and unsubmitted release drafts are automatically pruned after 30 days of inactivity.',
      },
      {
        title: '3. 7-Year Immutable Financial Ledger Retention',
        content: 'Upon account closure and complete catalog takedown, artist personal identifiers are pseudonymized. However, transaction-level ledger entries, ISRC/UPC registries, and payout receipts are preserved for seven (7) years to satisfy statutory anti-money laundering (AML) and tax laws.',
      },
    ],
  },
  {
    id: 'POL-20',
    slug: 'accessibility-statement',
    title: 'Accessibility Statement',
    pillar: 'TRUST_AND_SECURITY',
    category: 'Platform Inclusion',
    version: '1.1.0',
    effectiveDate: 'September 2026',
    summary: 'Commitment to WCAG 2.1 Level AA accessibility, keyboard navigation, visible focus indicators, and reduced-motion support.',
    sections: [
      {
        title: '1. Our Accessibility Commitment',
        content: 'SONVÉRA is committed to providing a digital music distribution platform accessible to creators of all abilities. We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.',
      },
      {
        title: '2. Implementation Highlights',
        content: 'The platform incorporates: (a) Full keyboard navigation across all release wizards and tables; (b) High-contrast dark obsidian color tokens meeting contrast ratios; (c) Visible focus rings for screen readers; (d) Support for `prefers-reduced-motion` media queries; (e) ARIA labels on audio preview players.',
      },
      {
        title: '3. Feedback & Contact',
        content: 'If you encounter any accessibility barriers while using SONVÉRA, please contact accessibility@sonvera.audio.',
      },
    ],
  },
];
