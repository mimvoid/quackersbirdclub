import {
  EventItem,
  mkElement,
  mkText,
  month,
  amPmStr,
  trimLoc,
  addCalendarButton,
} from "./helpers.ts";

// Icons
const tablerClock = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>`;

const tablerMapPin = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/><path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0"/></g></svg>`;

(async () => {
  try {
    const res = await fetch("/.netlify/functions/fetchCalData");
    if (!res.ok) {
      throw new Error("Failed to fetch event data: " + res.status);
    }

    const data: Array<any> = await res.json();

    const eventNode = document.getElementById("events");
    if (!eventNode) {
      throw new Error("Couldn't find HTML element with id 'events'.");
    }

    const events: EventItem[] = data.map((rawEvent) => {
      const evItem: EventItem = Object.assign(new EventItem(), rawEvent);

      // Make sure the dates get parsed
      evItem.start.dateTime = new Date(rawEvent.start.dateTime);
      evItem.end.dateTime = new Date(rawEvent.end.dateTime);

      return evItem;
    });

    events.sort(
      (a, b) => b.start.dateTime.getTime() - a.start.dateTime.getTime(),
    );

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

      const card = timeline.appendChild(
        mkElement("li", (self) => self.classList.add("card")),
      );

      // Create date section
      card.appendChild(
        mkElement("div", (self) => {
          const date = self.appendChild(document.createElement("time"));
          date.dateTime = ev.start.dateTime.toISOString();
          date.innerHTML = `${month[ev.start.dateTime.getMonth()]} <span class="day">${ev.start.dateTime.getDate()}</span>`;
        }),
      );

      const text = card.appendChild(
        mkElement("div", (self) => self.classList.add("timeline-text")),
      );

      // Summary
      text.appendChild(mkText("h3", ev.summary));

      // Time
      const time = text.appendChild(document.createElement("p"));
      time.innerHTML += tablerClock;
      time.append(amPmStr(ev.start.dateTime) + "–" + amPmStr(ev.end.dateTime));

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
})();
