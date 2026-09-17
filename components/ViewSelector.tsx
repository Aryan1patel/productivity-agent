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
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex gap-2 px-4 py-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`
              relative flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-xl
              transition-all duration-200 transform
              ${
                currentView === view.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-102'
              }
            `}
          >
            <span className="text-lg">{view.icon}</span>
            <span>{view.label}</span>
            {currentView === view.id && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
