"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RichTextNode } from "@/strapi/services";

interface RichTextProps {
  content: RichTextNode[];
  className?: string;
}

// Helper function to get image URL
function getImageUrl(image: RichTextNode["image"]): string {
  if (!image?.url) return "";
  if (image.url.startsWith("http")) {
    return image.url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  return image.url.startsWith("/")
    ? `${baseUrl}${image.url}`
    : `${baseUrl}/${image.url}`;
}

// Recursive function to render text nodes with links
function renderTextNodes(children: RichTextNode[]): React.ReactNode {
  if (!children || children.length === 0) return null;

  return children.map((child, childIndex) => {
    if (child.type === "text") {
      return (
        <React.Fragment key={childIndex}>{child.text || ""}</React.Fragment>
      );
    }

    if (child.type === "link" && child.url) {
      const isExternal = child.url.startsWith("http");
      const linkContent = child.children
        ? renderTextNodes(child.children)
        : child.text || "";

      if (isExternal) {
        return (
          <a
            key={childIndex}
            href={child.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#353556] underline hover:opacity-70 transition-opacity"
          >
            {linkContent}
          </a>
        );
      }

      return (
        <Link
          key={childIndex}
          href={child.url}
          className="text-[#353556] underline hover:opacity-70 transition-opacity"
        >
          {linkContent}
        </Link>
      );
    }

    // Recursively render nested children
    if (child.children) {
      return (
        <React.Fragment key={childIndex}>
          {renderTextNodes(child.children)}
        </React.Fragment>
      );
    }

    return null;
  });
}

export default function RichText({ content, className = "" }: RichTextProps) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className={className}>
      {content.map((node, index) => {
        // Paragraph
        if (node.type === "paragraph") {
          if (!node.children || node.children.length === 0) return null;
          const hasContent = node.children.some(
            (child) => child.text?.trim() || child.type !== "text"
          );
          if (!hasContent) return null;

          return (
            <p
              key={index}
              className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black mb-4"
            >
              {renderTextNodes(node.children)}
            </p>
          );
        }

        // Headings (h1-h6)
        if (node.type === "heading") {
          const level = Math.min(Math.max(node.level || 1, 1), 6);
          const headingClasses = {
            1: "font-manrope font-bold text-[48px] md:text-[56px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-6",
            2: "font-manrope font-bold text-[40px] md:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-5",
            3: "font-manrope font-bold text-[32px] md:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-4",
            4: "font-manrope font-bold text-[28px] md:text-[32px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-4",
            5: "font-manrope font-bold text-[24px] md:text-[28px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-3",
            6: "font-manrope font-bold text-[20px] md:text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-3",
          };

          const className =
            headingClasses[level as keyof typeof headingClasses] ||
            headingClasses[3];

          const content = node.children
            ? renderTextNodes(node.children)
            : node.text || "";

          switch (level) {
            case 1:
              return (
                <h1 key={index} className={className}>
                  {content}
                </h1>
              );
            case 2:
              return (
                <h2 key={index} className={className}>
                  {content}
                </h2>
              );
            case 3:
              return (
                <h3 key={index} className={className}>
                  {content}
                </h3>
              );
            case 4:
              return (
                <h4 key={index} className={className}>
                  {content}
                </h4>
              );
            case 5:
              return (
                <h5 key={index} className={className}>
                  {content}
                </h5>
              );
            case 6:
              return (
                <h6 key={index} className={className}>
                  {content}
                </h6>
              );
            default:
              return (
                <h3 key={index} className={className}>
                  {content}
                </h3>
              );
          }
        }

        // Images
        if (node.type === "image" && node.image) {
          const imageUrl = getImageUrl(node.image);
          if (!imageUrl) return null;

          return (
            <div key={index} className="relative w-full my-6">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                <Image
                  src={imageUrl}
                  alt={node.image.alternativeText || node.image.caption || ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {node.image.caption && (
                <p className="mt-2 font-manrope font-medium text-xs md:text-sm leading-[150%] text-black opacity-70 text-center">
                  {node.image.caption}
                </p>
              )}
            </div>
          );
        }

        // Lists (ordered/unordered)
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
                if (item.type === "list-item") {
                  const hasContent = item.children
                    ? item.children.some(
                        (child) => child.text?.trim() || child.type !== "text"
                      )
                    : item.text?.trim();
                  if (!hasContent) return null;

                  return (
                    <li
                      key={itemIndex}
                      className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black"
                    >
                      {item.children
                        ? renderTextNodes(item.children)
                        : item.text || ""}
                    </li>
                  );
                }
                // Handle nested lists
                if (item.type === "list") {
                  return (
                    <li key={itemIndex} className="list-none">
                      <RichText content={[item]} />
                    </li>
                  );
                }
                return null;
              })}
            </ListTag>
          );
        }

        // List items (standalone)
        if (node.type === "list-item") {
          if (!node.children || node.children.length === 0) return null;
          return (
            <li
              key={index}
              className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black"
            >
              {renderTextNodes(node.children)}
            </li>
          );
        }

        return null;
      })}
    </div>
  );
}
