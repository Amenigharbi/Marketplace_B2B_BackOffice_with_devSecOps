//import type { LocalePrefix } from "node_modules/next-intl/dist/types/src/shared/types";

//const localePrefix: LocalePrefix = "as-needed";

export const AppConfig = {
  name: "Kamioun OMS",
  locales: [
    {
      id: "en",
      name: "English",
    },
    { id: "fr", name: "Français" },
  ],
  defaultLocale: "en",
  // localePrefix,
};

export const AllLocales = AppConfig.locales.map((locale) => locale.id);
