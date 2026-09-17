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
    <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20">
        <h2 className="text-lg font-black text-white">
          {title}
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({commitments.length})
          </span>
        </h2>
      </div>
      
      <div className="p-6">
        {commitments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-base font-semibold">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commitments.map((commitment, idx) => (
              <div
                key={idx}
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-102"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-grow">
                    <h3 className="font-bold text-white text-base mb-2 group-hover:text-blue-300 transition-colors">
                      {commitment.what}
                    </h3>
                    <div className="text-sm text-gray-300">
                      <span className="font-bold text-blue-300">{commitment.who}</span>
                      {commitment.to_whom && (
                        <>
                          <span className="mx-2 text-gray-500">→</span>
                          <span className="font-bold text-purple-300">{commitment.to_whom}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusPill status={commitment.status} />
                </div>

                {commitment.risk_flags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {commitment.risk_flags.map((flag, flagIdx) => (
                      <span
                        key={flagIdx}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-400/30 shadow-lg"
                      >
                        <span className="text-sm">⚠️</span> {flag}
                      </span>
                    ))}
                  </div>
                )}

                {commitment.scheduling_tightness && (
                  <div className="mt-3 text-xs text-gray-400 italic font-medium bg-white/5 px-3 py-2 rounded-lg">
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
