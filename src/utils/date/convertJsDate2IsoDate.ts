export const convertJsDate2IsoDate = (date: Date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Input must be a valid Date object");
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const isoDate = `${year}-${month}-${day}`;

  return isoDate;
};
