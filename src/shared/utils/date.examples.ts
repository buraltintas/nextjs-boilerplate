/**
 * Date Utilities Usage Examples
 * 
 * This file contains examples of how to use the date utilities.
 * You can import these functions in your components and use them.
 */

import {
  now,
  createDateTime,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelative,
  formatRelativeCalendar,
  addToDate,
  subtractFromDate,
  startOf,
  endOf,
  isBefore,
  isAfter,
  isToday,
  isPast,
  isFuture,
  getDifference,
  getDuration,
  formatDuration,
  getAge,
  isLeapYear,
  getDaysInMonth,
  getWeekNumber,
  getQuarter,
  changeTimezone,
  isValidDate,
} from './date';

// ============================================
// BASIC USAGE
// ============================================

export function basicExamples() {
  // Get current date/time
  const currentDate = now();
  console.log('Current:', currentDate.toISO());

  // Create DateTime from various sources
  const fromString = createDateTime('2024-12-31T14:30:00');
  const fromTimestamp = createDateTime(1735656600000);
  const fromDate = createDateTime(new Date());

  // Format dates
  console.log(formatDate(currentDate, 'SHORT'));      // 31/01/2026
  console.log(formatDate(currentDate, 'MEDIUM'));     // 31 Oca 2026
  console.log(formatDate(currentDate, 'LONG'));       // 31 Ocak 2026
  console.log(formatDate(currentDate, 'FULL'));       // Cumartesi, 31 Ocak 2026

  // Format times
  console.log(formatTime(currentDate, 'SHORT'));      // 14:30
  console.log(formatTime(currentDate, 'MEDIUM'));     // 14:30:45

  // Format date and time together
  console.log(formatDateTime(currentDate, 'SHORT'));  // 31/01/2026 14:30
  console.log(formatDateTime(currentDate, 'MEDIUM')); // 31 Oca 2026 14:30
}

// ============================================
// RELATIVE TIME
// ============================================

export function relativeTimeExamples() {
  const yesterday = subtractFromDate(now(), { days: 1 });
  const tomorrow = addToDate(now(), { days: 1 });
  const lastWeek = subtractFromDate(now(), { weeks: 1 });
  const nextMonth = addToDate(now(), { months: 1 });

  // Relative time (e.g., "2 hours ago", "in 3 days")
  console.log(formatRelative(yesterday));    // "1 gün önce"
  console.log(formatRelative(tomorrow));     // "1 gün içinde"
  console.log(formatRelative(lastWeek));     // "1 hafta önce"
  console.log(formatRelative(nextMonth));    // "1 ay içinde"

  // Calendar relative (e.g., "today at 2:30 PM", "yesterday at 5:00 PM")
  console.log(formatRelativeCalendar(yesterday)); // "dün"
  console.log(formatRelativeCalendar(tomorrow));  // "yarın"
}

// ============================================
// DATE MANIPULATION
// ============================================

export function manipulationExamples() {
  const baseDate = now();

  // Add duration
  const nextWeek = addToDate(baseDate, { weeks: 1 });
  const in2Hours = addToDate(baseDate, { hours: 2, minutes: 30 });
  
  // Subtract duration
  const lastMonth = subtractFromDate(baseDate, { months: 1 });
  const twoYearsAgo = subtractFromDate(baseDate, { years: 2 });

  // Start/End of period
  const startOfDay = startOf(baseDate, 'day');       // 00:00:00
  const endOfDay = endOf(baseDate, 'day');           // 23:59:59
  const startOfMonth = startOf(baseDate, 'month');   // First day of month
  const endOfYear = endOf(baseDate, 'year');         // Last day of year

  console.log('Start of today:', formatDateTime(startOfDay, 'LONG'));
  console.log('End of today:', formatDateTime(endOfDay, 'LONG'));
}

// ============================================
// COMPARISON
// ============================================

export function comparisonExamples() {
  const date1 = createDateTime('2024-01-15');
  const date2 = createDateTime('2024-12-31');

  // Before/After
  console.log(isBefore(date1, date2));  // true
  console.log(isAfter(date1, date2));   // false

  // Check if today
  console.log(isToday(now()));          // true
  console.log(isToday(date1));          // false

  // Check if past/future
  console.log(isPast(date1));           // true
  console.log(isFuture(date2));         // depends on current date
}

// ============================================
// DIFFERENCE & DURATION
// ============================================

export function differenceExamples() {
  const startDate = createDateTime('2024-01-01');
  const endDate = createDateTime('2024-12-31');

  // Get difference in specific unit
  const diffInDays = getDifference(endDate, startDate, 'days');
  const diffInMonths = getDifference(endDate, startDate, 'months');
  console.log(`Difference: ${diffInDays} days`);
  console.log(`Difference: ${diffInMonths} months`);

  // Get duration (multiple units)
  const duration = getDuration(endDate, startDate, ['months', 'days', 'hours']);
  console.log('Duration:', formatDuration(duration));

  // Custom duration
  const customDuration = { hours: 2, minutes: 30 };
  console.log('Custom:', formatDuration(customDuration)); // "2 saat, 30 dakika"
}

