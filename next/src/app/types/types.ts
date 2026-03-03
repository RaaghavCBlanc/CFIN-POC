import type { StrapiLocaleObject } from './strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description?: string | null;
  localizations: StrapiLocaleObject[];
  slug: string;
  content: any; // Strapi blocks content
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  dynamic_zone: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
  localizations?: any[];
}
