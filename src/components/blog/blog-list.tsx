"use client";

import { BlogPost } from "@/strapi/blog";
import BlogCard from "./blog-card";
import { useTranslation } from "react-i18next";

interface BlogListProps {
  posts: BlogPost[];
  lang: string;
}

export default function BlogList({ posts, lang }: BlogListProps) {
  const { t } = useTranslation();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-manrope font-medium text-base leading-[140%] text-[var(--color-text-primary)]">
          {t("blog.noPosts")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
      {posts.map((post) => (
        <div key={post.slug} className="w-full lg:mx-0">
          <BlogCard post={post} lang={lang} />
        </div>
      ))}
    </div>
  );
}
