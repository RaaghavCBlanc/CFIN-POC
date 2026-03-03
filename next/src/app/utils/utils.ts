import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { environment } from '../../environments/environment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string | null | undefined, length: number) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

export function getApiUrl(): string {
  return environment.apiUrl || '';
}

export function strapiImage(url: string): string {
  if (!url) return '';
  if (url.startsWith('/')) {
    return getApiUrl() + url;
  }
  return url;
}

export function getStrapiMedia(url: string | null): string | null {
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return getApiUrl() + url;
}
