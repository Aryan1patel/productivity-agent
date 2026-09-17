import React from 'react';
import { CommitmentStatus } from '@/types';

interface StatusPillProps {
  status: CommitmentStatus;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  
  const statusConfig = {
    open: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      label: 'Open',
      icon: '🔵',
    },
    at_risk: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      text: 'text-white',
      label: 'At Risk',
      icon: '🔴',
    },
    done: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      text: 'text-white',
      label: 'Done',
      icon: '✅',
    },
    unowned: {
      bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
      text: 'text-white',
      label: 'Unowned',
      icon: '⚠️',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold shadow-md
        ${sizeClasses}
        ${config.bg}
        ${config.text}
      `}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
}
