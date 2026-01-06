const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Timeout in milliseconds (60 seconds for Strapi requests)
const FETCH_TIMEOUT = 60000;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  next?: RequestInit["next"];
  timeout?: number; // Optional custom timeout
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

  const timeout = options.timeout ?? FETCH_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      // Allow Next.js caching hints if passed
      next: options.next,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Strapi request failed ${response.status}: ${text}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        throw new Error(
          `Strapi request timeout after ${timeout}ms: ${url.toString()}`
        );
      }
      if (error.message.includes("HeadersTimeoutError")) {
        throw new Error(
          `Strapi request headers timeout: ${url.toString()}. The server may be slow or unreachable.`
        );
      }
    }
    throw error;
  }
}
