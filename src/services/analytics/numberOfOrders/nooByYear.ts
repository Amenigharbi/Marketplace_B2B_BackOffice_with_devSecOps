import { getNooByMonth } from "@/services/orders/getNumberOfOrders/getNooByMonth";

function generateMonthsArray() {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export const nooByYear = async (year: string, storeId: string | null) => {
  const list: any[] = [];
  const months: number[] = generateMonthsArray();

  for (const month of months) {
    let twoDigitMonth = month.toString().padStart(2, "0");
    const monthDate: string = `${year}-${twoDigitMonth}`;
    const numberOfOrders = await getNooByMonth(monthDate, storeId);

    if (!numberOfOrders) {
      // break;
    }

    list.push({
      numberOfOrders: numberOfOrders?.toString(),
      date: monthDate,
    });
  }

  const total = list.reduce(
    (total, current) => total + Number(current.numberOfOrders),
    0,
  );

  return { data: list, total };
};
