export const isoDate2UnixTimestamp = (isoDate: string): number => {
  return Math.floor(new Date(isoDate).getTime() / 1000);
};
