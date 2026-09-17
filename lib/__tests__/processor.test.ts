// Test file for processor logic
// Validates all test cases from PROCESS.md §3.2

import { processDataPack, generateAlerts } from '../processor';
import datapack from '../../data/datapack.json';
import { DataPack } from '@/types';

describe('Executive Productivity Agent - Core Processor', () => {
  const data = datapack as DataPack;
  const resolved = processDataPack(data);

  // Test Case 1: Vendor List (Arjun → Raghav)
  test('TC1: Vendor list should be at_risk/overdue with 2+ slippages', () => {
    const vendorList = resolved.find(c => c.thread_id === 'thread_vendor_list');
    
    expect(vendorList).toBeDefined();
    expect(vendorList?.status).toBe('at_risk');
    expect(vendorList?.slippage_count).toBeGreaterThanOrEqual(2);
    expect(vendorList?.who).toBe('Arjun Malhotra');
    expect(vendorList?.to_whom).toBe('Raghav Sethi');
    expect(vendorList?.risk_flags).toContain('overdue');
  });

  // Test Case 2: Q3 Campaign Deck (Neha → Arjun)
  test('TC2: Campaign deck should be done, delivered Thu 8 AM', () => {
    const campaignDeck = resolved.find(c => c.thread_id === 'thread_campaign_deck');
    
    expect(campaignDeck).toBeDefined();
    expect(campaignDeck?.status).toBe('done');
    expect(campaignDeck?.who).toBe('Neha Kapoor');
    expect(campaignDeck?.to_whom).toBe('Arjun Malhotra');
    expect(campaignDeck?.current_deadline).toBe('2026-09-24'); // Thu 9:30 AM
  });

  // Test Case 3: Meridian Call Reschedule (Arjun ↔ Priya)
  test('TC3: Meridian call should be done, confirmed Wed 3 PM', () => {
    const meridianCall = resolved.find(c => c.thread_id === 'thread_call_reschedule');
    
    expect(meridianCall).toBeDefined();
    expect(meridianCall?.status).toBe('done');
    expect(meridianCall?.calendar_backed).toBe(true); // matches calendar entry
    expect(meridianCall?.who).toBe('Arjun Malhotra');
    expect(meridianCall?.to_whom).toBe('Priya Nair');
  });

  // Test Case 4: Expense Variance Report (Divya → Arjun)
  test('TC4: Expense report should be done, delivered Wed 6 PM', () => {
    const expenseReport = resolved.find(c => c.thread_id === 'thread_expense_report');
    
    expect(expenseReport).toBeDefined();
    expect(expenseReport?.status).toBe('done');
    expect(expenseReport?.who).toBe('Divya Rao');
    expect(expenseReport?.to_whom).toBe('Arjun Malhotra');
    expect(expenseReport?.current_deadline).toBe('2026-09-23'); // Wed evening
    expect(expenseReport?.scheduling_tightness).toBe('tight but feasible');
  });

  // Test Case 5: Mumbai Office Lease Renewal
  test('TC5: Mumbai lease should be unowned, NOT assigned to Arjun', () => {
    const mumbaiLease = resolved.find(c => c.thread_id === 'thread_mumbai_lease');
    
    expect(mumbaiLease).toBeDefined();
    expect(mumbaiLease?.status).toBe('unowned');
    expect(mumbaiLease?.who).toBe('Unassigned');
    expect(mumbaiLease?.who).not.toBe('Arjun Malhotra'); // Critical: NOT Arjun
    expect(mumbaiLease?.current_deadline).toBe('2026-09-25'); // Fri EOD
    expect(mumbaiLease?.risk_flags).toContain('unowned');
    expect(mumbaiLease?.calendar_backed).toBe(false);
  });

  // Test: Total threads resolved
  test('Should resolve exactly 5 threads', () => {
    expect(resolved.length).toBe(5);
  });

  // Test: Alerts generation
  test('Should generate alerts for at-risk and unowned items', () => {
    const alerts = generateAlerts(resolved);
    
    // Should have overdue alert (vendor list)
    const overdueAlert = alerts.find(a => a.type === 'overdue');
    expect(overdueAlert).toBeDefined();
    
    // Should have unowned alert (Mumbai lease)
    const unownedAlert = alerts.find(a => a.type === 'unowned');
    expect(unownedAlert).toBeDefined();
    
    // Should have slippage alert
    const slippageAlert = alerts.find(a => a.type === 'slippage');
    expect(slippageAlert).toBeDefined();
  });

  // Test: Timeline integrity
  test('Each commitment should have complete timeline', () => {
    resolved.forEach(commitment => {
      expect(commitment.timeline.length).toBeGreaterThan(0);
      commitment.timeline.forEach(event => {
        expect(event.timestamp).toBeDefined();
        expect(event.source).toBeDefined();
        expect(event.excerpt).toBeDefined();
      });
    });
  });

  // Test: Ownership rule (never silent auto-assign)
  test('No silent auto-assignment to Arjun for unowned items', () => {
    resolved.forEach(commitment => {
      if (commitment.status === 'unowned') {
        expect(commitment.who).not.toBe('Arjun Malhotra');
        expect(commitment.who).toBe('Unassigned');
      }
    });
  });
});
