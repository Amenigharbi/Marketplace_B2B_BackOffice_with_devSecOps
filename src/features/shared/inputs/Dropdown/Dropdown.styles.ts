export const tailwind = {
  container(width: string, bg: string): string {
    return ` font-semibold flex cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 px-3 py-1.5 text-xs dark:border-n500 sm:px-4 sm:py-2 
    min-w-48
    

    `;
  },
  list(width: string, open: boolean): string {
    return `absolute z-20 flex-col rounded-md ${
      width ? width : "min-w-max sm:min-w-[140px]"
    } top-full max-h-40 origin-top overflow-y-auto rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 ltr:right-0 rtl:left-0 ${
      open
        ? "visible flex scale-100 opacity-100"
        : "invisible scale-0 opacity-0"
    }`;
  },
};
