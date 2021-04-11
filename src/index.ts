import { MarsDate } from "./classes/MarsDate";

const spiritLanding = new Date(1073137591000);
const SPIRIT_LON = 184.702;

const testDate = spiritLanding;
const testLon = SPIRIT_LON;

const marsNow = new MarsDate(testDate);

console.log(marsNow);
console.log("Ls", marsNow.getLs());
console.log("MST", marsNow.getMST());
console.log("LMST", marsNow.getLMST(testLon));
console.log("LTST", marsNow.getLTST(testLon));
