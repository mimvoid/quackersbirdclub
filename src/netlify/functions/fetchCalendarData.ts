/**
 * A Netlify serverless function to fetch the club's Google Calendar data.
 *
 * Since Google Calendar requires an API key, that key is stored as
 * an environment variable on the hosting platform Netlify (since having it
 * as plain text is plain dangerous).
 *
 * Basically, this function lets other functions fetch the data without
 * exposing the API key.
 */
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

    /**
     * NOTE: It would probably be more efficient to forward the response
     * directly (without parsing and stringifying the JSON), but I have not
     * figured out how to do that yet.
     *
     * It would be difficult to test and it still works, so it's fine for now.
     */
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
}
