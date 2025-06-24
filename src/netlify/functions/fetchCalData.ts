export async function handler() {
  // The URL to access the Quackers Bird Club calendar JSON data
  const calURL =
    "https://www.googleapis.com/calendar/v3/calendars/quackersbirdclub@gmail.com/events";

  try {
    const key = process.env.CALENDAR_KEY;
    if (!key) {
      throw new Error(
        "Could not find the Google Calendar API key in the environment variables.",
      );
    }

    const response = await fetch(calURL, {
      headers: { "X-goog-api-key": key },
    });

    if (!response.ok) {
      throw new Error(
        "Request to the Quackers Bird Club Google Calendar failed: " +
          response.status,
      );
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data.items),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
