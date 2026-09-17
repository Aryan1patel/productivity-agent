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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
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
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">
                  {event.time}
                </div>
                <div className="flex-grow">
                  <div className={`font-medium ${
                    event.event === 'Blocked' 
                      ? 'text-gray-400 italic' 
                      : 'text-gray-900'
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
