'use client';

import React from 'react';

export type ViewType = 'daily' | 'weekly' | 'alerts';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = [
    { id: 'daily' as ViewType, label: 'Daily Briefing', icon: '📅', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'weekly' as ViewType, label: 'Weekly Board', icon: '📊', gradient: 'from-purple-500 to-pink-500' },
    { id: 'alerts' as ViewType, label: 'Alerts & Timeline', icon: '⚡', gradient: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="flex gap-3 px-6 py-4">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`
              relative group flex items-center gap-3 px-8 py-4 font-bold text-sm rounded-2xl
              transition-all duration-300 transform
              ${
                currentView === view.id
                  ? `bg-gradient-to-r ${view.gradient} text-white shadow-2xl shadow-${view.id === 'daily' ? 'blue' : view.id === 'weekly' ? 'purple' : 'orange'}-500/50 scale-105 border border-white/20`
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/10'
              }
            `}
          >
            {/* Glow effect for active tab */}
            {currentView === view.id && (
              <div className={`absolute inset-0 bg-gradient-to-r ${view.gradient} rounded-2xl blur-xl opacity-50 -z-10`}></div>
            )}
            
            <span className="text-2xl transform group-hover:scale-110 transition-transform">{view.icon}</span>
            <span className="tracking-wide">{view.label}</span>
            
            {/* Active indicator */}
            {currentView === view.id && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-1 bg-white rounded-full shadow-lg"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
