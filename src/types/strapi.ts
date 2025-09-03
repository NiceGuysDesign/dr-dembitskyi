// Shared Strapi response primitives and content types

export type StrapiID = number;

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: StrapiID;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
    [key: string]: StrapiImageFormat | undefined;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string | null;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface HeroLocalization {
  id: StrapiID;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface HeroEntity {
  id: StrapiID;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: StrapiImage | null;
  video: unknown | null;
  localizations?: HeroLocalization[];
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}
