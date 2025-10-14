import { typesenseClient } from "@/clients/typesense/typesenseClient";
import dayjs from "dayjs";
import { getGmvByMonth } from "@/clients/typesense/orders/gmv/getGmvByMonth";

export async function populateCollection() {
  try {
    const startYear = 2020;
    const currentDate = dayjs().format("MM-YYYY");
    const [month, year] = currentDate.split("-").map(Number);
    let endMonth = 12;
    for (let j = startYear; j <= year; j++) {
      console.info("populate GMV Previous Months Collection ~ Year:", j);

      if (j === year) {
        endMonth = month - 1;
      }
      for (let i = 1; i <= endMonth; i++) {
        const result = await getGmvByMonth(j, i);
        const monthDocument = {
          id: `${i}-${j}`,
          year: j.toString(),
          month: i.toString(),
          gmv: result,
        };
        await typesenseClient
          .collections("gmvPreviousMonths")
          .documents()
          .upsert(monthDocument);
      }
    }

    console.info("Finished populating gmvPreviousMonths collection");
    return {
      success: true,
      message: "GMV previous months data updated successfully",
    };
  } catch (error) {
    console.error("Error populating gmvPreviousMonths:", error);
    throw error;
  }
}
