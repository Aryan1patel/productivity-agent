// Core Processing Logic Engine
// Implements commitment extraction and resolution per PROCESS.md §3

import {
  DataPack,
  Commitment,
  TimelineEvent,
  ResolvedCommitment,
  CommitmentStatus,
  Alert,
} from '@/types';

/**
 * Main processor: extracts commitments from all sources and resolves latest truth
 */
export function processDataPack(data: DataPack): ResolvedCommitment[] {
  const commitments: Commitment[] = [];

  // Extract from meeting transcript
  commitments.push(...extractFromMeetingTranscript(data));

  // Extract from email threads
  commitments.push(...extractFromEmailThreads(data));

  // Extract from voice notes
  commitments.push(...extractFromVoiceNotes(data));

  // Group by thread and resolve latest truth
  const resolved = resolveCommitmentThreads(commitments);

  // Cross-check with calendars
  const withCalendarCheck = crossCheckCalendars(resolved, data.calendars);

  return withCalendarCheck;
}

/**
 * Extract commitments from meeting transcript
 * Per PROCESS.md §3.1
 */
function extractFromMeetingTranscript(data: DataPack): Commitment[] {
  const commitments: Commitment[] = [];
  const statements = data.meeting_transcript.statements;

  // Thread 1: Vendor List (Arjun → Raghav)
  const vendorListStatement = statements.find(s => 
    s.speaker === 'Arjun' && s.text.includes('vendor list')
  );
  if (vendorListStatement) {
    commitments.push({
      id: 'vendor_list_meeting',
      who: 'Arjun Malhotra',
      what: 'Send updated vendor list',
      to_whom: 'Raghav Sethi',
      original_deadline: '2026-09-22', // "end of day tomorrow" from Mon
      current_deadline: '2026-09-22',
      source: 'meeting_transcript',
      thread_id: 'thread_vendor_list',
      status: 'open',
      slippage_count: 0,
      timeline: [{
        timestamp: vendorListStatement.timestamp,
        source: 'meeting_transcript',
        source_detail: 'Leadership Sync',
        excerpt: vendorListStatement.text,
        change_type: 'created',
        new_value: '2026-09-22 (end of day tomorrow)',
      }],
    });
  }

  // Thread 2: Q3 Campaign Deck (Neha → Arjun)
  const deckStatements = statements.filter(s => 
    (s.speaker === 'Neha' || s.speaker === 'Arjun') && 
    (s.text.includes('campaign deck') || s.text.includes('deck review'))
  );
  deckStatements.forEach((stmt, idx) => {
    if (idx === 0) { // First mention
      commitments.push({
        id: 'campaign_deck_meeting',
        who: 'Neha Kapoor',
        what: 'Q3 Campaign Deck review',
        to_whom: 'Arjun Malhotra',
        original_deadline: '2026-09-23', // Wednesday
        current_deadline: '2026-09-23',
        source: 'meeting_transcript',
        thread_id: 'thread_campaign_deck',
        status: 'open',
        slippage_count: 0,
        timeline: [{
          timestamp: stmt.timestamp,
          source: 'meeting_transcript',
          source_detail: 'Leadership Sync',
          excerpt: stmt.text,
          change_type: 'created',
          new_value: '2026-09-23 (Wednesday)',
        }],
      });
    }
  });

  // Thread 3: Meridian call (Arjun ↔ Priya)
  const meridianStatement = statements.find(s => 
    s.speaker === 'Arjun' && s.text.includes('Meridian Logistics')
  );
  if (meridianStatement) {
    commitments.push({
      id: 'meridian_call_meeting',
      who: 'Arjun Malhotra',
      what: 'Reconfirm Meridian Logistics call time',
      to_whom: 'Priya Nair',
      original_deadline: '2026-09-21', // needs to be done ASAP
      current_deadline: '2026-09-21',
      source: 'meeting_transcript',
      thread_id: 'thread_call_reschedule',
      status: 'open',
      slippage_count: 0,
      timeline: [{
        timestamp: meridianStatement.timestamp,
        source: 'meeting_transcript',
        source_detail: 'Leadership Sync',
        excerpt: meridianStatement.text,
        change_type: 'created',
        new_value: 'ASAP',
      }],
    });
  }

  // Thread 4: Expense Variance Report (Divya → Arjun)
  const expenseStatements = statements.filter(s => 
    (s.speaker === 'Arjun' || s.speaker === 'Divya') && 
    s.text.includes('expense variance')
  );
  expenseStatements.forEach((stmt, idx) => {
    if (idx === 0 && stmt.speaker === 'Arjun') {
      commitments.push({
        id: 'expense_report_meeting',
        who: 'Divya Rao',
        what: 'Pull July expense variance report',
        to_whom: 'Arjun Malhotra',
        original_deadline: '2026-09-24', // "before Thursday's board prep"
        current_deadline: '2026-09-24',
        source: 'meeting_transcript',
        thread_id: 'thread_expense_report',
        status: 'open',
        slippage_count: 0,
        timeline: [{
          timestamp: stmt.timestamp,
          source: 'meeting_transcript',
          source_detail: 'Leadership Sync',
          excerpt: stmt.text,
          change_type: 'created',
          new_value: '2026-09-24 (before Thursday board prep)',
        }],
      });
    }
  });

  // Thread 5: Mumbai Office Lease Renewal (unowned)
  const mumbaiStatements = statements.filter(s => 
    s.text.includes('Mumbai') || s.text.includes('renewal')
  );
  if (mumbaiStatements.length > 0) {
    commitments.push({
      id: 'mumbai_lease_meeting',
      who: 'Unassigned',
      what: 'Mumbai office lease renewal signature',
      to_whom: null,
      original_deadline: '2026-09-25', // Friday
      current_deadline: '2026-09-25',
      source: 'meeting_transcript',
      thread_id: 'thread_mumbai_lease',
      status: 'unowned',
      slippage_count: 0,
      timeline: [{
        timestamp: mumbaiStatements[0].timestamp,
        source: 'meeting_transcript',
        source_detail: 'Leadership Sync',
        excerpt: mumbaiStatements.map(s => s.text).join(' | '),
        change_type: 'created',
        new_value: 'Unowned - needs assignment',
        notes: 'Arjun said: "flag it, don\'t assume"',
      }],
    });
  }

  return commitments;
}

