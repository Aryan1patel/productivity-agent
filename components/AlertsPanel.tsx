import React from 'react';
import { Alert } from '@/types';

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export default function AlertsPanel({ alerts, onAlertClick }: AlertsPanelProps) {
  // Group alerts by type
  const overdueAlerts = alerts.filter(a => a.type === 'overdue');
  const unownedAlerts = alerts.filter(a => a.type === 'unowned');
  const slippageAlerts = alerts.filter(a => a.type === 'slippage');
  const tightDeadlineAlerts = alerts.filter(a => a.type === 'tight_deadline');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const renderAlertSection = (title: string, alerts: Alert[], icon: string) => {
    if (alerts.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>{icon}</span>
          {title}
          <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
            {alerts.length}
          </span>
        </h3>
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              onClick={() => onAlertClick?.(alert)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                ${getSeverityColor(alert.severity)}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getSeverityIcon(alert.severity)}
                </span>
                <div className="flex-grow">
                  <p className="font-medium mb-1">{alert.message}</p>
                  <p className="text-sm opacity-75">
                    {alert.commitment.who} → {alert.commitment.to_whom || 'Team'}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlertClick?.(alert);
                    }}
                    className="mt-2 text-sm font-medium hover:underline"
                  >
                    View Timeline →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          Alerts & Flags
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({alerts.length} total)
          </span>
        </h2>
      </div>

      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              All Clear!
            </h3>
            <p className="text-gray-600">
              No critical alerts at this time
            </p>
          </div>
        ) : (
          <>
            {renderAlertSection('Overdue Items', overdueAlerts, '🚨')}
            {renderAlertSection('Unowned — Needs Assignment', unownedAlerts, '⚠️')}
            {renderAlertSection('Repeated Deadline Slips', slippageAlerts, '🔄')}
            {renderAlertSection('Tight Scheduling', tightDeadlineAlerts, '⏰')}
          </>
        )}
      </div>
    </div>
  );
}
