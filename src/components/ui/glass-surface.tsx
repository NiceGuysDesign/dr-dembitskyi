import React from "react";
import { cn } from "@/lib/utils";

interface GlassSurfaceProps {
  children: React.ReactNode;
  borderRadius?: number | string;
  backgroundOpacity?: number;
  backgroundColor?: string;
  blurIntensity?: "sm" | "md" | "lg";
  borderIntensity?: "sm" | "md" | "lg";
  borderWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const borderOpacityMap = {
  sm: 0.3,
  md: 0.5,
  lg: 0.7,
};

export default function GlassSurface({
  children,
  borderRadius = 20,
  backgroundOpacity = 0.1,
  backgroundColor = "rgba(255, 255, 255, 0.01)",
  blurIntensity = "sm",
  borderIntensity = "sm",
  borderWidth = 2,
  className,
  style,
}: GlassSurfaceProps) {
  const borderOpacity = borderOpacityMap[borderIntensity];

  const blurValue =
    blurIntensity === "sm" ? "9.7px" : blurIntensity === "md" ? "12px" : "16px";

  return (
    <div
      className={cn("relative", className)}
      style={{
        borderRadius:
          typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        backgroundColor,
        opacity: backgroundOpacity,
        border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
        backdropFilter: `blur(${blurValue})`,
        WebkitBackdropFilter: `blur(${blurValue})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
