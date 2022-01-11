export default class CurrentLocation {
  // Private fields must be declared here first
  #name;
  #lat;
  #long;
  #unit;

  constructor() {
    this.#name = "Current Location";
    this.#lat = null;
    this.#long = null;
    this.#unit = "metric";
  }

  // Tutorial calls for regular functions named "getName", etc, I decided to do it this way instead
  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get lat() {
    return this.#lat;
  }

  set lat(lat) {
    this.#lat = lat;
  }

  get long() {
    return this.#long;
  }

  set long(long) {
    this.#long = long;
  }

  get unit() {
    return this.#unit;
  }

  set unit(unit) {
    this.#unit = unit;
  }

  toggleUnit() {
    this.#unit = this.#unit === "imperial" ? "metric" : "imperial";
  }

  // Controls what fields are passed to JSON.stringify()
  // Custom change, tutorial did not do it this way
  toJSON() {
    const location = {
      name: this.#name,
      lat: this.#lat,
      long: this.#long,
      unit: this.#unit,
    };
    return location;
  }
}
