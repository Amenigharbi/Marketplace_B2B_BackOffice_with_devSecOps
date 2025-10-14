import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../YearPicker";
import { useGetNumberOfUniqueCustomerByYearAnalytics } from "../../hooks/useGetNucByYear";
import ChartFilterSelector from "../ChartFilterSelector";
import { useGetNucLifetime } from "../../hooks/useGetNucLifetime";

export const options = [
  { name: "By Year", key: "year" },
  { name: "Lifetime", key: "lifetime" },
];

const NumberOfUniqueCustomerChart = () => {
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const year = Number(date);
  const [selected, setSelected] = useState(options[0]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: yearData,
    isLoading: isYearLoading,
    refetch: refetchYear,
  } = useGetNumberOfUniqueCustomerByYearAnalytics(year);

  const {
    data: lifetimeData,
    isLoading: isLifetimeLoading,
    refetch: refetchLifetime,
  } = useGetNucLifetime();

  useEffect(() => {
    if (selected.key === "lifetime" && lifetimeData) {
      const yAxis = lifetimeData?.map((item: any) => parseInt(item.nuc));
      setChartData(yAxis);
      const xAxis = lifetimeData?.map((item: any) => item.quarter);
      setXAxis(xAxis);
      refetchLifetime();
    }
  }, [lifetimeData, selected, refetchLifetime]);

  useEffect(() => {
    if (selected.key === "year" && yearData) {
      const yAxis = yearData?.map((item: any) => parseInt(item.nuc));
      setChartData(yAxis);

      const xAxis = yearData?.map((item: any) => item.month);

      setXAxis(xAxis);
      refetchYear();
    }
  }, [selected, yearData, year, refetchYear]);

  useEffect(() => {
    if (isYearLoading || isLifetimeLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isYearLoading, isLifetimeLoading]);

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
      name: "Number of Unique Customer",
      data: chartData,
    },
  ];

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">Number of Unique Customer </p>
        </div>
        <div className="flex flex-row">
          {selected.key == "year" && (
            <YearPicker onYearChange={(date: string) => setDate(date)} />
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
          type={selected.key == "year" ? "bar" : "line"}
        />
      </div>
    </div>
  );
};

export default NumberOfUniqueCustomerChart;
