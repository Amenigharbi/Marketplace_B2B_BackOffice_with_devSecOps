"use client";

import { IconChevronDown, IconWorld } from "@tabler/icons-react";
import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";

import { AllLocales } from "@/utils/AppConfig";
import ISO6391 from "iso-639-1";
import { useDropdown } from "@/features/shared/hooks/useDropdown";

import { useLocale } from "next-intl";
import { useState } from "react";

const LanguageSwitcher = ({ isWhite }: { isWhite?: boolean }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  const [selected, setSelected] = useState(locale);
  const { open, ref, toggleOpen } = useDropdown();

  const onSelect = (lang: string) => {
    if (lang != locale) router.push(pathName, { locale: lang });
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className={`flex gap-1 rounded-full p-2 sm:p-3 ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconWorld />
        <IconChevronDown size={22} />
      </button>
      <div
        className={`absolute top-full rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        <ul className="flex w-32 flex-col rounded-md bg-n0 p-1 dark:bg-bg4">
          {AllLocales.map((locale) => (
            <li
              key={locale}
              onClick={() => onSelect(locale)}
              className={`block cursor-pointer rounded-md px-4 py-2 duration-300 hover:text-primary ${
                selected == locale && "bg-primary text-n0 hover:!text-n0"
              }`}
            >
              {ISO6391.getNativeName(locale)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
