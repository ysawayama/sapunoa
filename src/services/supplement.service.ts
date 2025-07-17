import type { Supplement } from '@/types/supplement';

// Mock data for supplements
const mockSupplements: Supplement[] = [
  {
    id: '1',
    name: 'Vitamin D3',
    scientificName: 'Cholecalciferol',
    category: 'VITAMIN',
    description: 'Essential vitamin for bone health, immune function, and mood regulation. Helps the body absorb calcium and supports overall health.',
    dosage: '2000 IU',
    frequency: 'Once daily',
    timing: 'With breakfast',
    form: 'Softgel Capsule',
    priority: 'HIGH',
    benefits: [
      'Supports strong bones and teeth',
      'Enhances immune system function',
      'May improve mood and reduce depression',
      'Supports muscle function',
      'May reduce risk of certain diseases'
    ],
    sideEffects: [
      'Nausea or vomiting (rare)',
      'Constipation',
      'Weakness or fatigue (with excessive doses)'
    ],
    interactions: [
      'Thiazide diuretics',
      'Digoxin',
      'Calcium channel blockers'
    ],
    recommendationReason: 'Your recent blood test shows vitamin D levels at 18 ng/mL, which is below the optimal range of 30-50 ng/mL. This deficiency can impact bone health, immune function, and mood. Supplementation is recommended to bring your levels to the optimal range.',
    relatedTestResults: [
      {
        testName: 'Vitamin D (25-OH)',
        value: '18',
        unit: 'ng/mL',
        status: 'low',
        referenceRange: '30-50 ng/mL'
      }
    ],
    doctorComment: 'Given your low vitamin D levels and indoor lifestyle, I recommend starting with 2000 IU daily. We\'ll retest in 3 months to assess your response and adjust the dose if needed.',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Internal Medicine',
    evidenceLinks: [
      {
        title: 'Vitamin D Deficiency and Its Health Consequences',
        source: 'New England Journal of Medicine',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMra070553',
        type: 'review'
      },
      {
        title: 'Effects of Vitamin D Supplementation on Musculoskeletal Health',
        source: 'The Lancet',
        url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)32225-6/fulltext',
        type: 'study'
      }
    ]
  },
  {
    id: '2',
    name: 'Omega-3 Fatty Acids',
    scientificName: 'EPA/DHA',
    category: 'FATTY_ACID',
    description: 'Essential fatty acids that support heart health, brain function, and reduce inflammation throughout the body.',
    dosage: '1000 mg',
    frequency: 'Twice daily',
    timing: 'With meals',
    form: 'Fish Oil Softgel',
    priority: 'HIGH',
    benefits: [
      'Reduces inflammation',
      'Supports heart health',
      'Improves brain function',
      'May reduce depression and anxiety',
      'Supports eye health'
    ],
    sideEffects: [
      'Fishy aftertaste',
      'Mild stomach upset',
      'Loose stools (with high doses)'
    ],
    interactions: [
      'Blood thinners (warfarin, aspirin)',
      'Blood pressure medications'
    ],
    recommendationReason: 'Your inflammatory markers are elevated, and you have a family history of heart disease. Omega-3 supplementation can help reduce inflammation and support cardiovascular health.',
    doctorComment: 'Start with 1000mg twice daily with meals. Choose a high-quality fish oil supplement that\'s been tested for purity.',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialty: 'Cardiology'
  },
  {
    id: '3',
    name: 'Magnesium Glycinate',
    scientificName: 'Magnesium bisglycinate',
    category: 'MINERAL',
    description: 'Highly absorbable form of magnesium that supports muscle function, sleep quality, and stress management.',
    dosage: '400 mg',
    frequency: 'Once daily',
    timing: 'Before bedtime',
    form: 'Capsule',
    priority: 'MEDIUM',
    benefits: [
      'Improves sleep quality',
      'Reduces muscle cramps',
      'Supports stress management',
      'Helps maintain normal heart rhythm',
      'Supports bone health'
    ],
    sideEffects: [
      'Mild stomach upset',
      'Diarrhea (with high doses)'
    ],
    interactions: [
      'Antibiotics (tetracyclines, quinolones)',
      'Bisphosphonates'
    ],
    recommendationReason: 'Your magnesium levels are on the lower end of normal, and you\'ve reported issues with sleep quality and occasional muscle cramps. Magnesium supplementation may help address these concerns.',
    relatedTestResults: [
      {
        testName: 'Magnesium, Serum',
        value: '1.7',
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: '1.6-2.6 mg/dL'
      }
    ]
  }
];

class SupplementService {
  async getSupplementById(id: string, userId: string): Promise<Supplement | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation, this would fetch user-specific supplement data
    const supplement = mockSupplements.find(s => s.id === id);
    
    if (!supplement) {
      return null;
    }
    
    // Add user-specific data here if needed
    return supplement;
  }

  async getSupplementsByIds(ids: string[]): Promise<Supplement[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockSupplements.filter(s => ids.includes(s.id));
  }

  async searchSupplements(query: string): Promise<Supplement[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return mockSupplements.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.scientificName.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getSupplementsByCategory(category: string): Promise<Supplement[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockSupplements.filter(s => s.category === category);
  }
}

export const supplementService = new SupplementService();