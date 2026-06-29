"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RichTextNode } from "@/strapi/services";
import CaseSensitiveMedia from "../cases/case-sensitive-media";

interface RichTextProps {
  content: RichTextNode[];
  className?: string;
  /** Blur images until user clicks "Show image" (case pages). */
  sensitive?: boolean;
  /** Larger vertical gaps for legal/docs content (privacy policy, etc.). */
  spacing?: "default" | "document";
  /** Body copy typography — `inter` for cards/FAQ, `manrope` elsewhere. */
  bodyVariant?: "manrope" | "inter";
}

const BODY_TEXT_CLASS = {
  manrope:
    "font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black",
  inter: "font-inter font-medium text-base leading-[150%] text-black",
} as const;

function isEmptyParagraph(node: RichTextNode): boolean {
  if (node.type !== "paragraph" || !node.children?.length) return true;
  return !node.children.some(
    (child) => (child.text && child.text.length > 0) || child.type !== "text",
  );
}

const SPACER_CLASS = {
  default: "h-4 md:h-5",
  document: "h-6 md:h-8",
} as const;

/** Gap when CMS blocks sit back-to-back without an empty paragraph spacer. */
function getDocumentBlockGap(
  index: number,
  content: RichTextNode[],
  spacing: RichTextProps["spacing"],
): string {
  if (spacing !== "document" || index === 0) return "";
  const prev = content[index - 1];
  if (prev && isEmptyParagraph(prev)) return "";
  return "mt-4 md:mt-5";
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
      const text = child.text || "";
      if (child.bold) {
        return (
          <strong key={childIndex} className="font-bold text-[18px]">
            {text}
          </strong>
        );
      }
      return <React.Fragment key={childIndex}>{text}</React.Fragment>;
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

export default function RichText({
  content,
  className = "",
  sensitive = false,
  spacing = "default",
  bodyVariant = "manrope",
}: RichTextProps) {
  if (!content || !Array.isArray(content)) return null;

  const bodyTextClass = BODY_TEXT_CLASS[bodyVariant];

  const spacerClass = SPACER_CLASS[spacing];
  const isDocument = spacing === "document";

  return (
    <div className={className}>
      {content.map((node, index) => {
        const blockGap = getDocumentBlockGap(index, content, spacing);

        // Paragraph
        if (node.type === "paragraph") {
          if (isEmptyParagraph(node)) {
            return (
              <div
                key={index}
                className={spacerClass}
                role="presentation"
                aria-hidden
              />
            );
          }

          return (
            <p
              key={index}
              className={`${bodyTextClass} ${blockGap} ${
                isDocument ? "mb-0" : "mb-4"
              }`}
            >
              {renderTextNodes(node.children!)}
            </p>
          );
        }

        // Headings (h1-h6)
        if (node.type === "heading") {
          const level = Math.min(Math.max(node.level || 1, 1), 6);
          const docHeading =
            "font-manrope font-bold text-[18px] md:text-[20px] leading-[130%] tracking-[-0.03em] text-[#353556]";
          const headingClasses = {
            1: "font-manrope font-bold text-[48px] md:text-[56px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-6",
            2: "font-manrope font-bold text-[40px] md:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-5",
            3: "font-manrope font-bold text-[32px] md:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-4",
            4: isDocument
              ? `${docHeading} mb-0`
              : "font-manrope font-bold text-[28px] md:text-[32px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-4",
            5: "font-manrope font-bold text-[24px] md:text-[28px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-3",
            6: "font-manrope font-bold text-[20px] md:text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-3",
          };

          const headingClassName = `${
            headingClasses[level as keyof typeof headingClasses] ||
            headingClasses[3]
          } ${blockGap}`;

          const content = node.children
            ? renderTextNodes(node.children)
            : node.text || "";

          switch (level) {
            case 1:
              return (
                <h1 key={index} className={headingClassName}>
                  {content}
                </h1>
              );
            case 2:
              return (
                <h2 key={index} className={headingClassName}>
                  {content}
                </h2>
              );
            case 3:
              return (
                <h3 key={index} className={headingClassName}>
                  {content}
                </h3>
              );
            case 4:
              return (
                <h4 key={index} className={headingClassName}>
                  {content}
                </h4>
              );
            case 5:
              return (
                <h5 key={index} className={headingClassName}>
                  {content}
                </h5>
              );
            case 6:
              return (
                <h6 key={index} className={headingClassName}>
                  {content}
                </h6>
              );
            default:
              return (
                <h3 key={index} className={headingClassName}>
                  {content}
                </h3>
              );
          }
        }

        // Images
        if (node.type === "image" && node.image) {
          const imageUrl = getImageUrl(node.image);
          if (!imageUrl) return null;

          const imageBlock = (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src={imageUrl}
                alt={node.image.alternativeText || node.image.caption || ""}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          );

          return (
            <div key={index} className="relative w-full my-6">
              {sensitive ? (
                <CaseSensitiveMedia revealOnly className="w-full">
                  {imageBlock}
                </CaseSensitiveMedia>
              ) : (
                imageBlock
              )}
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
              } ml-6 space-y-2 ${blockGap} ${isDocument ? "mb-0 pl-1" : "mb-4"}`}
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
                    <li key={itemIndex} className={bodyTextClass}>
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
                      <RichText
                        content={[item]}
                        sensitive={sensitive}
                        bodyVariant={bodyVariant}
                        spacing={spacing}
                      />
                    </li>
                  );
                }
                return null;
              })}
            </ListTag>
          );
        }

        // Blockquote
        if (node.type === "quote") {
          if (!node.children || node.children.length === 0) return null;
          return (
            <blockquote
              key={index}
              className={`mt-4 border-l-4 bg-gray-200 p-4 border-[#353556] pl-4 italic ${bodyTextClass} ${blockGap} ${
                isDocument ? "mb-0" : "my-6"
              }`}
            >
              {renderTextNodes(node.children)}
            </blockquote>
          );
        }

        // List items (standalone)
        if (node.type === "list-item") {
          if (!node.children || node.children.length === 0) return null;
          return (
            <li key={index} className={bodyTextClass}>
              {renderTextNodes(node.children)}
            </li>
          );
        }

        return null;
      })}
    </div>
  );
}
