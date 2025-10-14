import { getNooByDay } from "@/services/orders/getNumberOfOrders/getNooByDay";
import { axios } from "@/libs/axios";

// Helper function to generate an array of days for the given month and year
function generateMonthDaysObject({ year, month }: any) {
  const lastDay = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);
  return daysArray;
}

// Fetch data function to get external data (e.g., orders)
const fetchData = async () => {
  try {
    // Get today's date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits for month
    const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure 2 digits for day

    // Format the current date as dd/mm/yyyy
    const fromDate = `${day}/${month}/${year}`;
    const today1 = new Date();

    const year1 = today1.getFullYear();
    const month1 = (today1.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits for month
    const day1 = today1.getDate().toString().padStart(2, "0"); // Ensure 2 digits for day
    const fromDate1 = `${day1}-${month1}-${year1}`;

    // Get tomorrow's date
    currentDate.setDate(currentDate.getDate() - 217); // Move to the previous day
    const nextDay = currentDate.getDate().toString().padStart(2, "0");
    const nextMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits for month
    const nextYear = currentDate.getFullYear();

    // Format tomorrow's date as dd/mm/yyyy
    const toDate = `${nextDay}/${nextMonth}/${nextYear}`;

    // Make the API request
    const res = await axios.magentoClient.get(
      `analytics/get_by_date_range?from=${toDate}&to=${fromDate}`,
    );
    //
    // Check if data exists and has the expected structure
    if (res.data && res.data.days) {
      let l;
      const entryIndex1 = res.data.days.findIndex(
        (item: { key: any }) => item.key === fromDate1,
      );
      if (entryIndex1 == -1) {
        l = 0;
        // Push the current day data into the list
        res.data.days.push({
          key: fromDate1,
          value: l,
        });
      }
      return res.data; // return the data if it's valid
    } else {
      console.error("Unexpected response structure", res.data);
      return null; // return null if the data doesn't match expectations
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // return null in case of an error
  }
};

// Function to update the day in the list using the external data
let updateDayInList = (externalData: any, list: any[]) => {
  try {
    // Get the last value of externalData.days.value, ensure days is an array
    if (!externalData?.days || externalData.days.length === 0) {
      console.error("No days data found in external data.");
      return list; // return list as is if no days data
    }

    // Get the current date in the format 'yyyy-m-d'
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-based, so add 1
    const currentDay = currentDate.getDate();
    const currentFormattedDate = `${currentYear}-${
      currentMonth < 10 ? "0" + currentMonth : currentMonth
    }-${currentDay < 10 ? "0" + currentDay : currentDay}`;
    const currentFormattedDate1 = `${
      currentDay < 10 ? "0" + currentDay : currentDay
    }-${currentMonth < 10 ? "0" + currentMonth : currentMonth}-${currentYear}`;

    // Loop for the previous 7 days
    for (let i = 1; i <= 216; i++) {
      // Calculate the previous date by subtracting 'i' days from the current date
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - i);
      const pastYear = pastDate.getFullYear();
      const pastMonth = pastDate.getMonth() + 1; // Month is 0-based, so add 1
      const pastDay = pastDate.getDate();

      // Format the past date
      const pastFormattedDate = `${pastYear}-${pastMonth}-${
        pastDay < 10 ? "0" + pastDay : pastDay
      }`;
      //// Subtract i days

      // Find the list entry for the specific past date
      const entryIndex = list.findIndex(
        (item) => item.date === pastFormattedDate,
      );
      let lastDayValue =
        externalData.days[externalData.days.length - i - 1].value;
      if (entryIndex !== -1) {
        // If the entry is found, update the 'day' value with the lastDayValue
        list[entryIndex].numberOfOrders = lastDayValue;
        //
      }
    }

    let lastDayValue1 = externalData.days[externalData.days.length - 1].value;
    const entryIndex1 = externalData.days.findIndex(
      (item: { key: any }) => item.key === currentFormattedDate,
    );
    if (entryIndex1 == -1)
      lastDayValue1 = externalData.days[externalData.days.length - 1].value;
    // Push the current day data into the list
    list.push({
      date: currentFormattedDate,
      numberOfOrders: lastDayValue1.toString(),
      day: currentDay,
    });
    return list;
  } catch (error) {
    console.error("Error updating day:", error);
    return list; // return list as is in case of error
  }
};

// Main function to fetch number of orders by month
export const nooByMonth = async (
  year: string,
  month: string,
  storeId: string | null,
) => {
  const list: any[] = [];
  let updatedList: any[] = [];

  // Fetch external data
  const externalData = await fetchData();
  //

  // If externalData is invalid, return the empty list and total of 0
  if (!externalData || !externalData.days) {
    console.error("External data is invalid or missing the 'days' field.");
    return { data: list, total: 0 };
  }

  const monthDays: any[] = generateMonthDaysObject({ year, month });

  // Populate the list with orders data
  for (const day of monthDays) {
    let towDigitDay = day;
    if (day.toString().length !== 2) towDigitDay = "0" + day.toString();
    const dayDate: string = year + "-" + month + "-" + towDigitDay;
    //
    const currentDate = new Date();

    const day1 = currentDate.getDate().toString().padStart(2, "0"); // Ensure 2 digits for day
    //
    let numberOfOrders;
    if (day1 != towDigitDay)
      numberOfOrders = await getNooByDay(dayDate, storeId);

    if (numberOfOrders) {
      list.push({
        numberOfOrders: numberOfOrders?.toString(),
        date: dayDate,
        day,
      });
    }
  }

  updatedList = list;

  if (externalData.days && externalData.days.length > 0) {
    updatedList = updateDayInList(externalData, list);
  }
  //
  const total = updatedList.reduce(
    (total, current) => total + Number(current.numberOfOrders),
    0,
  );

  return { data: updatedList, total };
};
