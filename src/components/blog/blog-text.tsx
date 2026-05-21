"use client";

import React from "react";
import { BlogTextBlock } from "@/strapi/blog";
import { RichTextNode } from "@/strapi/services";
import RichText from "../ui/rich-text";
import CaseSensitiveInlineImage from "../cases/case-sensitive-inline-image";

interface BlogTextProps {
  block: BlogTextBlock;
  sensitive?: boolean;
}

function isRichTextContent(content: unknown): content is RichTextNode[] {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    typeof content[0] === "object" &&
    content[0] !== null &&
    "type" in content[0]
  );
}

interface ImageMatch {
  alt: string;
  url: string;
  index: number;
}

function splitTextWithImages(text: string, imageCounterStart: number) {
  const parts: (string | ImageMatch)[] = [];
  let imageCounter = imageCounterStart;

  const combinedRegex =
    /!\[([^\]]*)\]\(([^)]+)\)|<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*(?:\s+alt=["']([^"']*)["'])?[^>]*\/?>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const isMarkdown = match[0].startsWith("!");
    const imageMatch: ImageMatch = {
      alt: isMarkdown ? match[1] || "" : match[4] || "",
      url: isMarkdown ? match[2] : match[3],
      index: imageCounter++,
    };
    parts.push(imageMatch);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return { parts, imageCounter };
}

// Simple markdown parser for basic elements
function parseMarkdown(content: string, sensitive = false): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let unorderedListItems: string[] = [];
  let orderedListItems: string[] = [];
  let imageCounter = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      const { parts, imageCounter: nextCounter } = splitTextWithImages(
        text,
        imageCounter,
      );
      imageCounter = nextCounter;

      // If no images, render as simple paragraph
      if (parts.length === 1 && typeof parts[0] === "string") {
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="font-manrope font-semibold text-sm md:text-base leading-[140%] tracking-[-0.02em] text-[var(--color-text-primary)] mb-4 md:mb-6"
            dangerouslySetInnerHTML={{
              __html: processInlineMarkdown(parts[0]),
            }}
          />
        );
      } else {
        // Render with images
        parts.forEach((part, idx) => {
          if (typeof part === "string" && part.trim()) {
            elements.push(
              <p
                key={`p-${elements.length}-${idx}`}
                className="font-manrope font-semibold text-sm md:text-base leading-[140%] tracking-[-0.02em] text-[var(--color-text-primary)] mb-4 md:mb-6"
                dangerouslySetInnerHTML={{
                  __html: processInlineMarkdown(part),
                }}
              />
            );
          } else if (typeof part === "object") {
            elements.push(
              <CaseSensitiveInlineImage
                key={`img-${part.index}`}
                src={part.url}
                alt={part.alt}
                imageKey={`img-${part.index}`}
                sensitive={sensitive}
              />,
            );
          }
        });
      }
      currentParagraph = [];
    }
  };

  const flushUnorderedList = () => {
    if (unorderedListItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="list-disc list-inside mb-4 md:mb-6 space-y-2 font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black"
        >
          {unorderedListItems.map((item, idx) => (
            <li
              key={idx}
              dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }}
            />
          ))}
        </ul>
      );
      unorderedListItems = [];
    }
  };

  const flushOrderedList = () => {
    if (orderedListItems.length > 0) {
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="list-decimal list-inside mb-4 md:mb-6 space-y-2 font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black"
        >
          {orderedListItems.map((item, idx) => (
            <li
              key={idx}
              dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }}
            />
          ))}
        </ol>
      );
      orderedListItems = [];
    }
  };

  const flushAllLists = () => {
    flushUnorderedList();
    flushOrderedList();
  };

  const processInlineMarkdown = (text: string): string => {
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "");
    text = text.replace(
      /<img\b[^>]*\bsrc=["'][^"']+["'][^>]*\/?>/gi,
      "",
    );
    // Bold **text** - non-greedy match to handle multiple bold sections
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );
    // Italic _text_
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");
    // Links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-text-primary)]/70 hover:text-[var(--color-text-primary)] hover:underline transition-all duration-300">$1</a>'
    );
    return text.trim();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Headers
    if (line.startsWith("# ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(2);
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="font-manrope font-bold text-[6vw] md:text-[28px] lg:text-[34px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(3);
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="font-manrope font-bold text-[5vw] md:text-[24px] lg:text-[28px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    } else if (line.startsWith("### ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(4);
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="font-manrope font-bold text-[4vw] md:text-[20px] lg:text-[24px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    } else if (line.startsWith("#### ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(5);
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="font-manrope font-bold text-[3.5vw] md:text-[18px] lg:text-[20px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    } else if (line.startsWith("##### ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(6);
      elements.push(
        <h5
          key={`h5-${elements.length}`}
          className="font-manrope font-bold text-[3vw] md:text-[16px] lg:text-[18px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    } else if (line.startsWith("###### ")) {
      flushParagraph();
      flushAllLists();
      const headerText = line.substring(7);
      elements.push(
        <h6
          key={`h6-${elements.length}`}
          className="font-manrope font-bold text-[2.5vw] md:text-[14px] lg:text-[16px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-4 md:mb-6"
          dangerouslySetInnerHTML={{
            __html: processInlineMarkdown(headerText),
          }}
        />
      );
    }
    // Unordered list (starts with - or *)
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      flushOrderedList(); // Close ordered list if open
      unorderedListItems.push(line.substring(2));
    }
    // Ordered list (starts with number.)
    else if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      flushUnorderedList(); // Close unordered list if open
      orderedListItems.push(line.replace(/^\d+\.\s/, ""));
    }
    // Empty line
    else if (line === "") {
      flushParagraph();
      flushAllLists();
    }
    // Regular paragraph
    else {
      flushAllLists();
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushAllLists();

  return elements;
}

export default function BlogText({ block, sensitive = false }: BlogTextProps) {
  const raw = block.content as string | RichTextNode[];

  if (sensitive && isRichTextContent(raw)) {
    return <RichText content={raw} sensitive className="space-y-4 md:space-y-6" />;
  }

  if (typeof raw !== "string") {
    return null;
  }

  const elements = parseMarkdown(raw, sensitive);

  return <div className="space-y-4 md:space-y-6">{elements}</div>;
}
