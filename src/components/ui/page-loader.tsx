"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "./logo-loader";

const VISITED_PAGES_KEY = "visited-pages";

function getVisitedPages(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = sessionStorage.getItem(VISITED_PAGES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function addVisitedPage(pathname: string): void {
  if (typeof window === "undefined") return;

  try {
    const visited = getVisitedPages();
    visited.add(pathname);
    sessionStorage.setItem(
      VISITED_PAGES_KEY,
      JSON.stringify(Array.from(visited))
    );
  } catch {
    // Ignore errors
  }
}

function isHomePage(pathname: string): boolean {
  // Check if pathname is home page (e.g., "/uk", "/en", or just "/")
  return pathname === "/" || /^\/[a-z]{2}$/.test(pathname);
}

function isPageReload(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return navigation?.type === "reload";
  } catch {
    // Fallback: check if it's the first page load
    return !sessionStorage.getItem("has-navigated");
  }
}

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Mark that navigation has occurred (after first mount)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      sessionStorage.setItem("has-navigated", "true");
    }

    // Always show loader on home page if it's a reload
    const isReload = isPageReload();
    const isHome = isHomePage(pathname);

    if (isHome && isReload) {
      // Always show loader on home page reload
      setIsLoading(true);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }, 2500);

      return () => clearTimeout(timer);
    }

    // For other pages, check if already visited
    const visitedPages = getVisitedPages();
    const isAlreadyVisited = visitedPages.has(pathname);

    if (isAlreadyVisited) {
      // Don't show loader for already visited pages
      setIsLoading(false);
      setIsAnimating(false);
      return;
    }

    // Show loader for new pages
    setIsLoading(true);
    setIsAnimating(true);

    // Mark page as visited immediately
    addVisitedPage(pathname);

    // Hide loader after animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Wait for fade out animation
    }, 2500); // Show loader for 2.5 seconds (2s animation + 0.5s delay)

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F4F5] transition-opacity duration-500 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-[442px] h-[120px] text-[#353556]">
        <LogoLoader />
      </div>
    </div>
  );
}
