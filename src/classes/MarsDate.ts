import { MarsDateBase } from "./MarsDateBase";
import { addLeadingZero } from "../helpers/index";
import { MARS_SECONDS_IN_SOL, MARS_SOLS_IN_YEAR } from "../constants";

export class MarsDate extends MarsDateBase {
  constructor(earthDate?: Date) {
    super(earthDate || new Date());
  }

  public getEarthDate() {
    return this.earthDate;
  }

  private formatTime(time: number) {
    const hour = Math.floor(time);
    const minsLeft = (time - hour) * 60;
    const minute = Math.floor(minsLeft);
    const second = Math.floor((minsLeft - minute) * 60);

    const hourString = addLeadingZero(hour.toString(), 2);
    const minuteString = addLeadingZero(minute.toString(), 2);
    const secondString = addLeadingZero(second.toString(), 2);

    return `${hourString}:${minuteString}:${secondString}`;
  }

  /****************************************************
  // Basic Methods
  *****************************************************/

  // Mars Calendar Year, with Year 1 beginning April 11 1955 at 00:00:00 UTC
  public getCalendarYear() {
    return this.MY;
  }

  // Solar Longitude - Location of Mars around the Sun, or roughly the season
  public getLs() {
    return this.Ls;
  }

  // Mean Solar Time at Airy Crater (Lon 0 deg)
  public getMST() {
    return this.formatTime(this.MST);
  }

  /****************************************************
  // Longitude-Specific Methods
  *****************************************************/

  // Local Mean Solar Time at a specific longitude
  public getLMST(lon: number) {
    return this.formatTime(this.getLocalMeanSolarTime(lon));
  }

  // Local True Solar Time at a specific longitude
  public getLTST(lon: number) {
    return this.formatTime(this.getLocalTrueSolarTime(lon));
  }

  /****************************************************
  // Age Methods
  *****************************************************/

  public getAgeInSeconds() {
    const now = new Date();
    const nowSeconds = now.getTime();
    const dateSeconds = this.earthDate.getTime();

    return (nowSeconds - dateSeconds) / 1000;
  }

  public getAgeInSols() {
    const now = new Date();
    const msd = this.getMarsSolDate(now);
    return msd - this.marsSolDate;
  }

  public getAgeInYears() {
    return this.getAgeInSols() / MARS_SOLS_IN_YEAR;
  }

  /****************************************************
  // Special Age Methods
  *****************************************************/

  public getSolOfMission(lon: number) {
    const timeDiff = this.getLocalMeanSolarTime(lon);
    const adjAge = timeDiff / 24 + this.getAgeInSols();
    return Math.floor(adjAge);
  }

  public getAnniversary(n: number) {
    const anniversary =
      this.millisecondsSinceEpoch +
      MARS_SECONDS_IN_SOL * MARS_SOLS_IN_YEAR * n * 1000;
    return new Date(anniversary);
  }

  public getNextAnniversary(n: number = 1) {
    const age = this.getAgeInYears();
    return this.getAnniversary(Math.ceil(age) + n - 1);
  }

  /****************************************************
  // Other Methods
  *****************************************************/

  public getHeliocentricDistance(options?: { unit: "km" | "au" }) {
    const multiplier = options?.unit.toLowerCase() === "km" ? 149597870.7 : 1;
    return this.heliocentricDistance * multiplier;
  }
}
