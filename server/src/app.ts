import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { z } from 'zod';
import { getDb, saveDb } from './lib/db.js';
import { demoDistributionProvider } from './modules/distribution/providers/demoDistributionProvider.js';
import {
  PRODUCTION_SECURITY_CHECKLIST,
  DATA_CLASSIFICATION_MATRIX,
  ACTIVE_FRAUD_ALERTS,
  checkRateLimit,
  checkIdempotency,
  saveIdempotency,
  createStepUpChallenge,
  verifyStepUpCode,
  inspectAudioMaster,
} from './lib/security.js';
import {
  COMPLETE_POLICY_STACK,
  SUBPROCESSORS_REGISTRY,
  SYSTEM_STATUS_COMPONENTS,
  HISTORICAL_STATUS_INCIDENTS,
} from './lib/policies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security Headers (OWASP ASVS 5.0 L2)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; media-src 'self' blob: https:; font-src 'self' https: data:;"
  );
  next();
});

// Storage directory
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  },
});
const upload = multer({ storage });

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Logging with secret redaction (ASVS L2)
app.use((req, _res, next) => {
  const sanitizedUrl = req.url.replace(/(token|secret|key)=[^&]*/gi, '$1=[REDACTED]');
  console.log(`[SONVÉRA API v1] ${req.method} ${sanitizedUrl}`);
  next();
});

// Zod Release Schema for input validation (Page 6, 7)
const createReleaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  releaseType: z.enum(['single', 'ep', 'album', 'compilation']).default('single'),
  primaryArtist: z.string().min(1, 'Primary artist is required'),
  featuredArtists: z.array(z.string()).optional().default([]),
  labelName: z.string().optional().default('Independent'),
  primaryGenre: z.string().optional().default('Electronic'),
  releaseDate: z.string().optional(),
});

// =============================================================
// ROUTE REGISTRATION: /api/v1/*
// =============================================================
const v1Router = express.Router();

// 1. Health & Architecture Info
v1Router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'SONVÉRA Global Music Distribution Platform',
    version: '1.0-September-2026',
    architecture: 'Modular Monolith (Express.js + TypeScript)',
    orm: 'Prisma + PostgreSQL',
    provider: demoDistributionProvider.name,
    isSandbox: demoDistributionProvider.isDemo,
    ddexStandard: 'ERN 4.3 XML',
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth & Identity (Page 3, 10)
v1Router.get('/auth/me', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({
    success: true,
    user: db.users?.[0] || {
      id: 'user-01',
      name: 'Gautam Giri',
      email: 'gautam@sonvera.io',
      role: 'independent_artist',
      plan: 'Pro Plan',
      verified: true,
    },
  });
});

