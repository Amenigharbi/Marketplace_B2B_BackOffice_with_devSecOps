import { getNooForEachHourOfTheDay } from "@/services/orders/getNumberOfOrders/getNooForEachHourOfTheDay";

export const nooByDay = async ({ currentDay, storeId }: any) => {
  const [day, month, year] = currentDay.split("-");

  let towDigitDay = day.toString();
  if (day.toString().length != 2) {
    towDigitDay = "0" + day.toString();
  }
  const dayDate: string = year + "-" + month + "-" + towDigitDay;

  let data: any[] = [];

  const numberOfOrders = await getNooForEachHourOfTheDay({
    date: dayDate,
    storeId,
  });
  numberOfOrders.map((OrderByHour, index) => {
    data.push({
      numberOfOrders: !!OrderByHour ? OrderByHour : 0,
      day: dayDate,
      Hour: `${index + 1}:00`,
    });
  });

  const total = data.reduce(
    (total, current) => total + current.numberOfOrders,
    0,
  );

  return { data, total };
};
