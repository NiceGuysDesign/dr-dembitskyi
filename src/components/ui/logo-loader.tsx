"use client";

import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import animationData from "../../../Dembutskyi Preloader Animation.json";

interface LogoLoaderProps {
  className?: string;
  onComplete?: () => void;
}

export default function LogoLoader({ className, onComplete }: LogoLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let anim: AnimationItem | null = null;
    const containerEl = containerRef.current;

    async function mount() {
      if (!containerEl) return;
      const lottie = (await import("lottie-web")).default;
      if (destroyed) return;

      anim = lottie.loadAnimation({
        container: containerEl,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData,
      });

      if (onComplete) {
        anim.addEventListener("complete", onComplete);
      }
    }

    void mount();

    return () => {
      destroyed = true;
      try {
        if (anim && onComplete) {
          anim.removeEventListener("complete", onComplete);
        }
      } catch {
        // ignore
      }
      anim?.destroy();
      if (containerEl) {
        containerEl.innerHTML = "";
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center max-w-[90%] mx-auto md:max-w-none justify-center ${className || ""}`}
    />
  );
}
