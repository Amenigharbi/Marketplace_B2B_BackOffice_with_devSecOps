"use client";
import { options } from "@/public/data/timesDropdown";
import { useLayout } from "@/utils/LayoutContext";
import { useWindowSize } from "@/features/shared/hooks/useWindowSize";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
//import Dropdown from "../../elements/Dropdown";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ShowcaseInfo = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { windowSize } = useWindowSize();
  const { dir } = useLayout();

  const chartData: ApexOptions = {
    series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
    chart: {
      height: 355,
      type: "polarArea",
    },
    colors: [
      "#5D69F4",
      "#00998B",
      "#FFC861",
      "#FF6161",
      "#8169D3",
      "#5D69F4",
      "#00998B",
      "#FFC861",
      "#FF6161",
    ],
    labels: [
      "Application",
      "Widgets",
      "Input Forms",
      "Components",
      "Pages",
      "Earning List",
      "Total Sale",
      "Revenue",
      "Ads Spent",
    ],
    stroke: {
      colors: theme == "dark" ? ["#343E56"] : ["#EBECEF"],
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    responsive: [
      {
        breakpoint: 1600,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 320,
        options: {
          chart: {
            height: 500,
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      style: {
        colors: theme != "dark" ? ["#343E56"] : ["#EBECEF"],
      },
      textAnchor: "start",
      distributed: false,
      background: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: theme == "dark" ? "#343E56" : "#EBECEF",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: theme == "dark" ? "#343E56" : "#EBECEF",
        },
      },
    },
    legend: {
      offsetX: 10,
      offsetY: windowSize! > 1600 ? 40 : 10,
      itemMargin: {
        vertical: 3,
      },
      position: windowSize! > 580 ? "right" : "bottom",
      horizontalAlign: "center",
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
      markers: {
        //  width: 5,
        // height: 5,
        offsetX: dir == "ltr" ? -6 : 3,
      },
    },
  };
  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Showcase Info</p>
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
        height={450}
        width={"100%"}
        series={chartData.series}
        options={chartData}
        type="polarArea"
      />
    </div>
  );
};

export default ShowcaseInfo;
