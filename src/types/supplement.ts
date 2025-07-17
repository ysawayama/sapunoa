export type SupplementCategory = 'VITAMIN' | 'MINERAL' | 'HERB' | 'FATTY_ACID' | 'AMINO_ACID' | 'PROBIOTIC' | 'OTHER';

export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Supplement {
  id: string;
  name: string;
  scientificName: string;
  category: SupplementCategory;
  description: string;
  dosage: string;
  frequency?: string;
  timing?: string;
  duration?: string;
  form?: string;
  priority: RecommendationPriority;
  benefits?: string[];
  sideEffects?: string[];
  interactions?: string[];
  recommendationReason: string;
  relatedTestResults?: TestResult[];
  doctorComment?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  evidenceLinks?: EvidenceLink[];
}

export interface TestResult {
  testName: string;
  value: string;
  unit: string;
  status: 'low' | 'normal' | 'high';
  referenceRange: string;
}

export interface EvidenceLink {
  title: string;
  source: string;
  url: string;
  type: 'study' | 'review' | 'article';
}