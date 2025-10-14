import { typesenseClient } from "@/clients/typesense/typesenseClient";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { getGmvByDay } from "@/clients/typesense/orders/gmv/getGmvByDay";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export async function populateCollection() {
  try {
    const startYear = 2020;
    const currentDate = dayjs();
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month() + 1;
    const currentDay = currentDate.date();

    for (let year = startYear; year <= currentYear; year++) {
      console.info(" populate GMV Previous Days Collection ~ year:", year);

      const finalMonth = year === currentYear ? currentMonth : 12;

      for (let month = 1; month <= finalMonth; month++) {
        console.info(" populate GMV Previous Days Collection  ~ month:", month);

      const endDay =
          year === currentYear && month === currentMonth
            ? currentDay 
            : dayjs(`${year}-${month}`).daysInMonth();
         /*   const endDay =
            year === currentYear && month === currentMonth
              ? dayjs().endOf('month').date()
              : dayjs(`${year}-${month}`).daysInMonth();*/
        for (let day = 1; day <= endDay; day++) {
          try {
            const date = dayjs(`${year}-${month}-${day}`);
          
            const week = date.isoWeek();
            const result = await getGmvByDay(year, month, day);
            const document = {
              id: `${year}-${month}-${day}`,
              year: year.toString(),
              month: month.toString(),
              day: day.toString(),
              gmv: result,
              week: week.toString(),
            };
            await typesenseClient
              .collections("gmvPreviousDays")
              .documents()
              .upsert(document);
          } catch (error) {
            console.error(
              `Error processing date ${year}-${month}-${day}:`,
              error,
            );
          }
        }
      }
    }

    console.info(`GmvPrevDays Collection successfully populated.`);
  } catch (error) {
    console.error("Error populating gmvPreviousDays:", error);
    throw error;
  }
}
