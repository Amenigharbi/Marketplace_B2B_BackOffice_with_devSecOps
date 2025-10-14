"use client";
import { options } from "@/public/data/timesDropdown";
import { useLayout } from "@/utils/LayoutContext";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
//import Dropdown from "../../elements/Dropdown";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

let series = [
  {
    name: "Total Sales",
    data: [10, 80, 70, 65, 40, 88, 60, 99, 105],
  },
  {
    name: "Total Expense",
    data: [13, 61, 70, 88, 68, 30, 100, 70, 98],
  },
  {
    name: "Total Profit",
    data: [9, 38, 35, 52, 49, 70, 38, 22, 148],
  },
];

const SalesStatistics = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { dir } = useLayout();
  const chartData: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    forecastDataPoints: {
      count: 3,
    },
    colors: ["#FFC861", "#00998B", "#5D69F4"],
    stroke: {
      width: 3,
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      tickAmount: 9,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      tickAmount: 6,
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
        offsetX: dir == "rtl" ? -30 : 0,
      },
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: undefined,
      textAnchor: "middle",
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
      },
    },
    legend: {
      offsetY: 8,
      markers: {
        //  height: 4,
        //  width: 4,
        offsetX: dir == "rtl" ? 5 : -5,
      },
      itemMargin: {
        horizontal: 20,
      },
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
    },
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
      padding: {
        bottom: 16,
      },
    },
  };

  return (
    <div className="box col-span-12 overflow-x-hidden lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Sales Statistics</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          {/* <Dropdown
            selected={selected}
            setSelected={setSelected}
            items={options}
          /> */}
        </div>
      </div>
      <ReactApexChart
        height={400}
        width={"100%"}
        series={series}
        options={chartData}
        type="line"
      />
    </div>
  );
};

export default SalesStatistics;
