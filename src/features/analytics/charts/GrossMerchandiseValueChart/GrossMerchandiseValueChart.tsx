import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../../widgets/YearPicker";
import ChartFilterSelector from "../../widgets/ChartFilterSelector";
import MonthPicker from "../../widgets/MonthPicker";
import { useGetGmvByMonth } from "../../hooks/useGetGmvByMonth";
import { useGetGmvByYear } from "../../hooks/useGetGmvByYear";
import { useGetGmvLifetime } from "../../hooks/useGetGmvLifetime";

export const options = [
  { name: "By Month", key: "month" },
  { name: "By Year", key: "year" },
  { name: "Lifetime", key: "lifetime" },
];

const GrossMerchandiseValueChart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateYear, setDateYear] = useState(`${new Date().getFullYear()}-01-01`);
  const [dateMonth, setDateMonth] = useState("2024-01");
  const [year, month] = dateMonth.split("-").map(Number);
  const [selected, setSelected] = useState(options[0]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);

  const [total, setTotal] = useState(0);
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
      name: "Gross Merchandise Value",
      data: chartData,
    },
  ];

  const {
    data: monthData,
    total: totalByMonth,
    isLoading: isMonthLoading,
    refetch: refetchMonth,
  } = useGetGmvByMonth({
    year,
    month,
  });

  const {
    data: yearData,
    total: totalByYear,
    isLoading: isYearLoading,
    refetch: refetchYear,
  } = useGetGmvByYear(dateYear);

  const {
    data: lifetimeData,
    total: totalLifetime,
    isLoading: isLifetimeLoading,
    refetch: refetchLifetime,
  } = useGetGmvLifetime();

  useEffect(() => {
    if (selected.key === "month" && monthData) {
      const yAxis = monthData?.map((item: any) => parseInt(item.gmv)); // Reverse y-axis data
      const xAxis = monthData?.map((item: any) => item.day); // Reverse x-axis data

      setChartData(yAxis);
      setXAxis(xAxis);
      refetchMonth();
    }
  }, [monthData, selected, year, month, refetchMonth]);

  useEffect(() => {
    if (selected.key === "month") {
      setTotal(totalByMonth);
    }
    if (selected.key === "year") {
      setTotal(totalByYear);
    }
    if (selected.key === "lifetime") {
      setTotal(totalLifetime);
    }
  }, [selected, totalByMonth, totalByYear, totalLifetime]);

  useEffect(() => {
    if (selected.key === "lifetime" && lifetimeData) {
      const yAxis = lifetimeData?.map((item: any) => parseInt(item.gmv));
      const xAxis = lifetimeData?.map((item: any) => item.quarter);

      setChartData(yAxis);
      setXAxis(xAxis);
      refetchLifetime();
    }
  }, [lifetimeData, selected, refetchLifetime]);

  useEffect(() => {
    if (selected.key === "year" && yearData) {
      const yAxis = yearData?.map((item: any) => parseInt(item.gmv));
      const xAxis = yearData?.map((item: any) => item.month);

      setChartData(yAxis);
      setXAxis(xAxis);
      refetchYear();
    }
  }, [selected, yearData, dateYear, refetchYear]);

  useEffect(() => {
    if (isMonthLoading || isYearLoading || isLifetimeLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isMonthLoading, isYearLoading, isLifetimeLoading]);

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center">
          <div className="mx-4 h-8 w-8 items-center justify-center">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">
            Gross Merchandise Value : {Math.floor(total) || 0} TND
          </p>
        </div>
        <div className="flex flex-row">
          {selected.key === "year" && (
            <YearPicker onYearChange={(date: string) => setDateYear(date)} />
          )}
          {selected.key === "month" && (
            <MonthPicker onMonthChange={(date: string) => setDateMonth(date)} />
          )}
          <ChartFilterSelector
            selected={selected}
            onSelect={setSelected}
            items={options}
          />
        </div>
      </div>
      <div className="h-[320px]">
        <ReactApexChart
          height="100%"
          width={"100%"}
          series={series}
          options={chartOptions}
          type="bar"
        />
      </div>
    </div>
  );
};

export default GrossMerchandiseValueChart;
