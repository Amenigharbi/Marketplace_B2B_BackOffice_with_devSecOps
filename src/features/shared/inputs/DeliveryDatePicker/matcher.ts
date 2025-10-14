export const matcher = (day: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the day is a Sunday
  const isSunday = day.getDay() === 0;

  // Return false for all previous days (including today) and all upcoming Sundays
  return day <= today ;
};
