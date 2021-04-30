import { addLeadingZero } from "..";

export const formatTime = (time: number) => {
  const hour = Math.floor(time);
  const minsLeft = (time - hour) * 60;
  const minute = Math.floor(minsLeft);
  const second = Math.floor((minsLeft - minute) * 60);

  const hourString = addLeadingZero(hour.toString(), 2);
  const minuteString = addLeadingZero(minute.toString(), 2);
  const secondString = addLeadingZero(second.toString(), 2);

  return `${hourString}:${minuteString}:${secondString}`;
};
