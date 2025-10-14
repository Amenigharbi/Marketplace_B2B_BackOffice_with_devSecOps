import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/utils/ThemeProvider";
import { NextUIProvider } from "@nextui-org/react";
import { Next13NProgress } from "nextjs13-progress";
import { LayoutProvider } from "@/utils/LayoutContext";

import "@/public/styles/style.scss";
import "@/public/styles/globals.css";

type PageParamsType = {
  locale: string;
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "Kamioun - Order Management System",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const RootLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: PageParamsType;
}) => {
  return (
    <html suppressHydrationWarning lang={locale} className="!scroll-smooth">
      <meta name="robots" content="noindex,nofollow" />
      <body className={`${inter.className}   text-n500  dark:text-n30 `}>
        <ThemeProvider>
          <Next13NProgress color="#5D69F4" height={3} />
          <LayoutProvider>
            <NextUIProvider
            ///  locale="fr-FR"c
            >
              {children}
            </NextUIProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
