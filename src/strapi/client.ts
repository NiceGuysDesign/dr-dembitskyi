const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  next?: RequestInit["next"];
}

export async function strapiFetch<T>(
  path: string,
  locale?: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = new URL(path, STRAPI_BASE_URL);
  if (locale) {
    url.searchParams.set("locale", locale);
  }
  // keep existing query params in path (e.g., populate=*)
  // If path already included query, URL() constructor preserves it

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    // Allow Next.js caching hints if passed
    next: options.next,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strapi request failed ${response.status}: ${text}`);
  }
  return (await response.json()) as T;
}
