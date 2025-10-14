import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import { axios } from "@/libs/axios";

// Helper function to generate an array of days in a given month of a given year
function generateMonthDaysObject({
  year,
  month,
}: {
  year: number;
  month: number;
}): number[] {
  const lastDay = new Date(year, month, 0).getDate(); // Get the last day of the month
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1); // Create an array of days
  return daysArray;
}

// Helper function to get the current day in the `yyyy-m-d` format
function getCurrentDayId(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Remove padStart to get the month without leading zero
  const day = currentDate.getDate().toString().padStart(2, "0"); // Keep padStart for day to ensure 2 digits
  return `${year}-${month}-${day}`;
}

//);

// Define the type for the document in the hits array
interface GmvDocument {
  day: string;
  gmv: number;
  id: string;
  month: string;
  week: string;
  year: string;
}

// Typesense hit structure
interface SearchResponseHit<T> {
  document: T;
}

type DataType = {
  day: number;
  gmv: number;
};

export const gmvByMonth = async (year: number, month: number) => {
  const monthDays: number[] = generateMonthDaysObject({ year, month });
  let allOrders: number[] = [];

  try {
    const searchParams = {
      filter_by: `month:=[${month}] && year:=[${year}]`,
      q: "*",
      query_by: "year,month",
      page: 1,
      per_page: 250,
    };
    const searchResults = await typesenseClient
      .collections("gmvPreviousDays")
      .documents()
      .search(searchParams);

    const hits: SearchResponseHit<GmvDocument>[] =
      searchResults.hits as SearchResponseHit<GmvDocument>[];

    // Get the current day ID
    const currentDayId = getCurrentDayId();

    // Fetch the last 90 days of external data
    const fetchData = async () => {
      try {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 90); // Set to 90 days ago
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits for month
        const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure 2 digits for day

        // Format the current date as dd/mm/yyyy
        const fromDate = `${day}/${month}/${year}`;

        // Get today's date
        currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const nextDay = currentDate.getDate().toString().padStart(2, "0");
        const nextMonth = (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const nextYear = currentDate.getFullYear();

        // Format tomorrow's date as dd/mm/yyyy
        const toDate = `${nextDay}/${nextMonth}/${nextYear}`;

        // Make the API request
        const res = await axios.magentoClient.get(
          `/analytics/get_base_total_by_date_range?from=${fromDate}&to=${toDate}`,
        );

        // Check if data exists and has the expected structure
        if (res.data && res.data.days) {
          // Handle response
          return res.data;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };

    const externalData = await fetchData();
    if (!externalData) {
      throw new Error("Failed to fetch external data.");
    }

    // Get the last 90 days of external data
    const last90Days = externalData.days.slice(-90);

    // Modify the hits array: Update gmv values for matching days
    let modifiedHits = hits.map((hit) => {
      const document = hit.document;
      const documentId = document.id; // `yyyy-m-d` format
      const [year, month, day] = document.id.split("-");
      const documentDate = `${day.padStart(2, "0")}-${month.padStart(
        2,
        "0",
      )}-${year}`; // Ensure dd-mm-yyyy
      // Find matching external data based on the formatted documentDate
      const matchingExternalData = last90Days.find(
        (data: { key: string }) => data.key === documentDate,
      );

      if (matchingExternalData) {
        // Update the gmv for today's document
        document.gmv = matchingExternalData.value;
      } else {
        document.gmv = 0;
      }
      return hit; // Return the updated hit
    });

    // Sort the data by day
    const sortedHits = modifiedHits.sort((a, b) => {
      return parseInt(a.document.day) - parseInt(b.document.day);
    });

    // Now extract all orders from the sorted and modified hits
    allOrders = sortedHits.map((hit) => hit.document.gmv);

    const data: DataType[] = monthDays.map((day, index) => ({
      day,
      gmv: allOrders[index] || 0,
    }));

    const total = data.reduce((total, current) => total + current.gmv, 0);

    return { data, total };
  } catch (error: any) {
    logError(error);
  }
};