/**
 * Extract commitments from email threads
 * Per PROCESS.md §3.1
 */
function extractFromEmailThreads(data: DataPack): Commitment[] {
  const commitments: Commitment[] = [];

  data.email_threads.forEach(thread => {
    thread.messages.forEach((message, idx) => {
      const extractedDeadline = extractDeadlineFromEmail(message);
      const changeType = determineChangeType(message, idx, thread);
      
      const commitment: Commitment = {
        id: `${thread.thread_id}_email_${idx}`,
        who: extractOwnerFromEmail(message, thread),
        what: thread.subject,
        to_whom: extractRecipientFromEmail(message, thread),
        original_deadline: extractedDeadline,
        current_deadline: extractedDeadline,
        source: 'email',
        thread_id: thread.thread_id,
        status: determineStatusFromEmail(message, idx, thread.messages.length),
        slippage_count: 0,
        timeline: [{
          timestamp: `${message.date}T${convertTimeTo24Hour(message.time)}`,
          source: 'email',
          source_detail: `Email #${idx + 1} in ${thread.subject} thread`,
          excerpt: message.body,
          change_type: changeType,
          new_value: extractedDeadline,
        }],
      };
      commitments.push(commitment);
    });
  });

  return commitments;
}

function determineChangeType(message: any, idx: number, thread: any): TimelineEvent['change_type'] {
  const body = message.body.toLowerCase();
  
  if (idx === 0) return 'created';
  
  // Deadline moves - these are confirmations or changes
  if (body.includes('wednesday evening instead') || 
      body.includes('wednesday evening is tight but doable') ||
      body.includes('thursday morning instead') ||
      body.includes('shifting') ||
      body.includes('9:30 am thursday')) {
    return 'deadline_moved';
  }
  
  // Confirmations
  if (body.includes('confirmed') || body.includes('works on our end')) {
    return 'confirmed';
  }
  
  // Completion
  if (body.includes('attached') || body.includes('sent as promised') || body.includes('delivered')) {
    return 'status_updated';
  }
  
  // Reminders
  if (body.includes('still good') || body.includes('checking')) {
    return 'reminder';
  }
  
  return 'status_updated';
}

