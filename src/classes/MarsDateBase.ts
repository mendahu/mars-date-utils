// Based on Allison and McEwen (2000) and revision from the Mars24 Sunclock
// https://www.giss.nasa.gov/tools/mars24/help/algorithm.html

// Earth Longitude calculated using
// http://www.stargazing.net/kepler/circle.html

// Earth Perhelion date taken from
// http://www.astropixels.com/ephemeris/perap2001.html

import {
  LEAP_SECONDS,
  MARS_SECONDS_IN_SOL,
  MARS_SOLS_IN_YEAR,
  MARS_YEAR_EPOCH,
  PERTURBERS,
  TAI_UTC_DIFF,
  MS_PER_DAY,
  DAYS_IN_CENTURY,
  SECS_PER_DAY,
  DEGREES_IN_A_CIRCLE,
  LEAP_SECOND_EPOCH,
  EARTH_SEMI_MAJOR_AXIS,
  EARTH_ECCENTRICITY,
  DAYS_IN_YEAR,
  MARS_SEMI_MAJOR_AXIS,
  SPEED_OF_LIGHT,
  ASTRONOMICAL_UNIT,
  MILLIS_IN_A_SEC,
  HOURS_IN_A_DAY,
} from "../constants";
import { cos, sin, tan, acos, atan2, getDaysBetween } from "../helpers";

export class MarsDateBase {
  protected earthDate: Date;
  protected millisecondsSinceEpoch: number;
  protected millisecondsSinceMarsEpoch: number;

  // Age Properties
  protected ageInSeconds: number;
  protected ageInSols: number;
  protected ageInYears: number;
  protected marsSolDate: number;

  //Properties used to calculate other properties
  private _julianDateUT: number;
  private _j2000offsetUT: number;
  private _UTCtoTTConversion: number;
  private _julianDateTT: number;
  private _j2000offsetTT: number;
  private _marsMeanAnomaly: number;
  private _marsAngleOfFictionMeanSun: number;
  private _perturbers: number;
  private _marsEquationOfCenter: number;
  private _marsEquationOfTime: number;
  private _heliocentricLongitude: number;
  private _solarDeclination: number;
  private _subsolarLongitude: number;

  // Earth Properties
  private _earthHeliocentricLongitude: number;
  protected earthHeliocentricDistance: number;

  // Basic Date properties
  protected MY: number;
  protected Ls: number;
  protected MST: number;

  // Advanced Date Properties
  protected heliocentricDistance: number;
  protected earthMarsDistance: number;
  protected lightDelay: number;

  constructor(earthDate: Date) {
    this.earthDate = earthDate;
    this.millisecondsSinceEpoch = earthDate.getTime(); // A-1
    this.millisecondsSinceMarsEpoch = this.setMilliSecondsSinceMarsEpoch();
    this.MY = this.setMarsYear();
    this._julianDateUT = this.getJulianDateUT(); // A-2
    this._j2000offsetUT = this.getJ2000OffsetUT(); // A-3
    this._UTCtoTTConversion = this.getUTCtoTTConversion(); // A-4
    this._julianDateTT = this.getJulianDateTT(); // A-5
    this._j2000offsetTT = this.getJ2000OffsetTT(); // A-6
    this._marsMeanAnomaly = this.getMarsMeanAnomaly(); // B-1
    this._marsAngleOfFictionMeanSun = this.getMarsAngleOfFictionMeanSun(); // B-2
    this._perturbers = this.getMarsPerturbers(); // B-3
    this._marsEquationOfCenter = this.getMarsEquationOfCenter(); // B-4
    this.Ls = this.getSolarLongitude(); // B-5
    this._marsEquationOfTime = this.getMarsEquationOfTime(); // C-1
    this.marsSolDate = this.getMarsSolDate();
    this.MST = this.getMeanSolarTime(); // C-2
    this._subsolarLongitude = this.setSubsolarLongitude(); // C-5
    this._solarDeclination = this.setSolarDeclination(); // D-1
    this.heliocentricDistance = this.setHeliocentricDistance(); // D-2
    this._heliocentricLongitude = this.setHeliocentricLongitude(); // D-3
    this._earthHeliocentricLongitude = this.setEarthHeliocentricLongitude();
    this.earthHeliocentricDistance = this.setEarthHeliocentricDistance();
    this.earthMarsDistance = this.setEarthMarsDistance();
    this.lightDelay = this.setLightDelay();
  }

