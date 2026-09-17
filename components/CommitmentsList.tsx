import React from 'react';
import { ResolvedCommitment } from '@/types';
import StatusPill from './StatusPill';

interface CommitmentsListProps {
  commitments: ResolvedCommitment[];
  title: string;
  emptyMessage?: string;
}

export default function CommitmentsList({ 
  commitments, 
  title,
  emptyMessage = 'No commitments for this day'
}: CommitmentsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({commitments.length})
          </span>
        </h2>
      </div>
      
      <div className="p-6">
        {commitments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {commitments.map((commitment, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {commitment.what}
                    </h3>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{commitment.who}</span>
                      {commitment.to_whom && (
                        <>
                          {' → '}
                          <span className="font-medium">{commitment.to_whom}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusPill status={commitment.status} />
                </div>

                {commitment.risk_flags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commitment.risk_flags.map((flag, flagIdx) => (
                      <span
                        key={flagIdx}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700"
                      >
                        ⚠️ {flag}
                      </span>
                    ))}
                  </div>
                )}

                {commitment.scheduling_tightness && (
                  <div className="mt-2 text-xs text-gray-500 italic">
                    📅 {commitment.scheduling_tightness}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
