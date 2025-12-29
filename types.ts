
export enum RiskLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  AVOID = 'AVOID'
}

export interface Ingredient {
  name: string;
  normalizedName: string;
  category: string;
  riskLevel: RiskLevel;
  usageReason: string;
  sideEffects?: string;
  sourceAuthority: string;
  originalName?: string;
}

export interface VerificationLink {
  title: string;
  url: string;
}

export interface AnalysisResult {
  productName: string;
  thumbnail?: string; // Base64 thumbnail for history
  ingredients: Ingredient[];
  nutrition: {
    calories?: string;
    sugar?: string;
    fat?: string;
    sodium?: string;
  };
  healthVerdict: string;
  overallScore: number;
  confidenceScore: number;
  dataSources: string[];
  disclaimer: string;
  alert?: string;
  detailedDescription: string;
  riskBadge: string; // e.g., "OCCASIONAL", "HEALTHY", "AVOID"
  verificationLinks: VerificationLink[];
  knowledgeBases: VerificationLink[];
  scanDate: string;
}

export type AppState = 'SPLASH' | 'IDLE' | 'ANALYZING' | 'RESULT' | 'ERROR' | 'ABOUT';
