"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import LenisContext from "./lenis-context";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    let lenisInstance: Lenis | null = null;

    const init = async () => {
      const { default: LenisConstructor } = await import("lenis");
      lenisInstance = new LenisConstructor({
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

      document.documentElement.classList.add("lenis");
      document.documentElement.classList.add("lenis-smooth");

      let rafId = 0;
      function raf(time: number) {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

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
              const offset = 120;
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
        cancelAnimationFrame(rafId);
        lenisInstance?.destroy();
        document.removeEventListener("click", handleAnchorClick);
        document.documentElement.classList.remove("lenis");
        document.documentElement.classList.remove("lenis-smooth");
      };
    };

    const cleanupPromise = init();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  useLayoutEffect(() => {
    // Reset scroll position on route change.
    // This prevents Next.js/Lenis from keeping the previous scroll offset.
    if (!pathname) return;

    // If Lenis isn't ready yet, fallback to native.
    if (!lenis) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Ensure no visible "jump/animation" after route change.
    // Lenis has `immediate` option, use it to avoid tweening.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    lenis.scrollTo(0, { immediate: true, programmatic: true });

    // `stop()`-like operations can leave Lenis in a stopped state.
    // Restart it on the next frame so the whole site scrolls again.
    requestAnimationFrame(() => {
      try {
        lenis.start();
      } catch {
        // noop
      }
    });
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
  );
}
