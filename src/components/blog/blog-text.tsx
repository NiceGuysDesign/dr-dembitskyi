"use client";

import React from "react";
import Image from "next/image";
import { BlogTextBlock } from "@/strapi/blog";

interface BlogTextProps {
  block: BlogTextBlock;
}

interface ImageMatch {
  alt: string;
  url: string;
  index: number;
}

// Simple markdown parser for basic elements
function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let unorderedListItems: string[] = [];
  let orderedListItems: string[] = [];
  let imageCounter = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      // Extract images from text
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      let lastIndex = 0;
      const parts: (string | ImageMatch)[] = [];

      while ((match = imageRegex.exec(text)) !== null) {
        // Add text before image
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add image
        const imageMatch: ImageMatch = {
          alt: match[1] || "",
          url: match[2],
          index: imageCounter++,
        };
        parts.push(imageMatch);
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

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
            // Render image
            elements.push(
              <div
                key={`img-${part.index}`}
                className="relative w-full my-4 md:my-6 aspect-video rounded overflow-hidden max-h-[50vh]"
              >
                <Image
                  src={part.url}
                  alt={part.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
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
    // Remove images from text (they are handled separately)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "");
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

export default function BlogText({ block }: BlogTextProps) {
  const elements = parseMarkdown(block.content);

  return <div className="space-y-4 md:space-y-6">{elements}</div>;
}
