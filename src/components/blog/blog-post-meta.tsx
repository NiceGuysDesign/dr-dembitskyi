import { BlogPost } from "@/strapi/blog";

interface BlogPostMetaProps {
  post: BlogPost;
}

export default function BlogPostMeta({ post }: BlogPostMetaProps) {
  return (
    <div className="border-t border-b border-[var(--color-line)] py-4 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <span className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#35355699] opacity-60">
          Пластична хірургія
        </span>
      <span className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#35355699] opacity-60 md:text-right">
        {post.publishedAt}
      </span>
    </div>
  );
}
