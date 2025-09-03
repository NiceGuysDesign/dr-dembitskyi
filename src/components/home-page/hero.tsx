"use client";

import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { getHero } from "@/strapi/hero";
import type { HeroEntity } from "@/types/strapi";
import Image from "next/image";

export default function Hero() {
  // const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.lang as string) || "en";

  const [data, setData] = useState<HeroEntity | null>(null);

  useEffect(() => {
    let isMounted = true;
    getHero(locale)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch(() => {
        if (isMounted) setData(null);
      });
    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <div className="font-sans flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20">
      {/* <h1 className="text-4xl font-bold"> {t("hero.title")} </h1> */}
      <div className="flex flex-col items-center justify-center gap-4">
        {data?.image?.url && (
          <Image
            src={data.image.url}
            width={100}
            height={100}
            alt={data.image.alternativeText || "Hero image"}
            className="object-cover"
            unoptimized={true}
          />
        )}
        {data && (
          <>
            <h1 className="text-4xl font-bold"> {data.title} </h1>
            <p className="text-lg text-gray-500"> {data.description} </p>
          </>
        )}
      </div>
      <div className="flex gap-4">
        <Button variant="default">Test Button</Button>
        <Button variant="destructive">Test Button</Button>
        <Button variant="outline">Test Button</Button>
        <Button variant="secondary">Test Button</Button>
        <Button variant="ghost">Test Button</Button>
        <Button variant="link">Test Button</Button>
      </div>
    </div>
  );
}
