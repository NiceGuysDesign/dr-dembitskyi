"use client";

import React from "react";
import { RichTextNode } from "@/strapi/services";

interface RichTextProps {
  content: RichTextNode[];
  className?: string;
}

export default function RichText({ content, className = "" }: RichTextProps) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className={className}>
      {content.map((node, index) => {
        if (node.type === "paragraph") {
          if (!node.children || node.children.length === 0) return null;
          const text = node.children
            .map((child) => child.text || "")
            .filter(Boolean)
            .join(" ");
          if (!text.trim()) return null;
          return (
            <p
              key={index}
              className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black mb-4"
            >
              {text}
            </p>
          );
        }

        if (node.type === "list") {
          if (!node.children || node.children.length === 0) return null;
          const isOrdered = node.format === "ordered";
          const ListTag = isOrdered ? "ol" : "ul";

          return (
            <ListTag
              key={index}
              className={`${
                isOrdered ? "list-decimal" : "list-disc"
              } ml-6 mb-4 space-y-2`}
            >
              {node.children.map((item, itemIndex) => {
                if (item.type === "list-item" && item.children) {
                  const text = item.children
                    .map((child) => child.text || "")
                    .filter(Boolean)
                    .join(" ");
                  if (!text.trim()) return null;
                  return (
                    <li
                      key={itemIndex}
                      className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black"
                    >
                      {text}
                    </li>
                  );
                }
                return null;
              })}
            </ListTag>
          );
        }

        return null;
      })}
    </div>
  );
}
