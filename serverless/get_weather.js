// This function serves as a Node relay.  It takes the rewuest from the front end, makes the request in the backend with the API key stored on Netlify, and passes the results to the front end.  Allows hiding of the API key.

const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { lat, long, units } = params;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;

  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson),
    };
  } catch (e) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
};
