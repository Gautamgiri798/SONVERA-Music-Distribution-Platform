// Distribution Provider Abstraction
// Part II, Section 5 (Page 7)

export interface ValidationIssue {
  id: string;
  category: 'Audio' | 'Artwork' | 'Metadata' | 'Copyright' | 'Contributors' | 'Distribution';
  severity: 'error' | 'warning' | 'info';
  field: string;
  trackId?: string;
  message: string;
  recommendation: string;
  fixActionStep?: number;
}

export interface ReleaseHealthScore {
  overallScore: number;
  breakdown: {
    audio: number;
    artwork: number;
    metadata: number;
    copyright: number;
    contributors: number;
    distributionReadiness: number;
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

export interface SubmissionResult {
  submissionId: string;
  batchId: string;
  releaseId: string;
  status: 'SUBMITTED' | 'PROCESSING' | 'FAILED';
  targetDsps: string[];
  submittedAt: string;
  ddexMessageId: string;
  logSummary: string[];
}

export interface UpdateResult {
  success: boolean;
  releaseId: string;
  updatedAt: string;
  message: string;
}

export interface TakedownResult {
  success: boolean;
  releaseId: string;
  takedownId: string;
  broadcastAt: string;
  targetDsps: string[];
  message: string;
}

export interface DistributionProvider {
  name: string;
  providerId: string;
  isDemo: boolean;
  version: string;
  validateRelease(releaseId: string): Promise<ValidationResult>;
  submitRelease(releaseId: string): Promise<SubmissionResult>;
  getDeliveryStatus(submissionId: string): Promise<any>;
  updateRelease(releaseId: string): Promise<UpdateResult>;
  requestTakedown(releaseId: string): Promise<TakedownResult>;
  generateDdexPackage(release: any): string;
}