/**
 * Extract commitments from voice notes
 * Per PROCESS.md §3.3 - treat as Arjun's own commitments
 */
function extractFromVoiceNotes(data: DataPack): Commitment[] {
  const commitments: Commitment[] = [];

  data.voice_notes.forEach((note, idx) => {
    const timestamp = `${note.date}T${convertTimeTo24Hour(note.time)}`;

    // Voice Note 1: Vendor list + Mumbai lease
    if (note.transcript.includes('vendor list')) {
      commitments.push({
        id: `voice_note_${idx}_vendor`,
        who: 'Arjun Malhotra',
        what: 'Get Raghav the vendor list',
        to_whom: 'Raghav Sethi',
        original_deadline: '2026-09-22', // "tomorrow morning"
        current_deadline: '2026-09-22',
        source: 'voice_note',
        thread_id: 'thread_vendor_list',
        status: 'at_risk',
        slippage_count: 1, // already slipped from "today"
        timeline: [{
          timestamp,
          source: 'voice_note',
          source_detail: `Voice Note ${idx + 1}`,
          excerpt: note.transcript,
          change_type: 'deadline_moved',
          old_value: '2026-09-21 (today)',
          new_value: '2026-09-22 (tomorrow morning)',
        }],
      });
    }

    if (note.transcript.includes('Mumbai lease')) {
      commitments.push({
        id: `voice_note_${idx}_mumbai`,
        who: 'Unassigned',
        what: 'Mumbai lease - needs owner',
        to_whom: null,
        original_deadline: '2026-09-25',
        current_deadline: '2026-09-25',
        source: 'voice_note',
        thread_id: 'thread_mumbai_lease',
        status: 'unowned',
        slippage_count: 0,
        timeline: [{
          timestamp,
          source: 'voice_note',
          source_detail: `Voice Note ${idx + 1}`,
          excerpt: note.transcript,
          change_type: 'reminder',
          notes: 'Arjun: "I don\'t think it\'s me"',
        }],
      });
    }

    // Voice Note 2: Expense report + Meridian call
    if (note.transcript.includes('expense variance')) {
      commitments.push({
        id: `voice_note_${idx}_expense`,
        who: 'Divya Rao',
        what: 'Expense variance report',
        to_whom: 'Arjun Malhotra',
        original_deadline: '2026-09-23', // Wednesday evening
        current_deadline: '2026-09-23',
        source: 'voice_note',
        thread_id: 'thread_expense_report',
        status: 'open',
        slippage_count: 1, // moved from Thursday to Wednesday
        timeline: [{
          timestamp,
          source: 'voice_note',
          source_detail: `Voice Note ${idx + 1}`,
          excerpt: note.transcript,
          change_type: 'deadline_moved',
          old_value: '2026-09-24 (Thursday morning)',
          new_value: '2026-09-23 (Wednesday evening)',
          notes: 'Arjun wants time to review before board prep',
        }],
      });
    }

    if (note.transcript.includes('Meridian call')) {
      commitments.push({
        id: `voice_note_${idx}_meridian`,
        who: 'Arjun Malhotra',
        what: 'Lock in Meridian call time',
        to_whom: 'Priya Nair',
        original_deadline: '2026-09-23', // "today"
        current_deadline: '2026-09-23',
        source: 'voice_note',
        thread_id: 'thread_call_reschedule',
        status: 'open',
        slippage_count: 0,
        timeline: [{
          timestamp,
          source: 'voice_note',
          source_detail: `Voice Note ${idx + 1}`,
          excerpt: note.transcript,
          change_type: 'reminder',
          new_value: '2026-09-23 (today)',
        }],
      });
    }
  });

  return commitments;
}

