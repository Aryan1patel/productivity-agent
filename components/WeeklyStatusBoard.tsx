'use client';

import React, { useState } from 'react';
import { ResolvedCommitment } from '@/types';
import StatusPill from './StatusPill';

interface WeeklyStatusBoardProps {
  commitments: ResolvedCommitment[];
  onItemClick?: (commitment: ResolvedCommitment) => void;
}

export default function WeeklyStatusBoard({ commitments, onItemClick }: WeeklyStatusBoardProps) {
  // Sort by priority: at_risk/overdue → unowned → open → done
  const sortedCommitments = [...commitments].sort((a, b) => {
    const priority = { at_risk: 0, unowned: 1, open: 2, done: 3 };
    return priority[a.status] - priority[b.status];
  });

  // Calculate summary counts
  const summary = {
    open: commitments.filter(c => c.status === 'open').length,
    at_risk: commitments.filter(c => c.status === 'at_risk').length,
    done: commitments.filter(c => c.status === 'done').length,
    unowned: commitments.filter(c => c.status === 'unowned').length,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header with Summary */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Weekly Status Board
          </h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">At Risk: {summary.at_risk}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Unowned: {summary.unowned}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Open: {summary.open}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Done: {summary.done}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedCommitments.map((commitment, idx) => (
            <div
              key={idx}
              onClick={() => onItemClick?.(commitment)}
              className={`
                p-4 rounded-lg border-2 transition-all cursor-pointer
                ${commitment.status === 'at_risk' ? 'border-red-200 bg-red-50 hover:border-red-300' : ''}
                ${commitment.status === 'unowned' ? 'border-orange-200 bg-orange-50 hover:border-orange-300' : ''}
                ${commitment.status === 'open' ? 'border-blue-200 bg-blue-50 hover:border-blue-300' : ''}
                ${commitment.status === 'done' ? 'border-green-200 bg-green-50 hover:border-green-300' : ''}
                hover:shadow-md
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-gray-900 flex-grow">
                  {commitment.what}
                </h3>
                <StatusPill status={commitment.status} size="sm" />
              </div>

              {/* Owner Info */}
              <div className="mb-3">
                <div className="text-sm text-gray-700">
                  {commitment.status === 'unowned' ? (
                    <span className="font-medium text-orange-700">
                      ⚠️ Needs owner assignment
                    </span>
                  ) : (
                    <>
                      <span className="font-medium">{commitment.who}</span>
                      {commitment.to_whom && (
                        <>
                          {' → '}
                          <span className="font-medium">{commitment.to_whom}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="font-medium">Deadline:</span>
                <span>{formatDate(commitment.current_deadline)}</span>
              </div>

              {/* Slippage Badge */}
              {commitment.slippage_count >= 2 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium mb-2">
                  🔄 Deadline slipped {commitment.slippage_count}× times
                </div>
              )}

              {/* Risk Flags */}
              {commitment.risk_flags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {commitment.risk_flags.map((flag, flagIdx) => (
                    <span
                      key={flagIdx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              {/* Calendar Status */}
              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className={`
                  ${commitment.calendar_backed ? 'text-green-600' : 'text-gray-500'}
                `}>
                  {commitment.calendar_backed ? '✓ Calendar backed' : '○ No calendar entry'}
                </span>
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick?.(commitment);
                  }}
                >
                  View Timeline →
                </button>
              </div>
            </div>
          ))}
        </div>

        {commitments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No commitments found
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Showing {commitments.length} items for the week of September 21-25, 2026.
          Click any item to view its full timeline.
        </p>
      </div>
    </div>
  );
}
