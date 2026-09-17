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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900">
                {atRiskItems.length} item{atRiskItems.length !== 1 ? 's' : ''} need{atRiskItems.length === 1 ? 's' : ''} attention
              </h3>
              <p className="text-sm text-red-700">
                {atRiskItems.filter(i => i.status === 'unowned').length > 0 && 'Unowned items require assignment. '}
                {atRiskItems.filter(i => i.status === 'at_risk').length > 0 && 'Overdue or at-risk items need resolution.'}
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {calendarEvents.filter(e => e.date === selectedDate).length}
          </div>
          <div className="text-sm text-gray-600">Calendar Events</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {commitmentsDue.length}
          </div>
          <div className="text-sm text-gray-600">Commitments Due</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {atRiskItems.length}
          </div>
          <div className="text-sm text-gray-600">At Risk</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {resolvedCommitments.filter(c => c.status === 'done').length}
          </div>
          <div className="text-sm text-gray-600">Completed This Week</div>
        </div>
      </div>
    </div>
  );
}
