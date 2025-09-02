"use client";

import { Container } from "@/components/ui/container";
import { useTranslation } from "react-i18next";

export default function ContactsPage() {
  const { t } = useTranslation()
  return (  
    <Container variant="content">
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1> {t("contacts.title")} </h1>
      </div>
    </Container>
  );
}
