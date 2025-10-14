export const convertIsoDateToUnixTimestamp = (isoDate: string): number => {
  const date = new Date(isoDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid ISO date format:", isoDate);
    return NaN;
  }

  const res = Math.floor(date.getTime() / 1000);

  return res;
};
