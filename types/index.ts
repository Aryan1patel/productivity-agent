// Core types for the Executive Productivity Agent

export type CommitmentStatus = 'open' | 'at_risk' | 'done' | 'unowned';

export interface Person {
  name: string;
  role: string;
  email: string;
}

export interface Metadata {
  week_start: string;
  week_end: string;
  user: Person;
}

export interface MeetingStatement {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface MeetingTranscript {
  title: string;
  date: string;
  time: string;
  attendees: string[];
  statements: MeetingStatement[];
}

export interface CalendarEvent {
  date: string;
  day: string;
  time: string;
  event: string;
}

export interface EmailMessage {
  date: string;
  time: string;
  from: string;
  to: string;
  body: string;
}

export interface EmailThread {
  subject: string;
  thread_id: string;
  messages: EmailMessage[];
}

export interface VoiceNote {
  date: string;
  time: string;
  location: string;
  transcript: string;
}

export interface DataPack {
  metadata: Metadata;
  people: Person[];
  meeting_transcript: MeetingTranscript;
  calendars: Record<string, CalendarEvent[]>;
  email_threads: EmailThread[];
  voice_notes: VoiceNote[];
}

// Processing types

export interface Commitment {
  id: string;
  who: string; // owner
  what: string; // the task/commitment
  to_whom: string | null; // who it's owed to
  original_deadline: string;
  current_deadline: string;
  source: string; // transcript | email thread | voice note | calendar
  thread_id: string; // to group related commitments
  status: CommitmentStatus;
  slippage_count: number; // how many times deadline moved
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  timestamp: string;
  source: string;
  source_detail: string; // e.g., "Email #3 in Vendor List thread"
  excerpt: string; // raw text from source
  change_type: 'created' | 'deadline_moved' | 'status_updated' | 'confirmed' | 'reminder';
  old_value?: string;
  new_value?: string;
  notes?: string;
}

export interface ResolvedCommitment extends Commitment {
  calendar_backed: boolean; // does it have a calendar entry?
  scheduling_tightness?: string; // e.g., "tight but feasible"
  risk_flags: string[]; // e.g., ["overdue", "slipped 2+ times", "unowned"]
}

export interface DailyBriefing {
  date: string;
  day: string;
  calendar_events: CalendarEvent[];
  commitments_due: ResolvedCommitment[];
  at_risk_items: ResolvedCommitment[];
}

export interface WeeklyStatusBoard {
  week: string;
  items: ResolvedCommitment[];
  summary: {
    open: number;
    at_risk: number;
    done: number;
    unowned: number;
  };
}

export interface Alert {
  type: 'overdue' | 'unowned' | 'slippage' | 'tight_deadline';
  commitment: ResolvedCommitment;
  message: string;
  severity: 'high' | 'medium' | 'low';
}
