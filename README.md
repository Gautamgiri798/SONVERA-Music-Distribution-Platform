# SONVÉRA — Premium Music Distribution Platform

> **"UPLOAD ONCE. DISTRIBUTE EVERYWHERE."**  
> *Everything behind your release, in one intelligent workspace.*

---

## 🎵 Critical Product Philosophy & Identity

**SONVÉRA** is engineered first and foremost as an enterprise-grade **music distribution platform** for Independent Artists, Professional Artists, Record Labels, Label Team Members, and Operations Administrators.

The primary user journey and core operational loop is **MUSIC DISTRIBUTION**:

```
CREATE RELEASE
  → UPLOAD AUDIO
  → UPLOAD ARTWORK
  → ENTER METADATA
  → ADD CONTRIBUTORS
  → VALIDATE CONTENT
  → SELECT DISTRIBUTION DESTINATIONS
  → REVIEW RELEASE
  → SUBMIT FOR DISTRIBUTION
  → DISTRIBUTION PROCESSING (DDEX ERN 4.3)
  → PLATFORM DELIVERY (Spotify, Apple Music, YouTube Music, etc.)
  → RELEASE GOES LIVE
  → COLLECT STREAMING DATA
  → CALCULATE ROYALTIES
  → GENERATE STATEMENTS
  → PAY ARTIST
```

---

## ⚡ Key Architectural Capabilities

### 1. Provider Abstraction (`DistributionProvider`)
Distribution operations are decoupled from UI components via an extensible provider interface (`src/services/distributionProvider.ts`):
* `validateRelease(release: Release): Promise<ValidationResult>`
* `submitRelease(release: Release, dspIds: DspIdentifier[]): Promise<DeliveryBatch>`
* `getStatus(releaseId: string): Promise<DistributionStatus>`
* `updateMetadata(releaseId: string, updates: Partial<Release>): Promise<boolean>`
* `takeDownRelease(releaseId: string, reason: string): Promise<boolean>`
* `getDeliveryStatus(releaseId: string): Promise<DspDeliveryStatus[]>`
* `generateDdexPackage(release: Release): string`

#### Sandbox Demo Engine
The default provider is **`SonveraDemoProvider`**, clearly labeled throughout the interface as a Sandbox Environment. It implements realistic DDEX ERN 4.3 XML feed serialization, SHA-256 asset checksum validation, and delivery state progression without fabricating live credentials.

---

### 2. Status Lifecycle Model
Every release tracks an auditable status lifecycle with actor stamps and batch logs:
* `DRAFT`
* `VALIDATING`
* `VALIDATION_FAILED` (Blocking issues flagged with 1-click jump to step)
* `READY` (100% compliant)
* `SUBMITTED`
* `UNDER_REVIEW`
* `PROCESSING`
* `DELIVERED`
* `LIVE`
* `REJECTED`
* `TAKEDOWN_REQUESTED`
* `TAKEN_DOWN`

---

### 3. Release Center & Guided Builder (7-Step Engine)
1. **Metadata & Release Info**: Title, format (Single, EP, Album), primary/featured artists, record label, catalog number, UPC/EAN generator, genres, language, explicit rating, and street date with editorial pitching lead time calculator.
2. **Cover Artwork Quality Gate**: 3000 x 3000px resolution check, 1:1 aspect ratio, sRGB color space verification, and text restriction scan.
3. **Tracks & Master Audio**: Lossless WAV/FLAC audio check (sample rate ≥ 44.1kHz, 16/24-bit depth, true peak loudness check), auto-generated ISRC codes (`US-SVR-26-XXXXX`), and interactive Web Audio waveform player.
4. **Contributors & Publishing Splits**: Credits for Primary Vocalists, Songwriters, Lyricists, and Producers with **strict 100.0% mechanical split balancing validation**.
5. **Rights & Territorial Scope**: ℗ Sound Recording & © Packaging legal copyright holders, and worldwide vs custom territory scoping.
6. **Distribution Destinations**: DSP store selector across Spotify, Apple Music, YouTube Music, Amazon Music HD, TIDAL Masters, Deezer HiFi, JioSaavn, TikTok / ByteDance, Meta Reels, Qobuz, Pandora, and Tencent Music.
7. **Validation Review & Submission**: Real-time 0–100 Health Score, category breakdown, actionable error jump shortcuts, live DDEX XML preview, and confetti celebration on delivery dispatch.

---

### 4. Financial Royalties Pipeline
Connected directly to release distribution telemetry:
`Distribution Data` → `Store Playback Feeds` → `Rate Calculation Engine` → `Royalty Ledger` → `Monthly Audited Statements` → `Artist Payouts` (Stripe, SWIFT Wire, Wise, PayPal).
*Explicitly marked as sandbox financial simulation.*

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Local dev server runs at: `http://127.0.0.1:5173/`
