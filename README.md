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

```javascript
marsDate.getCalendarYear(); // Returns the Mars Year, with Year 1 beginning April 11 1955 at 00:00:00 UTC
// 26

marsDate.getLs(); // Returns the Ls (solar longitude)
// 327.66628054834337

marsDate.getMST(); // Returns the Mean Solar Time (equivalent to Earth's UTC)
// "03:34:38"
```

## Longitude-Specific Time Methods

```javascript
const landingSiteLongitude = 184.527364; // Degrees West of Mars Prime Meridien

marsDate.getLMST(landingSiteLongitude); // Returns Local Mean Solar Time at a specific longitude
// "15:16:32"

marsDate.getLTST(landingSiteLongitude); // Returns Local True Solar Time at a specific longitude
// "14:25:25"
```

## Age Methods

```javascript
marsDate.getAgeInYears(); //Returns age in Mars Years
// 9.18334452656409

marsDate.getAgeInSols(); //Returns age in Mars Sols
// 6139.975885450677

marsDate.getAgeInSeconds(); //Returns age in Seconds
// 545077857.385
```
