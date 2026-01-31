/**
 * Date/Time Utilities using Luxon
 * 
 * Luxon is a powerful, modern, and friendly wrapper for JavaScript dates and times.
 * It provides immutable date objects and chainable API.
 */

import { DateTime, Duration, Interval } from 'luxon';

/**
 * Default locale and timezone
 * You can override these in specific functions
 */
const DEFAULT_LOCALE = 'tr';
const DEFAULT_TIMEZONE = 'Europe/Istanbul';

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',           // 31/12/2024
  MEDIUM: 'dd MMM yyyy',          // 31 Ara 2024
  LONG: 'dd MMMM yyyy',           // 31 Aralık 2024
  FULL: 'EEEE, dd MMMM yyyy',    // Salı, 31 Aralık 2024
  ISO: 'yyyy-MM-dd',              // 2024-12-31
} as const;

/**
 * Time Formats
 */
export const TIME_FORMATS = {
  SHORT: 'HH:mm',                 // 14:30
  MEDIUM: 'HH:mm:ss',             // 14:30:45
  LONG: 'HH:mm:ss.SSS',           // 14:30:45.123
} as const;

/**
 * DateTime Formats
 */
export const DATETIME_FORMATS = {
  SHORT: 'dd/MM/yyyy HH:mm',      // 31/12/2024 14:30
  MEDIUM: 'dd MMM yyyy HH:mm',    // 31 Ara 2024 14:30
  LONG: 'dd MMMM yyyy HH:mm:ss',  // 31 Aralık 2024 14:30:45
  FULL: 'EEEE, dd MMMM yyyy HH:mm:ss', // Salı, 31 Aralık 2024 14:30:45
  ISO: "yyyy-MM-dd'T'HH:mm:ss",   // 2024-12-31T14:30:45
} as const;

// ============================================
// CREATION & PARSING
// ============================================

/**
 * Get current date/time
 */
export function now(timezone?: string): DateTime {
  return DateTime.now().setZone(timezone || DEFAULT_TIMEZONE);
}

/**
 * Create DateTime from various inputs
 */
export function createDateTime(
  input: string | number | Date,
  options?: { timezone?: string; locale?: string }
): DateTime {
  const timezone = options?.timezone || DEFAULT_TIMEZONE;
  const locale = options?.locale || DEFAULT_LOCALE;

  let dt: DateTime;

  if (typeof input === 'string') {
    // Try ISO format first
    dt = DateTime.fromISO(input, { zone: timezone });
    
    // If invalid, try RFC2822 format
    if (!dt.isValid) {
      dt = DateTime.fromRFC2822(input, { zone: timezone });
    }
    
    // If still invalid, try HTTP format
    if (!dt.isValid) {
      dt = DateTime.fromHTTP(input, { zone: timezone });
    }
  } else if (typeof input === 'number') {
    // Timestamp
    dt = DateTime.fromMillis(input, { zone: timezone });
  } else {
    // Date object
    dt = DateTime.fromJSDate(input, { zone: timezone });
  }

  return dt.setLocale(locale);
}

/**
 * Parse date from custom format
 */
export function parseDate(
  dateString: string,
  format: string,
  options?: { timezone?: string; locale?: string }
): DateTime {
  const timezone = options?.timezone || DEFAULT_TIMEZONE;
  const locale = options?.locale || DEFAULT_LOCALE;

  return DateTime.fromFormat(dateString, format, {
    zone: timezone,
    locale,
  });
}

// ============================================
// FORMATTING
// ============================================

/**
 * Format date
 */
export function formatDate(
  input: string | number | Date | DateTime,
  format: keyof typeof DATE_FORMATS | string = 'MEDIUM',
  options?: { timezone?: string; locale?: string }
): string {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  const dateFormat = DATE_FORMATS[format as keyof typeof DATE_FORMATS] || format;
  return dt.toFormat(dateFormat);
}

/**
 * Format time
 */
