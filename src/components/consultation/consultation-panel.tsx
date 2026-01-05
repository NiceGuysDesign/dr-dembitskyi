"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useConsultation } from "./consultation-provider";
import ConsultationForm from "./consultation-form";

export default function ConsultationPanel() {
  const { isOpen, closeConsultation } = useConsultation();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const savedScrollYRef = useRef<number>(0);

  // Create and manage GSAP timeline
  useEffect(() => {
    if (!panelRef.current) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Find main content wrapper (the div with margin-top in ConsultationProvider)
    const mainContent = document.querySelector(
      "[data-consultation-content]"
    ) as HTMLElement;

    if (!mainContent) return;

    // Set initial positions
    // Use height to reveal from top to bottom, content inside stays at full height
    gsap.set(panelRef.current, {
      height: "0vh", // Start with 0 height (hidden)
    });
    gsap.set(mainContent, { marginTop: "0" });

    // Create new timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.6, ease: "power3.inOut" },
    });

    // Animate panel height (reveal from top) and main content margin-top simultaneously
    // Content inside form stays fixed at full height (100vh), only the wrapper height animates
    tl.to(panelRef.current, {
      height: "100vh", // Fully revealed (full height)
      willChange: "height",
    })
      .to(
        mainContent,
        {
          marginTop: "100vh",
          willChange: "margin-top",
        },
        0 // Start at the same time
      )
      .call(() => {
        // Clean up will-change after animation
        if (panelRef.current) {
          gsap.set(panelRef.current, { willChange: "auto" });
        }
        if (mainContent) {
          gsap.set(mainContent, { willChange: "auto" });
        }
      });

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  // Control timeline based on isOpen state
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isOpen) {
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  }, [isOpen]);

  // Block body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      // Get scroll position before blocking
      savedScrollYRef.current =
        window.scrollY || document.documentElement.scrollTop;

      // Block scroll using body styles
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Refresh ScrollTrigger after DOM update
      setTimeout(() => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gsap = (window as any).gsap;
          if (gsap && gsap.ScrollTrigger) {
            gsap.ScrollTrigger.refresh();
          }
        }
      }, 100);
    } else {
      // Restore scroll when closing
      const scrollY = savedScrollYRef.current;

      // Restore body styles
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Restore scroll position after a delay to allow DOM update
      setTimeout(() => {
        window.scrollTo(0, scrollY);

        // Refresh ScrollTrigger after DOM update
        setTimeout(() => {
          if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const gsap = (window as any).gsap;
            if (gsap && gsap.ScrollTrigger) {
              gsap.ScrollTrigger.refresh();
            }
          }
        }, 100);
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeConsultation();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeConsultation]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeConsultation();
    }
  };

  // Prevent click inside form from closing
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-0 left-0 right-0 z-[100] overflow-hidden"
      style={{
        width: "100vw",
      }}
      onClick={handleBackdropClick}
    >
      {/* Content Container with fixed height */}
      <div
        ref={contentRef}
        className="h-full w-full"
        onClick={handleContentClick}
      >
        <ConsultationForm onClose={closeConsultation} />
      </div>
    </div>
  );
}
