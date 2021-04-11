import { MarsDateBase } from "./MarsDateBase";

export class MarsDate extends MarsDateBase {
  constructor(earthDate: Date) {
    super(earthDate);
  }

  public getEarthDate() {
    return this.earthDate;
  }

  private formatTime(time: number) {
    const addLeadingZero = (num: number) => {
      return ("0" + num).slice(-2);
    };

    const hour = Math.floor(time);
    const minsLeft = (time - hour) * 60;
    const minute = Math.floor(minsLeft);
    const second = Math.floor((minsLeft - minute) * 60);

    return `${addLeadingZero(hour)}:${addLeadingZero(minute)}:${addLeadingZero(
      second
    )}`;
  }

  /****************************************************
  Public Methods for Fetching Time Data
  *****************************************************/

  // Solar Longitude - Location of Mars around the Sun, or roughly the season
  public getLs() {
    return this.ls;
  }

  // Mean Solar Time at Airy Crater (Lon 0 deg)
  public getMST() {
    return this.formatTime(this.MST);
  }

  // Local Mean Solar Time at a specific longitude
  public getLMST(lon: number) {
    return this.formatTime(this.calculateLMST(lon));
  }

  // Local True Solar Time at a specific longitude
  public getLTST(lon: number) {
    return this.formatTime(this.calculateLTST(lon));
  }
}
