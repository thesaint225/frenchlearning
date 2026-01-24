import { Test, TestStatus } from '../types';

/**
 * Calculate test status based on current date and test dates
 */
export function calculateTestStatus(test: Test): TestStatus {
  const now = new Date();
  const startDate = new Date(test.start_date);
  const endDate = new Date(test.end_date);

  if (test.status === 'draft' || test.status === 'closed') {
    return test.status;
  }

  if (now < startDate) {
    return 'scheduled';
  }

  if (now >= startDate && now <= endDate) {
    return 'active';
  }

  if (now > endDate) {
    return 'completed';
  }

  return test.status;
}

/**
 * Format time limit in minutes to readable format
 */
export function formatTimeLimit(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
}

/**
 * Calculate time remaining for a test attempt
 */
export function calculateTimeRemaining(
  startedAt: string,
  timeLimitMinutes: number
): { minutes: number; seconds: number; expired: boolean } {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  const elapsedMs = now - startTime;
  const totalMs = timeLimitMinutes * 60 * 1000;
  const remainingMs = totalMs - elapsedMs;

  if (remainingMs <= 0) {
    return { minutes: 0, seconds: 0, expired: true };
  }

  const minutes = Math.floor(remainingMs / (60 * 1000));
  const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

  return { minutes, seconds, expired: false };
}

/**
 * Validate test dates
 */
export function validateTestDates(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start >= end) {
    return 'End date must be after start date';
  }

  if (end < now) {
    return 'End date cannot be in the past';
  }

  return null;
}
