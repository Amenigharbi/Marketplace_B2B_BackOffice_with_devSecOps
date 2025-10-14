"use client";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ProgressChart = ({
  labels,
  series,
  bg = "#5D69F4",
}: {
  labels: string;
  series: number;
  bg?: string;
}) => {
  const { theme } = useTheme();
  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: {
        enabled: false,
      },
    },
    series: [series],
    legend: {
      show: false,
    },
    stroke: {
      lineCap: "round",
    },
    colors: [bg],
    plotOptions: {
      radialBar: {
        track: {
          background: theme == "light" ? "#EBECEF" : "#343E56",
        },
        dataLabels: {
          value: {
            show: false,
          },
          name: {
            offsetY: 5,
          },
        },
        hollow: {
          size: "55%",
        },
      },
    },
    labels: [labels],
  };
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartOptions.series}
      width={"55%"}
      height={140}
      type="radialBar"
    />
  );
};

export default ProgressChart;
