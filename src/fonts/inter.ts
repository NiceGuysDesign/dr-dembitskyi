import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
