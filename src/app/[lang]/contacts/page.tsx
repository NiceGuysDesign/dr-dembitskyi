import { JsonLd } from "@/components/schema/json-ld";
import ContactsPageClient from "@/components/contacts/contacts-page-client";
import { buildContactPageJsonLd } from "@/lib/schema/contact-page";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <JsonLd data={buildContactPageJsonLd(lang)} />
      <ContactsPageClient />
    </>
  );
}
