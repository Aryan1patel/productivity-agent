'use client';

import React, { useState } from 'react';
import { ResolvedCommitment, Alert } from '@/types';
import { generateAlerts } from '@/lib/processor';
import AlertsPanel from './AlertsPanel';
import TimelineView from './TimelineView';

interface AlertsAndTimelineProps {
  commitments: ResolvedCommitment[];
  selectedCommitment?: ResolvedCommitment | null;
}

export default function AlertsAndTimeline({ 
  commitments, 
  selectedCommitment: initialSelection 
}: AlertsAndTimelineProps) {
  const [selectedCommitment, setSelectedCommitment] = useState<ResolvedCommitment | null>(
    initialSelection || null
  );

  // Generate alerts
  const alerts = generateAlerts(commitments);

  const handleAlertClick = (alert: Alert) => {
    setSelectedCommitment(alert.commitment);
  };

  const handleBack = () => {
    setSelectedCommitment(null);
  };

  return (
    <div>
      {selectedCommitment ? (
        // Show timeline for selected commitment
        <TimelineView commitment={selectedCommitment} onBack={handleBack} />
      ) : (
        // Show alerts panel
        <div className="space-y-6">
          <AlertsPanel alerts={alerts} onAlertClick={handleAlertClick} />

          {/* All Commitments - Quick Access */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                All Commitments — Quick Access
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Click any item to view its complete timeline
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {commitments.map((commitment, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCommitment(commitment)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{commitment.what}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {commitment.who}
                          {commitment.to_whom && ` → ${commitment.to_whom}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {commitment.timeline.length} events
                        </span>
                        <span className="text-blue-600">→</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