  private setMilliSecondsSinceMarsEpoch() {
    return this.millisecondsSinceEpoch - MARS_YEAR_EPOCH;
  }

  // Determine the Mars Year of given date
  private setMarsYear() {
    const marsYearsSinceMarsEpoch =
      this.millisecondsSinceMarsEpoch /
      (MARS_SECONDS_IN_SOL * MARS_SOLS_IN_YEAR * MILLIS_IN_A_SEC);
    return Math.floor(marsYearsSinceMarsEpoch);
  }

  // A-2
  // Convert millis to Julian Date (UT)
  // Offset from a known recent Julian date
  private getJulianDateUT(millis: number = this.millisecondsSinceEpoch) {
    return 2440587.5 + millis / MS_PER_DAY;
  }

  // A-3
  // Determine time offset form J2000 epoch (UT)
  // Optional data only used in dates prior to Jan 1, 1972 (the first leap second insertion)
  private getJ2000OffsetUT(JDut: number = this._julianDateUT) {
    return (JDut - 2451545) / DAYS_IN_CENTURY;
  }

  // A-4
  // Determine UTC to TT conversion
  // Terrestrial Time (TT) advances at constant rate, as does UTC,
  // but no leap seconds are inserted into it and so it gradually gets further ahead of UTC.
  // Uses a table for dates after Jan 1, 1972 and formula for dates before
  private getUTCtoTTConversion(
    millis: number = this.millisecondsSinceEpoch,
    j2000offsetUT: number = this._j2000offsetUT
  ) {
    const leapSecondsArray = Object.keys(LEAP_SECONDS);

    if (millis >= LEAP_SECOND_EPOCH) {
      const leapSecondsIndex = leapSecondsArray.findIndex(
        (ls) => Number(ls) >= millis
      );

      let mostRecentLeapSecondEpoch: string;

      if (leapSecondsIndex > -1) {
        mostRecentLeapSecondEpoch = leapSecondsArray[leapSecondsIndex];
      } else {
        mostRecentLeapSecondEpoch =
          leapSecondsArray[leapSecondsArray.length - 1];
      }

      return LEAP_SECONDS[mostRecentLeapSecondEpoch] + TAI_UTC_DIFF;
    } else {
      return (
        64.184 +
        59 * j2000offsetUT -
        51.2 * Math.pow(j2000offsetUT, 2) -
        67.1 * Math.pow(j2000offsetUT, 3) -
        16.4 * Math.pow(j2000offsetUT, 4)
      );
    }
  }

  // A-5
  // Determine Julian Date (TT)
  private getJulianDateTT(
    JDut: number = this._julianDateUT,
    UTCtoTT: number = this._UTCtoTTConversion
  ) {
    return JDut + UTCtoTT / SECS_PER_DAY;
  }

  // A-6
  // Determine time offset form J2000 epoch (TT)
  private getJ2000OffsetTT() {
    return this._julianDateTT - 2451545;
  }

  // B-1
  // Determine Mars Mean Anomaly
  private getMarsMeanAnomaly() {
    return 19.3871 + 0.52402073 * this._j2000offsetTT; // B-1
  }

  // B-2
  // Determine Mars Angle of Fiction Mean Sun
  private getMarsAngleOfFictionMeanSun() {
    return 270.3871 + 0.524038496 * this._j2000offsetTT; // B-2
  }

