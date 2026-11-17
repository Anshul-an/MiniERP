export const LEAVE_DEFAULTS = {
  SICK: 10,
  CASUAL: 12,
  ANNUAL: 15,
} as const;

export const LEAVE_TYPES = ['SICK', 'CASUAL', 'ANNUAL'] as const;

// Additional constants
export const MAX_ANNUAL_LEAVE_DAYS = 20;
export const MAX_SICK_LEAVE_DAYS = 12;
export const MAX_CASUAL_LEAVE_DAYS = 10;
export const WORKING_DAYS_PER_WEEK = 5;
// add: LEAVE_TYPES array for validation
// add: ANNUAL leave resets yearly not monthly
