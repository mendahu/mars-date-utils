import { MarsDateBase } from "./MarsDateBase";
import { formatTime } from "../helpers";
import {
  ASTRONOMICAL_UNIT,
  DEGREES_IN_A_CIRCLE,
  HOURS_IN_A_DAY,
  MARS_MILLIS_IN_A_YEAR,
  MARS_SOLS_IN_YEAR,
  MILLIS_IN_A_SEC,
} from "../constants";

/**
 * Class representing a Mars Date
 * @extends MarsDateBase
 */
export class MarsDate extends MarsDateBase {
  /**
   * Create a new Mars Date by passing an Earth Date.
   *
   * @param {Date} [earthDate=new Date()] - the Earth Date you wish to represent
   *
   * @example
   *
   * const now = new MarsDate();
   * const now = new MarsDate(new Date());
   */
  constructor(earthDate?: Date) {
    super(earthDate || new Date());
  }

  /**
   * @returns {Date} A JavaScript Date object for the Mars Date
   */
  public getEarthDate() {
    return this.earthDate;
  }

  /****************************************************
  // Basic Methods
  *****************************************************/

  /**
   * Get the Mars Calendar Year with Year 1 beginning April 11 1955 at 00:00:00 UTC.
   *
   * @returns {number} Mars Calendar Year
   */
  public getCalendarYear() {
    return this.MY;
  }

  /**
   * Mars Solar Longitude (Ls) is its position in its orbit around the sun, measured in degrees. Solar Longitude 0 (Ls 0) is the vernal equinox.
   *
   * @returns {number} Mars Solar Longitude (Ls)
   */
  public getLs() {
    return this.Ls;
  }

  /**
   * Mean Solar Time (sometimes Coordinated Mars Time or MTC) is the Local Mean Solar Time at Longitude 0. This is functionally equivalent to Greenwich Mean Time (UTC) on Earth.
   *
   * @returns {string} Mean Solar Time at Longitude 0, in format HH:MM:SS
   */
  public getMST() {
    return formatTime(this.MST);
  }

  /****************************************************
  // Longitude-Specific Methods
  *****************************************************/

  /**
   * Local Mean Solar Time (LMST) at a specific longitude. Because a solar day's duration is not constant, Mean Time takes the average of all solar days to create a constant time.
   *
   * This is probably the value you want if you simply want to know the time at a location.
   *
   * @param {number} lon Longitude in degrees W
   * @returns {string} Mean Solar Time at specified longitude, in format HH:MM:SS
   */
  public getLMST(lon: number) {
    return formatTime(this.getLocalMeanSolarTime(lon));
  }

  /**
   * Local True Solar Time (LTST) at a specific longitude. Solar days vary in duration, so true solar time is not constant. True solar time is what a sundial would read.
   *
   * If you're just looking for the simple time, recommend using LMST instead.
   *
   * @param {number} lon Longitude in degrees W
   * @returns {string} True Solar Time at specified longitude, in format HH:MM:SS
   */
  public getLTST(lon: number) {
    return formatTime(this.getLocalTrueSolarTime(lon));
  }

  /****************************************************
  // Age Methods
  *****************************************************/

  /**
   * @returns {number} Amount of seconds between the Mars Date and now. A negative value would indicate a Mars Date in the future.
   */
  public getAgeInSeconds() {
    const millis = new Date().getTime();
    return (millis - this.millisecondsSinceEpoch) / MILLIS_IN_A_SEC;
  }

  /**
   * @returns {number} Amount of Mars Sols (Martian Days) between the Mars Date and now. A negative value would indicate a Mars Date in the future.
   */
  public getAgeInSols() {
    const now = new Date();
    const msd = this.getMarsSolDate(now);
    return msd - this.marsSolDate;
  }

  /**
   * @returns {number} Amount of Mars Years between the Mars Date and now. A negative value would indicate a Mars Date in the future.
   */
  public getAgeInYears() {
    return this.getAgeInSols() / MARS_SOLS_IN_YEAR;
  }

  /****************************************************
  // Special Age Methods
  *****************************************************/

  /**
   * For NASA missions on the surface of Mars, landing day is Sol 0, and the sol increments at the end of each day, midnight local mean solar time.
   *
   * @param {number} lon Longitude
   * @returns {number} the current Mission Sol as of now
   */
  public getSolOfMission(lon: number) {
    const timeDiff = this.getLocalMeanSolarTime(lon);
    const adjAge = timeDiff / HOURS_IN_A_DAY + this.getAgeInSols();
    return Math.floor(adjAge);
  }