  // B-3
  // Determine perturbers (influence of other planets' gravity on Mars' orbit)
  private getMarsPerturbers() {
    let acc: number = 0;

    PERTURBERS.forEach((per) => {
      const cosiner = (0.985626 * this._j2000offsetTT) / per.T;
      const result = per.A * cos(cosiner + per.P);
      acc += result;
    });

    return acc;
  }

  // B-4
  // Determine Mars Equation of Center (True Anomaly minus Mean Anomaly)
  private getMarsEquationOfCenter() {
    const M = this._marsMeanAnomaly;

    return (
      (10.691 + 0.0000003 * this._j2000offsetTT) * sin(M) +
      0.623 * sin(2 * M) +
      0.05 * sin(3 * M) +
      0.005 * sin(4 * M) +
      0.0005 * sin(5 * M) +
      this._perturbers
    );
  }

  // B-5
  // Deterine areocentric solar longitude
  private getSolarLongitude() {
    const aFMS = this._marsAngleOfFictionMeanSun;
    const EOC = this._marsEquationOfCenter;
    const ls = (aFMS + EOC) % DEGREES_IN_A_CIRCLE;
    if (ls < 0) {
      return ls + DEGREES_IN_A_CIRCLE;
    } else {
      return ls;
    }
  }

  // C-1
  // Determine Equation of Time
  private getMarsEquationOfTime() {
    return (
      2.861 * sin(2 * this.Ls) -
      0.071 * sin(4 * this.Ls) +
      0.002 * sin(6 * this.Ls) -
      this._marsEquationOfCenter
    );
  }

  protected getMarsSolDate(earthDate?: Date) {
    const msd = (JDtt: number) =>
      (JDtt - 2451549.5) / 1.0274912517 + 44796 - 0.0009626;

    if (!earthDate) {
      return msd(this._julianDateTT);
    } else {
      const millis = earthDate.getTime();
      const JDut = this.getJulianDateUT(millis);
      const j2000Ut = this.getJ2000OffsetUT(JDut);
      const UTCtoTT = this.getUTCtoTTConversion(millis, j2000Ut);
      const JDtt = this.getJulianDateTT(JDut, UTCtoTT);
      return msd(JDtt);
    }
  }

  // C-2
  // Get Mean Solar Time at Mars Prime Meridian aka Airy Mean Time
  private getMeanSolarTime() {
    return (HOURS_IN_A_DAY * this.marsSolDate) % HOURS_IN_A_DAY;
  }

  // C-3
  // Determine Local Mean Solar Time at specific Longitude on Mars
  // Takes LON in degrees west of prime
  protected getLocalMeanSolarTime(lon: number) {
    const time =
      this.getMeanSolarTime() - (lon * HOURS_IN_A_DAY) / DEGREES_IN_A_CIRCLE;
    return (time + HOURS_IN_A_DAY) % HOURS_IN_A_DAY;
  }

  // C-4
  // Determine Local True Solar Time at specific Longitude on Mars
  // Takes LON in degrees west of prime
  protected getLocalTrueSolarTime(lon: number) {
    return (
      this.getLocalMeanSolarTime(lon) +
      this._marsEquationOfTime * (HOURS_IN_A_DAY / DEGREES_IN_A_CIRCLE)
    );
  }

  // C-5
  // Determine subsolar longitude
  private setSubsolarLongitude() {
    return (
      (this.MST * 15 + this._marsEquationOfTime + 180) % DEGREES_IN_A_CIRCLE
    );
  }

  // D-1
  // Deterine Planetrographic Solar Declination
  private setSolarDeclination() {
    const radians = Math.asin(0.42565 * sin(this.Ls));
    return (radians * 180) / Math.PI + 0.25 * sin(this.Ls);
  }

  // D-2
  // Determine Heliocentric Distance (distance from the sun)
  private setHeliocentricDistance() {
    const M = this._marsMeanAnomaly;
    return (
      MARS_SEMI_MAJOR_AXIS *
      (1.00436 -
        0.09309 * cos(M) -
        0.004336 * cos(2 * M) -
        0.00031 * cos(3 * M) -
        0.00003 * cos(4 * M))
    );
  }

