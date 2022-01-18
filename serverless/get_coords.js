// This function serves as a Node relay.  It takes the rewuest from the front end, makes the request in the backend with the API key stored on Netlify, and passes the results to the front end.  Allows hiding of the API key.

//const fetch = import("node-fetch");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { text, units } = params;
  const regex = /^\d+$/g;
  const flag = regex.test(text) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${text}&units=${units}&appid=${WEATHER_API_KEY}`;

  const encodedUrl = encodeURI(url);

  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: error.stack,
    };
  }
};
