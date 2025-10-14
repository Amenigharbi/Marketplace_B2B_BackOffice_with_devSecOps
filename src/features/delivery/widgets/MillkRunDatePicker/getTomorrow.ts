import { getTomorrowJsDate } from "@/utils/date/getTomorrowJsDate";

export const getTomorrow = (): Date => {
  const today = new Date();
  let tomorrow = getTomorrowJsDate();
  // Check if tomorrow is Sunday, if yes, set to day after tomorrow
  if (tomorrow.getDay() === 0) {
    tomorrow.setDate(today.getDate() + 2);
  }

  return tomorrow;
};
