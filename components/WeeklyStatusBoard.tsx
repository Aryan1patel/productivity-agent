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
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header with Summary */}
      <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Weekly Status Board
          </h2>
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-red-400/30 shadow-lg shadow-red-500/20">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <span className="font-bold text-red-300">At Risk: {summary.at_risk}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-orange-400/30 shadow-lg shadow-orange-500/20">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
              <span className="font-bold text-orange-300">Unowned: {summary.unowned}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span className="font-bold text-blue-300">Open: {summary.open}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-green-400/30 shadow-lg shadow-green-500/20">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              <span className="font-bold text-green-300">Done: {summary.done}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedCommitments.map((commitment, idx) => (
            <div
              key={idx}
              onClick={() => onItemClick?.(commitment)}
              className={`
                relative group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105
                ${commitment.status === 'at_risk' ? 'border-red-400/50 bg-gradient-to-br from-red-500/10 via-red-600/5 to-transparent hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/30' : ''}
                ${commitment.status === 'unowned' ? 'border-orange-400/50 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/30' : ''}
                ${commitment.status === 'open' ? 'border-blue-400/50 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/30' : ''}
                ${commitment.status === 'done' ? 'border-green-400/50 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/30' : ''}
                backdrop-blur-xl
              `}
            >
              {/* Glow effect on hover */}
              <div className={`
                absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10
                ${commitment.status === 'at_risk' ? 'bg-gradient-to-br from-red-500 to-pink-500' : ''}
                ${commitment.status === 'unowned' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : ''}
                ${commitment.status === 'open' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : ''}
                ${commitment.status === 'done' ? 'bg-gradient-to-br from-green-500 to-emerald-500' : ''}
              `}></div>

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="font-bold text-white flex-grow text-lg group-hover:text-white transition-colors">
                  {commitment.what}
                </h3>
                <StatusPill status={commitment.status} size="sm" />
              </div>

              {/* Owner Info */}
              <div className="mb-4">
                <div className="text-sm text-gray-300">
                  {commitment.status === 'unowned' ? (
                    <span className="font-bold text-orange-400 flex items-center gap-2">
                      <span className="text-lg">⚠️</span> Needs owner assignment
                    </span>
                  ) : (
                    <>
                      <span className="font-bold text-blue-300">{commitment.who}</span>
                      {commitment.to_whom && (
                        <>
                          <span className="mx-2 text-gray-500">→</span>
                          <span className="font-bold text-purple-300">{commitment.to_whom}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 bg-white/5 rounded-lg px-3 py-2">
                <span className="font-bold text-gray-300">📅 Deadline:</span>
                <span className="font-semibold text-white">{formatDate(commitment.current_deadline)}</span>
              </div>

              {/* Slippage Badge */}
              {commitment.slippage_count >= 2 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold mb-3 shadow-lg shadow-red-500/20">
                  <span className="text-base">🔄</span>
                  Slipped {commitment.slippage_count}× times
                </div>
              )}

              {/* Risk Flags */}
              {commitment.risk_flags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {commitment.risk_flags.map((flag, flagIdx) => (
                    <span
                      key={flagIdx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-400/30 shadow-lg"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              {/* Calendar Status */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5
                  ${commitment.calendar_backed ? 'text-green-400' : 'text-gray-500'}
                `}>
                  {commitment.calendar_backed ? (
                    <><span className="text-sm">✓</span> Calendar backed</>
                  ) : (
                    <><span className="text-sm">○</span> No calendar entry</>
                  )}
                </span>
                <button 
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick?.(commitment);
                  }}
                >
                  View Timeline <span className="text-base">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {commitments.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold">No commitments found</p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-8 py-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-white font-bold">{commitments.length} items</span> for the week of <span className="text-blue-400 font-bold">September 21-25, 2026</span>.
          Click any item to view its full timeline.
        </p>
      </div>
    </div>
  );
}
