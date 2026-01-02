import { BlogHeadingBlock } from "@/strapi/blog";

interface BlogHeadingProps {
  block: BlogHeadingBlock;
}

export default function BlogHeading({ block }: BlogHeadingProps) {
  const HeadingTag = block.level;
  const headingClasses = {
    h1: "font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
    h2: "font-manrope font-bold text-[6vw] md:text-[28px] lg:text-[34px] xl:text-[2.5vw] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
    h3: "font-manrope font-bold text-[5vw] md:text-[24px] lg:text-[28px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
    h4: "font-manrope font-bold text-[4vw] md:text-[20px] lg:text-[24px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
    h5: "font-manrope font-bold text-[3.5vw] md:text-[18px] lg:text-[20px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
    h6: "font-manrope font-bold text-[3vw] md:text-[16px] lg:text-[18px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]",
  };

  return (
    <HeadingTag className={headingClasses[block.level]}>
      {block.text}
    </HeadingTag>
  );
}
