type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

type JsonLdProps = {
  data: JsonLdValue;
};

/** Renders Schema.org JSON-LD in a safe script tag. */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
