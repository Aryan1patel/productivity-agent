import React from 'react';
import { CommitmentStatus } from '@/types';

interface StatusPillProps {
  status: CommitmentStatus;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  const statusConfig = {
    open: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Open',
    },
    at_risk: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'At Risk',
    },
    done: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Done',
    },
    unowned: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Unowned',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses}
        ${config.bg}
        ${config.text}
      `}
    >
      {config.label}
    </span>
  );
}