export function formatTime(
  input: string | number | Date | DateTime,
  format: keyof typeof TIME_FORMATS | string = 'SHORT',
  options?: { timezone?: string; locale?: string }
): string {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  const timeFormat = TIME_FORMATS[format as keyof typeof TIME_FORMATS] || format;
  return dt.toFormat(timeFormat);
}

/**
 * Format date and time
 */
export function formatDateTime(
  input: string | number | Date | DateTime,
  format: keyof typeof DATETIME_FORMATS | string = 'MEDIUM',
  options?: { timezone?: string; locale?: string }
): string {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  const datetimeFormat = DATETIME_FORMATS[format as keyof typeof DATETIME_FORMATS] || format;
  return dt.toFormat(datetimeFormat);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelative(
  input: string | number | Date | DateTime,
  options?: { timezone?: string; locale?: string; base?: DateTime }
): string {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  const base = options?.base || now(options?.timezone);
  return dt.toRelative({ base }) || '';
}

/**
 * Format relative time with calendar context
 * (e.g., "today at 2:30 PM", "yesterday at 5:00 PM", "tomorrow at 9:00 AM")
 */
export function formatRelativeCalendar(
  input: string | number | Date | DateTime,
  options?: { timezone?: string; locale?: string }
): string {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  return dt.toRelativeCalendar() || '';
}

// ============================================
// MANIPULATION
// ============================================

/**
 * Add duration to date
 */
export function addToDate(
  input: string | number | Date | DateTime,
  duration: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  },
  options?: { timezone?: string; locale?: string }
): DateTime {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  return dt.plus(duration);
}

/**
 * Subtract duration from date
 */
export function subtractFromDate(
  input: string | number | Date | DateTime,
  duration: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  },
  options?: { timezone?: string; locale?: string }
): DateTime {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  return dt.minus(duration);
}

/**
 * Start of period (day, week, month, year)
 */
export function startOf(
  input: string | number | Date | DateTime,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute',
  options?: { timezone?: string; locale?: string }
): DateTime {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  return dt.startOf(unit);
}

/**
 * End of period (day, week, month, year)
 */
export function endOf(
  input: string | number | Date | DateTime,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute',
  options?: { timezone?: string; locale?: string }
): DateTime {
  const dt = input instanceof DateTime 
    ? input 
    : createDateTime(input, options);

  return dt.endOf(unit);
}

// ============================================
// COMPARISON
// ============================================

/**
 * Check if date is before another date
 */
export function isBefore(
  date1: string | number | Date | DateTime,
  date2: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  const dt1 = date1 instanceof DateTime ? date1 : createDateTime(date1, options);
  const dt2 = date2 instanceof DateTime ? date2 : createDateTime(date2, options);

  return dt1 < dt2;
}

/**
 * Check if date is after another date
 */
export function isAfter(
  date1: string | number | Date | DateTime,
  date2: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  const dt1 = date1 instanceof DateTime ? date1 : createDateTime(date1, options);
  const dt2 = date2 instanceof DateTime ? date2 : createDateTime(date2, options);

  return dt1 > dt2;
}

/**
 * Check if dates are equal
 */
export function isEqual(
  date1: string | number | Date | DateTime,
  date2: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  const dt1 = date1 instanceof DateTime ? date1 : createDateTime(date1, options);
  const dt2 = date2 instanceof DateTime ? date2 : createDateTime(date2, options);

  return dt1.equals(dt2);
}

/**
 * Check if date is between two dates
 */
export function isBetween(
  date: string | number | Date | DateTime,
  start: string | number | Date | DateTime,
  end: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  const dt = date instanceof DateTime ? date : createDateTime(date, options);
  const startDt = start instanceof DateTime ? start : createDateTime(start, options);
  const endDt = end instanceof DateTime ? end : createDateTime(end, options);

  const interval = Interval.fromDateTimes(startDt, endDt);
  return interval.contains(dt);
}

/**
 * Check if date is today
 */
export function isToday(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  const today = now(options?.timezone);

  return dt.hasSame(today, 'day');
}

/**
 * Check if date is past
 */
