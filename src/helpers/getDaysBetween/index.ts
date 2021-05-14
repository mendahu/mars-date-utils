import { MS_PER_DAY } from "../../constants";

export const getDaysBetween = (date1: Date, date2: Date) => {
  return Math.abs(date1.getTime() - date2.getTime()) / MS_PER_DAY;
};