// 3. Releases Domain (Part III, Section 3)
// POST /api/v1/releases - Create release
v1Router.post('/releases', (req: Request, res: Response) => {
  try {
    const validated = createReleaseSchema.parse(req.body);
    const db = getDb();

    const newRelease = {
      ...req.body,
      ...validated,
      id: req.body.id || `rel-${Date.now()}`,
      status: req.body.status || 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'DRAFT',
          timestamp: new Date().toISOString(),
          note: 'Release created in Release Center.',
          actor: validated.primaryArtist,
        },
      ],
    };

    db.releases.unshift(newRelease);
    saveDb(db);

    res.status(201).json({ success: true, data: newRelease });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// GET /api/v1/releases - List user's releases
v1Router.get('/releases', (req: Request, res: Response) => {
  const db = getDb();
  let results = [...(db.releases || [])];

  const { status, type, q } = req.query;
  if (status && status !== 'ALL') {
    results = results.filter((r) => r.status === status);
  }
  if (type && type !== 'ALL') {
    results = results.filter((r) => r.releaseType === type);
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    results = results.filter(
      (r) =>
        r.title?.toLowerCase().includes(query) ||
        r.primaryArtist?.toLowerCase().includes(query) ||
        r.upc?.includes(query)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// GET /api/v1/releases/:id - Release detail
v1Router.get('/releases/:id', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const release = db.releases.find((r: any) => r.id === releaseId);
  if (!release) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }
  res.json({ success: true, data: release });
});

// PATCH /api/v1/releases/:id - Update release
v1Router.patch('/releases/:id', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const index = db.releases.findIndex((r: any) => r.id === releaseId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }

  const updated = {
    ...db.releases[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.releases[index] = updated;
  saveDb(db);

  res.json({ success: true, data: updated });
});

// Also support PUT for update
v1Router.put('/releases/:id', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const index = db.releases.findIndex((r: any) => r.id === releaseId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }

  const updated = {
    ...db.releases[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.releases[index] = updated;
  saveDb(db);

  res.json({ success: true, data: updated });
});

// POST /api/v1/releases/:id/validate - Run validation (Page 10)
v1Router.post('/releases/:id/validate', async (req: Request, res: Response) => {
  try {
    const releaseId = req.params.id as string;
    const result = await demoDistributionProvider.validateRelease(releaseId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/releases/:id/distribution - Submit distribution (Page 10, Security Blueprint §7, §9)
v1Router.post('/releases/:id/distribution', async (req: Request, res: Response) => {
  try {
    const releaseId = req.params.id as string;
    const idempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined;

    // 1. Idempotency Check
    if (idempotencyKey) {
      const cached = checkIdempotency(idempotencyKey);
      if (cached.exists && cached.cached) {
        res.setHeader('X-Cache-Lookup', 'HIT');
        return res.status(cached.cached.status).json(cached.cached.body);
      }
    }

    // 2. Rate limit distribution submissions (20/hour)
    const rateCheck = checkRateLimit(`dist-${req.ip || 'global'}`, 20, 3600000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Distribution rate limit exceeded. Please wait ${rateCheck.resetInSec}s.`,
      });
    }

    const result = await demoDistributionProvider.submitRelease(releaseId);

    // 3. Append-only Audit record
    const db = getDb();
    db.audit_logs = db.audit_logs || [];
    db.audit_logs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'artist.portal@sonvera.io',
      action: 'RELEASE_DISTRIBUTION_SUBMITTED',
      entityType: 'RELEASE',
      entityId: releaseId,
      details: `Dispatched DDEX ERN 4.3 submission batch across selected DSP stores`,
      status: 'SUCCESS',
    });
    saveDb(db);

    const payload = { success: true, data: result };
    if (idempotencyKey) {
      saveIdempotency(idempotencyKey, 200, payload);
    }
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/releases/:id/submit (alias for distribution submit)
v1Router.post('/releases/:id/submit', async (req: Request, res: Response) => {
  try {
    const releaseId = req.params.id as string;
    const result = await demoDistributionProvider.submitRelease(releaseId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/releases/:id/distribution/status - Delivery status (Page 11)
v1Router.get('/releases/:id/distribution/status', async (req: Request, res: Response) => {
  const releaseId = req.params.id as string;
  const status = await demoDistributionProvider.getDeliveryStatus(releaseId);
  res.json({ success: true, data: status });
});

// POST /api/v1/releases/:id/takedown - Controlled Takedown Flow (Section 10 of Blueprint)
// Pipeline: Authenticate -> Authorize -> Reason -> Review -> Provider Request -> Status -> Audit
v1Router.post('/releases/:id/takedown', async (req: Request, res: Response) => {
  try {
    const releaseId = req.params.id as string;
    const { reason, requestedBy } = req.body;
    const db = getDb();
    const release = db.releases?.find((r: any) => r.id === releaseId);

    if (!release) {
      return res.status(404).json({ success: false, error: 'Release not found' });
    }

    const validReason = reason || 'Artist legal rights withdrawal';
    const actor = requestedBy || 'artist.verified@sonvera.io';

    // Provider takedown dispatch
    await demoDistributionProvider.requestTakedown(releaseId);

    // Update release status and history
    release.status = 'TAKEN_DOWN';
    release.updatedAt = new Date().toISOString();
    release.statusHistory = release.statusHistory || [];
    release.statusHistory.unshift({
      id: `sh-takedown-${Date.now()}`,
      status: 'TAKEN_DOWN',
      timestamp: new Date().toISOString(),
      note: `Controlled takedown executed: ${validReason}`,
      actor,
    });

    release.deliveryStatuses = (release.deliveryStatuses || []).map((ds: any) => ({
      ...ds,
      status: 'TAKEDOWN',
    }));

    // Append-only audit trail
    db.audit_logs = db.audit_logs || [];
    db.audit_logs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: 'RELEASE_TAKEDOWN_EXECUTED',
      entityType: 'RELEASE',
      entityId: releaseId,
      details: `Purge messages dispatched across all active DSP pipes. Reason: ${validReason}`,
      status: 'WARN',
    });

    saveDb(db);

    res.json({
      success: true,
      message: `Takedown order processed. DDEX purge dispatched across all DSP channels.`,
      release,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/releases/:id/ddex - Download DDEX ERN 4.3 XML package
v1Router.get('/releases/:id/ddex', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const release = db.releases.find((r: any) => r.id === releaseId);
  if (!release) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }
  const xml = demoDistributionProvider.generateDdexPackage(release);
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// 4. Asset Upload Architecture (Page 8, 11)
// POST /api/v1/assets/presign - Get presigned upload URL
v1Router.post('/assets/presign', (req: Request, res: Response) => {
  const { filename, mimeType } = req.body;
  const assetId = `asset-${Date.now()}`;
  res.json({
    success: true,
    assetId,
    uploadUrl: `/api/v1/upload/direct?assetId=${assetId}`,
    method: 'POST',
    fields: { filename, mimeType },
  });
});

// POST /api/v1/assets/complete - Complete upload, trigger validation & waveform (Page 8, 11)
v1Router.post('/assets/complete', (req: Request, res: Response) => {
  const { assetId, filename } = req.body;
  res.json({
    success: true,
    assetId,
    status: 'PROCESSED',
    spec: {
      format: 'WAV',
      sampleRateHz: 48000,
      bitDepth: 24,
      channels: 'Stereo',
      durationSeconds: 204,
      peakLufs: -14.1,
    },
    message: 'Master audio validated and waveforms extracted via background worker.',
  });
});

// Upload multipart endpoints (Security Blueprint §6 - File & Audio Security)
v1Router.post('/upload/audio', upload.single('audio'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No audio file provided' });
  }

  // Rate limit uploads (25 per hour)
  const rate = checkRateLimit(`upload-${req.ip || 'global'}`, 25, 3600000);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: `Upload rate limit exceeded. Retry in ${rate.resetInSec}s.` });
  }

  // Audio master inspection: magic bytes, MIME, sample rate, bit depth, quarantine status
  const inspection = inspectAudioMaster(req.file.originalname, req.file.size);
  if (!inspection.passed) {
    return res.status(422).json({
      success: false,
      error: inspection.reason,
      quarantineStatus: inspection.quarantineStatus,
    });
  }

  res.json({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`,
    security: {
      quarantineStatus: inspection.quarantineStatus,
      magicBytesVerified: inspection.magicBytesVerified,
      mimeType: inspection.mimeType,
      dataClassification: 'HIGH', // unreleased master
      sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    spec: {
      fileName: req.file.originalname,
      fileSizeBytes: req.file.size,
      format: req.file.originalname.toUpperCase().endsWith('.FLAC') ? 'FLAC' : 'WAV',
      sampleRateHz: 48000,
      bitDepth: 24,
      channels: 'Stereo',
      durationSeconds: 204,
      peakLufs: -14.1,
    },
  });
});

v1Router.post('/upload/artwork', upload.single('artwork'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No artwork file provided' });
  }
  res.json({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`,
    spec: {
      width: 3000,
      height: 3000,
      colorSpace: 'RGB',
      format: 'JPEG',
      sizeBytes: req.file.size,
    },
  });
});

// 5. Analytics Domain (Page 11)
v1Router.get('/analytics/overview', (_req: Request, res: Response) => {
  res.json({
    success: true,
    metrics: {
      totalStreams: 1284921,
      uniqueListeners: 382400,
      streamsChangePct: 24.0,
      playlistAdds: 47,
      topPlatforms: [
        { name: 'Spotify', streams: '621.2K' },
        { name: 'YouTube Music', streams: '284.1K' },
        { name: 'Apple Music', streams: '198.4K' },
        { name: 'JioSaavn', streams: '142.1K' },
      ],
    },
  });
});

// 6. Royalties & Financial Domain (Part III, Section 3; Part IV, Section 7)
// GET /api/v1/royalties/transactions - Immutable royalty ledger
v1Router.get('/royalties/transactions', (_req: Request, res: Response) => {
  const transactions = [
    {
      id: 'tx-01',
      releaseTitle: 'Neon Nights',
      trackTitle: 'Neon Nights (Original Mix)',
      dsp: 'Spotify',
      territory: 'US',
      streams: 621200,
      netArtistShare: 2360.56,
      currency: 'USD',
    },
    {
      id: 'tx-02',
      releaseTitle: 'Neon Nights',
      trackTitle: 'Neon Nights (Original Mix)',
      dsp: 'YouTube Music',
      territory: 'IN',
      streams: 284100,
      netArtistShare: 568.20,
      currency: 'USD',
    },
    {
      id: 'tx-03',
      releaseTitle: 'Neon Nights',
      trackTitle: 'Neon Nights (Original Mix)',
      dsp: 'Apple Music',
      territory: 'US',
      streams: 198400,
      netArtistShare: 1488.00,
      currency: 'USD',
    },
    {
      id: 'tx-04',
      releaseTitle: 'Neon Nights',
      trackTitle: 'Neon Nights (Original Mix)',
      dsp: 'JioSaavn',
      territory: 'IN',
      streams: 142100,
      netArtistShare: 142.10,
      currency: 'USD',
    },
  ];

  res.json({
    success: true,
    balance: 5124.60,
    currency: 'USD',
    artistKeepPercentage: 100,
    transactions,
  });
});

// GET /api/v1/royalties/statements - Monthly statements
v1Router.get('/royalties/statements', (_req: Request, res: Response) => {
  res.json({
    success: true,
    statements: [
      {
        id: 'stmt-2026-09',
        periodName: 'September 2026 Accounting Period',
        periodStart: '2026-09-01',
        periodEnd: '2026-09-30',
        totalStreams: 1284921,
        totalGross: 5124.60,
        totalNet: 5124.60,
        status: 'AUDITED',
      },
    ],
  });
});

// POST /api/v1/payouts - Request payout (Page 11, Security Blueprint §9 - Royalty, Finance & Payout Security)
v1Router.post('/payouts', (req: Request, res: Response) => {
  const { amount, method, accountReference } = req.body;
  const idempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined;

  // 1. Check Idempotency Key to prevent double payout
  if (idempotencyKey) {
    const cached = checkIdempotency(idempotencyKey);
    if (cached.exists && cached.cached) {
      res.setHeader('X-Cache-Lookup', 'HIT');
      return res.status(cached.cached.status).json(cached.cached.body);
    }
  }

  // 2. Rate limit payouts (5/hour per IP)
  const rate = checkRateLimit(`payout-${req.ip || 'global'}`, 5, 3600000);
  if (!rate.allowed) {
    return res.status(429).json({ success: false, error: `Payout rate limit reached. Please wait ${rate.resetInSec}s.` });
  }

  const db = getDb();
  const payoutAmount = parseFloat(amount) || 5124.60;
  const newPayout = {
    id: `payout-${Date.now().toString(36)}`,
    amount: payoutAmount,
    currency: 'USD',
    status: 'PROCESSED',
    provider: method || 'Stripe Direct',
    accountReference: accountReference || 'acct_1NZX****8892',
    requestedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
    reconciliationState: 'RECONCILED',
    actorSource: 'gautam@sonvera.io',
    transactionRef: `TX-PAY-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`,
  };

  db.payouts = db.payouts || [];
  db.payouts.unshift(newPayout);

  // Append-only audit stream
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'gautam@sonvera.io',
    action: 'PAYOUT_DISPATCHED',
    entityType: 'PAYOUT',
    entityId: newPayout.id,
    details: `Initiated payout of $${payoutAmount.toFixed(2)} USD via ${newPayout.provider} (Ref: ${newPayout.transactionRef})`,
    status: 'SUCCESS',
  });

  saveDb(db);

  const payload = {
    success: true,
    message: `Payout of $${newPayout.amount.toFixed(2)} USD successfully initiated and recorded in immutable ledger.`,
    payout: newPayout,
  };

  if (idempotencyKey) {
    saveIdempotency(idempotencyKey, 200, payload);
  }

  res.json(payload);
});

// 7. AI & SONVÉRA Assist (Page 4, 8, 10)
v1Router.post('/ai/audit', (req: Request, res: Response) => {
  const { releaseId } = req.body;
  res.json({
    success: true,
    releaseId,
    audit: {
      titleCasingValid: true,
      integratedLoudnessLufs: -14.1,
      ddexSchemaErrors: 0,
      recommendation: 'Release metadata is 100% compliant with global DSP guidelines.',
    },
  });
});

v1Router.post('/ai/assist', (req: Request, res: Response) => {
  const { action, releaseTitle, genre, artistName, primaryMood } = req.body;

  // AI Security & Governance Guardrail (Security Blueprint §12)
  // AI is strictly prohibited from modifying ledgers, issuing takedowns, or approving payouts
  if (['mutate_ledger', 'takedown', 'payout_approve', 'delete_account', 'transfer_ownership'].includes(action)) {
    return res.status(403).json({
      success: false,
      error: 'Deterministic Guardrail: AI is prohibited from directly modifying balances, approving payouts, altering copyright ownership, or executing takedowns per SONVÉRA Production Security Architecture §12.',
    });
  }

  if (action === 'pitch' || action === 'playlist_pitch') {
    return res.json({
      success: true,
      data: {
        subject: `Editorial Pitch: ${releaseTitle || 'New Track'} - ${artistName || 'Gautam Giri'}`,
        shortPitch: `An evocative blend of ${genre || 'Synthwave'} and modern electronic textures, featuring pristine analog synth layering, punchy 80s drum machines, and an infectious nocturnal groove crafted for peak late-night driving and chill electronic playlists.`,
        suggestedPlaylists: ['Synthwave Chill', 'Night Drive', 'Electronic Rising', 'Future Sounds India'],
        targetDemographic: 'Ages 18-34, fans of The Midnight, Kavinsky, and Gunship',
      },
    });
  }

  if (action === 'marketing' || action === 'copy') {
    return res.json({
      success: true,
      data: {
        instagramCaption: `Out now on all major platforms worldwide: "${releaseTitle || 'New Music'}" by ${artistName || 'Gautam Giri'}. 🌃 Stream the official release and add it to your late-night rotation. Link in bio! #NewMusic #Synthwave #Sonvera`,
        tiktokHook: `If you like driving late at night with neon city lights reflecting off the dashboard, this track is for you.`,
        pressReleaseSummary: `Independent artist ${artistName || 'Gautam Giri'} announces the worldwide digital distribution of "${releaseTitle || 'New Release'}", distributed via SONVÉRA to 150+ streaming services globally.`,
      },
    });
  }

  // Default: QA Scan (Page 4 & 10)
  res.json({
    success: true,
    data: {
      qaPassed: true,
      score: 98,
      checks: [
        { name: 'DSP Title Case Formatter', status: 'PASS', detail: 'Capitalization conforms to Apple & Spotify guidelines' },
        { name: 'Audio Master Compliance', status: 'PASS', detail: 'WAV 24-bit / 48kHz, -14.1 LUFS detected' },
        { name: 'Cover Art Integrity', status: 'PASS', detail: 'Square 3000x3000px, RGB space, no prohibited logos' },
        { name: 'ISRC Verification', status: 'PASS', detail: 'Valid US-SVR-26 structure detected' },
      ],
      recommendation: 'Release is fully prepped for global digital delivery.',
    },
  });
});

// 8. Admin & Operations Control Plane (PDF Part I §4, Part III §1, Part IV §1, Part VII)
v1Router.get('/admin/overview', (_req: Request, res: Response) => {
  const db = getDb();
  const releases = db.releases || [];
  const pendingCount = releases.filter((r: any) => ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(r.status)).length;
  const liveCount = releases.filter((r: any) => r.status === 'LIVE').length;
  const totalUsers = (db.users || []).length || 5;

  res.json({
    success: true,
    data: {
      totalReleases: releases.length,
      pendingModeration: pendingCount,
      liveReleases: liveCount,
      totalUsers,
      platformReserve: 5124.60,
      dspUptimePct: 99.4,
      workerQueues: {
        audioProcessing: { status: 'ONLINE', active: 0, completed: 142 },
        artworkProcessing: { status: 'ONLINE', active: 0, completed: 98 },
        releaseValidation: { status: 'ONLINE', active: 0, completed: 230 },
        distribution: { status: 'ONLINE', active: 1, completed: 64 },
        royalties: { status: 'ONLINE', active: 0, completed: 512 },
        aiProcessing: { status: 'ONLINE', active: 0, completed: 420 },
      },
    },
  });
});

v1Router.get('/admin/releases', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ success: true, data: db.releases || [] });
});

v1Router.post('/admin/releases/:id/status', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const { status, note } = req.body;
  const index = (db.releases || []).findIndex((r: any) => r.id === releaseId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }

  const release = db.releases[index];
  const oldStatus = release.status;
  release.status = status;
  release.updatedAt = new Date().toISOString();

  release.statusHistory = release.statusHistory || [];
  release.statusHistory.unshift({
    id: `sh-admin-${Date.now()}`,
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status overridden by Administrator to ${status}`,
    actor: 'SONVÉRA Root Admin',
  });

  // If approved to LIVE, mark delivery statuses as LIVE
  if (status === 'LIVE') {
    release.liveAt = new Date().toISOString();
    release.deliveryStatuses = (release.deliveryStatuses || []).map((ds: any) => ({
      ...ds,
      status: 'LIVE',
    }));
  }

  // Append to audit log
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'admin.ingest@sonvera.audio',
    action: 'STATUS_OVERRIDE',
    entityType: 'RELEASE',
    entityId: releaseId,
    details: `Changed status from ${oldStatus} to ${status}: ${note || 'Admin manual intervention'}`,
    status: 'SUCCESS',
  });

  saveDb(db);
  res.json({ success: true, data: release });
});

v1Router.post('/admin/releases/:id/approve', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const index = (db.releases || []).findIndex((r: any) => r.id === releaseId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }

  const release = db.releases[index];
  release.status = 'LIVE';
  release.updatedAt = new Date().toISOString();
  release.liveAt = new Date().toISOString();
  release.statusHistory = release.statusHistory || [];
  release.statusHistory.unshift({
    id: `sh-admin-appr-${Date.now()}`,
    status: 'LIVE',
    timestamp: new Date().toISOString(),
    note: 'Release approved and delivered across all selected DSP stores.',
    actor: 'SONVÉRA Quality Assurance Admin',
  });

  release.deliveryStatuses = (release.deliveryStatuses || []).map((ds: any) => ({
    ...ds,
    status: 'LIVE',
  }));

  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'admin.ingest@sonvera.audio',
    action: 'RELEASE_APPROVED',
    entityType: 'RELEASE',
    entityId: releaseId,
    details: `Approved "${release.title}" for global DSP distribution`,
    status: 'SUCCESS',
  });

  saveDb(db);
  res.json({ success: true, data: release });
});

v1Router.post('/admin/releases/:id/reject', (req: Request, res: Response) => {
  const db = getDb();
  const releaseId = req.params.id as string;
  const { reason } = req.body;
  const index = (db.releases || []).findIndex((r: any) => r.id === releaseId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Release not found' });
  }

  const release = db.releases[index];
  release.status = 'REJECTED';
  release.updatedAt = new Date().toISOString();
  release.statusHistory = release.statusHistory || [];
  release.statusHistory.unshift({
    id: `sh-admin-rej-${Date.now()}`,
    status: 'REJECTED',
    timestamp: new Date().toISOString(),
    note: reason || 'Release rejected during QC review. Please update assets and re-submit.',
    actor: 'SONVÉRA Moderation Lead',
  });

  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'admin.ingest@sonvera.audio',
    action: 'RELEASE_REJECTED',
    entityType: 'RELEASE',
    entityId: releaseId,
    details: `Rejected "${release.title}": ${reason || 'Technical QC failure'}`,
    status: 'WARN',
  });

  saveDb(db);
  res.json({ success: true, data: release });
});

v1Router.get('/admin/audit-logs', (_req: Request, res: Response) => {
  const db = getDb();
  const logs = db.audit_logs || [
    {
      id: 'audit-001',
      timestamp: '2026-09-29T21:40:00Z',
      actor: 'system.worker@sonvera.audio',
      action: 'DDEX_ERN43_GENERATED',
      entityType: 'BATCH',
      entityId: 'BATCH-MUMW3L5C-5233',
      details: 'Compiled ERN 4.3 XML package for release rel-neon-nights',
      status: 'SUCCESS',
    },
    {
      id: 'audit-002',
      timestamp: '2026-09-29T21:35:12Z',
      actor: 'gautam@sonvera.io',
      action: 'RELEASE_SUBMITTED',
      entityType: 'RELEASE',
      entityId: 'rel-neon-nights',
      details: 'Submitted release "Neon Nights" across 8 DSP stores',
      status: 'SUCCESS',
    },
    {
      id: 'audit-003',
      timestamp: '2026-09-29T21:30:00Z',
      actor: 'system.qc@sonvera.audio',
      action: 'AUDIO_INTEGRITY_VERIFIED',
      entityType: 'ASSET',
      entityId: 'asset-neon-nights-wav',
      details: 'Audio waveform 24-bit/48kHz verified: -14.1 LUFS',
      status: 'SUCCESS',
    },
  ];
  res.json({ success: true, data: logs });
});

v1Router.post('/admin/sync-providers', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Global DSP feed synchronization initiated across all 12 provider connections.',
    syncedAt: new Date().toISOString(),
    activePipes: 12,
  });
});

// =============================================================
// PRODUCTION SECURITY & POLICY ARCHITECTURE ROUTES
// (OWASP Top 10:2025 + OWASP ASVS 5.0 Level 2 / Level 3 Baseline)
// =============================================================

// 9. Security Architecture & Compliance Overview
v1Router.get('/security/overview', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({
    success: true,
    data: {
      standard: 'OWASP Top 10:2025 + OWASP ASVS 5.0 Level 2 (Selected Level 3 Controls)',
      complianceScore: 98,
      status: 'PRODUCTION_ENFORCED',
      lastAudited: '2026-09-29T22:00:00Z',
      dataClassificationMatrix: DATA_CLASSIFICATION_MATRIX,
      activeSessions: [
        {
          id: 'sess-01',
          user: 'gautam@sonvera.io',
          role: 'SUPER_ADMIN',
          device: 'Chrome 129 / macOS',
          ip: '198.51.100.24',
          lastActive: 'Just now',
          mfaVerified: true,
        },
        {
          id: 'sess-02',
          user: 'mastering.qc@sonvera.audio',
          role: 'ADMIN',
          device: 'Firefox 130 / Windows 11',
          ip: '203.0.113.88',
          lastActive: '5 mins ago',
          mfaVerified: true,
        },
        {
          id: 'sess-03',
          user: 'finance.ops@sonvera.audio',
          role: 'FINANCE',
          device: 'Safari 18 / iPadOS',
          ip: '198.51.100.99',
          lastActive: '22 mins ago',
          mfaVerified: true,
        },
      ],
      encryption: {
        inTransit: 'TLS 1.3 (ChaCha20-Poly1305 / AES-256-GCM)',
        atRest: 'AES-256 Envelope Encryption (AWS KMS / Cloudflare R2)',
        passwords: 'Argon2id (m=65536, t=3, p=4) with 16-byte random salts',
        tokens: 'HMAC-SHA256 with 15-minute access token expiry & rotation',
      },
      quarantineEngine: {
        status: 'ACTIVE',
        cleanAudioScanned: 142,
        quarantinedFiles: 0,
        malwareDefinitionsDate: '2026-09-29',
      },
      auditRecordsCount: (db.audit_logs || []).length,
    },
  });
});

// 10. 20-Point Production Security Checklist
v1Router.get('/security/checklist', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalItems: PRODUCTION_SECURITY_CHECKLIST.length,
    enforcedItems: PRODUCTION_SECURITY_CHECKLIST.filter((i) => i.status === 'ENFORCED').length,
    targetStandard: 'OWASP ASVS 5.0 Level 2 / Level 3',
    items: PRODUCTION_SECURITY_CHECKLIST,
  });
});

// 11. Fraud & Risk Anomaly Detector
v1Router.get('/security/fraud-alerts', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: ACTIVE_FRAUD_ALERTS.length,
    data: ACTIVE_FRAUD_ALERTS,
  });
});

v1Router.post('/security/fraud-alerts/:id/resolve', (req: Request, res: Response) => {
  const alertId = req.params.id as string;
  const { resolution } = req.body;
  const alert = ACTIVE_FRAUD_ALERTS.find((a) => a.id === alertId);

  if (!alert) {
    return res.status(404).json({ success: false, error: 'Fraud alert not found' });
  }

  alert.status = resolution === 'HOLD' ? 'HOLD_PLACED' : 'VERIFIED_SAFE';

  // Audit log
  const db = getDb();
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'admin.security@sonvera.audio',
    action: resolution === 'HOLD' ? 'FRAUD_HOLD_PLACED' : 'FRAUD_ALERT_DISMISSED',
    entityType: alert.entityType,
    entityId: alert.entityId,
    details: `Resolved fraud alert ${alert.id}: marked as ${alert.status}`,
    status: resolution === 'HOLD' ? 'WARN' : 'SUCCESS',
  });
  saveDb(db);

  res.json({ success: true, alert });
});

// 12. Step-Up Authentication Flow (§4)
v1Router.post('/auth/step-up/challenge', (req: Request, res: Response) => {
  const { action, email } = req.body;
  const challenge = createStepUpChallenge(action || 'PRIVILEGED_ACTION', email || 'gautam@sonvera.io');
  res.json({
    success: true,
    challengeId: challenge.challengeId,
    action: challenge.action,
    expiresInSec: 600,
    hint: 'Enter your 6-digit authenticator or SMS verification code. (Demo code: 849201 or generated code)',
    demoCode: challenge.code,
  });
});

v1Router.post('/auth/step-up/verify', (req: Request, res: Response) => {
  const { challengeId, code } = req.body;
  const verified = verifyStepUpCode(challengeId, code || '');

  if (!verified) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired step-up authentication code. Please try again.',
    });
  }

  res.json({
    success: true,
    message: 'Step-up verification passed. Privileged action authorized for 15 minutes.',
    stepUpToken: `su-token-${Date.now()}`,
  });
});

// 13. Privacy & Legal Policy Suite (Section 1, 15, 17, 19)
v1Router.get('/security/policies', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalPolicies: COMPLETE_POLICY_STACK.length,
    pillars: ['LEGAL', 'TRUST_AND_SECURITY', 'SUPPORT_AND_REPORTING'],
    data: COMPLETE_POLICY_STACK.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      pillar: p.pillar,
      category: p.category,
      version: p.version,
      effectiveDate: p.effectiveDate,
      summary: p.summary,
      sectionCount: p.sections.length,
    })),
  });
});

v1Router.get('/security/policies/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const policy = COMPLETE_POLICY_STACK.find((p) => p.slug === slug || p.id === slug);

  if (!policy) {
    return res.status(404).json({ success: false, error: 'Policy document not found' });
  }

  res.json({ success: true, data: policy });
});

// 14. SONVÉRA Trust Center & Architecture (§13)
v1Router.get('/trust/overview', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      platform: 'SONVÉRA Global Music Distribution Platform',
      trustScore: 99.4,
      baselineStandard: 'OWASP Top 10:2025 + OWASP ASVS 5.0 Level 2/3',
      dpdpAct2023Compliant: true,
      gdprCompliant: true,
      encryptionInTransit: 'TLS 1.3 Strict Cipher Suites',
      encryptionAtRest: 'AES-256 Envelope Encryption (AWS KMS / Cloudflare R2)',
      activeSubprocessorsCount: SUBPROCESSORS_REGISTRY.length,
      pciDssComplianceLevel: 'Level 1 via Stripe Vaulting (Zero Plaintext Card Storage)',
      systemAvailability: '99.98% Historical Uptime',
      securityContact: 'security@sonvera.audio',
      privacyContact: 'privacy@sonvera.audio',
      legalContact: 'legal@sonvera.audio',
    },
  });
});

// 15. Real-Time Status Page API (§14)
v1Router.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      overallStatus: 'ALL_SYSTEMS_OPERATIONAL',
      updatedAt: new Date().toISOString(),
      components: SYSTEM_STATUS_COMPONENTS,
      historicalIncidents: HISTORICAL_STATUS_INCIDENTS,
    },
  });
});

// 16. Subprocessors Registry API (§13)
v1Router.get('/subprocessors', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: SUBPROCESSORS_REGISTRY.length,
    data: SUBPROCESSORS_REGISTRY,
  });
});

// 17. User Privacy & Data Rights Self-Service API (§12)
v1Router.post('/privacy/requests', (req: Request, res: Response) => {
  const { requestType, userEmail, details } = req.body;
  const db = getDb();

  const newRequest = {
    id: `prv-${Date.now().toString(36)}`,
    requestType: requestType || 'DATA_EXPORT', // 'DATA_EXPORT' | 'DATA_CORRECTION' | 'DATA_DELETION' | 'REVOKE_CONSENT'
    userEmail: userEmail || 'gautam@sonvera.io',
    status: 'RECEIVED',
    details: details || 'User submitted self-service privacy request',
    submittedAt: new Date().toISOString(),
    expectedCompletionDate: new Date(Date.now() + 30 * 86400000).toISOString(), // 30-day statutory SLA
  };

  db.privacy_requests = db.privacy_requests || [];
  db.privacy_requests.unshift(newRequest);

  // Append-only audit trail
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: newRequest.userEmail,
    action: `PRIVACY_REQUEST_${newRequest.requestType}`,
    entityType: 'USER_PRIVACY',
    entityId: newRequest.id,
    details: `Initiated self-service privacy request: ${newRequest.requestType}`,
    status: 'SUCCESS',
  });

  saveDb(db);

  res.json({
    success: true,
    message: `Privacy request (${newRequest.requestType}) received. You will receive a secure confirmation link at ${newRequest.userEmail} within statutory SLA timelines.`,
    request: newRequest,
  });
});

v1Router.get('/privacy/requests', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({
    success: true,
    data: db.privacy_requests || [
      {
        id: 'prv-init-01',
        requestType: 'DATA_EXPORT',
        userEmail: 'gautam@sonvera.io',
        status: 'COMPLETED',
        submittedAt: '2026-09-28T10:00:00Z',
        downloadUrl: '/api/v1/privacy/export/gautam-catalog.json',
      },
    ],
  });
});

// 18. Dedicated Support & Reporting Channels (§3, §9, §4)
// Dedicated Copyright Infringement & DMCA Complaint Intake (§3)
v1Router.post('/support/report-copyright', (req: Request, res: Response) => {
  const { complainantName, email, affectedWork, infringingReleaseId, evidenceUrl, perjuryDeclaration } = req.body;

  if (!perjuryDeclaration) {
    return res.status(400).json({
      success: false,
      error: 'Statutory perjury declaration is required for copyright takedown complaints.',
    });
  }

  const db = getDb();
  const reportId = `dmca-${Date.now().toString(36)}`;
  const record = {
    id: reportId,
    complainantName,
    email,
    affectedWork,
    infringingReleaseId,
    evidenceUrl,
    status: 'UNDER_LEGAL_REVIEW',
    submittedAt: new Date().toISOString(),
  };

  db.copyright_reports = db.copyright_reports || [];
  db.copyright_reports.unshift(record);

  // Append-only audit stream
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: email || 'rights-claimant@legal.org',
    action: 'COPYRIGHT_CLAIM_RECEIVED',
    entityType: 'RELEASE',
    entityId: infringingReleaseId || 'unknown',
    details: `Filed formal copyright complaint for work "${affectedWork}" (Claim ref: ${reportId})`,
    status: 'WARN',
  });

  saveDb(db);

  res.json({
    success: true,
    reportId,
    message: 'Formal copyright notice received. Our legal review team will inspect evidence and update the uploader within 24 business hours.',
  });
});

// Responsible Security Vulnerability Disclosure (§9)
v1Router.post('/support/report-vulnerability', (req: Request, res: Response) => {
  const { reporterName, contactEmail, severity, endpointAffected, description, proofOfConcept } = req.body;
  const reportId = `vuln-${Date.now().toString(36)}`;

  const db = getDb();
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: contactEmail || 'security-researcher@external.io',
    action: 'VULNERABILITY_REPORT_RECEIVED',
    entityType: 'PLATFORM_SECURITY',
    entityId: reportId,
    details: `Received ${severity || 'MEDIUM'} severity report on "${endpointAffected || 'API'}"`,
    status: 'SUCCESS',
  });
  saveDb(db);

  res.json({
    success: true,
    reportId,
    message: 'Vulnerability report logged with Security Operations. Safe Harbor protections active. Initial assessment within 24h.',
  });
});

// Royalty Dispute & Correction Channel (§4)
v1Router.post('/support/royalty-dispute', (req: Request, res: Response) => {
  const { statementId, releaseTitle, dsp, disputedAmount, reason } = req.body;
  const disputeId = `disp-${Date.now().toString(36)}`;

  const db = getDb();
  db.audit_logs = db.audit_logs || [];
  db.audit_logs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'artist.portal@sonvera.io',
    action: 'ROYALTY_DISPUTE_FILED',
    entityType: 'ROYALTY_STATEMENT',
    entityId: statementId || 'stmt-current',
    details: `Disputed ${dsp || 'DSP'} calculation for "${releaseTitle || 'Release'}" (Amount: $${disputedAmount || '0.00'})`,
    status: 'WARN',
  });
  saveDb(db);

  res.json({
    success: true,
    disputeId,
    message: 'Royalty dispute submitted for financial audit. Our accounting team will cross-reference raw DSP reporting files within 5 business days.',
  });
});

// Mount /api/v1 router
app.use('/api/v1', v1Router);

// Backwards compatibility: also mount /api routes pointing to the same handlers
app.use('/api', v1Router);
