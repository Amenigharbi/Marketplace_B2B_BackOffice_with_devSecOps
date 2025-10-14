"use client";

import { IconMoon, IconSunHigh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Props } from "./types";
import { useTheme } from "next-themes";

const ModeSwitcher = ({ isBlue, isWhite }: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const handleThemeSwitch = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <button
      aria-label="dark mode switch"
      onClick={handleThemeSwitch}
      className={`rounded-full p-2 sm:p-3  ${
        isBlue &&
        "border border-primary bg-transparent !p-1.5 text-primary dark:bg-transparent sm:!p-2 xxl:!p-3"
      } ${
        isWhite
          ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
          : "bg-primary/5 dark:bg-bg3"
      }`}
    >
      {theme == "light" ? <IconMoon /> : <IconSunHigh />}
    </button>
  );
};

export default ModeSwitcher;
