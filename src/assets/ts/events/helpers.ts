import "add-to-calendar-button";

class UserItem {
  email: string;
  self: boolean;
}
class DateItem {
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

export function mkElement(tag: string, setup: (self: HTMLElement) => void) {
  const element = document.createElement(tag);
  setup(element);
  return element;
}

export function mkTime(setup: (self: HTMLTimeElement) => void) {
  const element = document.createElement("time");
  setup(element);
  return element;
}

export function mkText(tag: string, textContent: string) {
  const element = document.createElement(tag);
  element.textContent = textContent;
  return element;
}

export function amPmStr(dateTime: Date) {
  const h = dateTime.getHours();
  const m = dateTime.getMinutes();

  if (m === 0) {
    return h > 12 ? `${h - 12}pm` : `${h}am`;
  }
  return h > 12 ? `${h - 12}:${m}pm` : `${h}:${m}am`;
}

export function trimLoc(loc: string) {
  // Remove ", USA" suffix if it exists
  return loc.endsWith(", USA") ? loc.slice(0, -5) : loc;
}

export function addCalendarButton(ev: EventItem) {
  const addCal = document.createElement("add-to-calendar-button");

  addCal.name = ev.summary;
  addCal.description = ev.description;
  addCal.options =
    "'iCal','Google','Outlook.com','Microsoft365','MicrosoftTeams','Apple','Yahoo'";
  addCal.location = ev.location;
  addCal.startDate = ev.start.dateTime.toDateString();
  addCal.endDate = ev.end.dateTime.toDateString();
  addCal.startTime = ev.start.dateTime.toTimeString();
  addCal.endTime = ev.end.dateTime.toTimeString();
  addCal.timeZone = ev.start.timeZone;

  return addCal;
}
