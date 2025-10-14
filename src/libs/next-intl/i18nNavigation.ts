import { AllLocales, AppConfig } from "@/utils/AppConfig";

import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const { usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: AllLocales,
  // localePrefix: AppConfig.localePrefix,
});
