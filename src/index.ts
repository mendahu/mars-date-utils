import { MarsDate } from "./classes/MarsDate";

const spiritLanding = new Date(1073137591000);

const marsNow = new MarsDate(spiritLanding);

console.log(marsNow);
console.log(marsNow.getMarsLs());
