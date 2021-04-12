import { MarsDateBase } from "./MarsDateBase";
import { addLeadingZero } from "../helpers/index";

export class MarsDate extends MarsDateBase {
  constructor(earthDate: Date) {
    super(earthDate);
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
    return this.marsYear;
  }

  // Solar Longitude - Location of Mars around the Sun, or roughly the season
  public getLs() {
    return this.ls;
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
    return this.formatTime(this.calculateLMST(lon));
  }

  // Local True Solar Time at a specific longitude
  public getLTST(lon: number) {
    return this.formatTime(this.calculateLTST(lon));
  }

  /****************************************************
  // Age Methods
  *****************************************************/

  public getAgeInYears() {
    return this.ageInYears;
  }

  public getAgeInSols() {
    return this.ageInSols;
  }

  public getAgeInSeconds() {
    return this.ageInSeconds;
  }
}
