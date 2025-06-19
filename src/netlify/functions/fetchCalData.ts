export const handler = async () => {
  // The URL to access the Quackers Bird Club calendar JSON data
  const calURL =
    "https://www.googleapis.com/calendar/v3/calendars/quackersbirdclub@gmail.com/events";

  try {
    const key = process.env.CALENDAR_KEY!;
    const res = await fetch(calURL, {
      headers: { "X-goog-api-key": key },
    });

    if (!res.ok) {
      throw new Error(
        `Request to the Quackers Bird Club Google Calendar failed: ` +
          res.status,
      );
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
