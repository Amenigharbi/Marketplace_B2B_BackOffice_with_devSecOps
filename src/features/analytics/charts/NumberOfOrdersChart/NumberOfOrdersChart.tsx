import dynamic from "next/dynamic";
import MonthPicker from "../../widgets/MonthPicker";
import { useEffect, useState, useCallback } from "react";
import Loading from "@/features/shared/elements/Loading";
import { useGetNooByMonth } from "../../hooks/useGetNooByMonth";
import { useGetNooLifetime } from "../../hooks/useGetNooLifetime";
import ChartFilterSelector from "../../widgets/ChartFilterSelector";
import YearPicker from "../../widgets/YearPicker";
import { useGetNooByYear } from "../../hooks/useGetNooByYear";

export const options = [
  { name: "By Month", key: "month" },
  { name: "By Year", key: "year" },
  { name: "Lifetime", key: "lifetime" },
];

const NumberOfOrdersChart = () => {
  const date1 = new Date();
  const currentYear = date1.getFullYear();

  const [date, setDate] = useState(`${currentYear}-01-01`);
  const [year, month, day] = date.split("-").map(Number);
  const [selected, setSelected] = useState(options[0]);
  const [total, setTotal] = useState(0);
  const [selectedYear, setSelectedYear] = useState<any>(currentYear);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: monthData, isLoading: isByMonthLoading, total: monthTotal } = useGetNooByMonth(year, month);
  const { data: lifeTimeData, isLoading: isLifetimeLoading, total: lifetimeTotal } = useGetNooLifetime();
  const { data: yearData, isLoading: isYearLoading, total: yearTotal } = useGetNooByYear(selectedYear);

  const [xAxis, setXaxis] = useState<any[]>([]);
  const [yAxis, setYaxis] = useState<any[]>([]);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  const chartOptions = {
    xaxis: {
      categories: xAxis,
    },
  };

  const series = [
    {
      name: "Number of Orders ",
      data: yAxis,
    },
  ];

  // Update the total when selection changes
  useEffect(() => {
    if (selected.key === "month") {
      setTotal(monthTotal);
    } else if (selected.key === "year") {
      setTotal(yearTotal);
    } else if (selected.key === "lifetime") {
      setTotal(lifetimeTotal);
    }
  }, [selected, lifetimeTotal, yearTotal, monthTotal]);

  // Handle loading state to show spinner
  useEffect(() => {
    const isCurrentlyLoading = isByMonthLoading || isLifetimeLoading || isYearLoading;
    setIsLoading(isCurrentlyLoading);
  }, [isByMonthLoading, isLifetimeLoading, isYearLoading]);

  // Memoize data transformation logic
  const updateChartData = useCallback((data: any, key: string) => {
    if (key === "month") {
      setYaxis(data?.map((item: any) => parseInt(item.numberOfOrders)));
      setXaxis(data?.map((item: any) => item.day));
    } else if (key === "lifetime") {
      setYaxis(data?.map((item: any) => parseInt(item.numberOfOrders)));
      setXaxis(data?.map((item: any) => item.date));
    } else if (key === "year") {
      setYaxis(data?.map((item: any) => parseInt(item.numberOfOrders)));
      setXaxis(data?.map((item: any) => item.date));
    }
  }, []);

  // Fetch and update chart data based on selection
  useEffect(() => {
    if (selected.key === "month" && monthData) {
      updateChartData(monthData, "month");
      setData(monthData);
    } else if (selected.key === "lifetime" && lifeTimeData) {
      updateChartData(lifeTimeData, "lifetime");
      setData(lifeTimeData);
    } else if (selected.key === "year" && yearData) {
      updateChartData(yearData, "year");
      setData(yearData);
    }
  }, [selected, monthData, lifeTimeData, yearData, updateChartData]);

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center">
          <div className="mx-4 h-8 w-8 items-center justify-center">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">
            Number of Orders Chart: {total || 0}
          </p>
        </div>
        <div className="flex">
          {selected.key === "month" && (
            <MonthPicker onMonthChange={(date: string) => setDate(date)} />
          )}
          {selected.key === "year" && (
            <YearPicker onYearChange={(date: string) => setSelectedYear(date)} />
          )}
          <ChartFilterSelector selected={selected} onSelect={setSelected} items={options} />
        </div>
      </div>

      <div className="h-[320px]">
        {data && (
          <ReactApexChart
            height="100%"
            width={"100%"}
            series={series}
            options={chartOptions}
            type={selected.key === "month" ? "bar" : "line"}
          />
        )}
      </div>
    </div>
  );
};

export default NumberOfOrdersChart;
