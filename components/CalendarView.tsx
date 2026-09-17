import React from 'react';
import { CalendarEvent } from '@/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  date: string;
}

export default function CalendarView({ events, date }: CalendarViewProps) {
  // Filter events for the selected date
  const dayEvents = events.filter(e => e.date === date);

  // Sort by time
  const sortedEvents = [...dayEvents].sort((a, b) => {
    const timeA = a.time.split('-')[0] || a.time.split('–')[0];
    const timeB = b.time.split('-')[0] || b.time.split('–')[0];
    return timeA.localeCompare(timeB);
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">📅</span>
          Calendar — {formatDate(date)}
        </h2>
      </div>
      
      <div className="p-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No events scheduled for this day
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <div className="text-sm font-bold text-blue-700">
                    {event.time}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className={`font-semibold ${
                    event.event === 'Blocked' 
                      ? 'text-gray-400 italic' 
                      : 'text-gray-800'
                  }`}>
                    {event.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
