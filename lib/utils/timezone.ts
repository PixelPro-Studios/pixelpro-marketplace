import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";

// Singapore timezone
export const SINGAPORE_TIMEZONE = "Asia/Singapore";

/**
 * Get current date/time in Singapore timezone
 */
export function getSingaporeTime(): Date {
  return toZonedTime(new Date(), SINGAPORE_TIMEZONE);
}

/**
 * Get Singapore time as ISO string for database storage
 */
export function getSingaporeTimeISO(): string {
  const sgTime = getSingaporeTime();
  return formatInTimeZone(sgTime, SINGAPORE_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}

/**
 * Format a date to Singapore timezone with custom format
 */
export function formatToSingaporeTime(
  date: Date | string | null | undefined,
  formatString: string = "dd/MM/yyyy HH:mm:ss"
): string {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return formatInTimeZone(dateObj, SINGAPORE_TIMEZONE, formatString);
}

/**
 * Format date only (no time) in Singapore timezone
 */
export function formatSingaporeDate(date: Date | string | null | undefined): string {
  return formatToSingaporeTime(date, "dd/MM/yyyy");
}

/**
 * Format date and time in Singapore timezone
 */
export function formatSingaporeDateTime(date: Date | string | null | undefined): string {
  return formatToSingaporeTime(date, "dd/MM/yyyy, HH:mm:ss");
}

/**
 * Convert any date to Singapore timezone
 */
export function toSingaporeTime(date: Date | string | null | undefined): Date {
  if (!date) return new Date();

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return new Date();
  }

  return toZonedTime(dateObj, SINGAPORE_TIMEZONE);
}
