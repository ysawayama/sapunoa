interface TestResult {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: 'low' | 'normal' | 'high';
}

interface AnalysisResult {
  testId: string;
  interpretation: string;
  severity: 'mild' | 'moderate' | 'severe';
  supplementRecommendations?: string[];
  lifestyleRecommendations?: string[];
  followUpRecommended: boolean;
}

interface NutrientMapping {
  testName: string;
  relatedSupplements: {
    supplementId: string;
    condition: 'low' | 'high' | 'both';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

class AnalysisService {
  private nutrientMappings: NutrientMapping[] = [
    {
      testName: 'Vitamin D (25-OH)',
      relatedSupplements: [
        { supplementId: '1', condition: 'low', priority: 'HIGH' }
      ]
    },
    {
      testName: 'C-Reactive Protein',
      relatedSupplements: [
        { supplementId: '2', condition: 'high', priority: 'HIGH' },
        { supplementId: '4', condition: 'high', priority: 'MEDIUM' } // Curcumin
      ]
    },
    {
      testName: 'Magnesium, Serum',
      relatedSupplements: [
        { supplementId: '3', condition: 'low', priority: 'MEDIUM' }
      ]
    },
    {
      testName: 'Vitamin B12',
      relatedSupplements: [
        { supplementId: '5', condition: 'low', priority: 'HIGH' }
      ]
    },
    {
      testName: 'Ferritin',
      relatedSupplements: [
        { supplementId: '6', condition: 'low', priority: 'HIGH' }
      ]
    },
    {
      testName: 'Homocysteine',
      relatedSupplements: [
        { supplementId: '5', condition: 'high', priority: 'HIGH' }, // B12
        { supplementId: '7', condition: 'high', priority: 'HIGH' }, // Folate
        { supplementId: '8', condition: 'high', priority: 'MEDIUM' } // B6
      ]
    },
    {
      testName: 'TSH',
      relatedSupplements: [
        { supplementId: '9', condition: 'high', priority: 'MEDIUM' }, // Selenium
        { supplementId: '10', condition: 'high', priority: 'MEDIUM' } // Iodine
      ]
    }
  ];

  async analyzeTestResult(testResult: TestResult): Promise<AnalysisResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const percentageFromNormal = this.calculatePercentageFromNormal(testResult);
    const severity = this.determineSeverity(percentageFromNormal, testResult.status);
    const interpretation = this.generateInterpretation(testResult, severity);
    const supplementRecommendations = this.getSupplementRecommendations(testResult);
    const lifestyleRecommendations = this.getLifestyleRecommendations(testResult);
    
    return {
      testId: testResult.testId,
      interpretation,
      severity,
      supplementRecommendations,
      lifestyleRecommendations,
      followUpRecommended: severity === 'severe' || 
        (severity === 'moderate' && testResult.status !== 'normal')
    };
  }

  private calculatePercentageFromNormal(testResult: TestResult): number {
    const { value, referenceMin, referenceMax, status } = testResult;
    
    if (status === 'normal') return 0;
    
    if (status === 'low') {
      return ((referenceMin - value) / referenceMin) * 100;
    } else {
      return ((value - referenceMax) / referenceMax) * 100;
    }
  }

  private determineSeverity(
    percentageFromNormal: number, 
    status: string
  ): 'mild' | 'moderate' | 'severe' {
    if (status === 'normal') return 'mild';
    
    if (percentageFromNormal < 20) return 'mild';
    if (percentageFromNormal < 40) return 'moderate';
    return 'severe';
  }

  private generateInterpretation(
    testResult: TestResult, 
    severity: string
  ): string {
    const { testName, value, unit, status, referenceMin, referenceMax } = testResult;
    
    if (status === 'normal') {
      return `Your ${testName} level is within the normal range.`;
    }
    
    const severityText = severity === 'mild' ? 'slightly' : 
                        severity === 'moderate' ? 'moderately' : 'significantly';
    
    const statusText = status === 'low' ? 'below' : 'above';
    const optimalRange = `${referenceMin}-${referenceMax} ${unit}`;
    
    return `Your ${testName} level (${value} ${unit}) is ${severityText} ${statusText} ` +
           `the optimal range (${optimalRange}). This may indicate a need for intervention.`;
  }

  private getSupplementRecommendations(testResult: TestResult): string[] | undefined {
    const mapping = this.nutrientMappings.find(
      m => m.testName === testResult.testName
    );
    
    if (!mapping) return undefined;
    
    const recommendations = mapping.relatedSupplements.filter(supp => {
      if (supp.condition === 'both') return true;
      return supp.condition === testResult.status;
    });
    
    return recommendations.length > 0 
      ? recommendations.map(r => r.supplementId)
      : undefined;
  }

  private getLifestyleRecommendations(testResult: TestResult): string[] {
    const recommendations: string[] = [];
    
    switch (testResult.testName) {
      case 'Vitamin D (25-OH)':
        if (testResult.status === 'low') {
          recommendations.push(
            'Increase sun exposure (15-20 minutes daily)',
            'Include vitamin D-rich foods (fatty fish, egg yolks)',
            'Consider vitamin D fortified foods'
          );
        }
        break;
        
      case 'C-Reactive Protein':
        if (testResult.status === 'high') {
          recommendations.push(
            'Follow an anti-inflammatory diet',
            'Increase physical activity',
            'Manage stress through meditation or yoga',
            'Ensure adequate sleep (7-8 hours)'
          );
        }
        break;
        
      case 'Magnesium, Serum':
        if (testResult.status === 'low') {
          recommendations.push(
            'Include magnesium-rich foods (leafy greens, nuts, seeds)',
            'Reduce alcohol and caffeine intake',
            'Manage stress levels'
          );
        }
        break;
        
      case 'Ferritin':
        if (testResult.status === 'low') {
          recommendations.push(
            'Include iron-rich foods (red meat, beans, spinach)',
            'Pair iron foods with vitamin C sources',
            'Avoid tea and coffee with meals'
          );
        }
        break;
    }
    
    return recommendations;
  }

  async analyzeMultipleResults(testResults: TestResult[]): Promise<{
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    keyFindings: string[];
    prioritySupplements: string[];
  }> {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const analyses = await Promise.all(
      testResults.map(result => this.analyzeTestResult(result))
    );
    
    // Determine overall health
    const severeCounts = analyses.filter(a => a.severity === 'severe').length;
    const moderateCounts = analyses.filter(a => a.severity === 'moderate').length;
    
    let overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    if (severeCounts > 0) {
      overallHealth = 'poor';
    } else if (moderateCounts > 2) {
      overallHealth = 'fair';
    } else if (moderateCounts > 0) {
      overallHealth = 'good';
    } else {
      overallHealth = 'excellent';
    }
    
    // Extract key findings
    const keyFindings = analyses
      .filter(a => a.severity !== 'mild')
      .map(a => a.interpretation);
    
    // Get priority supplements
    const allSupplements = analyses
      .flatMap(a => a.supplementRecommendations || [])
      .filter((v, i, a) => a.indexOf(v) === i); // unique values
    
    return {
      overallHealth,
      keyFindings,
      prioritySupplements: allSupplements
    };
  }
}

export const analysisService = new AnalysisService();