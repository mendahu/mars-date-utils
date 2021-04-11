const LEAP_SECONDS = {
  "63100800000": 10,
  "78822000000": 11,
  "94723200000": 12,
  "126259200000": 13,
  "157795200000": 14,
  "189331200000": 15,
  "220953600000": 16,
  "252489600000": 17,
  "284025600000": 18,
  "315561600000": 19,
  "362818800000": 20,
  "394354800000": 21,
  "425890800000": 22,
  "489049200000": 23,
  "568022400000": 24,
  "631180800000": 25,
  "662716800000": 26,
  "709974000000": 27,
  "741510000000": 28,
  "773046000000": 29,
  "820483200000": 30,
  "867740400000": 31,
  "915177600000": 32,
  "1136102400000": 33,
  "1230796800000": 34,
  "1341126000000": 35,
  "1435734000000": 36,
  "1483257600000": 37,
};

const TAI_UTC_DIFF = 32.184;

export class MarsDate {
  public earthDate: Date;
  private epoch: number;
  private offsetFromJ2000: number;
  private julianDateUT: number;
  private julianOffset: number;
  private UTCtoTTConversion: number;
  private julianDateTT: number;
  private marsMeanAnomaly: number;
  private marsAngleOfFictionMeanSun: number;
  private marsPerturbers: number;
  private marsEquationOfCenter: number;

  constructor(earthDate: Date) {
    this.earthDate = earthDate;
    this.epoch = earthDate.getTime();
    this.julianDateUT = this.getJulianDateUT(this.epoch);
    this.UTCtoTTConversion = this.getUTCtoTTConversion(this.julianOffset);
    this.julianDateTT = this.getJulianDateTT(
      this.julianDateUT,
      this.UTCtoTTConversion
    );
    this.offsetFromJ2000 = this.getOffsetFromJ2000(this.julianDateTT);
    this.marsMeanAnomaly = this.getMarsMeanAnomaly(this.offsetFromJ2000);
    this.marsAngleOfFictionMeanSun = this.getMarsAngleOfFictionMeanSun(
      this.offsetFromJ2000
    );
    this.marsPerturbers = this.getMarsPerturbers(this.offsetFromJ2000);
    this.marsEquationOfCenter = this.getMarsEquationOfCentre(
      this.marsMeanAnomaly,
      this.marsPerturbers
    );
  }

  public getEarthDate() {
    return this.earthDate;
  }

  private getJulianDateUT(epoch) {
    return 2440587.5 + epoch / 86400000;
  }

  private getUTCtoTTConversion(JDut) {
    if (this.epoch >= 0) {
      const mostRecentLeapSecondEpoch = Object.keys(LEAP_SECONDS).find(
        (ls) => Number(ls) >= this.epoch
      );

      return LEAP_SECONDS[mostRecentLeapSecondEpoch] + TAI_UTC_DIFF;
    } else {
      const jOff = (JDut - 2451545.0) / 36525;

      return (
        64.184 +
        59 * jOff -
        51.2 * Math.pow(jOff, 2) -
        67.1 * Math.pow(jOff, 3) -
        16.4 * Math.pow(jOff, 4)
      );
    }
  }

  private getJulianDateTT(JDut, TTUTC) {
    return JDut + TTUTC / 86400;
  }

  private getOffsetFromJ2000(JDtt) {
    return JDtt - 2451545;
  }

  private getMarsMeanAnomaly(jOff) {
    return 19.3871 + 0.52402073 * jOff;
  }

  private getMarsAngleOfFictionMeanSun(jOff) {
    return 270.3871 + 0.524038496 * jOff;
  }

  private getMarsPerturbers(jOff) {
    const PERTURBERS = [
      {
        A: 0.0071,
        T: 2.2353,
        P: 49.409,
      },
      {
        A: 0.0057,
        T: 2.7543,
        P: 168.173,
      },
      {
        A: 0.0039,
        T: 1.1177,
        P: 191.837,
      },
      {
        A: 0.0037,
        T: 15.7866,
        P: 21.736,
      },
      {
        A: 0.0021,
        T: 2.1354,
        P: 15.704,
      },
      {
        A: 0.002,
        T: 2.4694,
        P: 95.528,
      },
      {
        A: 0.0018,
        T: 32.8493,
        P: 49.095,
      },
    ];

    let acc: number = 0;

    const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);

    PERTURBERS.forEach((per) => {
      const cosiner = (0.985626 * jOff) / per.T;
      const result = per.A * cos(cosiner + per.P);
      acc += result;
    });

    return acc;
  }

  private getMarsEquationOfCentre(M, perturbers) {
    const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);

    return (
      (10.691 + 0.0000003 * this.offsetFromJ2000) * sin(M) +
      0.623 * sin(2 * M) +
      0.05 * sin(3 * M) +
      0.005 * sin(4 * M) +
      0.0005 * sin(5 * M) +
      perturbers
    );
  }

  public getMarsLs() {
    return (this.marsAngleOfFictionMeanSun + this.marsEquationOfCenter) % 360;
  }
}
