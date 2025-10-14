import React from "react";
import { IconClock, IconMessageDots } from "@tabler/icons-react";
import Image from "next/image";
import { unixTimestampToDateDMY } from "@/utils/date/unixTimestamp";
const NotificationComponent = ({ data }: any) => {
  return (
    <div
      key={data.id}
      className={`rounded-xl p-4 md:p-6 ${
        !false && "bg-primary/5 dark:bg-bg3"
      } mb-4 flex flex-wrap items-start gap-4 border border-n30 last:mb-0 dark:border-n500 md:gap-6`}
    >
      <Image
        src="/images/avatarUser.jpg"
        width={48}
        className="rounded-full"
        height={48}
        alt="img"
      />
      <div className="grow">
        <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-4">
          <p className="text-xl font-medium">{data.name}</p>
        </div>
        <div className="bb-dashed mb-5 flex gap-1 pb-5">
          <IconMessageDots />
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span>{data.message}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconClock />
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {unixTimestampToDateDMY(new Date().getTime())}
            </p>
            <span className="text-xs">{data.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;
