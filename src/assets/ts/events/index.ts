import {
  EventItem,
  mkText,
  month,
  amPmStr,
  trimLoc,
} from "./helpers";
import { tablerCalendarEvent, tablerClock, tablerMapPin } from "./icons";

/**
 * Since Google Calendar requires an API key, we ask Netlify to fetch
 * the data with the key stored as an environment variable.
 *
 * (See `fetchCalendarData` in the `netlify/functions` folder.)
 *
 * @returns A parsed JSON array.
 */
async function fetchEventJson(): Promise<any[]> {
  const res = await fetch("/.netlify/functions/fetchCalendarData");
  if (!res.ok) {
    throw new Error("Failed to fetch event data: " + res.status);
  }

  return res.json();
}

function processDate(dateObj: any) {
  if (dateObj.dateTime instanceof Date) {
    return; // Nothing to do
  }

  if (dateObj.dateTime !== undefined) {
    // Try to parse the date
    dateObj.dateTime = new Date(dateObj.dateTime);
  } else if (dateObj.date !== undefined) {
    dateObj["dateTime"] = new Date(dateObj.date);
  } else {
    throw new Error("Unable to parse event date: " + JSON.stringify(dateObj));
  }
}

/**
 * Creates an array of EventItems from raw JSON data, and sorts
 * them in ascending order by start date.
 *
 * @jsonData The array of raw event data.
 * @returns An array of typed event item objects.
 */
function processEventJson(jsonData: any[]) {
  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];

  const now = Date.now();

  for (const rawEvent of jsonData) {
    try {
      processDate(rawEvent.start);
      processDate(rawEvent.end);
    } catch (e) {
      console.error("Skipping event item:", e);
      continue;
    }

    const evItem: EventItem = Object.assign(new EventItem(), rawEvent);

    if (evItem.start.dateTime.getTime() - now >= 0) {
      upcoming.push(evItem);
    } else {
      past.push(evItem);
    }
  }

  const sortDates = (a: EventItem, b: EventItem) =>
    b.start.dateTime.getTime() - a.start.dateTime.getTime();

  return [upcoming.sort(sortDates), past.sort(sortDates)];
}

/**
 * Adds the content of one event as HTML.
 *
 * @param timeline The HTML parent element for the card.
 * @param ev The event data.
 */
function makeEventCard(timeline: HTMLElement, ev: EventItem) {
  const card = timeline.appendChild(document.createElement("li"));
  card.classList.add("card");

  // -- Date section
  const date = card.appendChild(document.createElement("div"));
  const dt = date.appendChild(document.createElement("time"));
  dt.dateTime = ev.start.dateTime.toISOString();
  dt.innerHTML =
    month[ev.start.dateTime.getMonth()] +
    ` <span class="day">${ev.start.dateTime.getDate()}</span>`;

  // -- Text section
  const text = card.appendChild(document.createElement("div"));
  text.classList.add("timeline-text");

  // Summary
  const summary = text.appendChild(mkText("h4", ev.summary));
  summary.classList.add("h3");

  // Time
  const timeText = text.appendChild(document.createElement("p"));
  timeText.innerHTML += tablerClock;
  timeText.append(amPmStr(ev.start.dateTime) + "–" + amPmStr(ev.end.dateTime));

  if (ev.location) {
    const loc = text.appendChild(document.createElement("p"));
    loc.innerHTML += tablerMapPin;
    loc.append(trimLoc(ev.location));
  }

  if (ev.description) {
    for (const line of ev.description.split("\n")) {
      const trimmedLine = line.trim();
      if (trimmedLine) text.appendChild(mkText("p", trimmedLine));
    }
  }

  if (ev.htmlLink) {
    const calendarLink = text.appendChild(document.createElement("a"));
    calendarLink.classList.add("button", "tertiary", "add-to-calendar");
    calendarLink.href = ev.htmlLink;
    calendarLink.title = "Open event in Google Calendar"; // tooltip
    calendarLink.innerHTML += tablerCalendarEvent;
  }
}

function makeTimeline(events: EventItem[], fragment: DocumentFragment) {
  // Store divs for each year for easy access
  const timelines = new Map<number, HTMLElement>();

  for (let i = 0, len = events.length; i < len; i++) {
    const ev = events[i];
    const year = ev.start.dateTime.getFullYear();
    let timeline = timelines.get(year);

    if (timeline == undefined) {
      // Set up a new year timeine
      const yearDiv = fragment.appendChild(document.createElement("div"));
      yearDiv.appendChild(mkText("h3", String(year)));

      timeline = yearDiv.appendChild(document.createElement("ul"));
      timeline.classList.add("timeline");
      timeline.id = `timeline-${year}`;

      // Save it in the dictionary
      timelines.set(year, timeline);
    }

    makeEventCard(timeline, ev);
  }
}

(async () => {
  const eventNode = document.getElementById("events");
  if (!eventNode) {
    console.error("Couldn't find HTML element with id 'events'.");
    return;
  }

  try {
    const jsonData = await fetchEventJson();
    const [upcoming, past] = processEventJson(jsonData);

    // A container to create new elements without manipulating the DOM.
    // This lets us update the page at the very end, requiring only a single reflow.
    const fragment = document.createDocumentFragment();

    if (upcoming.length > 0) {
      const heading = fragment.appendChild(document.createElement("h2"));
      heading.textContent = "Upcoming";
      makeTimeline(upcoming, fragment);
    }

    if (past.length > 0) {
      const heading = fragment.appendChild(document.createElement("h2"));
      heading.textContent = "Past Events";
      makeTimeline(past, fragment);
    }

    // Add everything onto the page
    eventNode.replaceChildren(fragment);
  } catch (err) {
    const simpleError = document.createElement("p");
    simpleError.textContent = "Failed to fetch event data.";

    const details = document.createElement("details");
    const summary = details.appendChild(document.createElement("summary"));
    summary.textContent = "Reason";
    details.appendChild(document.createTextNode(err));

    eventNode.replaceChildren(simpleError, details);
    console.error(err.message);
  }
})();
