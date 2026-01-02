import { BlogContentBlock } from "@/strapi/blog";
import BlogHeading from "./blog-heading";
import BlogText from "./blog-text";
import BlogBeforeAfter from "./blog-before-after";
import BlogImage from "./blog-image";
import BlogVideo from "./blog-video";

interface BlogContentProps {
  content: BlogContentBlock[];
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-12">
      {content.map((block, index) => {
        // Use combination of component type and id for unique keys
        const uniqueKey = `${block.__component}-${block.id}-${index}`;

        switch (block.__component) {
          case "blog-blocks.heading":
            return <BlogHeading key={uniqueKey} block={block} />;
          case "blog-blocks.text":
            return <BlogText key={uniqueKey} block={block} />;
          case "blog-blocks.before-after":
            return <BlogBeforeAfter key={uniqueKey} block={block} />;
          case "blog-blocks.image":
            return <BlogImage key={uniqueKey} block={block} />;
          case "blog-blocks.video":
            return <BlogVideo key={uniqueKey} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
