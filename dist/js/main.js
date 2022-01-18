import {
  setLocationObject,
  getHomeLocation,
  cleanText,
  getCoordsFromApi,
  getWeatherFromCoords,
} from "./dataFunctions.js";
import {
  setPlaceholderText,
  addSpinner,
  displayError,
  displayApiError,
  updateScreenReaderConfirmation,
  updateDisplay,
} from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
  // ADD LISTENERS
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);

  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);

  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);

  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPref);

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);

  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  // SETUP
  setPlaceholderText();

  // LOAD WEATHER
  loadWeather();
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
  if (event?.type === "click") {
    // add spinner
    const mapIcon = document.querySelector(".fa-map-marker-alt");
    addSpinner(mapIcon);
  }
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "Geolocation not supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };

  // set location object
  setLocationObject(currentLoc, myCoordsObj);
  //console.log(myCoordsObj);
  //console.log(currentLoc);
  // update data and display
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError(
      "No Home Location Saved.",
      "Sorry, please save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      long: locationJson.long,
      name: locationJson.name,
      unit: locationJson.unit,
    };

    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.lat && currentLoc.long) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    //console.log("Saved location: \n", JSON.stringify(currentLoc));
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(currentLoc));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.name} as home location.`
    );
  }
};

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  //console.log(currentLoc);
  updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
  // Prevent page reload
  event.preventDefault();

  // Get text from search bar and clean up
  const text = document.getElementById("searchBar__text").value;
  const entryText = cleanText(text);
  if (!entryText.length) return; // Fail if no clean text

  // Add spinner to search bar submit icon
  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);

  // Wait for the location from the API
  const coordsData = await getCoordsFromApi(entryText, currentLoc.unit);

  // Work with API data
  if (coordsData?.cod === 200) {
    // success
    // Work with API data
    const myCoordsObj = {
      lat: coordsData.coord.lat,
      long: coordsData.coord.lon,
      name: coordsData.sys.country
        ? `${coordsData.name}, ${coordsData.sys.country}`
        : coordsData.name,
    };

    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  } else {
    // failure
    // Error from API
    if (coordsData) {
      displayApiError(coordsData);
    }

    // Connection error
    else {
      displayError("Connection Error", "Connection Error");
    }
  }

  // Set current location to location returned from API
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  //console.log(weatherJson);
  if (weatherJson) updateDisplay(weatherJson, locationObj);
};
