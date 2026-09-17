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
    <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
        <h2 className="text-lg font-black text-white flex items-center gap-3">
          <span className="text-2xl">📅</span>
          Calendar — {formatDate(date)}
        </h2>
      </div>
      
      <div className="p-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-base font-semibold">No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-102"
              >
                <div className="flex-shrink-0 px-4 py-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 shadow-lg">
                  <div className="text-sm font-black text-blue-300">
                    {event.time}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className={`font-bold text-base ${
                    event.event === 'Blocked' 
                      ? 'text-gray-500 italic' 
                      : 'text-white group-hover:text-blue-300 transition-colors'
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
