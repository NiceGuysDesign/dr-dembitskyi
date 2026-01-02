"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import LenisContext from "./lenis-context";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(lenisInstance);

    // Додаємо клас до html елемента
    document.documentElement.classList.add("lenis");
    document.documentElement.classList.add("lenis-smooth");

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Глобальний обробник для всіх якорних посилань
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (anchor && anchor.getAttribute("href")?.startsWith("#")) {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          const targetId = href.substring(1);
          const element = document.getElementById(targetId);

          if (element && lenisInstance) {
            e.preventDefault();
            const offset = 120; // Відступ зверху
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            lenisInstance.scrollTo(offsetPosition, {
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenisInstance.destroy();
      document.removeEventListener("click", handleAnchorClick);
      document.documentElement.classList.remove("lenis");
      document.documentElement.classList.remove("lenis-smooth");
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
  );
}
