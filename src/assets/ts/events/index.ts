import {
  EventItem,
  mkElement,
  mkText,
  month,
  amPmStr,
  trimLoc,
  addCalendarButton,
  mkTime,
} from "./helpers";
import { tablerClock, tablerMapPin } from "./icons";

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

/**
 * Creates an array of EventItems from raw JSON data, and sorts
 * them in ascending order by start date.
 *
 * @jsonData The array of raw event data.
 * @returns An array of typed event item objects.
 */
function processEventJson(jsonData: any[]) {
  const events = jsonData.map((rawEvent) => {
    const evItem: EventItem = Object.assign(new EventItem(), rawEvent);

    // Make sure the dates get parsed
    evItem.start.dateTime = new Date(rawEvent.start.dateTime);
    evItem.end.dateTime = new Date(rawEvent.end.dateTime);

    return evItem;
  });

  return events.sort(
    (a, b) => b.start.dateTime.getTime() - a.start.dateTime.getTime(),
  );
}

/**
 * Adds the content of one event as HTML.
 *
 * @param timeline The HTML parent element for the card.
 * @param ev The event data.
 */
function makeEventCard(timeline: HTMLElement, ev: EventItem) {
  const card = timeline.appendChild(
    mkElement("li", (self) => self.classList.add("card")),
  );

  // -- Date section
  const date = card.appendChild(document.createElement("div"));
  date.appendChild(
    mkTime((self) => {
      self.dateTime = ev.start.dateTime.toISOString();
      self.innerHTML =
        month[ev.start.dateTime.getMonth()] +
        ` <span class="day">${ev.start.dateTime.getDate()}</span>`;
    }),
  );

  // -- Text section
  const text = card.appendChild(
    mkElement("div", (self) => self.classList.add("timeline-text")),
  );

  // Summary
  text.appendChild(mkText("h3", ev.summary));

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
    text.appendChild(mkText("p", ev.description));
  }

  // FIX: The add to calendar button does not actually work
  text.appendChild(addCalendarButton(ev));
}

(async () => {
  try {
    const eventNode = document.getElementById("events");
    if (!eventNode) {
      throw new Error("Couldn't find HTML element with id 'events'.");
    }

    const jsonData = await fetchEventJson();
    const events = processEventJson(jsonData);

    // A container to create new elements without manipulating the DOM.
    // This lets us update the page at the very end, requiring only a single reflow.
    const fragment = document.createDocumentFragment();

    // Store divs for each year for easy access
    const timelines = new Map<number, HTMLElement>();

    for (let i = 0, len = events.length; i < len; i++) {
      const ev = events[i];
      const year = ev.start.dateTime.getFullYear();
      let timeline = timelines.get(year);

      if (timeline == undefined) {
        // Set up a new year timeine
        const yearDiv = fragment.appendChild(document.createElement("div"));
        yearDiv.appendChild(mkText("h2", String(year)));

        timeline = yearDiv.appendChild(
          mkElement("ul", (self) => {
            self.classList.add("timeline");
            self.id = `timeline-${year}`;
          }),
        );

        // Save it in the dictionary
        timelines.set(year, timeline);
      }

      makeEventCard(timeline, ev);
    }

    // Add everything onto the page
    eventNode.appendChild(fragment);
  } catch (err) {
    console.error(err.message);
  }
})();
