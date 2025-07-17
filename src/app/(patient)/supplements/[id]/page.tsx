'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SupplementDetail from '@/components/supplements/SupplementDetail';
import DoctorComment from '@/components/supplements/DoctorComment';
import EvidenceLinks from '@/components/supplements/EvidenceLinks';
import RecommendationReason from '@/components/supplements/RecommendationReason';
import { supplementService } from '@/services/supplement.service';
import type { Supplement } from '@/types/supplement';

export default function SupplementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [supplement, setSupplement] = useState<Supplement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id && session?.user?.id) {
      loadSupplement();
    }
  }, [params.id, session]);

  const loadSupplement = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supplementData = await supplementService.getSupplementById(
        params.id as string,
        session!.user.id
      );
      
      setSupplement(supplementData);
    } catch (err) {
      console.error('Failed to load supplement:', err);
      setError('Failed to load supplement details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !supplement) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error || 'Supplement not found'}</p>
            <button
              onClick={() => router.push('/supplements')}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Supplements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/supplements')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recommendations
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Supplement Details */}
          <SupplementDetail supplement={supplement} />

          {/* Recommendation Reason */}
          <RecommendationReason
            reason={supplement.recommendationReason}
            testResults={supplement.relatedTestResults}
          />

          {/* Doctor Comment */}
          {supplement.doctorComment && (
            <DoctorComment
              comment={supplement.doctorComment}
              doctorName={supplement.doctorName}
              doctorSpecialty={supplement.doctorSpecialty}
            />
          )}

          {/* Scientific Evidence */}
          {supplement.evidenceLinks && supplement.evidenceLinks.length > 0 && (
            <EvidenceLinks links={supplement.evidenceLinks} />
          )}

          {/* Purchase Options (Placeholder for Phase 2) */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Purchase Options
            </h3>
            <p className="text-gray-600 mb-4">
              Purchase functionality will be available in the next phase.
            </p>
            <div className="space-y-3">
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart (Coming Soon)
              </button>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed"
              >
                Subscribe & Save (Coming Soon)
              </button>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Safety Information
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Always consult with your healthcare provider before starting any new supplement regimen. 
                  This recommendation is based on your test results but should not replace professional medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}