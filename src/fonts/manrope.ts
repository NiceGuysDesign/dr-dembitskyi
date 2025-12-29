import localFont from "next/font/local";

export const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope/Manrope-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});
