import Image from "next/image";
import { BlogImageBlock } from "@/strapi/blog";

interface BlogImageProps {
  block: BlogImageBlock;
}

export default function BlogImage({ block }: BlogImageProps) {
  return (
    <div className="space-y-4 md:space-y-6 my-8 md:my-12">
      <div className="relative w-full aspect-video bg-[#CBCBCB] overflow-hidden">
        <Image
          src={block.image}
          alt={block.caption || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      {block.caption && (
        <p className="font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}
