import { MarsDate } from "./classes/MarsDate";

export { MarsDate };

const spiritRoverLanding = new Date(1073190900000);
// 2004-01-04T04:35:00.000Z
const now = new Date();

const marsDate = new MarsDate(spiritRoverLanding);
const nowMarsDate = new MarsDate(now);

console.log(marsDate);
console.log(nowMarsDate);

console.log(marsDate.getLMST(184.527364));
console.log(nowMarsDate.getMST());
console.log(marsDate.getAgeInSols());
console.log(marsDate.getSolOfMission());