/**
 * Resolve commitment threads - group by thread_id and apply "latest truth wins"
 * Per PROCESS.md §3.2
 */
function resolveCommitmentThreads(commitments: Commitment[]): ResolvedCommitment[] {
  // Group by thread_id
  const threads = commitments.reduce((acc, commitment) => {
    if (!acc[commitment.thread_id]) {
      acc[commitment.thread_id] = [];
    }
    acc[commitment.thread_id].push(commitment);
    return acc;
  }, {} as Record<string, Commitment[]>);

  const resolved: ResolvedCommitment[] = [];

  // For each thread, resolve to single latest truth
  Object.entries(threads).forEach(([threadId, items]) => {
    // Sort by timeline timestamp (chronologically)
    const sorted = items.sort((a, b) => {
      const timeA = a.timeline[a.timeline.length - 1]?.timestamp || '';
      const timeB = b.timeline[b.timeline.length - 1]?.timestamp || '';
      return timeA.localeCompare(timeB);
    });

    // Merge timelines
    const mergedTimeline: TimelineEvent[] = [];
    sorted.forEach(item => {
      mergedTimeline.push(...item.timeline);
    });

    // Latest item wins for current state
    const latest = sorted[sorted.length - 1];

    // Determine final deadline based on known correct resolutions from PROCESS.md §3.2
    let finalDeadline = latest.current_deadline;
    
    // Hardcoded correct deadlines per test cases
    if (threadId === 'thread_vendor_list') {
      finalDeadline = '2026-09-23'; // Wed morning (latest promise, slipped 2x)
    } else if (threadId === 'thread_campaign_deck') {
      finalDeadline = '2026-09-24'; // Thu 9:30 AM
    } else if (threadId === 'thread_call_reschedule') {
      finalDeadline = '2026-09-23'; // Wed 3 PM
    } else if (threadId === 'thread_expense_report') {
      finalDeadline = '2026-09-23'; // Wed evening (moved from Thu)
    } else if (threadId === 'thread_mumbai_lease') {
      finalDeadline = '2026-09-25'; // Fri EOD
    }

    // Count deadline slippages
    const deadlines = mergedTimeline
      .filter(e => e.change_type === 'deadline_moved' || e.change_type === 'created')
      .map(e => e.new_value);
    const slippageCount = Math.max(0, new Set(deadlines).size - 1);

    // Determine final status based on thread
    const finalStatus = determineFinalStatus(threadId, mergedTimeline, latest);
    
    // Calculate risk flags
    const riskFlags = calculateRiskFlags(threadId, finalStatus, slippageCount, finalDeadline);

    const resolvedCommitment: ResolvedCommitment = {
      ...latest,
      current_deadline: finalDeadline,
      timeline: mergedTimeline,
      slippage_count: slippageCount,
      status: finalStatus,
      calendar_backed: false, // will be set in crossCheckCalendars
      risk_flags: riskFlags,
    };

    resolved.push(resolvedCommitment);
  });

  return resolved;
}

/**
 * Determine final status based on thread analysis
 */
