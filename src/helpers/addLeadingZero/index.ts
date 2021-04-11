export const addLeadingZero = (string: string, length: number) => {
  for (let i = 0; i < length; i++) {
    string = "0" + string;
  }

  return string.slice(-length);
};
