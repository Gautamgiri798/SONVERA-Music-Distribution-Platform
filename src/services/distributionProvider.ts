import {
  DistributionProvider,
  Release,
  ValidationResult,
  ValidationIssue,
  ReleaseHealthScore,
  DeliveryBatch,
  DspDeliveryStatus,
  DistributionStatus,
  DspIdentifier
} from '../types';

export class SonveraDemoProvider implements DistributionProvider {
  name = 'SONVÉRA Sandbox Distribution Engine';
  providerId = 'snvr-sandbox-v2';
  isDemo = true;
  version = '2026.4.1-ERN4.3';

  async validateRelease(release: Release): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let audioScore = 20;
    let artworkScore = 20;
    let metadataScore = 20;
    let copyrightScore = 15;
    let contributorScore = 15;
    let distributionScore = 10;

    let passedChecks = 0;
    const totalChecks = 16;

    // 1. Audio Validation
    if (!release.tracks || release.tracks.length === 0) {
      issues.push({
        id: 'aud-no-tracks',
        category: 'Audio',
        severity: 'error',
        field: 'tracks',
        message: 'No audio tracks found in this release package.',
        recommendation: 'Add at least 1 audio track with high-resolution master file.',
        fixActionStep: 3,
      });
      audioScore = 0;
    } else {
      let audioValid = true;
      release.tracks.forEach((track, idx) => {
        if (!track.audioSpec) {
          issues.push({
            id: `aud-missing-${track.id}`,
            category: 'Audio',
            severity: 'error',
            field: `tracks[${idx}].audioSpec`,
            trackId: track.id,
            message: `Track "${track.title}" is missing an uploaded master audio file.`,
            recommendation: 'Upload an uncompressed 24-bit/44.1kHz or 48kHz WAV/FLAC audio file.',
            fixActionStep: 3,
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
              message: `Track "${track.title}" has a sample rate of ${track.audioSpec.sampleRateHz}Hz. DSPs require minimum 44.1kHz.`,
              recommendation: 'Re-export master at 44.1kHz, 48kHz, or 96kHz.',
              fixActionStep: 3,
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
              message: `Track "${track.title}" bit depth is ${track.audioSpec.bitDepth}-bit. Minimum 16-bit required (24-bit recommended).`,
              recommendation: 'Upload a 16-bit or 24-bit master recording.',
              fixActionStep: 3,
            });
            audioValid = false;
          }
          if (track.audioSpec.durationSeconds < 10) {
            issues.push({
              id: `aud-duration-${track.id}`,
              category: 'Audio',
              severity: 'warning',
              field: `tracks[${idx}].audioSpec.durationSeconds`,
              trackId: track.id,
              message: `Track "${track.title}" is shorter than 10 seconds. Streaming services may flag this as ringtone/snippet.`,
              recommendation: 'Verify track length or flag as interlude if intentional.',
              fixActionStep: 3,
            });
          }
        }
      });
      if (audioValid) {
        passedChecks += 3;
      } else {
        audioScore = Math.max(0, audioScore - 12);
      }
    }

    // 2. Artwork Validation
    if (!release.artwork || !release.artwork.url) {
      issues.push({
        id: 'art-missing',
        category: 'Artwork',
        severity: 'error',
        field: 'artwork',
        message: 'Cover artwork is missing.',
        recommendation: 'Upload a square cover art image of at least 3000 x 3000 pixels.',
        fixActionStep: 2,
      });
      artworkScore = 0;
    } else {
      const art = release.artwork;
      let artValid = true;
      if (art.width < 3000 || art.height < 3000) {
        issues.push({
          id: 'art-res-low',
          category: 'Artwork',
          severity: 'error',
          field: 'artwork.resolution',
          message: `Artwork resolution (${art.width}x${art.height}px) is below the DSP 3000x3000px minimum standard.`,
          recommendation: 'Provide high-resolution square artwork at exactly 3000x3000px or larger.',
          fixActionStep: 2,
        });
        artValid = false;
        artworkScore -= 10;
      } else {
        passedChecks += 1;
      }

      if (art.width !== art.height) {
        issues.push({
          id: 'art-aspect-ratio',
          category: 'Artwork',
          severity: 'error',
          field: 'artwork.aspectRatio',
          message: 'Artwork is not a perfect 1:1 square ratio.',
          recommendation: 'Crop your artwork to an exact 1:1 square ratio before submission.',
          fixActionStep: 2,
        });
        artValid = false;
        artworkScore -= 5;
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
          recommendation: 'Convert artwork color space to sRGB in Photoshop or your image editor.',
          fixActionStep: 2,
        });
        artValid = false;
        artworkScore -= 5;
      } else {
        passedChecks += 1;
      }

      if (!art.hasTextRestrictionsPassed) {
        issues.push({
          id: 'art-text-guidelines',
          category: 'Artwork',
          severity: 'warning',
          field: 'artwork.text',
          message: 'Artwork visual check flagged potential external URLs, social handles, or store logos.',
          recommendation: 'Ensure your cover art does not include barcodes, pricing, website URLs, or competitor streaming logos.',
          fixActionStep: 2,
        });
        artworkScore -= 4;
      } else {
        passedChecks += 1;
      }
    }

    // 3. Metadata Validation
    if (!release.title || release.title.trim().length === 0) {
      issues.push({
        id: 'meta-title-empty',
        category: 'Metadata',
        severity: 'error',
        field: 'title',
        message: 'Release title cannot be empty.',
        recommendation: 'Enter the official release title.',
        fixActionStep: 1,
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
        fixActionStep: 1,
      });
      metadataScore -= 6;
    } else {
      passedChecks += 1;
    }

    if (!release.primaryGenre) {
      issues.push({
        id: 'meta-genre-empty',
        category: 'Metadata',
        severity: 'error',
        field: 'primaryGenre',
        message: 'Primary genre is required for DSP algorithmic categorization.',
        recommendation: 'Select a primary genre (e.g., Electronic, Indie Pop, Hip-Hop).',
        fixActionStep: 1,
      });
      metadataScore -= 4;
    } else {
      passedChecks += 1;
    }

    // ISRC check per track
    const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/;
    release.tracks.forEach((tr, i) => {
      if (!tr.isrc || tr.isrc.trim() === '') {
        issues.push({
          id: `meta-isrc-missing-${tr.id}`,
          category: 'Metadata',
          severity: 'error',
          field: `tracks[${i}].isrc`,
          trackId: tr.id,
          message: `ISRC is missing for Track ${tr.trackNumber}: "${tr.title}".`,
          recommendation: 'Generate an automatic SONVÉRA ISRC or input an existing assigned code.',
          fixActionStep: 3,
        });
        metadataScore = Math.max(0, metadataScore - 6);
      } else if (!isrcRegex.test(tr.isrc)) {
        issues.push({
          id: `meta-isrc-format-${tr.id}`,
          category: 'Metadata',
          severity: 'warning',
          field: `tracks[${i}].isrc`,
          trackId: tr.id,
          message: `ISRC "${tr.isrc}" does not match standard 12-character format (e.g. US-SVR-26-00001).`,
          recommendation: 'Confirm ISRC formatting: 2-char country, 3-char registrant, 2-digit year, 5-digit designation.',
          fixActionStep: 3,
        });
        metadataScore = Math.max(0, metadataScore - 2);
      } else {
        passedChecks += 1;
      }
    });

    // Release Date lead time check
    const releaseTime = new Date(release.releaseDate).getTime();
    const nowTime = new Date().getTime();
    const daysUntilRelease = Math.ceil((releaseTime - nowTime) / (1000 * 60 * 60 * 24));

    if (isNaN(releaseTime)) {
      issues.push({
        id: 'meta-date-invalid',
        category: 'Metadata',
        severity: 'error',
        field: 'releaseDate',
        message: 'Release date is invalid or not specified.',
        recommendation: 'Choose a valid calendar release date.',
        fixActionStep: 1,
      });
      metadataScore -= 6;
    } else if (daysUntilRelease < 7) {
      issues.push({
        id: 'meta-date-rush',
        category: 'Metadata',
        severity: 'warning',
        field: 'releaseDate',
        message: `Release date is in ${daysUntilRelease} days. Spotify and Apple Music require at least 14 days lead time for playlist editorial consideration.`,
        recommendation: 'For best streaming playlist pitching, schedule releases at least 14-21 days in advance.',
        fixActionStep: 1,
      });
      metadataScore -= 2;
    } else {
      passedChecks += 1;
    }

    // 4. Copyright & Publishing Validation
    if (!release.pLineOwner || release.pLineOwner.trim() === '') {
      issues.push({
        id: 'cpr-pline-missing',
        category: 'Copyright',
        severity: 'error',
        field: 'pLineOwner',
        message: '℗ Sound Recording Copyright (P-Line) owner is required.',
        recommendation: 'Enter the master rights holder (e.g., Artist Name or Record Label).',
        fixActionStep: 5,
      });
      copyrightScore -= 8;
    } else {
      passedChecks += 1;
    }

    if (!release.cLineOwner || release.cLineOwner.trim() === '') {
      issues.push({
        id: 'cpr-cline-missing',
        category: 'Copyright',
        severity: 'error',
        field: 'cLineOwner',
        message: '© Packaging / Artwork Copyright (C-Line) owner is required.',
        recommendation: 'Enter the visual/cover copyright owner.',
        fixActionStep: 5,
      });
      copyrightScore -= 7;
    } else {
      passedChecks += 1;
    }

    // 5. Contributors & Splits Validation (Must equal 100%)
    release.tracks.forEach((track, idx) => {
      if (!track.contributors || track.contributors.length === 0) {
        issues.push({
          id: `con-no-contributors-${track.id}`,
          category: 'Contributors',
          severity: 'error',
          field: `tracks[${idx}].contributors`,
          trackId: track.id,
          message: `Track "${track.title}" has no listed songwriting or production contributors.`,
          recommendation: 'Add writers, composers, and producers for publishing and royalty splits.',
          fixActionStep: 4,
        });
        contributorScore = Math.max(0, contributorScore - 8);
      } else {
        const totalSplit = track.contributors.reduce(
          (sum, c) => sum + (Number(c.sharePercentage) || 0),
          0
        );
        if (Math.abs(totalSplit - 100) > 0.01) {
          issues.push({
            id: `con-splits-unequal-${track.id}`,
            category: 'Contributors',
            severity: 'error',
            field: `tracks[${idx}].contributors.sharePercentage`,
            trackId: track.id,
            message: `Royalty split total for Track "${track.title}" is ${totalSplit.toFixed(1)}%. All splits must total exactly 100.0%.`,
            recommendation: 'Rebalance contributor mechanical share percentages so they sum to 100%.',
            fixActionStep: 4,
          });
          contributorScore = Math.max(0, contributorScore - 10);
        } else {
          passedChecks += 1;
        }

        const hasWriter = track.contributors.some(
          (c) =>
            c.role === 'Songwriter / Composer' ||
            c.role === 'Lyricist' ||
            c.role === 'Primary Artist'
        );
        if (!hasWriter) {
          issues.push({
            id: `con-no-writer-${track.id}`,
            category: 'Contributors',
            severity: 'warning',
            field: `tracks[${idx}].contributors`,
            trackId: track.id,
            message: `Track "${track.title}" is missing an explicitly credited Songwriter/Composer.`,
            recommendation: 'PRO societies (ASCAP/BMI/PRS) require accredited composers.',
            fixActionStep: 4,
          });
        }
      }
    });

    // 6. Distribution Readiness
    if (!release.selectedDsps || release.selectedDsps.length === 0) {
      issues.push({
        id: 'dst-no-dsps',
        category: 'Distribution',
        severity: 'error',
        field: 'selectedDsps',
        message: 'No digital service providers (DSPs) selected for distribution.',
        recommendation: 'Select at least one destination (e.g. Spotify, Apple Music, Tidal).',
        fixActionStep: 6,
      });
      distributionScore = 0;
    } else {
      passedChecks += 1;
    }

    if (release.territoryOption === 'custom' && (!release.selectedTerritories || release.selectedTerritories.length === 0)) {
      issues.push({
        id: 'dst-no-territories',
        category: 'Distribution',
        severity: 'error',
        field: 'selectedTerritories',
        message: 'Custom territories selected but no countries specified.',
        recommendation: 'Select target territories or switch to "Worldwide" distribution.',
        fixActionStep: 5,
      });
      distributionScore -= 5;
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

  async submitRelease(
    release: Release,
    dspIds: DspIdentifier[]
  ): Promise<DeliveryBatch> {
    const batchId = `BATCH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ddexMessageId = `DDEX-ERN43-SVR-${release.upc || 'UPC'}-${Date.now()}`;

    const logSummary = [
      `[${new Date().toISOString()}] Initiated delivery batch ${batchId} via SONVÉRA Sandbox Provider.`,
      `[${new Date().toISOString()}] Generated DDEX ERN 4.3 XML package (${release.tracks.length} sound recordings, 1 visual artwork asset).`,
      `[${new Date().toISOString()}] Verified checksums (SHA-256) for audio masters & 3000x3000px artwork package.`,
      `[${new Date().toISOString()}] Dispatched to DSP endpoints: ${dspIds.join(', ')}.`,
      `[${new Date().toISOString()}] Sandbox ingestion pipeline status: QUEUED for DSP catalog matching.`,
    ];

    return {
      batchId,
      releaseId: release.id,
      submittedAt: new Date().toISOString(),
      targetDsps: dspIds,
      ddexMessageId,
      status: 'QUEUED',
      logSummary,
    };
  }

  async getStatus(releaseId: string): Promise<DistributionStatus> {
    // In our live state, status is driven by release entity
    return 'PROCESSING';
  }

  async updateMetadata(
    _releaseId: string,
    _updates: Partial<Release>
  ): Promise<boolean> {
    return true;
  }

  async takeDownRelease(_releaseId: string, _reason: string): Promise<boolean> {
    return true;
  }

  async getDeliveryStatus(releaseId: string): Promise<DspDeliveryStatus[]> {
    // Sandbox default status simulator
    const dspList: DspIdentifier[] = [
      'spotify',
      'apple_music',
      'youtube_music',
      'amazon_music',
      'tidal',
      'deezer',
      'jiosaavn',
      'tiktok',
      'meta',
    ];

    return dspList.map((dspId) => ({
      dspId,
      dspName: dspId.replace('_', ' ').toUpperCase(),
      status: 'LIVE',
      deliveryBatchId: `SB-${releaseId.slice(0, 6)}`,
      deliveredAt: new Date().toISOString(),
      liveAt: new Date().toISOString(),
    }));
  }

  generateDdexPackage(release: Release): string {
    const timestamp = new Date().toISOString();
    const messageId = `ERN43_SONVERA_${release.upc || 'NOUPC'}_${Date.now()}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/43" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" MessageSchemaVersionId="ern/43" LanguageAndScriptCode="en">
  <MessageHeader>
    <MessageThreadId>${messageId}</MessageThreadId>
    <MessageId>${messageId}</MessageId>
    <MessageSender>
      <PartyId Namespace="PADPIDA">PADPIDA2026SONVERA01</PartyId>
      <PartyName>
        <FullName>SONVÉRA Global Music Distribution Platform (Sandbox)</FullName>
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
        <FullName>${this.escapeXml(release.primaryArtist)}</FullName>
      </PartyName>
    </Party>
    <Party>
      <PartyReference>P_LABEL_1</PartyReference>
      <PartyName>
        <FullName>${this.escapeXml(release.labelName || 'Independent')}</FullName>
      </PartyName>
    </Party>
  </PartyList>

  <ResourceList>
${release.tracks
  .map(
    (t, idx) => `    <SoundRecording>
      <ResourceReference>A_${idx + 1}</ResourceReference>
      <Type>MusicalWorkSoundRecording</Type>
      <SoundRecordingId>
        <ISRC>${t.isrc || 'PENDING'}</ISRC>
      </SoundRecordingId>
      <DisplayTitleText>${this.escapeXml(t.title)}</DisplayTitleText>
      <DisplayArtistName>${this.escapeXml(t.primaryArtist)}</DisplayArtistName>
      <Duration>PT${Math.floor((t.audioSpec?.durationSeconds || 180) / 60)}M${(t.audioSpec?.durationSeconds || 180) % 60}S</Duration>
      <SoundRecordingDetailsByTerritory>
        <TerritoryCode>Worldwide</TerritoryCode>
        <Title TitleType="FormalTitle">
          <TitleText>${this.escapeXml(t.title)}</TitleText>
        </Title>
        <DisplayArtist>
          <PartyReference>P_ARTIST_1</PartyReference>
          <ArtistRole>MainArtist</ArtistRole>
        </DisplayArtist>
        <PLine>
          <Year>${release.pLineYear || 2026}</Year>
          <PLineCompany>${this.escapeXml(release.pLineOwner || release.primaryArtist)}</PLineCompany>
        </PLine>
        <Genre>
          <GenreText>${this.escapeXml(release.primaryGenre)}</GenreText>
        </Genre>
        <ParentalWarningType>${t.isExplicit ? 'Explicit' : 'NotExplicit'}</ParentalWarningType>
        <TechnicalDetails>
          <TechnicalResourceDetailsReference>T_${idx + 1}</TechnicalResourceDetailsReference>
          <AudioCodecType>WAV</AudioCodecType>
          <BitDepth>${t.audioSpec?.bitDepth || 24}</BitDepth>
          <SamplingRate UnitOfMeasure="Hz">${t.audioSpec?.sampleRateHz || 44100}</SamplingRate>
          <NumberOfChannels>2</NumberOfChannels>
        </TechnicalDetails>
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
        <CatalogNumber>${this.escapeXml(release.catalogNumber || 'SVR-001')}</CatalogNumber>
      </ReleaseId>
      <ReferenceTitle>
        <TitleText>${this.escapeXml(release.title)}</TitleText>
      </ReferenceTitle>
      <ReleaseResourceReferenceList>
${release.tracks.map((_, i) => `        <ReleaseResourceReference ReleaseResourceType="PrimaryResource">A_${i + 1}</ReleaseResourceReference>`).join('\n')}
        <ReleaseResourceReference ReleaseResourceType="SecondaryResource">IMG_FRONT_COVER</ReleaseResourceReference>
      </ReleaseResourceReferenceList>
      <ReleaseType>${release.releaseType.toUpperCase()}</ReleaseType>
      <ReleaseDetailsByTerritory>
        <TerritoryCode>${release.territoryOption === 'worldwide' ? 'Worldwide' : release.selectedTerritories.join(' ')}</TerritoryCode>
        <DisplayArtistName>${this.escapeXml(release.primaryArtist)}</DisplayArtistName>
        <LabelName>${this.escapeXml(release.labelName || 'Independent')}</LabelName>
        <CLine>
          <Year>${release.cLineYear || 2026}</Year>
          <CLineCompany>${this.escapeXml(release.cLineOwner || release.primaryArtist)}</CLineCompany>
        </CLine>
        <OriginalReleaseDate>${release.releaseDate || '2026-10-01'}</OriginalReleaseDate>
      </ReleaseDetailsByTerritory>
    </Release>
  </ReleaseList>

  <DealList>
    <ReleaseDeal>
      <DealReleaseReference>R_MAIN</DealReleaseReference>
      <Deal>
        <DealTerms>
          <CommercialModelType>SubscriptionModel</CommercialModelType>
          <Usage>
            <UseType>PermanentDownload</UseType>
          </Usage>
          <Usage>
            <UseType>OnDemandStream</UseType>
          </Usage>
          <TerritoryCode>Worldwide</TerritoryCode>
          <ValidityPeriod>
            <StartDate>${release.releaseDate}</StartDate>
          </ValidityPeriod>
        </DealTerms>
      </Deal>
    </ReleaseDeal>
  </DealList>
</ern:NewReleaseMessage>`;
  }

  private escapeXml(unsafe?: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export const sonveraDemoProvider = new SonveraDemoProvider();
