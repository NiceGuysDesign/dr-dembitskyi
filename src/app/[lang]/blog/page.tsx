import { JsonLd } from "@/components/schema/json-ld";
import { buildBlogListingJsonLd } from "@/lib/schema/medical-web-page";
import { getBlogPosts } from "@/strapi/blog";
import BlogHeader from "@/components/blog/blog-header";
import BlogList from "@/components/blog/blog-list";
import CTASection from "@/components/home-page/cta-section";

type BlogPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const posts = await getBlogPosts(lang);

  return (
    <main className="relative w-full">
      <JsonLd data={buildBlogListingJsonLd(lang)} />
      <div className="relative z-10 pt-24 md:pt-30 pb-16 md:pb-[60px]">
        <div className="px-[10px] md:px-5">
          <BlogHeader />
          <BlogList posts={posts} lang={lang} />
        </div>
      </div>
      <CTASection />
    </main>
  );
}
