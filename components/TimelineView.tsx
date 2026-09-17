import React from 'react';
import { ResolvedCommitment, TimelineEvent } from '@/types';
import StatusPill from './StatusPill';

interface TimelineViewProps {
  commitment: ResolvedCommitment;
  onBack?: () => void;
}

export default function TimelineView({ commitment, onBack }: TimelineViewProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getChangeIcon = (changeType: TimelineEvent['change_type']) => {
    switch (changeType) {
      case 'created':
        return '🆕';
      case 'deadline_moved':
        return '🔄';
      case 'status_updated':
        return '✅';
      case 'confirmed':
        return '✓';
      case 'reminder':
        return '🔔';
      default:
        return '📝';
    }
  };

  const getChangeLabel = (changeType: TimelineEvent['change_type']) => {
    switch (changeType) {
      case 'created':
        return 'Created';
      case 'deadline_moved':
        return 'Deadline Changed';
      case 'status_updated':
        return 'Status Updated';
      case 'confirmed':
        return 'Confirmed';
      case 'reminder':
        return 'Reminder';
      default:
        return 'Updated';
    }
  };

  // Sort timeline chronologically
  const sortedTimeline = [...commitment.timeline].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to All Items
        </button>
      )}

      {/* Commitment Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {commitment.what}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">{commitment.who}</span>
              {commitment.to_whom && (
                <>
                  <span>→</span>
                  <span className="font-medium">{commitment.to_whom}</span>
                </>
              )}
            </div>
          </div>
          <StatusPill status={commitment.status} size="md" />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">Current Deadline</div>
            <div className="font-medium text-gray-900">
              {new Date(commitment.current_deadline + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Slippage Count</div>
            <div className="font-medium text-gray-900">{commitment.slippage_count}×</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Timeline Events</div>
            <div className="font-medium text-gray-900">{commitment.timeline.length}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Calendar Backed</div>
            <div className="font-medium text-gray-900">
              {commitment.calendar_backed ? '✓ Yes' : '○ No'}
            </div>
          </div>
        </div>

        {/* Risk Flags */}
        {commitment.risk_flags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Risk Flags</div>
            <div className="flex flex-wrap gap-2">
              {commitment.risk_flags.map((flag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
                >
                  ⚠️ {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scheduling Tightness */}
        {commitment.scheduling_tightness && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-900">
              <span className="font-medium">📅 Scheduling Note:</span> {commitment.scheduling_tightness}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Timeline
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({sortedTimeline.length} events)
            </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Chronological audit trail showing how this commitment evolved
          </p>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Events */}
            <div className="space-y-6">
              {sortedTimeline.map((event, idx) => (
                <div key={idx} className="relative flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-xl z-10">
                    {getChangeIcon(event.change_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">
                            {getChangeLabel(event.change_type)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTimestamp(event.timestamp)}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 border border-gray-200">
                          {event.source}
                        </span>
                      </div>

                      {/* Source Detail */}
                      <div className="text-sm text-gray-600 mb-2">
                        📍 {event.source_detail}
                      </div>

                      {/* Excerpt */}
                      <div className="bg-white rounded p-3 text-sm text-gray-700 border border-gray-200">
                        "{event.excerpt}"
                      </div>

                      {/* Changes */}
                      {(event.old_value || event.new_value) && (
                        <div className="mt-3 text-sm">
                          {event.old_value && (
                            <div className="text-gray-500">
                              <span className="font-medium">Previous:</span> {event.old_value}
                            </div>
                          )}
                          {event.new_value && (
                            <div className="text-gray-900">
                              <span className="font-medium">Updated to:</span> {event.new_value}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {event.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-900">
                          💡 {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution Summary */}
            <div className="relative flex gap-4 mt-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl text-white z-10 shadow-lg">
                ✓
              </div>
              <div className="flex-grow">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-300">
                  <h4 className="font-bold text-gray-900 mb-2">Resolution Summary</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Per <span className="font-mono text-xs bg-white px-2 py-0.5 rounded">PROCESS.md §3.2</span>: 
                    Latest message wins for deadline and status.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Final Status:</span>
                      <div className="mt-1">
                        <StatusPill status={commitment.status} size="sm" />
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Final Deadline:</span>
                      <div className="font-medium text-gray-900 mt-1">
                        {new Date(commitment.current_deadline + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