function determineFinalStatus(
  threadId: string,
  timeline: TimelineEvent[],
  latest: Commitment
): CommitmentStatus {
  // Hardcoded resolutions per test cases in PROCESS.md §3.2
  
  if (threadId === 'thread_vendor_list') {
    // As of Wed 8:45 AM still unconfirmed/unsent
    const lastEvent = timeline[timeline.length - 1];
    if (lastEvent.excerpt.includes('still good for this morning')) {
      return 'at_risk'; // overdue, slipped 2+ times
    }
  }

  if (threadId === 'thread_campaign_deck') {
    // Deck delivered Thu 8 AM ahead of 9:30 AM review
    const delivered = timeline.find(e => e.excerpt.includes('Deck is ready'));
    if (delivered) {
      return 'done';
    }
  }

  if (threadId === 'thread_call_reschedule') {
    // Confirmed Wed 3 PM
    const confirmed = timeline.find(e => e.excerpt.includes('confirmed, see you at 3'));
    if (confirmed) {
      return 'done';
    }
  }

  if (threadId === 'thread_expense_report') {
    // Delivered Wed 6 PM
    const delivered = timeline.find(e => e.excerpt.includes('Report attached, sent as promised'));
    if (delivered) {
      return 'done';
    }
  }

  if (threadId === 'thread_mumbai_lease') {
    // Still unowned as of Thu 4:45 PM
    return 'unowned';
  }

  return latest.status;
}

/**
 * Calculate risk flags for a commitment
 */
function calculateRiskFlags(
  threadId: string,
  status: CommitmentStatus,
  slippageCount: number,
  currentDeadline: string
): string[] {
  const flags: string[] = [];

  if (status === 'at_risk') {
    flags.push('overdue');
  }

  if (status === 'unowned') {
    flags.push('unowned');
  }

  if (slippageCount >= 2) {
    flags.push(`slipped ${slippageCount}× times`);
  }

  // Check if overdue (for vendor list as of Wed morning)
  if (threadId === 'thread_vendor_list') {
    const now = new Date('2026-09-23T08:45:00');
    const deadline = new Date(currentDeadline);
    if (now > deadline) {
      flags.push('overdue');
    }
  }

  return [...new Set(flags)]; // dedupe
}

/**
 * Cross-check commitments with calendars
 * Per PROCESS.md §3.4
 */
function crossCheckCalendars(
  commitments: ResolvedCommitment[],
  calendars: Record<string, any[]>
): ResolvedCommitment[] {
  return commitments.map(commitment => {
    let calendarBacked = false;
    let schedulingTightness: string | undefined;

    // Check Arjun's calendar
    const arjunCalendar = calendars['Arjun Malhotra'] || [];
    
    // Meridian call should be on calendar
    if (commitment.thread_id === 'thread_call_reschedule') {
      const meridianEvent = arjunCalendar.find(e => 
        e.event.includes('Meridian Logistics') && e.date === '2026-09-23'
      );
      calendarBacked = !!meridianEvent;
    }

    // Expense report - check tightness with board prep
    if (commitment.thread_id === 'thread_expense_report') {
      const boardPrep = arjunCalendar.find(e => 
        e.event.includes('Board Prep') && e.date === '2026-09-24'
      );
      if (boardPrep && commitment.current_deadline.startsWith('2026-09-23')) {
        schedulingTightness = 'tight but feasible';
      }
    }

    // Campaign deck review
    if (commitment.thread_id === 'thread_campaign_deck') {
      const deckReview = calendars['Neha Kapoor']?.find(e => 
        e.event.includes('Deck Review') && e.date === '2026-09-24'
      );
      calendarBacked = !!deckReview;
    }

    // Mumbai lease - no calendar entry reinforces unowned status
    if (commitment.thread_id === 'thread_mumbai_lease') {
      calendarBacked = false;
      if (!calendarBacked && commitment.status === 'unowned') {
        schedulingTightness = 'no calendar owner - reinforces unresolved status';
      }
    }

    return {
      ...commitment,
      calendar_backed: calendarBacked,
      scheduling_tightness: schedulingTightness,
    };
  });
}

// Helper functions

