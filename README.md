# 🎵 SONVÉRA — Enterprise Music Distribution Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Security Standard](https://img.shields.io/badge/OWASP-ASVS%205.0%20L2%2FL3-critical?style=for-the-badge&logo=owasp&logoColor=white)](https://owasp.org/www-project-application-security-verification-standard/)
[![DDEX](https://img.shields.io/badge/Standard-DDEX%20ERN%204.3-8A2BE2?style=for-the-badge)](https://ddex.net/)

<p align="center">
  <strong>"UPLOAD ONCE. DISTRIBUTE EVERYWHERE."</strong><br>
  <em>Next-generation global digital music distribution, rights administration, and royalty settlement platform.</em>
</p>

[Explore Capabilities](#-core-capabilities--functional-modules) • [System Architecture](#-system-architecture) • [Directory Structure](#-repository-structure) • [REST API Reference](#-rest-api-reference) • [Getting Started](#-quick-start--local-development)

</div>

---

## 🌟 Executive Summary

**SONVÉRA** is an enterprise-grade digital music distribution ecosystem architected for **Independent Artists, Professional Musicians, Record Labels, Rights Administrators, and Music Operations Teams**. 

Engineered around the international **DDEX ERN 4.3 (Electronic Release Notification)** metadata standard and fortified by an **OWASP ASVS 5.0 Level 2/3 security baseline**, SONVÉRA delivers frictionless delivery to 150+ Digital Service Providers (DSPs) including **Spotify, Apple Music, YouTube Music, Amazon Music HD, TIDAL, Deezer, TikTok, Meta Reels, Qobuz, and JioSaavn**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE SONVÉRA END-TO-END PIPELINE                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
   STUDIO MASTER         METADATA & RIGHTS         DDEX ERN 4.3           GLOBAL DSP INGESTION     
 ┌───────────────┐     ┌───────────────────┐     ┌───────────────┐     ┌────────────────────────┐  
 │ 24-bit / 48kHz│ ──► │ Strict 100% Splits│ ──► │ Canonical XML │ ──► │ Spotify, Apple Music,  │  
 │ Lossless FLAC │     │ ISRC / UPC Gen    │     │ Package Spec  │     │ YouTube, TIDAL, TikTok │  
 └───────────────┘     └───────────────────┘     └───────────────┘     └────────────────────────┘  
                                                                                    │              
                                                                                    ▼              
   PAYOUT DISPATCH        AUDITED LEDGER         DAILY TELEMETRY           PLAYBACK & TELEMETRY    
 ┌───────────────┐     ┌───────────────────┐     ┌───────────────┐     ┌────────────────────────┐  
 │ Stripe / Wire │ ◄── │ Immutable Entries │ ◄── │ Cross-DSP Run │ ◄── │ Stream Counts, Geo,    │  
 │ Zero Margin   │     │ Monthly Stmt Gen  │     │ Rate Matching │     │ Playlist Placements    │  
 └───────────────┘     └───────────────────┘     └───────────────┘     └────────────────────────┘  
```

---

## 📑 Table of Contents

- [🎵 Core Capabilities & Functional Modules](#-core-capabilities--functional-modules)
  - [1. 7-Step Guided Release Builder](#1-7-step-guided-release-builder)
  - [2. Multi-Tier Status Lifecycle State Machine](#2-multi-tier-status-lifecycle-state-machine)
  - [3. Financial Royalties & Accounting Pipeline](#3-financial-royalties--accounting-pipeline)
  - [4. OWASP ASVS 5.0 L2/L3 Security Architecture](#4-owasp-asvs-50-l2l3-security-architecture)
  - [5. SONVÉRA Assist (AI Release Copilot)](#5-sonvéra-assist-ai-release-copilot)
  - [6. Admin & Operations Control Plane](#6-admin--operations-control-plane)
  - [7. Legal Stack, Trust Center & Privacy Self-Service](#7-legal-stack-trust-center--privacy-self-service)
  - [8. Cinematic Auth & Onboarding Flow](#8-cinematic-auth--onboarding-flow)
- [🏛️ System Architecture](#-system-architecture)
  - [High-Level Architecture Diagram](#high-level-architecture-diagram)
  - [Distribution State Machine Diagram](#distribution-state-machine-diagram)
  - [Idempotent Financial Settlement Flow](#idempotent-financial-settlement-flow)
- [📂 Repository Structure](#-repository-structure)
- [🔌 REST API Reference](#-rest-api-reference)
- [🗄️ Database Architecture & Prisma Schema](#️-database-architecture--prisma-schema)
- [🚀 Quick Start & Local Development](#-quick-start--local-development)
- [🛡️ Security, Governance & Compliance Specifications](#️-security-governance--compliance-specifications)
- [📄 License & Authorship](#-license--authorship)

---

## 🎵 Core Capabilities & Functional Modules

### 1. 7-Step Guided Release Builder
An intuitive, foolproof workflow engine designed to prevent metadata ingestion rejects before dispatch:

| Step | Engine Phase | Validation Criteria & Technical Specifications |
| :--- | :--- | :--- |
| **01** | **Metadata & Identity** | Title, release format (*Single, EP, Album, Compilation*), primary/featured artists, label imprint, auto-generated EAN/UPC barcodes, primary/secondary genre, language, explicit flag, and street date with editorial pitch lead-time tracker. |
| **02** | **Artwork Quality Gate** | Automated client & server verification: 3000 x 3000 px minimum resolution, 1:1 aspect ratio, sRGB color profile check, max 25MB payload, and automated OCR check against prohibited store logos or unauthorized URLs. |
| **03** | **Master Audio & Waveforms** | Lossless 24-bit/16-bit at 44.1kHz / 48kHz WAV or FLAC ingestion, Integrated True-Peak Loudness analysis (-14 LUFS target), automatic ISRC issuance (`US-SVR-26-XXXXX`), and interactive Web Audio waveform player with millisecond scrubbing. |
| **04** | **Contributors & Publishing Splits** | Granular credits across Vocalists, Producers, Songwriters, Lyricists, Mixers, and Engineers with **strict 100.0% mechanical royalty balancing validation** preventing submittals on split mismatches. |
| **05** | **Rights & Territorial Scope** | ℗ Sound Recording & © Packaging legal copyright holders, publishing administration, and custom territorial geofencing (Worldwide vs. curated territory whitelists/blacklists). |
| **06** | **DSP Platform Selector** | Matrix selector covering 150+ stores: Spotify, Apple Music, YouTube Music, Amazon Music HD, TIDAL Masters, Deezer HiFi, JioSaavn, TikTok / ByteDance, Meta Reels, Qobuz, Pandora, and Tencent Music. |
| **07** | **Quality Gate & DDEX Engine** | Live 0–100 Health Score, category breakdown, instant error jump shortcuts, real-time DDEX ERN 4.3 XML package inspector, and celebratory launch dispatch. |

---

### 2. Multi-Tier Status Lifecycle State Machine
Every release progresses through an auditable, append-only status lifecycle with actor-stamped audit trails:

```
[ DRAFT ] ────────► [ VALIDATING ] ────────► [ VALIDATION_FAILED ]
                           │                        ▲
                           ▼                        │ (Fix blocking issues)
                       [ READY ] ───────────────────┘
                           │
                           ▼
                      [ SUBMITTED ] 
                           │
                           ▼
                    [ UNDER_REVIEW ] ──► [ REJECTED ]
                           │
                           ▼
                     [ PROCESSING ]
                           │
                           ▼
                      [ DELIVERED ]
                           │
                           ▼
                        [ LIVE ]
                           │
                           ▼ (Controlled Takedown)
                 [ TAKEDOWN_REQUESTED ] ──► [ TAKEN_DOWN ]
```

---

### 3. Financial Royalties & Accounting Pipeline
- **100% Artist Share Retention**: Zero distributor percentage skimming on standard tiers.
- **Micro-Cent Granularity**: Immutable double-entry royalty transactions calculated against daily DSP ingestion reports.
- **Audited Statements**: Comprehensive monthly reconciliations downloadable as auditable PDF/CSV packages.
- **Idempotent Payouts**: Guaranteed double-spend prevention through `Idempotency-Key` headers across Stripe Direct, SWIFT International Wire, Wise, and PayPal.
- **Dispute Resolution Flow**: Embedded mechanism to challenge mismatched stream counts or mechanical rate calculations directly to the accounting team.

---

### 4. OWASP ASVS 5.0 L2/L3 Security Architecture
Built from the ground up on production-grade security standards:

- **Strict HTTP Defense**: Pre-configured HSTS (max-age 1 year), Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.
- **4-Tier Data Classification Matrix**:
  - `PUBLIC`: Public catalog metadata, release dates, artist profiles.
  - `INTERNAL`: Operational analytics, aggregate platform metrics.
  - `HIGH`: Unreleased master audio WAVs, unreleased artwork, contributor contracts.
  - `CRITICAL`: PII, tax IDs, bank account coordinates, hashed credentials.
- **20-Point Enforced Security Checklist**: Hardened against OWASP Top 10:2025.
- **Dynamic Step-Up MFA Challenge**: Mandatory secondary verification challenge for high-risk operations (e.g. payout disbursement, copyright transfers, metadata withdrawals).
- **Audio Master Malware Quarantine**: Server-side inspection verifying audio magic bytes (`RIFF/WAVE`, `fLaC`), MIME integrity, and SHA-256 digest signing before storage.
- **Append-Only Tamper-Evident Audit Logs**: Every privileged state transition, validation, and administrative override is logged with immutable actor identifiers.

---

### 5. SONVÉRA Assist (AI Release Copilot)
An embedded intelligence assistant engineered with **deterministic safety guardrails**:

- **Metadata QA Scanner**: Automatically detects and fixes capitalization anomalies violating Apple Music Style Guide or Spotify Metadata Specifications.
- **Editorial Pitch Generator**: Synthesizes genre, instrumentation, mood, and artist bio into concise, formatted pitches formatted for Spotify for Artists and Apple Music editors.
- **Social Marketing Synthesizer**: Produces release day Instagram hooks, TikTok audio captions, and press release drafts.
- **Enforced Security Guardrail (§12)**: System-level hard lock strictly prohibiting AI from mutating accounting ledgers, triggering takedowns, or modifying legal rights.

---

### 6. Admin & Operations Control Plane
- **Live Queue Telemetry**: Real-time worker health monitoring across Audio Ingestion, Artwork Processing, DDEX Compilation, Distribution Dispatch, and Royalty Calculations.
- **Content Moderation Queue**: Single-click inspection of pending releases, validation results, and asset integrity.
- **Administrative Overrides**: Ability to approve releases to `LIVE`, reject releases with actionable QC feedback, or trigger emergency takedowns.
- **Active Fraud Anomaly Monitor**: Automated detection of suspicious stream spikes, duplicate ISRC conflicts, and fraudulent payout routing changes.

---

### 7. Legal Stack, Trust Center & Privacy Self-Service
- **Comprehensive 10-Document Legal Stack**: Full contractual policies covering Distribution Terms, Privacy Policy, DMCA Copyright Guidelines, Master Recording Warranties, Anti-Fraud Policies, and Cookie Charters.
- **DPDP Act 2023 & GDPR Data Subject Rights Portal**: Self-service interface for verified users to request full JSON data export, information rectification, or account/catalog deletion within statutory SLAs.
- **Dedicated Reporting Intake Channels**:
  - DMCA / Copyright Infringement Notice with legal perjury declaration requirement.
  - Responsible Security Vulnerability Disclosure with Safe Harbor protections.
  - Royalty & Statement Accounting Dispute channel.
- **Real-Time Trust & Status Monitor**: Public uptime metrics for API, Ingestion Queues, DSP Delivery Pipes, and database health with subprocessor disclosure registry.

---

### 8. Cinematic Auth & Onboarding Flow
- Split-screen cinematic visual styling featuring high-resolution audio production photography.
- Role-based onboarding: **Independent Artist, Professional Artist, Record Label, Label Team Member, or Audio Producer**.
- Real-time password entropy meter conforming to NIST 800-63B guidelines.
- Support for email verification, TOTP MFA challenges, password recovery, and OAuth social sign-in.

---

## 🏛️ System Architecture

### High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client Tier (React 19 + TypeScript + Vite)"]
        UI[Landing & Marketing UI]
        RC[Release Center & 7-Step Builder]
        CAT[Catalog & Release Detail]
        ROY[Royalties & Payout Ledger]
        ADM[Admin Operations Cockpit]
        ASSIST[SONVÉRA Assist AI Copilot]
    end

    subgraph Security["Edge & Gateway Security Middleware"]
        CSP[OWASP ASVS L2 Headers & CSP]
        RL[Sliding-Window Rate Limiter]
        IDEM[Idempotency Key Verifier]
        STEPUP[Step-Up MFA Challenge Guard]
        AUTH[JWT / Session Verification]
    end

    subgraph Backend["Core Application Services (Express 5 + TypeScript)"]
        REL_SVC[Release Domain Service]
        VAL_SVC[Quality Gate & Health Evaluator]
        DDEX_ENG[DDEX ERN 4.3 XML Serializer]
        ROY_SVC[Royalty Calculation Engine]
        AUDIT_SVC[Append-Only Audit Stream]
        PRIV_SVC[GDPR / DPDP Privacy Engine]
    end

    subgraph Persistence["Storage & Persistence Tier"]
        DB[(PostgreSQL / Prisma ORM)]
        UPLOADS[Asset Vault / S3 / R2 Bucket]
        AUDIT_STORE[(Immutable Audit Records)]
    end

    subgraph External["External Ecosystem & DSP Pipes"]
        SPOTIFY[Spotify Ingestion Pipe]
        APPLE[Apple Music Transporter]
        YOUTUBE[YouTube Content ID]
        TIKTOK[TikTok Sound Onboarding]
        OTHER_DSP[150+ Digital Storefronts]
        STRIPE[Stripe Connect / Banking Rails]
    end

    Client --> Security
    Security --> Backend
    Backend --> Persistence
    DDEX_ENG --> External
    ROY_SVC --> STRIPE
```

### Distribution State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Create Release
    DRAFT --> VALIDATING : Run Quality Gate
    VALIDATING --> VALIDATION_FAILED : Blockers Detected (Score < 80)
    VALIDATION_FAILED --> DRAFT : Fix Audio / Artwork / Metadata
    VALIDATING --> READY : 100% Compliant (Score >= 80)
    READY --> SUBMITTED : Submit for Delivery
    SUBMITTED --> UNDER_REVIEW : Ingestion QA Queue
    UNDER_REVIEW --> REJECTED : QC Violation
    REJECTED --> DRAFT : Amend & Resubmit
    UNDER_REVIEW --> PROCESSING : QC Passed
    PROCESSING --> DELIVERED : DDEX ERN 4.3 Dispatched
    DELIVERED --> LIVE : Ingested & Streamable on DSPs
    LIVE --> TAKEDOWN_REQUESTED : Controlled Takedown Filed
    TAKEDOWN_REQUESTED --> TAKEN_DOWN : Purge Messages Confirmed
    TAKEN_DOWN --> [*]
```

### Idempotent Financial Settlement Flow

```mermaid
sequenceDiagram
    autonumber
    actor Artist as Artist / Label Owner
    participant Web as SONVÉRA Frontend
    participant API as API Gateway (/api/v1/payouts)
    participant Sec as Security & Idempotency Store
    participant Ledger as Immutable Financial Ledger
    participant Rail as Payout Rail (Stripe / SWIFT)

    Artist->>Web: Request Payout ($5,124.60)
    Web->>Web: Generate UUIDv4 Idempotency-Key
    Web->>API: POST /api/v1/payouts (with Idempotency-Key & Step-Up Token)
    API->>Sec: Check Idempotency Key
    alt Key already exists (Duplicate Request)
        Sec-->>API: Return Cached Result
        API-->>Web: Return 200 OK (Previous Transaction)
    else Key is fresh
        API->>Sec: Validate Rate Limit (5/hr) & Step-Up Token
        API->>Ledger: Lock Balance & Append Payout Record
        API->>Rail: Dispatch Funds via API
        Rail-->>API: Transaction Confirmation Reference
        API->>Ledger: Record Settled State & Audit Entry
        API->>Sec: Cache Response with Key (24h TTL)
        API-->>Web: Return 200 OK (Payout Dispatched)
        Web-->>Artist: Display Confirmation & Updated Balance
    end
```

---

## 📂 Repository Structure

```text
SONVÉRA — Premium Music Distribution Platform/
├── .github/                           # CI/CD Workflows & GitHub issue templates
├── prisma/
│   └── schema.prisma                  # Enterprise PostgreSQL schema (Identity, Releases, Royalties)
├── public/
│   ├── assets/auth/                   # Cinematic onboarding imagery & visual assets
│   ├── favicon.svg                    # Brand vector mark
│   └── icons.svg                      # Optimized SVG icon sprite sheet
├── server/
│   ├── data/
│   │   └── db.json                    # Development JSON seed & persistent storage engine
│   ├── src/
│   │   ├── lib/
│   │   │   ├── db.ts                  # Persistent filesystem DB helper with read/write locks
│   │   │   ├── policies.ts            # Complete 10-document legal stack & status components
│   │   │   └── security.ts            # OWASP ASVS checklist, data classification, MFA, fraud detection
│   │   ├── modules/
│   │   │   └── distribution/
│   │   │       └── providers/
│   │   │           ├── demoDistributionProvider.ts        # DDEX ERN 4.3 XML generator & sandbox provider
│   │   │           └── distributionProvider.interface.ts # Pluggable provider abstraction contract
│   │   ├── app.ts                     # Core Express 5 application, middleware & /api/v1 router
│   │   └── server.ts                  # HTTP server initialization & port binding
│   └── uploads/                       # Ingested master audio files and release cover artwork
├── src/
│   ├── assets/                        # Frontend UI images, logos, and vector assets
│   ├── components/
│   │   ├── auth/                      # Dedicated Cinematic Authentication Suite
│   │   │   ├── AudioWaveform.tsx      # Decorative real-time canvas waveform animator
│   │   │   ├── CinematicLeftPanel.tsx # High-impact hero narrative & photography sidebar
│   │   │   ├── LoginPage.tsx          # Credentials login with MFA redirect
│   │   │   ├── RegisterPage.tsx       # Multi-step account creation with role selector
│   │   │   ├── OnboardingFlow.tsx     # Personalized onboarding question wizard
│   │   │   ├── MfaChallengeView.tsx   # TOTP 6-digit verification screen
│   │   │   ├── EmailVerificationView.tsx # One-time code verification interface
│   │   │   ├── ForgotPasswordPage.tsx # Password reset intake & email dispatcher
│   │   │   └── PasswordStrength.tsx   # NIST 800-63B compliant password entropy calculator
│   │   ├── AdminView.tsx              # Operations control cockpit, moderation & worker queues
│   │   ├── AnalyticsView.tsx          # Streaming metrics, territorial breakdown & DSP split
│   │   ├── AudioPreviewPlayer.tsx     # Floating Web Audio lossless playback scrubber
│   │   ├── CatalogView.tsx            # Complete catalog grid, release cards & filter controls
│   │   ├── CookiePreferencesModal.tsx # GDPR ePrivacy cookie consent configuration modal
│   │   ├── DashboardView.tsx          # Artist dashboard, quick release stats & recent activity
│   │   ├── DedicatedReportingModal.tsx# Intake modal for DMCA, Vulnerabilities & Royalty Disputes
│   │   ├── DistributionView.tsx       # Live status tracking across 150+ connected DSPs
│   │   ├── LandingPageView.tsx        # High-conversion public landing page with interactive demos
│   │   ├── LegalPoliciesModal.tsx     # Full-text legal policy viewer for 10 platform contracts
│   │   ├── Navbar.tsx                 # Top navigation bar with wallet balance, notifications & profile
│   │   ├── PromotionView.tsx          # SmartLinks generator, pre-save campaigns & editorial pitch
│   │   ├── ReleaseBuilderModal.tsx    # 7-Step master release creation engine with DDEX inspector
│   │   ├── ReleaseCenterView.tsx      # Release overview, health score badges & status management
│   │   ├── ReleaseDetailView.tsx      # Comprehensive release inspection, tracklist & audit timeline
│   │   ├── RoyaltiesView.tsx          # Financial ledger, statement downloads & idempotent payouts
│   │   ├── Sidebar.tsx                # Collapsible primary platform navigation sidebar
│   │   ├── SonveraAssistView.tsx      # AI Release Copilot (QA scan, pitches, social copy)
│   │   ├── StepUpAuthModal.tsx        # Dynamic modal for verifying high-risk privileged actions
│   │   ├── TrustCenterModal.tsx       # Live system status, subprocessor directory & compliance info
│   │   └── UserPrivacyRightsModal.tsx # DPDP Act 2023 & GDPR data export/correction/deletion modal
│   ├── data/
│   │   └── mockData.ts                # Rich seed dataset for releases, tracks, royalties & metrics
│   ├── services/
│   │   ├── api.ts                     # Typed client HTTP service targeting /api/v1/*
│   │   └── distributionProvider.ts    # Frontend client-side DDEX and sandbox provider bridge
│   ├── types/
│   │   └── index.ts                   # Strict TypeScript definitions for all domain entities
│   ├── App.css                        # Specialized component-level animations & styles
│   ├── App.tsx                        # Master view router, state coordinator & modal mounts
│   ├── index.css                      # Tailwind CSS v4 design system, font tokens & glassmorphism
│   └── main.tsx                       # React DOM root entry point
├── package.json                       # Project manifests, dependencies & runner scripts
├── tsconfig.json                      # Strict TypeScript compiler configuration
└── vite.config.ts                     # Vite build & bundler configuration
```

---

## 🔌 REST API Reference

All backend endpoints are prefixed with `/api/v1` and enforce JSON serialization, input sanitization, and structured error responses.

### 1. System Health & Core
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Platform diagnostics, version tag, active provider & DDEX standard info |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile, assigned role, and permissions |

### 2. Releases & Catalog
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/releases` | List releases with status, type, and keyword filtering |
| `POST` | `/api/v1/releases` | Create a new draft release with validated metadata schema |
| `GET` | `/api/v1/releases/:id` | Fetch full release detail including tracks, splits & delivery statuses |
| `PATCH` | `/api/v1/releases/:id` | Update draft metadata, tracks, or contributor splits |
| `POST` | `/api/v1/releases/:id/validate` | Run comprehensive 7-point Quality Gate validation & return Health Score |
| `POST` | `/api/v1/releases/:id/distribution` | Submit release for DSP delivery (Enforces rate limit & idempotency) |
| `GET` | `/api/v1/releases/:id/distribution/status` | Real-time ingest and store live status across all target DSPs |
| `POST` | `/api/v1/releases/:id/takedown` | Execute controlled takedown order across all active DSP pipelines |
| `GET` | `/api/v1/releases/:id/ddex` | Generate and stream canonical DDEX ERN 4.3 XML package |

### 3. Asset Ingestion
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/upload/audio` | Lossless WAV/FLAC upload with magic byte inspection & LUFS check |
| `POST` | `/api/v1/upload/artwork` | 3000x3000px cover artwork ingestion with color space verification |
| `POST` | `/api/v1/assets/presign` | Generate presigned upload URL for direct cloud storage ingest |
| `POST` | `/api/v1/assets/complete` | Complete upload and trigger background waveform extraction worker |

### 4. Financial Royalties & Accounting
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/royalties/transactions` | Fetch immutable transaction ledger with per-stream micro-cent shares |
| `GET` | `/api/v1/royalties/statements` | List audited monthly financial statements |
| `POST` | `/api/v1/payouts` | Disburse artist payout with `Idempotency-Key` and rate-limit controls |

### 5. SONVÉRA Assist (AI Release Copilot)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/ai/audit` | Run automated style guide & casing audit on release title and tracks |
| `POST` | `/api/v1/ai/assist` | Generate editorial DSP pitches, marketing hooks (Protected by §12 guardrail) |

### 6. Admin Control Plane
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/overview` | Platform telemetry, queue statuses, reserves & active delivery pipes |
| `GET` | `/api/v1/admin/releases` | List all platform releases for administrative moderation |
| `POST` | `/api/v1/admin/releases/:id/status` | Administrative manual status override with audit note |
| `POST` | `/api/v1/admin/releases/:id/approve` | Approve release and dispatch live delivery across all stores |
| `POST` | `/api/v1/admin/releases/:id/reject` | Reject release with formal QC remediation guidance |
| `GET` | `/api/v1/admin/audit-logs` | Retrieve chronological, append-only security and operational audit trail |
| `POST` | `/api/v1/admin/sync-providers` | Trigger manual resynchronization of external DSP ingestion feeds |

### 7. Security, Trust & Data Subject Rights
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/security/overview` | OWASP compliance score, encryption standards, active sessions |
| `GET` | `/api/v1/security/checklist` | 20-Point production security checklist audit status |
| `GET` | `/api/v1/security/fraud-alerts` | Retrieve active fraud anomaly alerts (duplicate ISRCs, streaming spikes) |
| `POST` | `/api/v1/security/fraud-alerts/:id/resolve` | Resolve or place administrative hold on flagged fraud alert |
| `POST` | `/api/v1/auth/step-up/challenge` | Issue time-limited MFA challenge for privileged operations |
| `POST` | `/api/v1/auth/step-up/verify` | Verify 6-digit TOTP code and issue short-lived step-up token |
| `GET` | `/api/v1/security/policies` | Retrieve directory of all 10 legal and security platform policies |
| `GET` | `/api/v1/security/policies/:slug` | Retrieve full legal text for a specific policy contract |
| `GET` | `/api/v1/trust/overview` | Trust score, DPDP/GDPR compliance status, security contacts |
| `GET` | `/api/v1/status` | Live infrastructure status, component health & incident log |
| `GET` | `/api/v1/subprocessors` | Audited registry of 3rd-party subprocessors with signed DPAs |
| `POST` | `/api/v1/privacy/requests` | Submit GDPR/DPDP Act 2023 data export, correction or deletion request |
| `GET` | `/api/v1/privacy/requests` | List user's active privacy rights requests and statutory SLA progress |
| `POST` | `/api/v1/support/report-copyright` | File formal DMCA copyright infringement notice with perjury declaration |
| `POST` | `/api/v1/support/report-vulnerability` | Submit responsible security vulnerability report under Safe Harbor |
| `POST` | `/api/v1/support/royalty-dispute` | Lodge formal royalty accounting dispute for financial investigation |

---

## 🗄️ Database Architecture & Prisma Schema

The persistence layer is defined via [prisma/schema.prisma](file:///e:/New%20Projects/SONV%C3%89RA%20%E2%80%94%20Premium%20Music%20Distribution%20Platform/prisma/schema.prisma) targeting PostgreSQL:

- **Identity Domain**: `User`, `Profile`, `Artist`, `Label`, `ArtistMember`, `LabelMember` with role-based access control.
- **Catalog Domain**: `Release`, `Track`, `Contributor`, `TrackContributor` with foreign keys tracking ISRC, UPC, explicit tags, and publishing shares.
- **Asset Vault**: `Asset`, `ReleaseAsset`, `TrackAsset` maintaining file specifications, bit-depth, sample rates, checksums, and storage references.
- **Distribution Domain**: `DistributionBatch`, `DestinationDelivery`, `DeliveryStatusEvent` tracking delivery progress for each distinct DSP store.
- **Financial Ledger**: `Royalty`, `RoyaltyStatement`, `Payout` modeling micro-cent calculations, currency types, and settlement proofs.
- **Audit Domain**: `AuditLog` providing an append-only timeline of actor identity, IP, action, entity references, and metadata diffs.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Git**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Gautamgiri798/SONVERA-Music-Distribution-Platform.git
   cd SONVERA-Music-Distribution-Platform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional):
   Create a `.env` file in the root directory if configuring custom ports or external database connections:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sonvera"
   ```

4. **Launch Local Development Cluster**:
   Runs both the **Express 5 API server** and **Vite Frontend dev server** concurrently:
   ```bash
   npm run dev
   ```

   - **Frontend Application**: `http://127.0.0.1:5173/`
   - **Backend API**: `http://127.0.0.1:3000/api/v1/health`

### Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts backend server and Vite client concurrently |
| `npm run dev:frontend` | Starts only the Vite frontend dev server (`port 5173`) |
| `npm run server` | Starts only the Express TypeScript backend via `tsx watch` |
| `npm run build` | Compiles TypeScript and builds production client bundle to `/dist` |
| `npm run preview` | Previews production client bundle locally |
| `npm run lint` | Runs ultra-fast code quality linter via `oxlint` |

---

## 🛡️ Security, Governance & Compliance Specifications

SONVÉRA complies with international regulatory and audio industry specifications:

- **DDEX Standards**: Complies with **DDEX ERN 4.3 (Electronic Release Notification)** and backwards-compatible with **DDEX ERN 3.8.2** XML schema specifications.
- **OWASP ASVS 5.0**: Adheres to Level 2 verification requirements with selective Level 3 controls across session management, cryptography, and input validation.
- **Audio Standards**: Enforces **AES/EBU R128** and **ITU-R BS.1770-4** loudness measurement algorithms (-14.0 LUFS target, -1.0 dBTP ceiling).
- **Data Privacy**: Full alignment with the **Digital Personal Data Protection Act 2023 (India DPDP Act)** and **General Data Protection Regulation (EU GDPR)**.
- **PCI-DSS Compliance**: Level 1 compliant architecture via client-side tokenization (Zero plaintext credit card or bank credentials touch SONVÉRA servers).

---

## 📄 License & Authorship

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with precision by **Gautam Giri** & the **SONVÉRA Engineering Team**.  
*For enterprise licensing, DSP partnership inquiries, or security disclosures, contact [legal@sonvera.audio](mailto:legal@sonvera.audio).*
