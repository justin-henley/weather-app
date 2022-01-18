//const WEATHER_API_KEY = deleted for security, switched to serverless function with new key;

export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, long, name, unit } = coordsObj;
  locationObj.lat = lat;
  locationObj.long = long;
  locationObj.name = name;
  if (unit) {
    locationObj.unit = unit;
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const cleanText = (text) => {
  const regex = / {2,}/g; // checks for 2 or more spaces in a row
  const entryText = text.replaceAll(regex, " ").trim();
  return entryText;
};

export const getWeatherFromCoords = async (locationObj) => {
  /* const lat = locationObj.lat;
  const long = locationObj.long;
  const units = locationObj.unit;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;

  // Get the weather data
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (error) {
    console.error(error);
  } */

  const urlDataObject = {
    lat: locationObj.lat,
    long: locationObj.long,
    units: locationObj.unit,
  };

  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObject),
    });
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (error) {
    console.error(error);
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  /*  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    //console.log(dataStream, jsonData);
    return jsonData;
  } catch (error) {
    console.error(error.stack);
  } */

  const urlDataObj = {
    text: entryText,
    units: units,
  };

  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (e) {
    console.error(e);
  }
};
