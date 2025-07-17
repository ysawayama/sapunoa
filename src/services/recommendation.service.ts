import { supplementService } from './supplement.service';
import { analysisService } from './analysis.service';
import type { Supplement } from '@/types/supplement';

interface TestResult {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: 'low' | 'normal' | 'high';
}

interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  lifestyle: {
    diet: string;
    exercise: string;
    sunExposure: string;
    stress: string;
  };
  medicalHistory: string[];
  currentMedications: string[];
}

class RecommendationService {
  async getUserTestResults(userId: string): Promise<TestResult[]> {
    // Simulate API call to get user's latest test results
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock test results
    return [
      {
        testId: '1',
        testName: 'Vitamin D (25-OH)',
        value: 18,
        unit: 'ng/mL',
        referenceMin: 30,
        referenceMax: 50,
        status: 'low'
      },
      {
        testId: '2',
        testName: 'C-Reactive Protein',
        value: 5.2,
        unit: 'mg/L',
        referenceMin: 0,
        referenceMax: 3,
        status: 'high'
      },
      {
        testId: '3',
        testName: 'Magnesium, Serum',
        value: 1.7,
        unit: 'mg/dL',
        referenceMin: 1.6,
        referenceMax: 2.6,
        status: 'normal'
      },
      {
        testId: '4',
        testName: 'Vitamin B12',
        value: 450,
        unit: 'pg/mL',
        referenceMin: 200,
        referenceMax: 900,
        status: 'normal'
      },
      {
        testId: '5',
        testName: 'Ferritin',
        value: 25,
        unit: 'ng/mL',
        referenceMin: 30,
        referenceMax: 400,
        status: 'low'
      }
    ];
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock user profile
    return {
      age: 35,
      gender: 'female',
      lifestyle: {
        diet: 'vegetarian',
        exercise: 'moderate',
        sunExposure: 'low',
        stress: 'high'
      },
      medicalHistory: ['anxiety', 'seasonal_affective_disorder'],
      currentMedications: ['birth_control']
    };
  }

  async generateRecommendations(testResults: TestResult[]): Promise<Supplement[]> {
    // Simulate API call for recommendation engine
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations: string[] = [];
    
    // Analyze test results and generate recommendations
    for (const result of testResults) {
      const analysis = await analysisService.analyzeTestResult(result);
      
      if (analysis.supplementRecommendations) {
        recommendations.push(...analysis.supplementRecommendations);
      }
    }
    
    // Get unique supplement IDs
    const uniqueSupplementIds = [...new Set(recommendations)];
    
    // Fetch supplement details
    const supplements = await supplementService.getSupplementsByIds(uniqueSupplementIds);
    
    // Sort by priority
    return supplements.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getPersonalizedRecommendations(
    userId: string,
    testResults: TestResult[],
    userProfile: UserProfile
  ): Promise<Supplement[]> {
    // Get base recommendations from test results
    const baseRecommendations = await this.generateRecommendations(testResults);
    
    // Apply personalization based on user profile
    const personalizedRecommendations = await this.personalizeRecommendations(
      baseRecommendations,
      userProfile
    );
    
    return personalizedRecommendations;
  }

  private async personalizeRecommendations(
    supplements: Supplement[],
    profile: UserProfile
  ): Promise<Supplement[]> {
    // Adjust recommendations based on user profile
    const personalized = supplements.map(supplement => {
      const adjusted = { ...supplement };
      
      // Adjust dosage based on age and gender
      if (supplement.name === 'Vitamin D3' && profile.lifestyle.sunExposure === 'low') {
        adjusted.priority = 'HIGH';
      }
      
      // Consider dietary restrictions
      if (profile.lifestyle.diet === 'vegetarian' && supplement.name === 'Vitamin B12') {
        adjusted.priority = 'HIGH';
        adjusted.recommendationReason = adjusted.recommendationReason + 
          ' As a vegetarian, you may be at higher risk for B12 deficiency.';
      }
      
      // Consider medical history
      if (profile.medicalHistory.includes('anxiety') && supplement.name === 'Magnesium Glycinate') {
        adjusted.priority = 'HIGH';
        adjusted.recommendationReason = adjusted.recommendationReason + 
          ' Magnesium may also help with anxiety management.';
      }
      
      return adjusted;
    });
    
    return personalized;
  }

  async checkInteractions(
    supplementIds: string[],
    medications: string[]
  ): Promise<{ hasInteractions: boolean; interactions: string[] }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const supplements = await supplementService.getSupplementsByIds(supplementIds);
    const interactions: string[] = [];
    
    for (const supplement of supplements) {
      if (supplement.interactions) {
        for (const interaction of supplement.interactions) {
          for (const medication of medications) {
            if (interaction.toLowerCase().includes(medication.toLowerCase())) {
              interactions.push(
                `${supplement.name} may interact with ${medication}`
              );
            }
          }
        }
      }
    }
    
    return {
      hasInteractions: interactions.length > 0,
      interactions
    };
  }
}

export const recommendationService = new RecommendationService();