"use client";
import { options } from "@/public/data/timesDropdown";
import useTable from "./useTable";
import { faker } from "@faker-js/faker";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
//import Dropdown from "../../elements/Dropdown";

type ProjectType = {
  title: string;
  percent: number;
  lead: {
    name: string;
    img: string;
  };
  status: string;
};

const projects: ProjectType[] = Array.from({ length: 4 }).map((_, i) => {
  return {
    title: faker.lorem.word(),
    percent: faker.number.int({ max: 100, min: 10 }),
    lead: {
      name: faker.person.firstName(),
      img: `/images/user-${i + 1}.png`,
    },
    status: faker.helpers.arrayElement(["Complete", "Inprogress", "Pending"]),
  };
});

const Projects = () => {
  const [selected, setSelected] = useState(options[0]);

  const { tableData, sortData } = useTable(projects);

  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Projects Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          {/* <Dropdown
            items={options}
            selected={selected}
            setSelected={setSelected}
          /> */}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-primary/5 text-n500 dark:bg-bg3 dark:text-n30">
              <th
                onClick={() => sortData("title")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Project Name <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("lead.name" as keyof ProjectType)}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Project Lead <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("percent")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Progress <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("status")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ lead, percent, status, title }) => (
              <tr key={title}>
                <td className="px-4 py-2">{title}</td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-3">
                    <Image
                      className="rounded-full"
                      src={lead.img}
                      width={32}
                      height={32}
                      alt="lead img"
                    />{" "}
                    {lead.name}{" "}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-2">
                    {percent}%{" "}
                    <span className="block h-1 w-20 rounded-sm bg-primary/10">
                      <span
                        style={{ width: `${percent}%` }}
                        className="block h-1 rounded-sm bg-primary"
                      ></span>
                    </span>
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`block w-28 rounded-[30px] border border-n30 py-2 text-center text-xs dark:border-n500 xxl:w-36 ${
                      status == "Complete" &&
                      "bg-primary/10 text-primary dark:bg-bg3"
                    } ${
                      status == "Inprogress" &&
                      "bg-secondary1/10 text-secondary1 dark:bg-bg3"
                    } ${
                      status == "Pending" &&
                      "bg-secondary2/10 text-secondary2 dark:bg-bg3"
                    }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
