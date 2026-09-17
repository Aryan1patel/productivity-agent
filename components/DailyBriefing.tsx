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
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">
                {atRiskItems.length} item{atRiskItems.length !== 1 ? 's' : ''} need{atRiskItems.length === 1 ? 's' : ''} attention
              </h3>
              <p className="text-sm text-red-700 mt-1">
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 p-5 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {calendarEvents.filter(e => e.date === selectedDate).length}
          </div>
          <div className="text-sm font-semibold text-blue-700 mt-1">Calendar Events</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 p-5 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {commitmentsDue.length}
          </div>
          <div className="text-sm font-semibold text-purple-700 mt-1">Commitments Due</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 p-5 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {atRiskItems.length}
          </div>
          <div className="text-sm font-semibold text-red-700 mt-1">At Risk</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 p-5 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {resolvedCommitments.filter(c => c.status === 'done').length}
          </div>
          <div className="text-sm font-semibold text-green-700 mt-1">Completed This Week</div>
        </div>
      </div>
    </div>
  );
}
