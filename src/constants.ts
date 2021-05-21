// Leap Second additions since EPOCH Jan 1 1970
// Will need to be updated if new leap seconds are added
// Current as of April 2021
// https://www.ietf.org/timezones/data/leap-seconds.list
export const LEAP_SECONDS = {
  "63072000000": 10,
  "78796800000": 11,
  "94694400000": 12,
  "126230400000": 13,
  "157766400000": 14,
  "189302400000": 15,
  "220924800000": 16,
  "252460800000": 17,
  "283996800000": 18,
  "315532800000": 19,
  "362793600000": 20,
  "394329600000": 21,
  "425865600000": 22,
  "489024000000": 23,
  "567993600000": 24,
  "631152000000": 25,
  "662688000000": 26,
  "709948800000": 27,
  "741484800000": 28,
  "773020800000": 29,
  "820454400000": 30,
  "867715200000": 31,
  "915148800000": 32,
  "1136073600000": 33,
  "1230768000000": 34,
  "1341100800000": 35,
  "1435708800000": 36,
  "1483228800000": 37,
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
export const SECS_PER_DAY = 8.64e4;
export const HOURS_IN_A_DAY = 24;
export const DAYS_IN_YEAR = 365.25;
export const DAYS_IN_CENTURY = 36525;

// Earth Orbital Data
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
export const EARTH_SEMI_MAJOR_AXIS = 1.00000011; // AU
export const EARTH_ECCENTRICITY = 0.01671022;

// Mars time Constants
export const MARS_YEAR_EPOCH = -524102400000; // April 1, 1955, 00:00 UTC
export const MARS_SOLS_IN_YEAR = 668.5991;
export const MARS_SECONDS_IN_SOL = 88775.244; // 24 hours, 39 minutes, 35.244 seconds
export const MARS_MILLIS_IN_A_YEAR = 59355048240.680405; // SOLS_IN_A_YEAR * SECS_IN_A_SOL * 1000

// Mars Orbital Data
export const MARS_SEMI_MAJOR_AXIS = 1.52367934; // AU

// Other Constants
export const MILLIS_IN_A_SEC = 1000;
export const DEGREES_IN_A_CIRCLE = 360;
export const LEAP_SECOND_EPOCH = 63072000000; // Jan 1, 1972, 00:00 UTC
export const ASTRONOMICAL_UNIT = 149597870.7; // kilometres in one AU
export const SPEED_OF_LIGHT = 299792458; // metres per second
