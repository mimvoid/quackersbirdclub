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

async function fetchEventJson(): Promise<Array<any>> {
  const res = await fetch("/.netlify/functions/fetchCalData");
  if (!res.ok) {
    throw new Error("Failed to fetch event data: " + res.status);
  }

  return res.json();
}

function processEventJson(jsonData: Array<any>): EventItem[] {
  const events: EventItem[] = jsonData.map((rawEvent) => {
    const evItem: EventItem = Object.assign(new EventItem(), rawEvent);

    // Make sure the dates get parsed
    evItem.start.dateTime = new Date(rawEvent.start.dateTime);
    evItem.end.dateTime = new Date(rawEvent.end.dateTime);

    return evItem;
  });

  // Sort events by start date
  return events.sort(
    (a, b) => b.start.dateTime.getTime() - a.start.dateTime.getTime(),
  );
}

function makeEventCard(timeline: HTMLElement, ev: EventItem): void {
  const card = timeline.appendChild(
    mkElement("li", (self) => self.classList.add("card")),
  );

  // Create date section
  const date = card.appendChild(document.createElement("div"));
  date.appendChild(
    mkTime((self) => {
      self.dateTime = ev.start.dateTime.toISOString();
      self.innerHTML =
        month[ev.start.dateTime.getMonth()] +
        ` <span class="day">${ev.start.dateTime.getDate()}</span>`;
    }),
  );

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

    // Store divs for each year for easy access
    const timelines = new Map<number, HTMLElement>();

    for (const ev of events) {
      const year = ev.start.dateTime.getFullYear();
      let timeline = timelines.get(year);

      if (timeline == undefined) {
        // Set up a new year timeine
        const yearDiv = eventNode.appendChild(document.createElement("div"));
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
  } catch (err) {
    console.error(err.message);
  }
})();
