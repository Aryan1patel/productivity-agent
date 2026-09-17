import React from 'react';
import { CommitmentStatus } from '@/types';

interface StatusPillProps {
  status: CommitmentStatus;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm';
  
  const statusConfig = {
    open: {
      bg: 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500',
      glow: 'shadow-lg shadow-blue-500/50',
      text: 'text-white',
      label: 'Open',
      icon: '⚡',
      border: 'border border-blue-400/30',
    },
    at_risk: {
      bg: 'bg-gradient-to-r from-rose-500 via-red-600 to-pink-500',
      glow: 'shadow-lg shadow-red-500/50',
      text: 'text-white',
      label: 'At Risk',
      icon: '🔥',
      border: 'border border-red-400/30',
    },
    done: {
      bg: 'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-500',
      glow: 'shadow-lg shadow-green-500/50',
      text: 'text-white',
      label: 'Done',
      icon: '✨',
      border: 'border border-emerald-400/30',
    },
    unowned: {
      bg: 'bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500',
      glow: 'shadow-lg shadow-orange-500/50',
      text: 'text-white',
      label: 'Unowned',
      icon: '⚠️',
      border: 'border border-amber-400/30',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full font-bold
        transform hover:scale-105 transition-all duration-200
        ${sizeClasses}
        ${config.bg}
        ${config.text}
        ${config.glow}
        ${config.border}
        backdrop-blur-sm
      `}
    >
      <span className="text-sm drop-shadow-lg">{config.icon}</span>
      <span className="tracking-wide">{config.label}</span>
    </span>
  );
}
