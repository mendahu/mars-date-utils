# Mars Date Utilities

For working with time on Mars

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

## Special Methods

Other useful methods.

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
