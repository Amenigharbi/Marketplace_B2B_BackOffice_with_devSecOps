//To Refactor

export const unixTimestampToDateYMD = (timestamp: number): string => {
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

export const unixTimestampToDateDMY = (timestamp: number): string => {
  if (timestamp === 0) {
    return "***";
  }
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  if (!day || !month || !year) {
    return "***";
  }

  return `${day}-${month}-${year}`;
};

export const dateYMDToUnixTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};

export const unixTimestampToMagentoDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const unixTimestampToYMD = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

export const getUnixTimestampForTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1); // Set date to tomorrow
  return Math.floor(tomorrow.getTime() / 1000); // Convert to Unix timestamp (seconds since epoch)
};

import { getLocalTimeZone } from "@internationalized/date";

export const convertToUnixTimestamp = (value: any, formatter: any) => {
  const dateString = formatter.format(value?.toDate(getLocalTimeZone()));
  const [month, day, year] = dateString.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  return Math.floor(date.getTime() / 1000);
};