export function isPast(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  return isBefore(input, now(options?.timezone), options);
}

/**
 * Check if date is future
 */
export function isFuture(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): boolean {
  return isAfter(input, now(options?.timezone), options);
}

// ============================================
// DIFFERENCE & DURATION
// ============================================

/**
 * Get difference between two dates
 */
export function getDifference(
  date1: string | number | Date | DateTime,
  date2: string | number | Date | DateTime,
  unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds' = 'milliseconds',
  options?: { timezone?: string }
): number {
  const dt1 = date1 instanceof DateTime ? date1 : createDateTime(date1, options);
  const dt2 = date2 instanceof DateTime ? date2 : createDateTime(date2, options);

  const diff = dt1.diff(dt2, unit);
  return diff.as(unit);
}

/**
 * Get duration between two dates (with multiple units)
 */
export function getDuration(
  date1: string | number | Date | DateTime,
  date2: string | number | Date | DateTime,
  units: Array<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'> = ['days', 'hours', 'minutes'],
  options?: { timezone?: string }
): Duration {
  const dt1 = date1 instanceof DateTime ? date1 : createDateTime(date1, options);
  const dt2 = date2 instanceof DateTime ? date2 : createDateTime(date2, options);

  return dt1.diff(dt2, units);
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(
  duration: Duration | { years?: number; months?: number; days?: number; hours?: number; minutes?: number; seconds?: number },
  options?: { locale?: string }
): string {
  const dur = duration instanceof Duration 
    ? duration 
    : Duration.fromObject(duration);

  // Luxon Duration.toHuman() doesn't support locale parameter directly
  return dur.toHuman();
}

// ============================================
// VALIDATION
// ============================================

/**
 * Check if date is valid
 */
export function isValidDate(input: string | number | Date): boolean {
  try {
    const dt = createDateTime(input);
    return dt.isValid;
  } catch {
    return false;
  }
}

/**
 * Validate date string with specific format
 */
export function isValidFormat(
  dateString: string,
  format: string,
  options?: { timezone?: string; locale?: string }
): boolean {
  try {
    const dt = parseDate(dateString, format, options);
    return dt.isValid;
  } catch {
    return false;
  }
}

// ============================================
// TIMEZONE
// ============================================

/**
 * Convert date to different timezone
 */
export function changeTimezone(
  input: string | number | Date | DateTime,
  timezone: string,
  options?: { locale?: string }
): DateTime {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  return dt.setZone(timezone);
}

/**
 * Get timezone offset
 */
export function getTimezoneOffset(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): number {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  return dt.offset;
}

/**
 * Get list of available timezones
 */
export function getTimezones(): string[] {
  // Note: Luxon doesn't provide a built-in list, but you can use Intl.supportedValuesOf
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    return (Intl as any).supportedValuesOf('timeZone');
  }
  
  // Fallback to common timezones
  return [
    'Europe/Istanbul',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];
}

// ============================================
// HELPERS
// ============================================

/**
 * Get age from birthdate
 */
export function getAge(
  birthdate: string | number | Date | DateTime,
  options?: { timezone?: string; referenceDate?: DateTime }
): number {
  const dt = birthdate instanceof DateTime ? birthdate : createDateTime(birthdate, options);
  const reference = options?.referenceDate || now(options?.timezone);

  return Math.floor(getDifference(reference, dt, 'years', options));
}

/**
 * Check if year is leap year
 */
export function isLeapYear(year: number): boolean {
  return DateTime.local(year, 1, 1).isInLeapYear;
}

/**
 * Get days in month
 */
export function getDaysInMonth(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): number {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  return dt.daysInMonth || 0;
}

/**
 * Get week number
 */
export function getWeekNumber(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): number {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  return dt.weekNumber;
}

/**
 * Get quarter
 */
export function getQuarter(
  input: string | number | Date | DateTime,
  options?: { timezone?: string }
): number {
  const dt = input instanceof DateTime ? input : createDateTime(input, options);
  return dt.quarter;
}
