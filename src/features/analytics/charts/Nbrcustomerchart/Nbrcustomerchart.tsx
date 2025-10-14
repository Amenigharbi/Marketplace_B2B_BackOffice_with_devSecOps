import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../../widgets/YearPicker";
import ChartFilterSelector from "../../widgets/ChartFilterSelector";
import MonthPicker from "../../widgets/MonthPicker";
import { axios } from "@/libs/axios";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type

// Define the shape of your data objects
interface DailyData {
  key: string;
  value: number;
}

interface WeeklyData {
  key: string;
  value: number;
}

interface MonthlyData {
  key: string;
  value: number;
}

// Filter options (current, per day, week, month, lifetime)
export const options = [
  { name: "Current", key: "current" },
  { name: "By Day", key: "day" },
  { name: "By Week", key: "week" },
  { name: "By Month", key: "month" },
 
];

const Nbrcustomerchart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(`${new Date().getFullYear()}`);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedFilter, setSelectedFilter] = useState(options[0]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

  // Apex chart options, typed as ApexOptions
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar", // Bar chart type
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    xaxis: {
      categories: xAxis, // X-axis categories from data
    },
  };

  const series = [
    {
      name: "Number of Customers",
      data: chartData,
    },
  ];

  // Helper functions

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${("0" + day).slice(-2)}/${("0" + month).slice(-2)}/${year}`;
  };

  const getLastDayOfMonth = (year: string, month: string) => {
    const date = new Date(Number(year), Number(month), 0);
    return date.getDate();
  };

  const getLast60Days = () => {
    const today = new Date();
    const last60Days = new Date(today);
    last60Days.setDate(today.getDate() - 59);
    return {
      fromDate: formatDate(last60Days.toISOString().split("T")[0]),
      toDate: formatDate(today.toISOString().split("T")[0]),
    };
  };

  const fetchData = async (from: string, to: string) => {
    try {
      const res = await axios.magentoClient.get(
        `/analytics/get_customers_by_date_range?from=${from}&to=${to}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);

        let fromDate = "";
        let toDate = "";

        if (selectedFilter.key === "current") {
          const today = new Date();
          const firstDayOfMonth = "01";
          const lastDayOfMonth = getLastDayOfMonth(today.getFullYear().toString(), (today.getMonth() + 1).toString());
          fromDate = formatDate(`${today.getFullYear()}-${today.getMonth() + 1}-${firstDayOfMonth}`);
          toDate = formatDate(`${today.getFullYear()}-${today.getMonth() + 1}-${lastDayOfMonth}`);
        } else if (selectedFilter.key === "day") {
          const { fromDate: last60FromDate, toDate: last60ToDate } = getLast60Days();
          fromDate = last60FromDate;
          toDate = last60ToDate;
        } else if (selectedFilter.key === "week" || selectedFilter.key === "month") {
          fromDate = formatDate(`${selectedYear}-01-01`);
          toDate = formatDate(`${selectedYear}-12-31`);
        } else if (selectedFilter.key === "lifetime") {
          fromDate = formatDate(`${selectedYear}-01-01`);
          toDate = formatDate(`${selectedYear}-12-31`);
        }

        const data = await fetchData(fromDate, toDate);

        if (data) {
          if (selectedFilter.key === "day" || selectedFilter.key === "current") {
            const dailyData: DailyData[] = data.days || [];
            const yAxis = dailyData.map((item: DailyData) => item.value);
            const xAxis = dailyData.map((item: DailyData) => item.key);
            setChartData(yAxis);
            setXAxis(xAxis);
            setTotal(yAxis.reduce((acc, val) => acc + val, 0));
          } else if (selectedFilter.key === "week") {
            const weeklyData: WeeklyData[] = data.weeks || [];
            const yAxis = weeklyData.map((item: WeeklyData) => item.value);
            const xAxis = weeklyData.map((item: WeeklyData) => item.key);
            setChartData(yAxis);
            setXAxis(xAxis);
            setTotal(yAxis.reduce((acc, val) => acc + val, 0));
          } else if (selectedFilter.key === "month") {
            const monthlyData: MonthlyData[] = data.months || [];
            const yAxis = monthlyData.map((item: MonthlyData) => item.value);
            const xAxis = monthlyData.map((item: MonthlyData) => item.key);
            setChartData(yAxis);
            setXAxis(xAxis);
            setTotal(yAxis.reduce((acc, val) => acc + val, 0));
          } else if (selectedFilter.key === "lifetime") {
            const lifetimeData = data.months || [];
            const yearlyData: { [key: string]: number } = {};

            lifetimeData.forEach((item: any) => {
              const [month, year] = item.key.split("-");
              if (!yearlyData[year]) yearlyData[year] = 0;
              yearlyData[year] += item.value;
            });

            const xAxis = Object.keys(yearlyData);
            const yAxis = Object.values(yearlyData);

            setChartData(yAxis);
            setXAxis(xAxis);
            setTotal(yAxis.reduce((acc, val) => acc + val, 0));
          }
        }
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [selectedFilter, selectedYear, selectedMonth]);

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center">
          <div className="mx-4 h-8 w-8 items-center justify-center">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">
            Customer Count: {Math.floor(total) || 0}
          </p>
        </div>
        <div className="flex flex-row">
  {/* Display YearPicker for 'week' or 'month' filter */}
  {selectedFilter.key === "week" && (
    <YearPicker onYearChange={(date: string) => setSelectedYear(date)} />
  )}
  
  {/* Display MonthPicker for 'day' filter */}
  {selectedFilter.key === "day" }
  
  {/* Do not display any calendar for 'current' filter */}
  {selectedFilter.key !== "current" && selectedFilter.key !== "day" && selectedFilter.key !== "week" && (
    <>
      {selectedFilter.key === "month" && (
        <YearPicker onYearChange={(date: string) => setSelectedYear(date)} />
      )}
    </>
  )}

  <ChartFilterSelector
    selected={selectedFilter}
    onSelect={setSelectedFilter}
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

export default Nbrcustomerchart;
