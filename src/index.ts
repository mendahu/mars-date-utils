import { MarsDate } from "./classes/MarsDate";

const spiritLanding = new Date(1073190900000);
console.log(spiritLanding);
const SPIRIT_LON = 184.527364;

const now = new Date();
const MARS_PRIME_MERIDIEN = 0;

const testDate = spiritLanding;
const testLon = SPIRIT_LON;

const marsNow = new MarsDate(testDate);

console.log(marsNow);
console.log("Ls", marsNow.getLs());
console.log("MST", marsNow.getMST());
console.log("LMST", marsNow.getLMST(testLon));
console.log("LTST", marsNow.getLTST(testLon));
