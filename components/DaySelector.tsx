'use client';

import React from 'react';

interface DaySelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const WEEK_DAYS = [
  { date: '2026-09-21', day: 'MON', label: 'Monday', num: '21', gradient: 'from-blue-500 to-cyan-500' },
  { date: '2026-09-22', day: 'TUE', label: 'Tuesday', num: '22', gradient: 'from-purple-500 to-blue-500' },
  { date: '2026-09-23', day: 'WED', label: 'Wednesday', num: '23', gradient: 'from-pink-500 to-purple-500' },
  { date: '2026-09-24', day: 'THU', label: 'Thursday', num: '24', gradient: 'from-orange-500 to-pink-500' },
  { date: '2026-09-25', day: 'FRI', label: 'Friday', num: '25', gradient: 'from-red-500 to-orange-500' },
];

export default function DaySelector({ selectedDate, onDateChange }: DaySelectorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {WEEK_DAYS.map((day) => (
        <button
          key={day.date}
          onClick={() => onDateChange(day.date)}
          className={`
            relative group px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap
            transition-all duration-300 transform
            ${
              selectedDate === day.date
                ? `bg-gradient-to-br ${day.gradient} text-white shadow-2xl scale-110 border border-white/30`
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/10'
            }
          `}
        >
          {/* Glow effect for selected day */}
          {selectedDate === day.date && (
            <div className={`absolute inset-0 bg-gradient-to-br ${day.gradient} rounded-2xl blur-xl opacity-60 -z-10`}></div>
          )}
          
          <div className="flex flex-col items-center gap-1">
            <div className={`text-xs tracking-widest font-extrabold ${selectedDate === day.date ? 'opacity-90' : 'opacity-50'}`}>
              {day.day}
            </div>
            <div className="text-3xl font-black">{day.num}</div>
            <div className={`text-xs mt-1 ${selectedDate === day.date ? 'opacity-90' : 'opacity-60'}`}>
              {day.label}
            </div>
          </div>

          {/* Selection indicator */}
          {selectedDate === day.date && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg"></div>
          )}
        </button>
      ))}
    </div>
  );
}
