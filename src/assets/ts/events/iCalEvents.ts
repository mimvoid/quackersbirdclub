import process from "node:process";
import {
  EventItem,
  mkElement,
  mkText,
  month,
  amPmStr,
  trimLoc,
  addCalendarButton,
} from "./helpers.ts";

document.addEventListener("DOMContentLoaded", async () => {
  // The URL to access the Quackers Bird Club calendar JSON data
  const icalURL =
    "https://www.googleapis.com/calendar/v3/calendars/quackersbirdclub@gmail.com/events";

  try {
    process.loadEnvFile();

    const res = await fetch(icalURL, {
      headers: { "X-goog-api-key": process.env.CALENDAR_KEY },
    });

    if (!res.ok) {
      throw new Error(`Request to Google Calendar failed: ` + res.status);
    }

    const data = await res.json();

    const tablerClock = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>`;

    const tablerMapPin = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/><path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0"/></g></svg>`;

    const eventNode = document.getElementById("events")!;
    const timelines = new Map<number, HTMLElement>();

    for (const rawEvent of data.items) {
      const ev: EventItem = Object.assign(new EventItem(), rawEvent);

      const start = new Date(ev.start.dateTime);
      const end = new Date(ev.end.dateTime);

      // This is an event, add it to the timeline
      const year = start.getFullYear();
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

      const card = timeline.appendChild(
        mkElement("li", (self) => self.classList.add("card")),
      );

      // Create date section
      const dateWrapper = card.appendChild(document.createElement("div"));
      const date = dateWrapper.appendChild(document.createElement("time"));
      date.dateTime = start.toISOString();
      date.innerHTML = `${month[start.getMonth()]} <span class="day">${start.getDate()}</span>`;

      const text = card.appendChild(
        mkElement("div", (self) => self.classList.add("timeline-text")),
      );

      // Summary
      text.appendChild(mkText("h3", ev.summary));

      // Time
      const time = text.appendChild(document.createElement("p"));
      time.innerHTML += tablerClock;
      time.append(amPmStr(start) + "–" + amPmStr(end));

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
  } catch (err) {
    console.error(err.message);
  }
});
