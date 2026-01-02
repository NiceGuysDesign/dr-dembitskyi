"use client";

import { BlogPost } from "@/strapi/blog";
import BlogPostMeta from "./blog-post-meta";
import BlogContent from "./blog-content";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {

  return (
    <>
      {/* Post Meta */}
      <BlogPostMeta post={post} />

      {/* Post Content */}
      <div className="mt-6 md:mt-8 lg:mt-12  max-w-[1440px] mx-auto">
        <BlogContent content={post.content} />
      </div>
    </>
  );
}