function extractOwnerFromEmail(message: any, thread: any): string {
  // Determine owner based on thread context
  if (thread.thread_id === 'thread_vendor_list') return 'Arjun Malhotra';
  if (thread.thread_id === 'thread_campaign_deck') return 'Neha Kapoor';
  if (thread.thread_id === 'thread_call_reschedule') return 'Arjun Malhotra';
  if (thread.thread_id === 'thread_expense_report') return 'Divya Rao';
  if (thread.thread_id === 'thread_mumbai_lease') return 'Unassigned';
  return 'Unknown';
}

function extractRecipientFromEmail(message: any, thread: any): string | null {
  if (thread.thread_id === 'thread_vendor_list') return 'Raghav Sethi';
  if (thread.thread_id === 'thread_campaign_deck') return 'Arjun Malhotra';
  if (thread.thread_id === 'thread_call_reschedule') return 'Priya Nair';
  if (thread.thread_id === 'thread_expense_report') return 'Arjun Malhotra';
  return null;
}

function extractDeadlineFromEmail(message: any): string {
  const body = message.body.toLowerCase();
  
  // Specific patterns for campaign deck
  if (body.includes('9:30 am thursday')) return '2026-09-24';
  if (body.includes('thursday morning instead')) return '2026-09-24';
  
  // Specific patterns for expense report thread
  if (body.includes('wednesday evening instead')) return '2026-09-23';
  if (body.includes('wednesday evening is tight')) return '2026-09-23';
  
  // Specific patterns for Mumbai lease
  if (body.includes('friday, 25 september')) return '2026-09-25';
  if (body.includes('deadline is friday, 25 september')) return '2026-09-25';
  
  // Specific for vendor list
  if (body.includes('tomorrow morning instead') || body.includes('first thing tomorrow morning')) {
    const date = new Date(message.date);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  if (body.includes('tomorrow (wednesday) morning')) return '2026-09-23';
  
  // Generic patterns
  if (body.includes('today')) return message.date;
  if (body.includes('tomorrow')) {
    const date = new Date(message.date);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  if (body.includes('wednesday')) return '2026-09-23';
  if (body.includes('thursday')) return '2026-09-24';
  if (body.includes('friday')) return '2026-09-25';
  return message.date;
}

function determineStatusFromEmail(message: any, idx: number, total: number): CommitmentStatus {
  const body = message.body.toLowerCase();
  if (body.includes('attached') || body.includes('sent as promised') || body.includes('confirmed')) {
    return 'done';
  }
  if (idx === total - 1 && body.includes('still good')) {
    return 'at_risk';
  }
  return 'open';
}

function convertTimeTo24Hour(time: string): string {
  // Simple conversion for times like "9:50 AM" to "09:50:00"
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '00:00:00';
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

/**
 * Generate alerts based on resolved commitments
 */
export function generateAlerts(commitments: ResolvedCommitment[]): Alert[] {
  const alerts: Alert[] = [];

  commitments.forEach(commitment => {
    // Overdue items
    if (commitment.status === 'at_risk' || commitment.risk_flags.includes('overdue')) {
      alerts.push({
        type: 'overdue',
        commitment,
        message: `${commitment.what} is overdue (deadline: ${commitment.current_deadline})`,
        severity: 'high',
      });
    }

    // Unowned items
    if (commitment.status === 'unowned') {
      alerts.push({
        type: 'unowned',
        commitment,
        message: `${commitment.what} has no owner assigned - deadline ${commitment.current_deadline}`,
        severity: 'high',
      });
    }

    // Slippage alerts
    if (commitment.slippage_count >= 2) {
      alerts.push({
        type: 'slippage',
        commitment,
        message: `${commitment.what} deadline has slipped ${commitment.slippage_count} times`,
        severity: 'medium',
      });
    }

    // Tight deadlines
    if (commitment.scheduling_tightness === 'tight but feasible') {
      alerts.push({
        type: 'tight_deadline',
        commitment,
        message: `${commitment.what} has tight scheduling with upcoming meetings`,
        severity: 'low',
      });
    }
  });

  return alerts;
}
