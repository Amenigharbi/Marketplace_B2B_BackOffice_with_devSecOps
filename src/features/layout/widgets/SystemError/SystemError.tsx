"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import syetemErrorImg from "@/public/images/system-error.png";
import syetemErrorImgDark from "@/public/images/system-error-dark.png";
import { useTheme } from "next-themes";

const SystemError = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center py-10 md:py-20 lg:py-28">
      <div className="mx-auto flex  max-w-[640px] flex-col items-center justify-center text-center">
        <Image
          src={theme == "dark" ? syetemErrorImgDark : syetemErrorImg}
          alt="confirm illustration"
          className="mb-10 lg:mb-14"
          height={30}
          width={30}
        />
        <h2 className="h2 mb-4 lg:mb-6">Oops... Something went wrong</h2>
        <p className="mb-6 md:mb-8 lg:mb-10">
          An error has occurred. If the problem persists, please contact a
          system administrator or try again later.
        </p>
        <button onClick={() => window.history.go(-1)} className="btn">
          Take Me Back <IconArrowUpRight />
        </button>
      </div>
    </div>
  );
};

export default SystemError;
