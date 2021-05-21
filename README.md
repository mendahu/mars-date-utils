# Mars Date Utilities

Zero dependency JavaScript library for working with time on Mars.

## Getting Started

Create a new instance of a MarsDate by passing it an Earth Date.

```javascript
import { MarsDate } from "mars-date-utils";

const spiritRoverLanding = new Date(1073190900000);
// 2004-01-04T04:35:00.000Z

const marsDate = new MarsDate(spiritRoverLanding);
```

## Basic Time Methods

These methods return the DateTime on Mars for your given Earth DateTime. `mars-date-utils` can return the Mars Year, Solar Longitude (used by scientists to determine seasonality) and Mean Solar Time at Mars Prime Meridien (longitude 0).

```javascript
marsDate.getCalendarYear(); // 26
// Returns the Mars Year, with Year 1 beginning April 11 1955 at 00:00:00 UTC

marsDate.getLs(); // 327.66627413425294
// Returns the Ls (solar longitude)

marsDate.getMST(); // "03:34:38"
// Returns the Mean Solar Time (equivalent to Earth's UTC)

marsDate.getEarthDate(); // 2004-01-04T04:35:00.000Z
// Return back Earth Date Object
```

## Longitude-Specific Time Methods

By passing these methods a longitude (degrees west from Prime Meridien), you can retrieve the local mean solar time or local true solar time from a specific location of your Mars DateTime.

```javascript
const landingSiteLongitude = 184.527364; // Degrees West of Mars Prime Meridien

marsDate.getLMST(landingSiteLongitude); // "15:16:31"
// Returns Local Mean Solar Time at a specific longitude

marsDate.getLTST(landingSiteLongitude); // "14:25:24"
// Returns Local True Solar Time at a specific longitude
```

## Age Methods

These methods calculate age from your Mars DateTime until now.

```javascript
marsDate.getAgeInYears(); // 9.185908911135375
//Returns age in Mars Years

marsDate.getAgeInSols(); // 6141.690430655763
//Returns age in Mars Sols

marsDate.getAgeInSeconds(); // 545230062.457
//Returns age in Seconds
```

## Special Age Methods

Other useful age methods.

```javascript
marsDate.getSolOfMission(landingSiteLongitude); // 6142
// Returns the day number since date at location,
// assuming date starts on Sol 0 and ticks over at local midnight.
// Useful for calculating what sol a space mission is on.

const n = 1;

marsDate.getAnniversary(n); // 2005-11-21T04:05:48.240Z
// Returns the nth Mars anniversary of the Mars Date.
// Example of n = 1 returns 1 Mars year since Spirit Landing.
// Returns regular Earth Date object.

marsDate.getNextAnniversary(n); // 2022-10-25T23:43:02.406Z
// Considering the original Mars Date, returns the Mars next anniversary of that date.
// n defaults to 1 but can be incremented to return n anniversaries from now
// Returns a regular Date object from which you can get the date on Earth
// Useful for finding your next Mars Birthday. 🎂
```

## Solar Position Methods

Methods to work with the position of the sun.

```javascript
const options = {
  unit: "au", // default
};

marsDate.getHeliocentricDistance(options); // 1.4784561362455526
// Returns the distance between the centre of Mars and the centre
// of the Sun on the given Mars Date. Defaults to "AU" as a unit
// but can optionally be passed "km" for kilometres
```

```javascript
const lat = -14.5684;
const lon = 184.527364; // Degrees West of Mars Prime Meridien

marsDate.getSolarElevation(lat, lon); // 54.726577500467855
// Return the elevation of the sun, in degrees, from the horizon (0
// is at the horizon, 90 is straight up). A negative number indicates
// the sun is below the horizon (ie. it is night time).

marsDate.getSolarAzimuth(lat, lon); // 267.47987404238927
// Return the solar azimuth (compass direction of the sun) in degrees
// clockwise from North. 0 degrees is North, 90 is East, 180 is South and 270 is West
```

## Earth and Mars Relationship Methods

Methods exploring time and distance between Earth and Mars

```javascript
const options = {
  unit: "au", // default
};

marsDate.getDistanceBetweenEarthAndMars(options); // 1.1387184676741797
// Returns the distance between the centre of Mars and the centre
// of the Earth on the given Mars Date. Defaults to "AU" as a unit
// but can optionally be passed "km" for kilometres
```

```javascript
marsDate.getLightDelay(); // 568.2259628119933
// Returns the time (in seconds) it would take light to travel between the
// centre of the Earth and the centre of Mars. Useful to determine one way
// radio signal delay when communicating with Spacecraft.
```
