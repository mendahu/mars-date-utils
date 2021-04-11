import { MarsDate } from "./classes/MarsDate";

const spiritLanding = new Date(1073137591000);
const SPIRIT_LON = 184.702;

const marsNow = new MarsDate(spiritLanding);

console.log(marsNow);
console.log(marsNow.getLs());
console.log(marsNow.getMST());
console.log(marsNow.getLMST(SPIRIT_LON));
console.log(marsNow.getLTST(SPIRIT_LON));
