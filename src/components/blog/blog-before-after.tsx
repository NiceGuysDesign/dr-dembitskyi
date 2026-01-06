"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { BlogBeforeAfterBlock } from "@/strapi/blog";
import GlassSurface from "../ui/glass-surface";
import { useTranslation } from "react-i18next";

interface BlogBeforeAfterProps {
  block: BlogBeforeAfterBlock;
}

export default function BlogBeforeAfter({ block }: BlogBeforeAfterProps) {
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !isDragging) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMoveElement = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="space-y-4 md:space-y-6 my-8 md:my-12">
      <div
        ref={containerRef}
        className="relative w-full h-[600px] md:h-[700px] overflow-hidden cursor-col-resize select-none"
        onMouseMove={isDragging ? handleMouseMoveElement : undefined}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
      >
        {/* Before Image (Full) */}
        <div className="absolute inset-0">
          <Image
            src={block.beforeImage}
            alt={t("blog.before")}
            fill
            className="object-cover pointer-events-none"
            priority
          />
          {/* Before Label */}
          <div className="absolute top-6 left-6 z-20">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[var(--color-text-heading)] text-base font-semibold">
              {t("blog.before")}
            </span>
          </div>
        </div>

        {/* After Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={block.afterImage}
            alt={t("blog.after")}
            fill
            className="object-cover pointer-events-none"
            priority
          />
        </div>

        {/* After Label - outside clipped area */}
        <div className="absolute top-6 right-6 z-20">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[var(--color-text-heading)] text-base font-semibold">
            {t("blog.after")}
          </span>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          {/* Slider Handle */}
          <div
            className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
              width: "118px",
              height: "66px",
              left: "calc(50% - 33px - 26px)",
              top: "calc(50% - 59px + 26px)",
            }}
          >
            <GlassSurface
              borderRadius={106}
              backgroundOpacity={1}
              backgroundColor="rgba(255, 255, 255, 0.01)"
              blurIntensity="sm"
              borderIntensity="sm"
              borderWidth={2}
              className="w-full h-full flex flex-row justify-center items-center gap-[32px]"
              style={{
                backdropFilter: "blur(9.7px)",
              }}
            >
              {/* Left Arrow */}
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.54809 13.8926L2.12206 7.4666M2.12206 7.4666L8.528 1.06065M2.12206 7.4666H15.4561"
                  stroke="white"
                  strokeWidth={3}
                />
              </svg>
              {/* Right Arrow */}
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.90894 1.06068L13.335 7.48671M13.335 7.48671L6.92903 13.8927M13.335 7.48671H0.000961756"
                  stroke="white"
                  strokeWidth={3}
                />
              </svg>
            </GlassSurface>
          </div>
        </div>
      </div>
      {block.caption && (
        <p className="font-manrope font-semibold text-sm md:text-base leading-[140%] tracking-[-0.02em] text-[var(--color-text-primary)] text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}
