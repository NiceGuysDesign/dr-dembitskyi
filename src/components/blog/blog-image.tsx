"use client";

import Image from "next/image";
import { BlogImageBlock } from "@/strapi/blog";
import CaseSensitiveMedia from "../cases/case-sensitive-media";
import { SensitiveContentImageFrame } from "../cases/case-sensitive-inline-image";

interface BlogImageProps {
  block: BlogImageBlock;
  sensitive?: boolean;
}

export default function BlogImage({ block, sensitive = false }: BlogImageProps) {
  const image = (
    <div className="relative inline-block max-w-full overflow-hidden">
      <Image
        src={block.image}
        alt={block.caption || ""}
        width={1600}
        height={900}
        className="block h-auto max-h-[70vh] w-auto max-w-full"
        sizes="(max-width: 768px) 100vw, 1100px"
      />
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 my-8 md:my-12">
      {sensitive ? (
        <SensitiveContentImageFrame className="my-0">
          <CaseSensitiveMedia revealOnly className="inline-block max-w-full">
            {image}
          </CaseSensitiveMedia>
        </SensitiveContentImageFrame>
      ) : (
        <SensitiveContentImageFrame className="my-0">{image}</SensitiveContentImageFrame>
      )}
      {block.caption && (
        <p className="font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}
