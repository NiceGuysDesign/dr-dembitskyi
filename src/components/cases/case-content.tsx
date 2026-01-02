import { BlogContentBlock } from "@/strapi/blog";
import BlogHeading from "@/components/blog/blog-heading";
import BlogText from "@/components/blog/blog-text";
import BlogBeforeAfter from "@/components/blog/blog-before-after";
import BlogImage from "@/components/blog/blog-image";
import BlogVideo from "@/components/blog/blog-video";

interface CaseContentProps {
  content: BlogContentBlock[];
}

export default function CaseContent({ content }: CaseContentProps) {
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
