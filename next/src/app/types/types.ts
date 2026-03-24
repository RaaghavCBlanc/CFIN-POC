import type { StrapiLocaleObject } from './strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface ArticleContentTextComponent {
  __component: 'shared.content';
  id?: number;
  content: any[];
}

export interface ArticleContentVideoEmbeddingComponent {
  __component: 'shared.video-embedding';
  id?: number;
  url: string;
  caption?: string | null;
  autoplay?: boolean | null;
}

export type ArticleContentComponent =
  | ArticleContentTextComponent
  | ArticleContentVideoEmbeddingComponent;

export interface Article {
  title: string;
  description?: string | null;
  localizations: StrapiLocaleObject[];
  slug: string;
  content?: any[] | null; // Legacy Strapi blocks field
  content_component?: ArticleContentComponent[];
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
  pin?: boolean;
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
