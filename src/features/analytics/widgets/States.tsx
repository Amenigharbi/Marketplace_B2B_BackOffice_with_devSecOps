"use client";
import { IconArrowUpRight, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import ProgressChart from "./ProgressChart";
const statesData = [
  {
    title: "All Earnings",
    amount: "$65,110",
    percent: 40.7,
    series: 35.5,
  },
  {
    title: "Total Users",
    amount: "32.7k",
    percent: 66.7,
    series: 78.5,
  },
  {
    title: "Session",
    amount: "29.4%",
    percent: 10.7,
    series: 55.5,
  },
  {
    title: "Monthly Sales",
    amount: "$33,110",
    percent: 50.7,
    series: 83.5,
  },
];
const States = () => {
  return (
    <>
      {statesData.map(({ amount, percent, series, title }) => (
        <div
          key={title}
          className="box col-span-12 bg-n0 dark:bg-n800 min-[650px]:col-span-6 xxxl:col-span-3"
        >
          <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <span className="font-medium">{title}</span>
            <div className="flex">
              <Image
                src="/images/user-2.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-3.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-4.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-5.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-n0 bg-primary text-n0 dark:border-n500">
                <IconPlus size={22} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="h4 mb-4">{amount}</h4>
              <span className="flex items-center gap-1 whitespace-nowrap text-primary">
                <IconArrowUpRight /> {percent}%
              </span>
            </div>
            <div className="-my-3 shrink-0 ltr:translate-x-3 ltr:xl:translate-x-7 ltr:xxxl:translate-x-2 ltr:4xl:translate-x-9 rtl:-translate-x-3 rtl:xl:-translate-x-7 rtl:xxxl:-translate-x-2 rtl:4xl:-translate-x-9">
              <ProgressChart labels={series + "%"} series={series} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default States;
