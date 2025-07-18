'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTestResult, useNutrientData, useHealthTrends } from '@/hooks/useTestResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, Share2, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

// Import visualization components
import { NutritionRadarChart } from '@/components/visualization/NutritionRadarChart';
import { DeficiencyHeatmap } from '@/components/visualization/DeficiencyHeatmap';
import { BodyDiagram } from '@/components/visualization/BodyDiagram';
import { HealthTrendChart } from '@/components/visualization/HealthTrendChart';
import { TestValueTable } from '@/components/visualization/TestValueTable';
import { NutrientStatusCard } from '@/components/visualization/NutrientStatusCard';

export default function TestResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  
  const { testResult, loading: testLoading, error: testError } = useTestResult(testId);
  const { nutrientData, loading: nutrientLoading, error: nutrientError } = useNutrientData(testId);
  const { healthTrends, loading: trendsLoading, error: trendsError } = useHealthTrends('patient-1');
  
  const [activeTab, setActiveTab] = useState('overview');

  const loading = testLoading || nutrientLoading || trendsLoading;
  const error = testError || nutrientError || trendsError;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !testResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load test result</p>
              <p className="text-sm text-gray-500 mt-2">{error?.message || 'Test result not found'}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/test-results')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log('Downloading test result...');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing test result...');
  };

  // Mock data for affected areas
  const mockAffectedAreas = [
    {
      bodyPart: 'Brain',
      severity: 'moderate' as const,
      symptoms: ['Fatigue', 'Poor concentration'],
      relatedNutrients: ['Vitamin B12', 'Iron'],
    },
    {
      bodyPart: 'Bones',
      severity: 'severe' as const,
      symptoms: ['Weakness', 'Pain'],
      relatedNutrients: ['Vitamin D', 'Calcium'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/test-results')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{testResult.testType}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(testResult.testDate), 'MMMM dd, yyyy')}</span>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                testResult.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                testResult.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {testResult.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
          <TabsTrigger value="visualization">Visualizations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Overall Health Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${
                      testResult.overallScore >= 80 ? 'text-emerald-600' :
                      testResult.overallScore >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {testResult.overallScore}%
                    </span>
                    <span className="text-gray-500">/ 100</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Key Findings</p>
                  <p className="text-gray-900">{testResult.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrient Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nutrientData.slice(0, 6).map((nutrient, index) => (
              <NutrientStatusCard
                key={index}
                nutrient={nutrient}
                trend={index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'}
              />
            ))}
          </div>

          {/* Body Diagram */}
          <Card>
            <CardContent className="pt-6">
              <BodyDiagram affectedAreas={mockAffectedAreas} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <TestValueTable nutrients={nutrientData} showTrends />
            </CardContent>
          </Card>

          {/* Deficiency Heatmap */}
          <Card>
            <CardContent className="pt-6">
              <DeficiencyHeatmap data={[]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          {/* Nutrition Radar Chart */}
          <Card>
            <CardContent className="pt-6">
              <NutritionRadarChart nutrients={nutrientData} />
            </CardContent>
          </Card>

          {/* Individual Nutrient Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {nutrientData.map((nutrient, index) => (
              <NutrientStatusCard
                key={index}
                nutrient={nutrient}
                trend={index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'}
                previousValue={nutrient.value * (0.8 + Math.random() * 0.4)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Health Trend Chart */}
          <Card>
            <CardContent className="pt-6">
              <HealthTrendChart trends={healthTrends} />
            </CardContent>
          </Card>

          {/* Trend Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-emerald-600">+12%</div>
                <p className="text-sm text-gray-600 mt-2">Overall Improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <p className="text-sm text-gray-600 mt-2">Nutrients Improved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-amber-600">2</div>
                <p className="text-sm text-gray-600 mt-2">Need Attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">6</div>
                <p className="text-sm text-gray-600 mt-2">Months Tracked</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}