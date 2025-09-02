"use client";

import { Container } from "@/components/ui/container";
import { useTranslation } from "react-i18next";

type BlogPostPageProps = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const { t } = useTranslation()
  return (
    <Container variant="content">
      <div>
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <h1> {t("blog.title")} : {slug}</h1>
        </div>
      </div>
    </Container>
  );
}
