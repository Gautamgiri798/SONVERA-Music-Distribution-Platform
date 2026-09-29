import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Upload,
  ArrowRight,
  ArrowLeft,
  Disc,
  Music,
  CheckCircle2,
  FileCheck,
  Radio,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Release,
  Track,
  ReleaseType,
  ValidationResult,
  DspIdentifier,
  UserProfile,
} from '../types';
import { sonveraDemoProvider } from '../services/distributionProvider';

interface ReleaseBuilderModalProps {
  initialRelease?: Release | null;
  currentUser: UserProfile;
  onClose: () => void;
  onSaveRelease: (release: Release, submitNow: boolean) => void;
}

export const ReleaseBuilderModal: React.FC<ReleaseBuilderModalProps> = ({
  initialRelease,
  currentUser,
  onClose,
  onSaveRelease,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Release state matching screenshot
  const [title, setTitle] = useState<string>(initialRelease?.title || 'Neon Nights');
  const [releaseType, setReleaseType] = useState<ReleaseType>(initialRelease?.releaseType || 'single');
  const [primaryArtist, setPrimaryArtist] = useState<string>(
    initialRelease?.primaryArtist || 'Gautam Giri'
  );
  const [featuredArtists, setFeaturedArtists] = useState<string>(
    initialRelease?.featuredArtists.join(', ') || ''
  );
  const [genre, setGenre] = useState<string>(initialRelease?.primaryGenre || 'Electronic');
  const [subgenre, setSubgenre] = useState<string>(initialRelease?.secondaryGenre || 'Synthwave');
  const [language, setLanguage] = useState<string>(initialRelease?.language || 'English');
  const [originalDate, setOriginalDate] = useState<string>(initialRelease?.originalReleaseDate || '2026-10-18');
  const [releaseDate, setReleaseDate] = useState<string>(initialRelease?.releaseDate || '2026-10-18');
  const [label, setLabel] = useState<string>(initialRelease?.labelName || 'Gautam Giri Productions');
  const [cLine, setCLine] = useState<string>(initialRelease?.cLineOwner || '2026 Gautam Giri Productions');
  const [pLine, setPLine] = useState<string>(initialRelease?.pLineOwner || '2026 Gautam Giri Productions');
  const [isExplicit, setIsExplicit] = useState<boolean>(false);

  // Audio track state
  const [trackTitle, setTrackTitle] = useState<string>('Neon Nights');
  const [trackVersion, setTrackVersion] = useState<string>('Original Mix');
  const [isrc, setIsrc] = useState<string>('US-SVR-26-00101');
  const [autoGenerateIsrc, setAutoGenerateIsrc] = useState<boolean>(true);
  const [rightsDeclared, setRightsDeclared] = useState<boolean>(true);

  // Artwork
  const [artworkUrl, setArtworkUrl] = useState<string>(
    initialRelease?.artwork?.url ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
  );

  // DSP selections matching screenshot Screen 8
  const [selectedStreaming, setSelectedStreaming] = useState<string[]>([
    'spotify',
    'apple_music',
    'youtube_music',
    'amazon_music',
    'deezer',
    'tidal',
  ]);
  const [selectedIndia, setSelectedIndia] = useState<string[]>(['jiosaavn', 'gaana', 'wynk']);
  const [selectedSocial, setSelectedSocial] = useState<string[]>(['tiktok', 'instagram', 'youtube_shorts', 'facebook']);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const steps = [
    { num: 1, label: 'Type' },
    { num: 2, label: 'Upload' },
    { num: 3, label: 'Artwork' },
    { num: 4, label: 'Metadata' },
    { num: 5, label: 'Contributors' },
    { num: 6, label: 'Distribution' },
    { num: 7, label: 'Review' },
  ];

  const currentPayload: Release = {
    id: initialRelease?.id || `rel-${Date.now()}`,
    title,
    releaseType,
    primaryArtist,
    featuredArtists: featuredArtists ? [featuredArtists] : [],
    labelName: label,
    catalogNumber: 'GG-2026-01',
    upc: '793573194012',
    primaryGenre: genre,
    secondaryGenre: subgenre,
    language,
    explicitRating: isExplicit ? 'explicit' : 'clean',
    releaseDate,
    originalReleaseDate: originalDate,
    isRemaster: false,
    artwork: {
      url: artworkUrl,
      width: 3000,
      height: 3000,
      colorSpace: 'RGB',
      format: 'JPEG',
      sizeBytes: 4210000,
      hasTextRestrictionsPassed: true,
    },
    tracks: [
      {
        id: 'trk-01',
        trackNumber: 1,
        title: trackTitle,
        versionTitle: trackVersion,
        primaryArtist,
        featuredArtists: [],
        isrc: isrc || 'US-SVR-26-00101',
        isExplicit,
        isInstrumental: false,
        language,
        audioSpec: {
          fileName: 'Neon_Nights.wav',
          fileSizeBytes: 45200000,
          format: 'WAV',
          sampleRateHz: 48000,
          bitDepth: 24,
          channels: 'Stereo',
          durationSeconds: 204, // 3:24
          peakLufs: -14.1,
        },
        contributors: [
          { id: 'c1', name: primaryArtist, role: 'Primary Artist', sharePercentage: 50 },
          { id: 'c2', name: 'Markus Vance', role: 'Producer', sharePercentage: 30 },
          { id: 'c3', name: 'Elena Chen', role: 'Songwriter / Composer', sharePercentage: 20 },
        ],
        previewStartTimeSec: 30,
      },
    ],
    cLineYear: 2026,
    cLineOwner: cLine,
    pLineYear: 2026,
    pLineOwner: pLine,
    territoryOption: 'worldwide',
    selectedTerritories: ['WW'],
    selectedDsps: [
      'spotify',
      'apple_music',
      'youtube_music',
      'amazon_music',
      'jiosaavn',
      'deezer',
      'tidal',
      'meta',
    ],
    status: 'READY',
    statusHistory: initialRelease?.statusHistory || [],
    deliveryStatuses: initialRelease?.deliveryStatuses || [],
    createdAt: initialRelease?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    sonveraDemoProvider.validateRelease(currentPayload).then((res) => {
      setValidationResult(res);
    });
  }, [title, releaseType, primaryArtist, isrc, releaseDate, artworkUrl]);

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#38bdf8', '#10b981'],
    });

    setTimeout(() => {
      const submittedRelease: Release = {
        ...currentPayload,
        status: 'PROCESSING',
        statusHistory: [
          ...currentPayload.statusHistory,
          {
            id: `sh-${Date.now()}`,
            status: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            note: 'Submitted for global distribution.',
            actor: primaryArtist,
          },
          {
            id: `sh-proc-${Date.now()}`,
            status: 'PROCESSING',
            timestamp: new Date().toISOString(),
            note: 'Distribution packaging and ingestion active.',
            actor: 'SONVÉRA Gateway',
          },
        ],
      };
      setIsSubmitting(false);
      onSaveRelease(submittedRelease, true);
    }, 700);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 12, 21, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '980px',
          maxWidth: '96vw',
          height: '86vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          color: '#0f172a',
        }}
      >
        {/* Top Header with Stepper (Matching Screens 5, 6, 7, 8, 9) */}
        <div style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '16px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              Create New Release
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '780px', margin: '0 auto' }}>
            {steps.map((s) => {
              const isCurrent = currentStep === s.num;
              const isCompleted = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isCurrent ? '#6366f1' : isCompleted ? '#0f172a' : '#94a3b8',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? '#6366f1'
                        : isCompleted
                        ? '#e0e7ff'
                        : '#e2e8f0',
                      color: isCurrent ? '#ffffff' : isCompleted ? '#4338ca' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCompleted ? <Check size={13} strokeWidth={3} /> : s.num}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 500 }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '36px 48px', background: '#f8fafc' }}>
          {/* STEP 1: RELEASE TYPE (Screen 5) */}
          {currentStep === 1 && (
            <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                What type of release are you creating?
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '36px' }}>
                Choose the release structure that best matches your master recording collection.
              </p>

              {/* 4 Cards Grid Matching Screen 5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '40px' }}>
                {[
                  {
                    id: 'single',
                    title: 'Single',
                    desc: '1 track',
                    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    id: 'ep',
                    title: 'EP',
                    desc: '2 - 6 tracks',
                    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    id: 'album',
                    title: 'Album',
                    desc: '7+ tracks',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    id: 'compilation',
                    title: 'Compilation',
                    desc: 'Various artists',
                    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
                  },
                ].map((item) => {
                  const isSelected = releaseType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setReleaseType(item.id as ReleaseType)}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 10px 25px rgba(99, 102, 241, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ height: '140px', overflow: 'hidden' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 36px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: UPLOAD AUDIO (Screen 6) */}
          {currentStep === 2 && (
            <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Upload Your Music
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '28px' }}>
                Upload uncompressed master audio in WAV or FLAC format (44.1kHz or 48kHz, 16 or 24-bit).
              </p>

              {/* Big Dropzone Matching Screen 6 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#e0e7ff',
                    color: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <Upload size={24} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Drop your audio files here
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                  WAV or FLAC • Minimum 44.1kHz
                </div>
                <button
                  style={{
                    background: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse Files
                </button>
              </div>

              {/* Uploaded File Row Matching Screen 6 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '36px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6366f1',
                    }}
                  >
                    <Music size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      Neon_Nights.wav
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      45.2 MB • 3:24 • WAV 24-bit / 48kHz • -14.1 LUFS
                    </div>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#d1fae5', padding: '1px 6px', borderRadius: '4px' }}>Magic Bytes: 52 49 46 46 (RIFF)</span>
                      <span style={{ background: '#d1fae5', padding: '1px 6px', borderRadius: '4px' }}>Quarantine: CLEAN</span>
                      <span style={{ background: '#d1fae5', padding: '1px 6px', borderRadius: '4px' }}>True Peak: -1.1 dBTP</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#d1fae5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentStep(1)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 32px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COVER ARTWORK */}
          {currentStep === 3 && (
            <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Upload Cover Artwork
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '28px' }}>
                Streaming platforms require a 3000 x 3000px square cover image in RGB format without external URLs or logos.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
                <div>
                  <img
                    src={artworkUrl}
                    alt="cover"
                    style={{ width: '100%', height: '240px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 600, marginTop: '8px', textAlign: 'center' }}>
                    ✓ 3000 x 3000 px • RGB • JPG
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Artwork Image URL / Upload
                  </label>
                  <input
                    type="text"
                    value={artworkUrl}
                    onChange={(e) => setArtworkUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      marginBottom: '16px',
                    }}
                  />

                  <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                    <div>✓ Minimum resolution: 3000 x 3000 px</div>
                    <div>✓ Color Space: sRGB</div>
                    <div>✓ No pricing, URLs, barcodes, or partner logos</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 32px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: METADATA (Screen 7) */}
          {currentStep === 4 && (
            <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '36px' }}>
                {/* Left Column: Release Information */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Release Information
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Release Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Primary Artist</label>
                        <input
                          type="text"
                          value={primaryArtist}
                          onChange={(e) => setPrimaryArtist(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Featured Artists</label>
                        <input
                          type="text"
                          value={featuredArtists}
                          onChange={(e) => setFeaturedArtists(e.target.value)}
                          placeholder="Select Artists"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Genre</label>
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        >
                          <option value="Electronic">Electronic</option>
                          <option value="Synthwave">Synthwave</option>
                          <option value="Pop">Pop</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Subgenre</label>
                        <select
                          value={subgenre}
                          onChange={(e) => setSubgenre(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        >
                          <option value="Synthwave">Synthwave</option>
                          <option value="Darksynth">Darksynth</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Release Date</label>
                        <input
                          type="date"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Label</label>
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>℗ Copyright</label>
                        <input
                          type="text"
                          value={pLine}
                          onChange={(e) => setPLine(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>© Copyright</label>
                        <input
                          type="text"
                          value={cLine}
                          onChange={(e) => setCLine(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Track 01 */}
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Track 01
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Title</label>
                      <input
                        type="text"
                        value={trackTitle}
                        onChange={(e) => setTrackTitle(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Version</label>
                      <input
                        type="text"
                        value={trackVersion}
                        onChange={(e) => setTrackVersion(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>ISRC</label>
                        <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={autoGenerateIsrc}
                            onChange={(e) => setAutoGenerateIsrc(e.target.checked)}
                          />
                          <span>Auto-generate</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '4px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentStep(3)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 32px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONTRIBUTORS & SPLITS */}
          {currentStep === 5 && (
            <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Contributors & Royalty Splits
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '28px' }}>
                Publishing mechanical splits must equal 100.0%.
              </p>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
                {[
                  { name: 'Gautam Giri', role: 'Primary Artist', share: 50 },
                  { name: 'Markus Vance', role: 'Producer', share: 30 },
                  { name: 'Elena Chen', role: 'Songwriter / Composer', share: 20 },
                ].map((c) => (
                  <div
                    key={c.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{c.role}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#6366f1' }}>
                      {c.share}%
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#059669', fontSize: '13.5px' }}>
                  <span>Total Split:</span>
                  <span>100.0% (Balanced)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentStep(4)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 32px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: DISTRIBUTION DESTINATIONS (Screen 8) */}
          {currentStep === 6 && (
            <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Where do you want to distribute?
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>
                Select the platforms for your release. Demo distribution destinations.
              </p>

              {/* 3 Categorized Columns Matching Screen 8 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {/* Streaming Platforms */}
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                    Streaming Platforms
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'spotify', name: 'Spotify' },
                      { id: 'apple_music', name: 'Apple Music' },
                      { id: 'youtube_music', name: 'YouTube Music' },
                      { id: 'amazon_music', name: 'Amazon Music' },
                      { id: 'deezer', name: 'Deezer' },
                      { id: 'tidal', name: 'TIDAL' },
                    ].map((dsp) => (
                      <label key={dsp.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedStreaming.includes(dsp.id)}
                          onChange={() => {
                            if (selectedStreaming.includes(dsp.id)) {
                              setSelectedStreaming(selectedStreaming.filter((s) => s !== dsp.id));
                            } else {
                              setSelectedStreaming([...selectedStreaming, dsp.id]);
                            }
                          }}
                        />
                        <span>{dsp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* India Regional */}
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                    India
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'jiosaavn', name: 'JioSaavn' },
                      { id: 'gaana', name: 'Gaana' },
                      { id: 'wynk', name: 'Wynk' },
                    ].map((dsp) => (
                      <label key={dsp.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedIndia.includes(dsp.id)}
                          onChange={() => {
                            if (selectedIndia.includes(dsp.id)) {
                              setSelectedIndia(selectedIndia.filter((s) => s !== dsp.id));
                            } else {
                              setSelectedIndia([...selectedIndia, dsp.id]);
                            }
                          }}
                        />
                        <span>{dsp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Social / Short Video */}
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                    Social / Short Video
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'tiktok', name: 'TikTok' },
                      { id: 'instagram', name: 'Instagram' },
                      { id: 'youtube_shorts', name: 'YouTube Shorts' },
                      { id: 'facebook', name: 'Facebook' },
                    ].map((dsp) => (
                      <label key={dsp.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedSocial.includes(dsp.id)}
                          onChange={() => {
                            if (selectedSocial.includes(dsp.id)) {
                              setSelectedSocial(selectedSocial.filter((s) => s !== dsp.id));
                            } else {
                              setSelectedSocial([...selectedSocial, dsp.id]);
                            }
                          }}
                        />
                        <span>{dsp.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentStep(5)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 32px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & SUBMIT (Screen 9) */}
          {currentStep === 7 && (
            <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Review Your Release
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                Please review your release details before submitting.
              </p>

              {/* Release Header Card Matching Screen 9 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={artworkUrl}
                    alt={title}
                    style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{title}</h3>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      {primaryArtist} • Single • 1 Track
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Release Date: {releaseDate}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(4)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              </div>

              {/* Checklist Matching Screen 9 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '10px 24px',
                  marginBottom: '32px',
                }}
              >
                {[
                  { label: 'Audio', value: 'neon_nights.wav', status: 'Valid' },
                  { label: 'Artwork', value: 'neon_nights.jpg', status: 'Valid' },
                  { label: 'Metadata', value: 'Completed', status: 'Completed' },
                  { label: 'Contributors', value: '3 contributors', status: 'Complete' },
                  { label: 'Distribution', value: '8 platforms selected', status: 'Ready' },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', width: '110px' }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{row.value}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: 700 }}>
                      <Check size={14} strokeWidth={3} />
                      <span>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statutory Rights & Ownership Declaration (Blueprint §10) */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <input
                  type="checkbox"
                  id="rights-declaration"
                  checked={rightsDeclared}
                  onChange={(e) => setRightsDeclared(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="rights-declaration" style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, cursor: 'pointer' }}>
                  <strong style={{ color: '#0f172a' }}>Statutory Rights & Ownership Declaration (OWASP ASVS §10):</strong> I certify that I am the sole owner or authorized licensee of 100% of worldwide master recording and mechanical rights for this release. All samples are licensed and cleared. Contributor splits total 100%, and content adheres strictly to the SONVÉRA Copyright & Content Policy.
                </label>
              </div>

              {/* Submit CTA Button Matching Screen 9 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentStep(6)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || !rightsDeclared}
                  style={{
                    background: !rightsDeclared
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 40px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: !rightsDeclared ? 'not-allowed' : 'pointer',
                    boxShadow: !rightsDeclared ? 'none' : '0 6px 20px rgba(99, 102, 241, 0.45)',
                    opacity: !rightsDeclared ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? 'Transmitting Batch...' : 'Submit for Distribution'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
