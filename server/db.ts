import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface DbSchema {
  releases: any[];
  payouts: any[];
  statusHistory: any[];
  users: any[];
}

const defaultWaveform = [
  0.2, 0.45, 0.3, 0.7, 0.9, 0.65, 0.4, 0.8, 0.95, 0.7, 0.5, 0.85, 0.6, 0.3, 0.75,
  0.88, 0.92, 0.64, 0.42, 0.78, 0.91, 0.53, 0.38, 0.67, 0.84, 0.72, 0.59, 0.44, 0.63,
  0.8, 0.95, 0.6, 0.4, 0.7, 0.85, 0.9, 0.75, 0.6, 0.45, 0.8, 0.9, 0.55, 0.3, 0.6
];

const initialData: DbSchema = {
  users: [
    {
      id: 'user-01',
      name: 'Gautam Giri',
      role: 'independent_artist',
      email: 'gautam@sonvera.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      labelName: 'Gautam Giri Productions',
      verified: true,
    },
    {
      id: 'user-02',
      name: 'Aria Vance',
      role: 'professional_artist',
      email: 'aria@midnightecho-official.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
      labelName: 'Midnight Echo Recordings',
      verified: true,
    }
  ],
  releases: [
    {
      id: 'rel-neon-nights',
      title: 'Neon Nights',
      releaseType: 'single',
      primaryArtist: 'Gautam Giri',
      featuredArtists: [],
      labelName: 'Gautam Giri Productions',
      catalogNumber: 'GG-2026-01',
      upc: '793573194012',
      primaryGenre: 'Synthwave',
      secondaryGenre: 'Electronic / Retrowave',
      language: 'English',
      explicitRating: 'clean',
      releaseDate: '2026-10-18',
      originalReleaseDate: '2026-10-18',
      isRemaster: false,
      artwork: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        width: 3000,
        height: 3000,
        colorSpace: 'RGB',
        format: 'JPEG',
        sizeBytes: 4210000,
        hasTextRestrictionsPassed: true,
      },
      tracks: [
        {
          id: 'trk-nn-01',
          trackNumber: 1,
          title: 'Neon Nights (Original Mix)',
          versionTitle: 'Original Mix',
          primaryArtist: 'Gautam Giri',
          featuredArtists: [],
          isrc: 'US-SVR-26-00101',
          isExplicit: false,
          isInstrumental: false,
          language: 'English',
          audioSpec: {
            fileName: 'Neon_Nights.wav',
            fileSizeBytes: 45200000,
            format: 'WAV',
            sampleRateHz: 48000,
            bitDepth: 24,
            channels: 'Stereo',
            durationSeconds: 204, // 3:24
            peakLufs: -14.1,
            waveformSample: defaultWaveform,
          },
          contributors: [
            { id: 'c-gg-1', name: 'Gautam Giri', role: 'Primary Artist', sharePercentage: 50 },
            { id: 'c-gg-2', name: 'Markus Vance', role: 'Producer', sharePercentage: 30 },
            { id: 'c-gg-3', name: 'Elena Chen', role: 'Songwriter / Composer', sharePercentage: 20 },
          ],
          previewStartTimeSec: 45,
        }
      ],
      cLineYear: 2026,
      cLineOwner: '2026 Gautam Giri Productions',
      pLineYear: 2026,
      pLineOwner: '2026 Gautam Giri Productions',
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
        'meta'
      ],
      status: 'LIVE',
      statusHistory: [
        {
          id: 'sh-nn-1',
          status: 'SUBMITTED',
          timestamp: '2026-10-18T10:24:00Z',
          note: 'Submitted for global distribution.',
          actor: 'Gautam Giri',
        },
        {
          id: 'sh-nn-2',
          status: 'VALIDATING',
          timestamp: '2026-10-18T10:25:00Z',
          note: 'Automated DDEX content audit passed.',
          actor: 'SONVÉRA Engine',
        },
        {
          id: 'sh-nn-3',
          status: 'PROCESSING',
          timestamp: '2026-10-18T10:30:00Z',
          note: 'SONVÉRA review and ingestion packaging completed.',
          actor: 'Ingest Hub',
        },
        {
          id: 'sh-nn-4',
          status: 'DELIVERED',
          timestamp: '2026-10-18T12:00:00Z',
          note: 'Delivered to all 8 target streaming platforms.',
          actor: 'SONVÉRA Gateway',
        },
        {
          id: 'sh-nn-5',
          status: 'LIVE',
          timestamp: '2026-10-18T14:00:00Z',
          note: 'Release is officially live worldwide.',
          actor: 'Global Streaming Network',
        }
      ],
      deliveryStatuses: [
        { dspId: 'spotify', dspName: 'Spotify', status: 'LIVE', liveAt: '2026-10-18T14:00:00Z' },
        { dspId: 'apple_music', dspName: 'Apple Music', status: 'LIVE', liveAt: '2026-10-18T14:00:00Z' },
        { dspId: 'youtube_music', dspName: 'YouTube Music', status: 'INGESTING' },
        { dspId: 'amazon_music', dspName: 'Amazon Music', status: 'INGESTING' },
        { dspId: 'jiosaavn', dspName: 'JioSaavn', status: 'LIVE', liveAt: '2026-10-18T14:00:00Z' },
        { dspId: 'deezer', dspName: 'Deezer', status: 'PENDING' },
        { dspId: 'tidal', dspName: 'TIDAL', status: 'INGESTING' },
        { dspId: 'meta', dspName: 'Instagram', status: 'LIVE', liveAt: '2026-10-18T14:00:00Z' },
      ],
      createdAt: '2026-10-18T10:00:00Z',
      updatedAt: '2026-10-18T14:00:00Z',
      submittedAt: '2026-10-18T10:24:00Z',
      liveAt: '2026-10-18T14:00:00Z',
    },
    {
      id: 'rel-after-dark',
      title: 'After Dark',
      releaseType: 'ep',
      primaryArtist: 'Gautam Giri',
      featuredArtists: [],
      labelName: 'Gautam Giri Productions',
      catalogNumber: 'GG-2026-02',
      upc: '793573194029',
      primaryGenre: 'Synthwave',
      secondaryGenre: 'Darksynth',
      language: 'English',
      explicitRating: 'clean',
      releaseDate: '2026-09-22',
      originalReleaseDate: '2026-09-22',
      isRemaster: false,
      artwork: {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
        width: 3000,
        height: 3000,
        colorSpace: 'RGB',
        format: 'JPEG',
        sizeBytes: 5120000,
        hasTextRestrictionsPassed: true,
      },
      tracks: [
        {
          id: 'trk-ad-01',
          trackNumber: 1,
          title: 'After Dark (Intro)',
          primaryArtist: 'Gautam Giri',
          featuredArtists: [],
          isrc: 'US-SVR-26-00201',
          isExplicit: false,
          isInstrumental: true,
          language: 'English',
          audioSpec: {
            fileName: 'After_Dark_Intro.wav',
            fileSizeBytes: 42000000,
            format: 'WAV',
            sampleRateHz: 48000,
            bitDepth: 24,
            channels: 'Stereo',
            durationSeconds: 180,
            peakLufs: -14.0,
            waveformSample: defaultWaveform,
          },
          contributors: [{ id: 'c-ad-1', name: 'Gautam Giri', role: 'Primary Artist', sharePercentage: 100 }],
          previewStartTimeSec: 20,
        }
      ],
      cLineYear: 2026,
      cLineOwner: 'Gautam Giri Productions',
      pLineYear: 2026,
      pLineOwner: 'Gautam Giri Productions',
      territoryOption: 'worldwide',
      selectedTerritories: ['WW'],
      selectedDsps: ['spotify', 'apple_music', 'youtube_music', 'amazon_music', 'tidal', 'deezer', 'jiosaavn'],
      status: 'LIVE',
      statusHistory: [
        { id: 'sh-ad-1', status: 'LIVE', timestamp: '2026-09-22T00:00:00Z', note: 'Live across 7/8 stores.', actor: 'System' },
      ],
      deliveryStatuses: [
        { dspId: 'spotify', dspName: 'Spotify', status: 'LIVE' },
        { dspId: 'apple_music', dspName: 'Apple Music', status: 'LIVE' },
        { dspId: 'youtube_music', dspName: 'YouTube Music', status: 'LIVE' },
        { dspId: 'amazon_music', dspName: 'Amazon Music', status: 'LIVE' },
        { dspId: 'tidal', dspName: 'TIDAL', status: 'LIVE' },
        { dspId: 'deezer', dspName: 'Deezer', status: 'LIVE' },
        { dspId: 'jiosaavn', dspName: 'JioSaavn', status: 'LIVE' },
      ],
      createdAt: '2026-09-10T09:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z',
    },
    {
      id: 'rel-lost-again',
      title: 'Lost Again',
      releaseType: 'single',
      primaryArtist: 'Gautam Giri',
      featuredArtists: [],
      labelName: 'Gautam Giri Productions',
      catalogNumber: 'GG-2026-03',
      upc: '793573194036',
      primaryGenre: 'Indie Electronic',
      secondaryGenre: 'Chillwave',
      language: 'English',
      explicitRating: 'clean',
      releaseDate: '2026-10-30',
      isRemaster: false,
      artwork: {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        width: 3000,
        height: 3000,
        colorSpace: 'RGB',
        format: 'PNG',
        sizeBytes: 6840000,
        hasTextRestrictionsPassed: true,
      },
      tracks: [
        {
          id: 'trk-la-01',
          trackNumber: 1,
          title: 'Lost Again',
          primaryArtist: 'Gautam Giri',
          featuredArtists: [],
          isrc: 'US-SVR-26-00301',
          isExplicit: false,
          isInstrumental: false,
          language: 'English',
          audioSpec: {
            fileName: 'Lost_Again_Master.wav',
            fileSizeBytes: 52000000,
            format: 'WAV',
            sampleRateHz: 48000,
            bitDepth: 24,
            channels: 'Stereo',
            durationSeconds: 215,
            peakLufs: -14.0,
            waveformSample: defaultWaveform,
          },
          contributors: [{ id: 'c-la-1', name: 'Gautam Giri', role: 'Primary Artist', sharePercentage: 100 }],
          previewStartTimeSec: 30,
        }
      ],
      cLineYear: 2026,
      cLineOwner: 'Gautam Giri Productions',
      pLineYear: 2026,
      pLineOwner: 'Gautam Giri Productions',
      territoryOption: 'worldwide',
      selectedTerritories: ['WW'],
      selectedDsps: ['spotify', 'apple_music', 'youtube_music', 'amazon_music', 'tidal', 'deezer', 'jiosaavn', 'meta'],
      status: 'PROCESSING',
      statusHistory: [
        { id: 'sh-la-1', status: 'PROCESSING', timestamp: '2026-10-25T11:00:00Z', note: 'Store ingestion active (3/8 completed).', actor: 'Ingest Hub' },
      ],
      deliveryStatuses: [
        { dspId: 'spotify', dspName: 'Spotify', status: 'INGESTING' },
        { dspId: 'apple_music', dspName: 'Apple Music', status: 'INGESTING' },
        { dspId: 'youtube_music', dspName: 'YouTube Music', status: 'INGESTING' },
      ],
      createdAt: '2026-10-20T14:00:00Z',
      updatedAt: '2026-10-25T11:00:00Z',
    },
    {
      id: 'rel-midnight-drive',
      title: 'Midnight Drive',
      releaseType: 'album',
      primaryArtist: 'Gautam Giri',
      featuredArtists: [],
      labelName: 'Gautam Giri Productions',
      catalogNumber: 'GG-2026-04',
      upc: '793573194043',
      primaryGenre: 'Synthwave',
      secondaryGenre: 'Outrun / Electronic',
      language: 'English',
      explicitRating: 'clean',
      releaseDate: '2026-08-05',
      isRemaster: false,
      artwork: {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        width: 3000,
        height: 3000,
        colorSpace: 'RGB',
        format: 'JPEG',
        sizeBytes: 4100000,
        hasTextRestrictionsPassed: true,
      },
      tracks: [
        {
          id: 'trk-md-01',
          trackNumber: 1,
          title: 'Highway Horizon',
          primaryArtist: 'Gautam Giri',
          featuredArtists: [],
          isrc: 'US-SVR-26-00401',
          isExplicit: false,
          isInstrumental: true,
          language: 'English',
          audioSpec: {
            fileName: 'Highway_Horizon.wav',
            fileSizeBytes: 68000000,
            format: 'WAV',
            sampleRateHz: 48000,
            bitDepth: 24,
            channels: 'Stereo',
            durationSeconds: 248,
            peakLufs: -14.0,
            waveformSample: defaultWaveform,
          },
          contributors: [{ id: 'c-md-1', name: 'Gautam Giri', role: 'Primary Artist', sharePercentage: 100 }],
          previewStartTimeSec: 35,
        }
      ],
      cLineYear: 2026,
      cLineOwner: 'Gautam Giri Productions',
      pLineYear: 2026,
      pLineOwner: 'Gautam Giri Productions',
      territoryOption: 'worldwide',
      selectedTerritories: ['WW'],
      selectedDsps: ['spotify', 'apple_music', 'youtube_music', 'amazon_music', 'tidal', 'deezer', 'jiosaavn', 'meta'],
      status: 'LIVE',
      statusHistory: [
        { id: 'sh-md-1', status: 'LIVE', timestamp: '2026-08-05T00:00:00Z', note: 'Album live across 8/8 stores worldwide.', actor: 'System' },
      ],
      deliveryStatuses: [
        { dspId: 'spotify', dspName: 'Spotify', status: 'LIVE' },
        { dspId: 'apple_music', dspName: 'Apple Music', status: 'LIVE' },
        { dspId: 'youtube_music', dspName: 'YouTube Music', status: 'LIVE' },
        { dspId: 'amazon_music', dspName: 'Amazon Music', status: 'LIVE' },
        { dspId: 'tidal', dspName: 'TIDAL', status: 'LIVE' },
        { dspId: 'deezer', dspName: 'Deezer', status: 'LIVE' },
        { dspId: 'jiosaavn', dspName: 'JioSaavn', status: 'LIVE' },
        { dspId: 'meta', dspName: 'Instagram', status: 'LIVE' },
      ],
      createdAt: '2026-07-25T10:00:00Z',
      updatedAt: '2026-08-05T00:00:00Z',
    }
  ],
  payouts: [
    {
      id: 'payout-001',
      amount: 5124.60,
      currency: 'USD',
      method: 'Stripe Direct',
      requestedAt: '2026-10-08T14:20:00Z',
      status: 'PROCESSED',
      accountReference: 'acct_1NZX****8892',
    }
  ],
  statusHistory: []
};

export function getDb(): DbSchema {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, resetting to initialData', err);
    saveDb(initialData);
    return initialData;
  }
}

export function saveDb(data: DbSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