  // D-3
  // Determine heliocentric longitude
  private setHeliocentricLongitude() {
    const lon =
      this.Ls +
      85.061 -
      0.015 * sin(71 + 2 * this.Ls) -
      5.5e-6 * this._j2000offsetTT;

    return lon % DEGREES_IN_A_CIRCLE;
  }

  // D-5
  // Determine Zenith Angle of the Sun
  protected getZenithAngleOfSun(lat: number, lon: number) {
    return acos(
      sin(this._solarDeclination) * sin(lat) +
        cos(this._solarDeclination) *
          cos(lat) *
          cos(lon - this._subsolarLongitude)
    );
  }

  // D-6
  // Determine Compass Angle
  protected getCompassAngleOfSun(lat: number, lon: number) {
    const hourAngle = lon - this._subsolarLongitude;
    return atan2(
      sin(hourAngle),
      cos(lat) * tan(this._solarDeclination) - sin(lat) * cos(hourAngle)
    );
  }

  // Determine the heliocentric longitude of the Earth
  private setEarthHeliocentricLongitude() {
    // Uses 1996 Astronomical Ephemeris data
    // EPOCH = 25th August 1996 00:00 UTC
    // http://www.stargazing.net/kepler/circle.html
    const DAILY_MOTION_IN_DEGREES = 0.9855931;
    const LON_AT_EPOCH = 333.586;
    const EPHEMERIS = new Date("1996-08-25T00:00:00.000Z");

    const elapsedDays = getDaysBetween(this.earthDate, EPHEMERIS);

    return (
      DEGREES_IN_A_CIRCLE +
      ((DAILY_MOTION_IN_DEGREES * elapsedDays + LON_AT_EPOCH) %
        DEGREES_IN_A_CIRCLE)
    );
  }

  // Determine distance of the Earth from the Sun
  // Sets value in Astronomical Units
  private setEarthHeliocentricDistance() {
    // Uses epoch of Jan 2 2002, 14:09 UTC as Perihelion
    // Earth perihelion and aphelion Table Courtesy of Fred Espenak, www.Astropixels.com
    const perihelion = new Date("2002-01-02T14:09:00.000Z");

    const daysSincePerihelion = getDaysBetween(this.earthDate, perihelion);

    const trueAnomaly =
      (daysSincePerihelion / DAYS_IN_YEAR) * DEGREES_IN_A_CIRCLE;

    // http://curious.astro.cornell.edu/our-solar-system/41-our-solar-system/the-earth/orbit/80-how-can-i-find-the-distance-to-the-sun-on-any-given-day-advanced
    return (
      (EARTH_SEMI_MAJOR_AXIS * (1 - EARTH_ECCENTRICITY * EARTH_ECCENTRICITY)) /
      (1 + EARTH_ECCENTRICITY * cos(trueAnomaly))
    );
  }

  private setEarthMarsDistance() {
    const lons = [
      this._earthHeliocentricLongitude,
      this._heliocentricLongitude,
    ];
    lons.sort((a, b) => b - a);

    let angle = lons[0] - lons[1];
    angle = angle > 180 ? DEGREES_IN_A_CIRCLE - angle : angle;

    // find distance between Earth and Mars using law of cosines.
    // Assumes no orbital inclination of either planet for simplicity.
    return Math.sqrt(
      Math.pow(this.earthHeliocentricDistance, 2) +
        Math.pow(this.heliocentricDistance, 2) -
        2 *
          this.earthHeliocentricDistance *
          this.heliocentricDistance *
          cos(angle)
    );
  }

  // Returns number of seconds it takes to cross distance of Earth and Mars at speed of light
  private setLightDelay() {
    return (
      (this.earthMarsDistance * ASTRONOMICAL_UNIT * MILLIS_IN_A_SEC) /
      SPEED_OF_LIGHT
    );
  }
}
