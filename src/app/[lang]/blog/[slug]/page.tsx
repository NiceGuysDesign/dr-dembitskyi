import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/strapi/blog";
import BlogPostClient from "@/components/blog/blog-post-client";
import BlogList from "@/components/blog/blog-list";
import BlogHeader from "@/components/blog/blog-header";
import CTASection from "@/components/services/cta-section-2";

type BlogPostPageProps = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = await getBlogPostBySlug(slug, lang);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.description || "";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  return {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/blog/${slug}`,
      siteName: "Dr. Dembitskyi",
      images: post.seo?.opengraphImage
        ? [
            {
              url: post.seo.opengraphImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      locale: lang === "uk" ? "uk_UA" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.seo?.opengraphImage
        ? [post.seo.opengraphImage]
        : [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const post = await getBlogPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  // Get other posts (excluding current)
  const allPosts = await getBlogPosts(lang);
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="relative w-full">
      <div className="relative z-10 pt-[110px] md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-24">
        <div className="px-3 md:px-5">
          {/* Post Title */}
          <h1 className="font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[120%] tracking-[-0.04em] text-[var(--color-text-heading)] mb-6 md:mb-8">
            {post.title}
          </h1>

          {/* Post Meta and Content */}
          <BlogPostClient post={post} />

          {/* Other Posts Section */}
          {otherPosts.length > 0 && (
            <div className="mt-12 md:mt-16 lg:mt-24">
              <BlogHeader />
              <BlogList posts={otherPosts} lang={lang} />
            </div>
          )}
        </div>
      </div>
      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
