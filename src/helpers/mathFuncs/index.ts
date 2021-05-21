// Helper Math functions to use degrees instead of radians

export const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);
export const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
export const tan = (deg: number) => Math.tan((deg * Math.PI) / 180);
export const acos = (deg: number) => (Math.acos(deg) * 180) / Math.PI;
export const atan2 = (y: number, x: number) =>
  (Math.atan2(y, x) * 180) / Math.PI;
