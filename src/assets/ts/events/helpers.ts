/**
 * Helper functions, variables, and types.
 */

type UserItem = {
  email: string;
  self: boolean;
}
type DateItem = {
  dateTime: Date;
  timeZone: string;
}

// The basic structure of an event from the Google Calendar API.
export class EventItem {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;

  summary: string;
  description: string;
  location: string;

  creator: UserItem;
  organizer: UserItem;

  start: DateItem;
  end: DateItem;

  iCalUID: string;
  sequence: number;
  eventType: string;
}

// Array that maps numbers to month names.
export const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function mkText(tag: string, textContent: string) {
  const element = document.createElement(tag);
  element.textContent = textContent;
  return element;
}

/**
 * Gets the time from a Date object formatted in AM/PM time.
 * If the minutes are 0, only includes the hour.
 */
export function amPmStr(dateTime: Date) {
  const h = dateTime.getHours();
  const m = dateTime.getMinutes();

  if (m === 0) {
    return h > 12 ? `${h - 12}pm` : `${h}am`;
  }
  return h > 12 ? `${h - 12}:${m}pm` : `${h}:${m}am`;
}

/**
 * Cleans up location strings to fit the context of a club in the United States.
 */
export function trimLoc(loc: string) {
  // Remove ", USA" suffix if it exists
  return loc.endsWith(", USA") ? loc.slice(0, -5) : loc;
}
