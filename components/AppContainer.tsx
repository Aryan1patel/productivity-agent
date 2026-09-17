'use client';

import React, { useState, useMemo } from 'react';
import { DataPack, ResolvedCommitment } from '@/types';
import { processDataPack } from '@/lib/processor';
import ViewSelector, { ViewType } from './ViewSelector';
import DailyBriefing from './DailyBriefing';
import WeeklyStatusBoard from './WeeklyStatusBoard';
import AlertsAndTimeline from './AlertsAndTimeline';

interface AppContainerProps {
  data: DataPack;
}

export default function AppContainer({ data }: AppContainerProps) {
  const [currentView, setCurrentView] = useState<ViewType>('daily');
  const [selectedCommitment, setSelectedCommitment] = useState<ResolvedCommitment | null>(null);

  // Process data once
  const resolvedCommitments = useMemo(() => {
    return processDataPack(data);
  }, [data]);

  const handleItemClick = (commitment: ResolvedCommitment) => {
    setSelectedCommitment(commitment);
    setCurrentView('alerts'); // Switch to timeline view
  };

  return (
    <div>
      {/* View Navigation */}
      <ViewSelector currentView={currentView} onViewChange={setCurrentView} />

      {/* Content Area */}
      <div className="p-6">
        {currentView === 'daily' && <DailyBriefing data={data} />}
        
        {currentView === 'weekly' && (
          <WeeklyStatusBoard 
            commitments={resolvedCommitments}
            onItemClick={handleItemClick}
          />
        )}
        
        {currentView === 'alerts' && (
          <AlertsAndTimeline 
            commitments={resolvedCommitments}
            selectedCommitment={selectedCommitment}
          />
        )}
      </div>
    </div>
  );
}
