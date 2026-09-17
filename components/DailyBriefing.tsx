'use client';

import React, { useState, useMemo } from 'react';
import { DataPack, ResolvedCommitment } from '@/types';
import { processDataPack } from '@/lib/processor';
import DaySelector from './DaySelector';
import CalendarView from './CalendarView';
import CommitmentsList from './CommitmentsList';

interface DailyBriefingProps {
  data: DataPack;
}

export default function DailyBriefing({ data }: DailyBriefingProps) {
  const [selectedDate, setSelectedDate] = useState('2026-09-21');

  // Process the data pack to get resolved commitments
  const resolvedCommitments = useMemo(() => {
    return processDataPack(data);
  }, [data]);

  // Get Arjun's calendar events for selected date
  const calendarEvents = data.calendars['Arjun Malhotra'] || [];

  // Filter commitments due on selected date
  const commitmentsDue = useMemo(() => {
    return resolvedCommitments.filter(c => 
      c.current_deadline.startsWith(selectedDate)
    );
  }, [resolvedCommitments, selectedDate]);

  // Filter at-risk items due on or before selected date
  const atRiskItems = useMemo(() => {
    return resolvedCommitments.filter(c => 
      (c.status === 'at_risk' || c.status === 'unowned') &&
      c.current_deadline <= selectedDate
    );
  }, [resolvedCommitments, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <DaySelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* At Risk Items Alert (if any) */}
      {atRiskItems.length > 0 && (
        <div className="relative group bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-red-400/50 rounded-2xl p-6 shadow-2xl shadow-red-500/20 backdrop-blur-xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity -z-10"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-lg opacity-75"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <div>
              <h3 className="font-black text-white text-xl">
                {atRiskItems.length} item{atRiskItems.length !== 1 ? 's' : ''} need{atRiskItems.length === 1 ? 's' : ''} attention
              </h3>
              <p className="text-sm text-orange-200 mt-1 font-medium">
                {atRiskItems.filter(i => i.status === 'unowned').length > 0 && '🔸 Unowned items require assignment. '}
                {atRiskItems.filter(i => i.status === 'at_risk').length > 0 && '🔸 Overdue or at-risk items need resolution.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Calendar */}
        <div>
          <CalendarView 
            events={calendarEvents}
            date={selectedDate}
          />
        </div>

        {/* Right Column: Commitments */}
        <div className="space-y-6">
          {/* Commitments Due Today */}
          <CommitmentsList
            commitments={commitmentsDue}
            title="Commitments Due Today"
            emptyMessage="No commitments due today"
          />

          {/* At Risk Items */}
          {atRiskItems.length > 0 && (
            <CommitmentsList
              commitments={atRiskItems}
              title="At Risk / Needs Attention"
              emptyMessage="No items at risk"
            />
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent rounded-2xl border-2 border-blue-400/50 p-6 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          <div className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
            {calendarEvents.filter(e => e.date === selectedDate).length}
          </div>
          <div className="text-sm font-bold text-blue-300 mt-2 tracking-wide">Calendar Events</div>
        </div>
        <div className="relative group bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent rounded-2xl border-2 border-purple-400/50 p-6 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          <div className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
            {commitmentsDue.length}
          </div>
          <div className="text-sm font-bold text-purple-300 mt-2 tracking-wide">Commitments Due</div>
        </div>
        <div className="relative group bg-gradient-to-br from-red-500/10 via-orange-500/10 to-transparent rounded-2xl border-2 border-red-400/50 p-6 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          <div className="text-5xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-300 bg-clip-text text-transparent">
            {atRiskItems.length}
          </div>
          <div className="text-sm font-bold text-red-300 mt-2 tracking-wide">At Risk</div>
        </div>
        <div className="relative group bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-transparent rounded-2xl border-2 border-green-400/50 p-6 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          <div className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
            {resolvedCommitments.filter(c => c.status === 'done').length}
          </div>
          <div className="text-sm font-bold text-green-300 mt-2 tracking-wide">Completed This Week</div>
        </div>
      </div>
    </div>
  );
}
