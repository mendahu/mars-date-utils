// Based on Allison and McEwen (2000) and revision from the Mars24 Sunclock
// https://www.giss.nasa.gov/tools/mars24/help/algorithm.html

// Leap Second additions since EPOCH Jan 1 1970
// Will need to be updated if new leap seconds are added
// Current as of April 2021
// https://www.ietf.org/timezones/data/leap-seconds.list
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

// it is important to note that the table provides values for the TAI-UTC difference,
// where TAI is International Atomic Time. To obtain the TT-UTC difference, add 32.184
// seconds to the value of TAI-UTC.
const TAI_UTC_DIFF = 32.184;

const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);
const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);

export class MarsDateBase {
  protected earthDate: Date;
  protected ls: number;
  protected MST: number;

  private julianDateTT: number;
  private j2000offset: number;
  private marsEOC: number;
  private marsEOT: number;

  constructor(earthDate: Date) {
    this.earthDate = earthDate;

    this.julianDateTT = this.getJulianDateTT();
    this.j2000offset = this.julianDateTT - 2451545;
    this.marsEOC = this.getMarsEquationOfCentre();
    this.ls = this.calculateLs();
    this.marsEOT = this.getMarsEOT();
    this.MST = this.calculateMST();
  }

  private getUTCtoTTConversion(JDut, epoch) {
    if (epoch >= 0) {
      const mostRecentLeapSecondEpoch = Object.keys(LEAP_SECONDS).find(
        (ls) => Number(ls) >= epoch
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

  private getJulianDateTT() {
    const epoch = this.earthDate.getTime();
    const JDut = 2440587.5 + epoch / 86400000;
    const TTUTC = this.getUTCtoTTConversion(JDut, epoch);
    return JDut + TTUTC / 86400;
  }

  private getMarsPerturbers() {
    let acc: number = 0;

    PERTURBERS.forEach((per) => {
      const cosiner = (0.985626 * this.j2000offset) / per.T;
      const result = per.A * cos(cosiner + per.P);
      acc += result;
    });

    return acc;
  }

  private getMarsEquationOfCentre() {
    const M = 19.3871 + 0.52402073 * this.j2000offset;

    const perturbers = this.getMarsPerturbers();

    return (
      (10.691 + 0.0000003 * this.j2000offset) * sin(M) +
      0.623 * sin(2 * M) +
      0.05 * sin(3 * M) +
      0.005 * sin(4 * M) +
      0.0005 * sin(5 * M) +
      perturbers
    );
  }

  private calculateLs() {
    const aFMS = 270.3871 + 0.524038496 * this.j2000offset;
    const EOC = this.marsEOC;
    const ls = (aFMS + EOC) % 360;
    if (ls < 0) {
      return ls + 360;
    } else {
      return ls;
    }
  }

  private getMarsEOT() {
    const Ls = this.ls;
    const eqCenter = this.marsEOC;

    return (
      2.861 * sin(2 * Ls) - 0.071 * sin(4 * Ls) + 0.002 * sin(6 * Ls) - eqCenter
    );
  }

  private calculateMST() {
    const msd =
      (this.julianDateTT - 2451549.5) / 1.0274912517 + 44796 - 0.0009626;
    return (24 * msd) % 24;
  }

  protected calculateLMST(lon: number) {
    const time = this.calculateMST() - (lon * 24) / 360;
    return (time + 24) % 24;
  }

  protected calculateLTST(lon: number) {
    return this.calculateLMST(lon) + this.marsEOT * (24 / 360);
  }
}