// ============================================
// PRACTICAL EXAMPLES
// ============================================

export function practicalExamples() {
  // Age calculation
  const birthdate = createDateTime('1990-05-15');
  const age = getAge(birthdate);
  console.log(`Age: ${age} years`);

  // Check leap year
  console.log('2024 is leap year:', isLeapYear(2024)); // true
  console.log('2023 is leap year:', isLeapYear(2023)); // false

  // Days in month
  const daysInFeb2024 = getDaysInMonth(createDateTime('2024-02-01'));
  console.log('Days in February 2024:', daysInFeb2024); // 29

  // Week number
  const weekNum = getWeekNumber(now());
  console.log('Current week number:', weekNum);

  // Quarter
  const quarter = getQuarter(now());
  console.log('Current quarter:', quarter);

  // Validate date
  console.log(isValidDate('2024-12-31'));           // true
  console.log(isValidDate('invalid-date'));         // false
}

// ============================================
// TIMEZONE EXAMPLES
// ============================================

export function timezoneExamples() {
  const date = now();

  // Change timezone
  const istanbulTime = changeTimezone(date, 'Europe/Istanbul');
  const londonTime = changeTimezone(date, 'Europe/London');
  const newYorkTime = changeTimezone(date, 'America/New_York');

  console.log('Istanbul:', formatDateTime(istanbulTime, 'FULL'));
  console.log('London:', formatDateTime(londonTime, 'FULL'));
  console.log('New York:', formatDateTime(newYorkTime, 'FULL'));
}

// ============================================
// REAL-WORLD USE CASES
// ============================================

/**
 * Example: Blog post timestamp
 */
export function blogPostTimestamp(createdAt: string): string {
  const postDate = createDateTime(createdAt);
  
  // If less than 24 hours, show relative time
  if (getDifference(now(), postDate, 'hours') < 24) {
    return formatRelative(postDate);
  }
  
  // If this year, show date without year
  if (postDate.year === now().year) {
    return formatDate(postDate, 'dd MMM');
  }
  
  // Otherwise, show full date
  return formatDate(postDate, 'MEDIUM');
}

/**
 * Example: Event countdown
 */
export function eventCountdown(eventDate: string): string {
  const event = createDateTime(eventDate);
  const diff = getDuration(event, now(), ['days', 'hours', 'minutes']);
  
  if (diff.as('minutes') < 0) {
    return 'Event has started!';
  }
  
  return `Starts in ${formatDuration(diff)}`;
}

/**
 * Example: Booking availability
 */
export function checkBookingAvailability(
  checkIn: string,
  checkOut: string,
  minDays: number = 1,
  maxDays: number = 30
): { valid: boolean; message: string } {
  const checkInDate = createDateTime(checkIn);
  const checkOutDate = createDateTime(checkOut);
  
  // Check if dates are valid
  if (!checkInDate.isValid || !checkOutDate.isValid) {
    return { valid: false, message: 'Invalid dates' };
  }
  
  // Check if check-in is in the past
  if (isPast(checkInDate)) {
    return { valid: false, message: 'Check-in date cannot be in the past' };
  }
  
  // Check if check-out is before check-in
  if (isBefore(checkOutDate, checkInDate)) {
    return { valid: false, message: 'Check-out must be after check-in' };
  }
  
  // Check duration
  const duration = getDifference(checkOutDate, checkInDate, 'days');
  if (duration < minDays) {
    return { valid: false, message: `Minimum stay is ${minDays} days` };
  }
  if (duration > maxDays) {
    return { valid: false, message: `Maximum stay is ${maxDays} days` };
  }
  
  return { valid: true, message: 'Booking is available' };
}

/**
 * Example: Format business hours
 */
export function formatBusinessHours(
  openTime: string,
  closeTime: string
): string {
  const open = createDateTime(openTime);
  const close = createDateTime(closeTime);
  
  return `${formatTime(open, 'SHORT')} - ${formatTime(close, 'SHORT')}`;
}

/**
 * Example: Subscription expiry warning
 */
export function getSubscriptionStatus(expiryDate: string): {
  status: 'active' | 'expiring-soon' | 'expired';
  message: string;
} {
  const expiry = createDateTime(expiryDate);
  const daysUntilExpiry = getDifference(expiry, now(), 'days');
  
  if (daysUntilExpiry < 0) {
    return {
      status: 'expired',
      message: `Subscription expired ${formatRelative(expiry)}`,
    };
  }
  
  if (daysUntilExpiry <= 7) {
    return {
      status: 'expiring-soon',
      message: `Subscription expires in ${Math.ceil(daysUntilExpiry)} days`,
    };
  }
  
  return {
    status: 'active',
    message: `Active until ${formatDate(expiry, 'MEDIUM')}`,
  };
}
