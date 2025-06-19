import ical from "node-ical";

// The public URL for the Quackers Bird Club calendar
const icalURL =
  "https://calendar.google.com/calendar/ical/quackersbirdclub%40gmail.com/public/basic.ics";

ical.async.fromURL(icalURL, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const eventNode = document.getElementById("events")!;
  const timelines = new Map<number, HTMLElement>();

  // Iterate through the events in the data
  for (let k in data) {
    if (!data.hasOwnProperty(k)) continue;
    const ev = data[k];
    if (ev.type != "VEVENT") continue;

    // This is an event, add it to the timeline
    const year = ev.start.getFullYear();
    let timeline = timelines.get(year);

    if (timeline == undefined) {
      // Set up a new year timeine
      const yearDiv = eventNode.appendChild(document.createElement("div"));

      const heading = yearDiv.appendChild(document.createElement("h2"));
      heading.textContent = String(year);

      timeline = yearDiv.appendChild(document.createElement("ul"));
      timeline.classList.add("timeline");
      timeline.id = `timeline-${year}`;

      // Save it in the dictionary
      timelines.set(year, timeline);
    }

    const card = timeline.appendChild(document.createElement("li"));
    card.classList.add("card");

    // Create date section
    const dateWrapper = card.appendChild(document.createElement("div"));
    const date = dateWrapper.appendChild(document.createElement("time"));
    date.dateTime = ev.start.toDateString();
    date.innerHTML = `${ev.start.getMonth()} <span class="day">${ev.start.getDay()}</span>"`;

    const text = card.appendChild(document.createElement("div"));
    text.classList.add("timeline-text");

    const summary = text.appendChild(document.createElement("h3"));
    summary.textContent = ev.summary;

    const time = text.appendChild(document.createElement("p"));
    time.append(ev.start.toTimeString(), ev.end.toTimeString());

    if (ev.location) {
      const loc = text.appendChild(document.createElement("p"));
      loc.textContent = ev.location;
    }

    if (ev.description) {
      const desc = text.appendChild(document.createElement("p"));
      desc.textContent = ev.description;
    }
  }
});
