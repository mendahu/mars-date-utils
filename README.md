# Mars Date Utilities

For working with time on Mars

## Getting Started

Create a new instance of a MarsDate by passing it an Earth Date.

```javascript
const spiritRoverLanding = new Date(1073137591000);
const marsDate = new MarsDate(spiritRoverLanding);
```

## Methods

```javascript
marsDate.getLs(); // Returns the Ls (solar longitude) of Mars
// 327.32416829616636

marsDate.getMST(); // Returns the Mean Solar Time of Mars (equivalent to Earth's UTC)
// "13:09:56"

const landingSiteLongitude = 184.702; // Degrees West of Mars Prime Meridien
marsDate.getLMST(landingSiteLongitude); // Returns Local Mean Solar Time at a specific longitude
// "00:51:07"

marsDate.getLTST(landingSiteLongitude); // Returns Local True Solar Time at a specific longitude
// "00:00:01"

marsDate.getYear(); // Returns the Mars Year, with Year 1 beginning April 11 1955 at 00:00:00 UTC
// 26
```
