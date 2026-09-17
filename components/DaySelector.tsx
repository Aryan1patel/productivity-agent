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
    <div className="flex gap-3 overflow-x-auto pb-2">
      {WEEK_DAYS.map((day) => (
        <button
          key={day.date}
          onClick={() => onDateChange(day.date)}
          className={`
            px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap
            transition-all duration-200 transform
            ${
              selectedDate === day.date
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
            }
          `}
        >
          <div className={`text-xs font-medium ${selectedDate === day.date ? 'opacity-90' : 'opacity-60'}`}>
            {day.day}
          </div>
          <div className="mt-1">{day.label.split(' ')[0]}</div>
        </button>
      ))}
    </div>
  );
}
