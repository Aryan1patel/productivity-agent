'use client';

import React from 'react';

interface DaySelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const WEEK_DAYS = [
  { date: '2026-09-21', day: 'Mon', label: 'Monday 21' },
  { date: '2026-09-22', day: 'Tue', label: 'Tuesday 22' },
  { date: '2026-09-23', day: 'Wed', label: 'Wednesday 23' },
  { date: '2026-09-24', day: 'Thu', label: 'Thursday 24' },
  { date: '2026-09-25', day: 'Fri', label: 'Friday 25' },
];

export default function DaySelector({ selectedDate, onDateChange }: DaySelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {WEEK_DAYS.map((day) => (
        <button
          key={day.date}
          onClick={() => onDateChange(day.date)}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
            transition-colors
            ${
              selectedDate === day.date
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <div className="text-xs opacity-75">{day.day}</div>
          <div>{day.label.split(' ')[0]}</div>
        </button>
      ))}
    </div>
  );
}
