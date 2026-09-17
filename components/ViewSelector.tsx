'use client';

import React from 'react';

export type ViewType = 'daily' | 'weekly' | 'alerts';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = [
    { id: 'daily' as ViewType, label: 'Daily Briefing', icon: '📅' },
    { id: 'weekly' as ViewType, label: 'Weekly Board', icon: '📊' },
    { id: 'alerts' as ViewType, label: 'Alerts & Timeline', icon: '⚠️' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex gap-1 px-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`
              flex items-center gap-2 px-4 py-3 font-medium text-sm
              border-b-2 transition-colors
              ${
                currentView === view.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
            `}
          >
            <span>{view.icon}</span>
            <span>{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