  /**
   * Calculate the Mars anniversary of a Mars Date. For example, using n = 2, returns the Date two Mars Years from the Mars Date.
   *
   * @param {number} n Amount of years since Mars Date
   * @returns {Date} The cooresponding Earth date for the nth anniversary since the Mars Date, using Mars Years
   *
   * @example
   *
   * const mslLanding = new MarsDate(new Date("2012-08-06T05:17:57Z"))
   * const secondBirthday = mslLanding.getAnniversary(2)
   * console.log(secondBirthday) // "2016-05-11T04:18:36.481Z", 2 Mars Years from Landing
   */
  public getAnniversary(n: number) {
    const anniversary = this.millisecondsSinceEpoch + MARS_MILLIS_IN_A_YEAR * n;
    return new Date(anniversary);
  }

  /**
   * Calculate the next nth Mars anniversary of a Mars Date. For example, using n = 2, returns two anniversaries of the Mars Date from now.
   * Defaults to 1.
   *
   * Useful for finding your next Mars Birthday.
   *
   * @param {number=} n Amount of anniveraries from now
   * @returns {Date} The cooresponding Earth date for the nth anniversary of the Mars Date from now, using Mars Years
   *
   * @example
   *
   * const mslLanding = new MarsDate(new Date("2012-08-06T05:17:57Z"))
   * const nextBirthday = mslLanding.getNextAnniversary()
   * console.log(nextBirthday) // "2022-01-01T02:51:01.203Z", the next anniversary
   */
  public getNextAnniversary(n: number = 1) {
    const age = this.getAgeInYears();
    return this.getAnniversary(Math.ceil(age) + n - 1);
  }

  /****************************************************
  // Solar Position Methods
  *****************************************************/

  /**
   * Mars orbit is elliptical, and so its distance from the Sun varies through the year.
   *
   * Can return the value in Astronominal Units (AU where 1 AU === the average distance between the Sun and Earth) or kilometres.
   *
   * @param {{ unit: "km" | "au "}=} options Optional units
   * @returns {number} Distance from the Sun
   */
  public getHeliocentricDistance(options?: { unit: "km" | "au" }) {
    const multiplier =
      options?.unit.toLowerCase() === "km" ? ASTRONOMICAL_UNIT : 1;
    return this.heliocentricDistance * multiplier;
  }

  /**
   * Gives you the elevation of the sun, measured in degrees from the horizon.
   * 0 Degrees is at the horizon, 90 degrees is straight up. A negative number
   * means the sun is below the horizon and not visible (night time).
   *
   * @param {number} lon Latitude
   * @param {number} lat Longitude in degrees W
   * @returns {number} Degrees of elevation from the horizon
   */
  public getSolarElevation(lat: number, lon: number) {
    const zenithAngle = this.getZenithAngleOfSun(lat, lon);
    return 90 - zenithAngle;
  }

  /**
   * The direction of the sun, with 0 degrees being North, 90 degrees East,
   * 180 degrees South and 270 degrees West.
   *
   * @param {number} lon Latitude
   * @param {number} lat Longitude in degrees W
   * @returns {number} Degrees of azimuth from North, clockwise
   */
  public getSolarAzimuth(lat: number, lon: number) {
    const compassAngle = this.getCompassAngleOfSun(lat, lon);
    return (DEGREES_IN_A_CIRCLE + compassAngle) % DEGREES_IN_A_CIRCLE;
  }

  /****************************************************
  // Earth / Mars Relationship Methods
  *****************************************************/

  /**
   * Mars orbit is elliptical, and so its distance from the Sun varies through the year.
   *
   * Can return the value in Astronominal Units (AU where 1 AU === the average distance between the Sun and Earth) or kilometres.
   *
   * @param {{ unit: "km" | "au "}=} options Optional units
   * @returns {number} Distance from the Sun
   */
  public getDistanceBetweenEarthAndMars(options?: { unit: "km" | "au" }) {
    const multiplier =
      options?.unit.toLowerCase() === "km" ? ASTRONOMICAL_UNIT : 1;
    return this.earthMarsDistance * multiplier;
  }

  /**
   *
   * Measures the time it would take for a one-way radio signal (travelling at the speed of light) to cross from Earth to Mars.
   *
   * @returns Time in seconds
   */
  public getLightDelay() {
    return this.lightDelay;
  }
}
