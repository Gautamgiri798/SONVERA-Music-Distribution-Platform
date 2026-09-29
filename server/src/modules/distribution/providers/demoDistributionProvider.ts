import {
  DistributionProvider,
  ValidationResult,
  ValidationIssue,
  ReleaseHealthScore,
  SubmissionResult,
  UpdateResult,
  TakedownResult,
} from './distributionProvider.interface.js';
import { getDb, saveDb } from '../../../lib/db.js';

export class DemoDistributionProvider implements DistributionProvider {
  name = 'DemoDistributionProvider';
  providerId = 'snvr-sandbox-ern43';
  isDemo = true;
  version = '1.0-ERN4.3-September-2026';

  async validateRelease(releaseId: string): Promise<ValidationResult> {
    const db = getDb();
    const release = db.releases.find((r: any) => r.id === releaseId);

    if (!release) {
      throw new Error(`Release not found: ${releaseId}`);
    }

    const issues: ValidationIssue[] = [];
    let audioScore = 20;
    let artworkScore = 20;
    let metadataScore = 20;
    let copyrightScore = 15;
    let contributorScore = 15;
    let distributionScore = 10;
    let passedChecks = 0;
    const totalChecks = 16;

    // 1. Audio validation
    if (!release.tracks || release.tracks.length === 0) {
      issues.push({
        id: 'aud-no-tracks',
        category: 'Audio',
        severity: 'error',
        field: 'tracks',
        message: 'No audio tracks found in this release package.',
        recommendation: 'Add at least 1 audio track with high-resolution master file.',
        fixActionStep: 2,
      });
      audioScore = 0;
    } else {
      let audioValid = true;
      release.tracks.forEach((track: any, idx: number) => {
        if (!track.audioSpec) {
          issues.push({
            id: `aud-missing-${track.id}`,
            category: 'Audio',
            severity: 'error',
            field: `tracks[${idx}].audioSpec`,
            trackId: track.id,
            message: `Track "${track.title}" is missing an uploaded master audio file.`,
            recommendation: 'Upload an uncompressed 24-bit/44.1kHz or 48kHz WAV/FLAC audio file.',
            fixActionStep: 2,
          });
          audioValid = false;
        } else {
          if (track.audioSpec.sampleRateHz < 44100) {
            issues.push({
              id: `aud-sample-rate-${track.id}`,
              category: 'Audio',
              severity: 'error',
              field: `tracks[${idx}].audioSpec.sampleRateHz`,
              trackId: track.id,
              message: `Track "${track.title}" sample rate (${track.audioSpec.sampleRateHz}Hz) is below minimum 44.1kHz.`,
              recommendation: 'Re-export master at 44.1kHz or 48kHz.',
              fixActionStep: 2,
            });
            audioValid = false;
          }
          if (track.audioSpec.bitDepth < 16) {
            issues.push({
              id: `aud-bit-depth-${track.id}`,
              category: 'Audio',
              severity: 'error',
              field: `tracks[${idx}].audioSpec.bitDepth`,
              trackId: track.id,
              message: `Track "${track.title}" bit depth is ${track.audioSpec.bitDepth}-bit. Minimum 16-bit required.`,
              recommendation: 'Upload 16-bit or 24-bit master recording.',
              fixActionStep: 2,
            });
            audioValid = false;
          }
        }
      });
      if (audioValid) passedChecks += 3;
      else audioScore = Math.max(0, audioScore - 12);
    }

    // 2. Artwork validation
    if (!release.artwork || !release.artwork.url) {
      issues.push({
        id: 'art-missing',
        category: 'Artwork',
        severity: 'error',
        field: 'artwork',
        message: 'Cover artwork is missing.',
        recommendation: 'Upload a square cover art image of at least 3000 x 3000 pixels.',
        fixActionStep: 3,
      });
      artworkScore = 0;
    } else {
      const art = release.artwork;
      if (art.width < 3000 || art.height < 3000) {
        issues.push({
          id: 'art-res-low',
          category: 'Artwork',
          severity: 'error',
          field: 'artwork.resolution',
          message: `Artwork resolution (${art.width}x${art.height}px) is below the DSP 3000x3000px minimum standard.`,
          recommendation: 'Provide high-resolution square artwork at exactly 3000x3000px or larger.',
          fixActionStep: 3,
        });
        artworkScore -= 10;
      } else {
        passedChecks += 1;
      }

      if (art.colorSpace === 'CMYK') {
        issues.push({
          id: 'art-cmyk',
          category: 'Artwork',
          severity: 'error',
          field: 'artwork.colorSpace',
          message: 'Artwork is in CMYK color profile. Streaming DSPs require sRGB.',
          recommendation: 'Convert artwork color space to sRGB.',
          fixActionStep: 3,
        });
        artworkScore -= 5;
      } else {
        passedChecks += 1;
      }
    }

    // 3. Metadata validation
    if (!release.title || release.title.trim().length === 0) {
      issues.push({
        id: 'meta-title-empty',
        category: 'Metadata',
        severity: 'error',
        field: 'title',
        message: 'Release title cannot be empty.',
        recommendation: 'Enter the official release title.',
        fixActionStep: 4,
      });
      metadataScore -= 8;
    } else {
      passedChecks += 1;
    }

    if (!release.primaryArtist || release.primaryArtist.trim().length === 0) {
      issues.push({
        id: 'meta-artist-empty',
        category: 'Metadata',
        severity: 'error',
        field: 'primaryArtist',
        message: 'Primary artist name is required.',
        recommendation: 'Specify the primary billing artist for this release.',
        fixActionStep: 4,
      });
      metadataScore -= 6;
    } else {
      passedChecks += 1;
    }

    // ISRC check
    const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/;
    (release.tracks || []).forEach((tr: any, i: number) => {
      if (!tr.isrc || tr.isrc.trim() === '') {
        issues.push({
          id: `meta-isrc-missing-${tr.id}`,
          category: 'Metadata',
          severity: 'error',
          field: `tracks[${i}].isrc`,
          trackId: tr.id,
          message: `ISRC is missing for Track ${tr.trackNumber}: "${tr.title}".`,
          recommendation: 'Generate an automatic SONVÉRA ISRC or input an existing assigned code.',
          fixActionStep: 4,
        });
        metadataScore = Math.max(0, metadataScore - 6);
      } else if (!isrcRegex.test(tr.isrc)) {
        issues.push({
          id: `meta-isrc-format-${tr.id}`,
          category: 'Metadata',
          severity: 'warning',
          field: `tracks[${i}].isrc`,
          trackId: tr.id,
          message: `ISRC "${tr.isrc}" format recommendation: 12 alphanumeric characters (e.g. US-SVR-26-00001).`,
          recommendation: 'Confirm ISRC conforms to standard.',
          fixActionStep: 4,
        });
        metadataScore = Math.max(0, metadataScore - 2);
      } else {
        passedChecks += 1;
      }
    });

    // 4. Contributors & Splits (must sum to 100%)
    (release.tracks || []).forEach((track: any, idx: number) => {
      if (!track.contributors || track.contributors.length === 0) {
        issues.push({
          id: `con-no-contributors-${track.id}`,
          category: 'Contributors',
          severity: 'error',
          field: `tracks[${idx}].contributors`,
          trackId: track.id,
          message: `Track "${track.title}" has no listed songwriting or production contributors.`,
          recommendation: 'Add writers, composers, and producers for publishing and royalty splits.',
          fixActionStep: 5,
        });
        contributorScore = Math.max(0, contributorScore - 8);
      } else {
        const totalSplit = track.contributors.reduce(
          (sum: number, c: any) => sum + (Number(c.sharePercentage) || 0),
          0
        );
        if (Math.abs(totalSplit - 100) > 0.01) {
          issues.push({
            id: `con-splits-unequal-${track.id}`,
            category: 'Contributors',
            severity: 'error',
            field: `tracks[${idx}].contributors.sharePercentage`,
            trackId: track.id,
            message: `Royalty split total for Track "${track.title}" is ${totalSplit.toFixed(1)}%. Must total exactly 100.0%.`,
            recommendation: 'Rebalance contributor mechanical share percentages so they sum to 100%.',
            fixActionStep: 5,
          });
          contributorScore = Math.max(0, contributorScore - 10);
        } else {
          passedChecks += 1;
        }
      }
    });

    // 5. Distribution destinations check
    if (!release.selectedDsps || release.selectedDsps.length === 0) {
      issues.push({
        id: 'dst-no-dsps',
        category: 'Distribution',
        severity: 'error',
        field: 'selectedDsps',
        message: 'No digital service providers (DSPs) selected for distribution.',
        recommendation: 'Select at least one destination (e.g. Spotify, Apple Music, JioSaavn).',
        fixActionStep: 6,
      });
      distributionScore = 0;
    } else {
      passedChecks += 1;
    }

    const overallScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          audioScore +
            artworkScore +
            metadataScore +
            copyrightScore +
            contributorScore +
            distributionScore
        )
      )
    );

    const hasErrors = issues.some((i) => i.severity === 'error');
    const canSubmit = !hasErrors && overallScore >= 80;

    const healthScore: ReleaseHealthScore = {
      overallScore,
      breakdown: {
        audio: Math.max(0, audioScore),
        artwork: Math.max(0, artworkScore),
        metadata: Math.max(0, metadataScore),
        copyright: Math.max(0, copyrightScore),
        contributors: Math.max(0, contributorScore),
        distributionReadiness: Math.max(0, distributionScore),
      },
      passedChecks: Math.min(totalChecks, passedChecks),
      totalChecks,
    };

    return {
      isValid: !hasErrors,
      canSubmit,
      issues,
      healthScore,
      evaluatedAt: new Date().toISOString(),
    };
  }

  async submitRelease(releaseId: string): Promise<SubmissionResult> {
    const db = getDb();
    const index = db.releases.findIndex((r: any) => r.id === releaseId);

    if (index === -1) {
      throw new Error(`Release not found: ${releaseId}`);
    }

    const release = db.releases[index];
    const batchId = `BATCH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${Date.now().toString(36).toUpperCase()}`;
    const ddexMessageId = `DDEX-ERN43-SVR-${release.upc || 'UPC'}-${Date.now()}`;
    const targetDsps = release.selectedDsps || ['spotify', 'apple_music', 'youtube_music', 'amazon_music'];

    const logSummary = [
      `[${new Date().toISOString()}] Initiated delivery batch ${batchId} via DemoDistributionProvider.`,
      `[${new Date().toISOString()}] Generated DDEX ERN 4.3 XML package (${release.tracks?.length || 1} sound recordings).`,
      `[${new Date().toISOString()}] Checksums verified for 24-bit audio masters and 3000x3000px artwork.`,
      `[${new Date().toISOString()}] Ingestion state set to PROCESSING across ${targetDsps.length} DSP store targets.`,
    ];

    // Update release in database according to State Machine (DRAFT -> READY -> SUBMITTED -> PROCESSING)
    const updated = {
      ...release,
      status: 'PROCESSING',
      submittedAt: new Date().toISOString(),
      statusHistory: [
        ...(release.statusHistory || []),
        {
          id: `sh-sub-${Date.now()}`,
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          note: `Submitted for DDEX ERN 4.3 distribution to ${targetDsps.length} DSPs. Batch ID: ${batchId}`,
          actor: release.primaryArtist,
          batchId,
        },
        {
          id: `sh-proc-${Date.now()}`,
          status: 'PROCESSING',
          timestamp: new Date().toISOString(),
          note: 'Ingestion pipeline converting DDEX feeds and packaging WAV audio packages.',
          actor: 'SONVÉRA Sandbox Hub',
        },
      ],
      deliveryStatuses: targetDsps.map((dspId: string) => ({
        dspId,
        dspName: dspId.replace('_', ' ').toUpperCase(),
        status: 'INGESTING',
        deliveryBatchId: batchId,
        deliveredAt: new Date().toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    };

    db.releases[index] = updated;
    saveDb(db);

    return {
      submissionId,
      batchId,
      releaseId,
      status: 'PROCESSING',
      targetDsps,
      submittedAt: new Date().toISOString(),
      ddexMessageId,
      logSummary,
    };
  }

  async getDeliveryStatus(submissionId: string): Promise<any> {
    return {
      submissionId,
      status: 'PROCESSING',
      platforms: [
        { dsp: 'Spotify', status: 'LIVE' },
        { dsp: 'Apple Music', status: 'LIVE' },
        { dsp: 'YouTube Music', status: 'INGESTING' },
        { dsp: 'Amazon Music', status: 'INGESTING' },
      ],
    };
  }

  async updateRelease(releaseId: string): Promise<UpdateResult> {
    return {
      success: true,
      releaseId,
      updatedAt: new Date().toISOString(),
      message: 'Metadata successfully synchronized with DemoDistributionProvider.',
    };
  }

  async requestTakedown(releaseId: string): Promise<TakedownResult> {
    const db = getDb();
    const index = db.releases.findIndex((r: any) => r.id === releaseId);

    if (index === -1) {
      throw new Error(`Release not found: ${releaseId}`);
    }

    const release = db.releases[index];
    const takedownId = `TKD-${Date.now().toString(36).toUpperCase()}`;

    const updated = {
      ...release,
      status: 'TAKEDOWN_REQUESTED',
      statusHistory: [
        ...(release.statusHistory || []),
        {
          id: `sh-tkd-${Date.now()}`,
          status: 'TAKEDOWN_REQUESTED',
          timestamp: new Date().toISOString(),
          note: `Takedown notice broadcast to all connected DSP stores. Reference: ${takedownId}`,
          actor: release.primaryArtist,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    db.releases[index] = updated;
    saveDb(db);

    return {
      success: true,
      releaseId,
      takedownId,
      broadcastAt: new Date().toISOString(),
      targetDsps: release.selectedDsps || [],
      message: 'Formal takedown notice broadcast to all partner endpoints.',
    };
  }

  generateDdexPackage(release: any): string {
    const timestamp = new Date().toISOString();
    const messageId = `ERN43_SONVERA_${release.upc || 'UPC'}_${Date.now()}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/43" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" MessageSchemaVersionId="ern/43" LanguageAndScriptCode="en">
  <MessageHeader>
    <MessageThreadId>${messageId}</MessageThreadId>
    <MessageId>${messageId}</MessageId>
    <MessageSender>
      <PartyId Namespace="PADPIDA">PADPIDA2026SONVERA01</PartyId>
      <PartyName>
        <FullName>SONVÉRA Global Music Distribution Platform (Demo Provider)</FullName>
      </PartyName>
    </MessageSender>
    <MessageRecipient>
      <PartyId Namespace="PADPIDA">DSP_AGGREGATOR_INSPECTOR</PartyId>
      <PartyName>
        <FullName>Global DSP Partner Gateway</FullName>
      </PartyName>
    </MessageRecipient>
    <MessageCreatedDateTime>${timestamp}</MessageCreatedDateTime>
    <Comment>Automated DDEX ERN 4.3 export generated by SONVÉRA</Comment>
  </MessageHeader>

  <PartyList>
    <Party>
      <PartyReference>P_ARTIST_1</PartyReference>
      <PartyName>
        <FullName>${release.primaryArtist || 'Unknown Artist'}</FullName>
      </PartyName>
    </Party>
    <Party>
      <PartyReference>P_LABEL_1</PartyReference>
      <PartyName>
        <FullName>${release.labelName || 'Independent'}</FullName>
      </PartyName>
    </Party>
  </PartyList>

  <ResourceList>
${(release.tracks || [])
  .map(
    (t: any, idx: number) => `    <SoundRecording>
      <ResourceReference>A_${idx + 1}</ResourceReference>
      <Type>MusicalWorkSoundRecording</Type>
      <SoundRecordingId>
        <ISRC>${t.isrc || 'PENDING'}</ISRC>
      </SoundRecordingId>
      <DisplayTitleText>${t.title}</DisplayTitleText>
      <DisplayArtistName>${t.primaryArtist || release.primaryArtist}</DisplayArtistName>
      <Duration>PT${Math.floor((t.audioSpec?.durationSeconds || 180) / 60)}M${(t.audioSpec?.durationSeconds || 180) % 60}S</Duration>
      <SoundRecordingDetailsByTerritory>
        <TerritoryCode>Worldwide</TerritoryCode>
        <Title TitleType="FormalTitle">
          <TitleText>${t.title}</TitleText>
        </Title>
        <DisplayArtist>
          <PartyReference>P_ARTIST_1</PartyReference>
          <ArtistRole>MainArtist</ArtistRole>
        </DisplayArtist>
        <PLine>
          <Year>${release.pLineYear || 2026}</Year>
          <PLineCompany>${release.pLineOwner || release.primaryArtist}</PLineCompany>
        </PLine>
        <Genre>
          <GenreText>${release.primaryGenre || 'Electronic'}</GenreText>
        </Genre>
        <ParentalWarningType>${t.isExplicit ? 'Explicit' : 'NotExplicit'}</ParentalWarningType>
      </SoundRecordingDetailsByTerritory>
    </SoundRecording>`
  )
  .join('\n')}
    <Image>
      <ResourceReference>IMG_FRONT_COVER</ResourceReference>
      <Type>FrontCoverImage</Type>
      <ImageDetailsByTerritory>
        <TerritoryCode>Worldwide</TerritoryCode>
        <TechnicalDetails>
          <TechnicalResourceDetailsReference>T_IMG</TechnicalResourceDetailsReference>
          <ImageCodecType>${release.artwork?.format || 'JPEG'}</ImageCodecType>
          <ImageHeight>${release.artwork?.height || 3000}</ImageHeight>
          <ImageWidth>${release.artwork?.width || 3000}</ImageWidth>
        </TechnicalDetails>
      </ImageDetailsByTerritory>
    </Image>
  </ResourceList>

  <ReleaseList>
    <Release>
      <ReleaseReference>R_MAIN</ReleaseReference>
      <ReleaseId>
        <ICPN>${release.upc || 'NOUPC'}</ICPN>
        <CatalogNumber>${release.catalogNumber || 'SVR-001'}</CatalogNumber>
      </ReleaseId>
      <ReferenceTitle>
        <TitleText>${release.title}</TitleText>
      </ReferenceTitle>
      <ReleaseType>${(release.releaseType || 'single').toUpperCase()}</ReleaseType>
      <ReleaseDetailsByTerritory>
        <TerritoryCode>Worldwide</TerritoryCode>
        <DisplayArtistName>${release.primaryArtist}</DisplayArtistName>
        <LabelName>${release.labelName || 'Independent'}</LabelName>
        <CLine>
          <Year>${release.cLineYear || 2026}</Year>
          <CLineCompany>${release.cLineOwner || release.primaryArtist}</CLineCompany>
        </CLine>
        <OriginalReleaseDate>${release.releaseDate || '2026-10-18'}</OriginalReleaseDate>
      </ReleaseDetailsByTerritory>
    </Release>
  </ReleaseList>
</ern:NewReleaseMessage>`;
  }
}

export const demoDistributionProvider = new DemoDistributionProvider();
