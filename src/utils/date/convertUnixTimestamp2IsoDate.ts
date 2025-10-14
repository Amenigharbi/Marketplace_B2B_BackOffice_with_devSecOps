export const convertUnixTimestampToIsoDate = (
  unixTimestamp: number,
): string => {
  const date = new Date(unixTimestamp * 1000); // Convert UNIX timestamp to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
