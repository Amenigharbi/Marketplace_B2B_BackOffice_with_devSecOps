"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import syetemErrorImg from "@/public/images/404.jpeg";

const PageNotFoundError = () => {
  return (
    <div className="flex flex-grow items-center justify-center py-10 md:py-20 lg:py-28">
      <div className="mx-auto flex  max-w-[640px] flex-col items-center justify-center text-center">
        <Image
          src={syetemErrorImg}
          alt="confirm illustration"
          className="mb-10 lg:mb-14"
        />
        <h2 className="h2 mb-4 lg:mb-6">Oops...Page Not Found </h2>
        <p className="mb-6 md:mb-8 lg:mb-10">
          If the problem persists, please contact a system administrator or try
          again later.
        </p>
        <button onClick={() => window.history.go(-1)} className="btn">
          Take Me Back <IconArrowUpRight />
        </button>
      </div>
    </div>
  );
};

export default PageNotFoundError;
