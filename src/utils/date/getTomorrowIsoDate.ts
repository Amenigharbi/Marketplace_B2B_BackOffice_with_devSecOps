export const getTomorrowIsoDate = () => {
  // Step 1: Create a new Date object for the current date
  let today = new Date();

  // Step 2: Add one day to the current date
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Step 3: Convert the resulting date to ISO format
  let isoTomorrow = tomorrow.toISOString().split("T")[0];

  return isoTomorrow;
};
