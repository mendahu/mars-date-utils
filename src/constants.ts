// Leap Second additions since EPOCH Jan 1 1970
// Will need to be updated if new leap seconds are added
// Current as of April 2021
// https://www.ietf.org/timezones/data/leap-seconds.list
export const LEAP_SECONDS = {
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

export const PERTURBERS = [
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
export const TAI_UTC_DIFF = 32.184;

// Earth Time Constants
export const MS_PER_DAY = 8.64e7;
export const SECS_PER_DAY = MS_PER_DAY / 1000;
export const DAYS_IN_CENTURY = 36525;

// Mars time Constants
export const MARS_YEAR_EPOCH = new Date(-524102400000);
export const MARS_SOLS_IN_YEAR = 668.5991;
export const MARS_SECONDS_IN_SOL = 24 * 60 * 60 + 39 * 60 + 35.244; // 24 hours, 39 minutes, 35.244 seconds

// Other Constants
export const DEGREES_IN_A_CIRCLE = 360;
