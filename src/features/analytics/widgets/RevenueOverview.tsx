"use client";
import { options } from "@/public/data/timesDropdown";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
//import Dropdown from "../../elements/Dropdown";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueOverview = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const chartData: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#5D69F4"],
    stroke: {
      width: 5,
    },
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
      categories: [
        "11 Feb",
        "13 Feb",
        "15 Feb",
        "19 Feb",
        "21 Feb",
        "23 Feb",
        "25 Feb",
        "27 Feb",
        "01 Mar",
        "11 Mar",
        "13 Mar",
        "15 Mar",
        "19 Mar",
        "21 Mar",
        "23 Mar",
        "25 Mar",
        "27 Mar",
        "28 Mar",
        "30 Mar",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme == "dark" ? "#404A60" : "#EBECEF",
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 2,
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
    },

    markers: {
      //  width: 8,
      //  height: 8,
      //radius: 50,
      shape: "circle",
      size: 8,
      strokeColors: "#FFC861",
      hover: {
        size: 12,
      },
    },
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
    },
  };

  let series = [
    {
      name: "Total Sales",
      data: [
        2, 40, 48, 22, 26, 19, 59, 40, 43, 21, 15, 51, 57, 34, 30, 28, 24, 27,
        18, 51,
      ],
    },
  ];
  return (
    <div className="box col-span-12 overflow-x-hidden lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Revenue Overview</p>
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
        height={250}
        width={"100%"}
        series={series}
        options={chartData}
        type="line"
      />
    </div>
  );
};

export default RevenueOverview;
