import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { strapi } from '@strapi/client';
import { getApiUrl } from '../utils/utils';
import { AuthService } from './auth.service';

interface CacheEntry {
  data: any;
  timestamp: number;
}

/**
 * Run a promise-returning function outside Angular's zone so Zone.js
 * doesn't track the underlying fetch / setTimeout calls.
 * This prevents SSR from waiting indefinitely for API responses.
 */
function outsideZone<T>(zone: NgZone, fn: () => Promise<T>): Promise<T> {
  return zone.runOutsideAngular(fn);
}

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private zone = inject(NgZone);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes
  private isDraftMode = false;

  setDraftMode(enabled: boolean) {
    this.isDraftMode = enabled;
  }

  getDraftMode(): boolean {
    return this.isDraftMode;
  }

  private createClient(isDraftMode: boolean = false, includeAuth: boolean = true) {
    const headers: Record<string, string> = {};

    if (isDraftMode) {
      headers['strapi-encode-source-maps'] = 'true';
    }

    if (includeAuth && isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return strapi({
      baseURL: `${getApiUrl()}/api`,
      headers,
    });
  }

  private getAuthCacheScope(): 'server' | 'public' | 'authenticated' {
    if (!isPlatformBrowser(this.platformId)) {
      return 'server';
    }

    return this.authService.getToken() ? 'authenticated' : 'public';
  }

  private getCacheKey(type: string, name: string, options?: any): string {
    return `${this.getAuthCacheScope()}-${type}-${name}-${JSON.stringify(options || {})}`;
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private shouldRetryWithAuth(error: unknown): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (!this.authService.getToken()) {
      return false;
    }

    const candidate = error as { status?: number; response?: { status?: number }; message?: string };
    const status = candidate?.status ?? candidate?.response?.status;
    const message = candidate?.message || '';

    if (status === 401 || status === 403) {
      return true;
    }

    return /status code\s+401/i.test(message) || /status code\s+403/i.test(message);
  }

  async fetchCollectionType<T = any[]>(
    collectionName: string,
    options?: any,
    includeAuthForPublished: boolean = false
  ): Promise<T> {
    if (this.isDraftMode) {
      try {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true, true)
            .collection(collectionName)
            .find({ ...options, status: 'draft' })
        );
        return data as T;
      } catch (error) {
        console.error(`Failed to fetch draft collection "${collectionName}":`, error);
        return [] as unknown as T;
      }
    }

    const cacheKey = this.getCacheKey('collection', collectionName, options);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached as T;
    }

    try {
      const { data } = await outsideZone(this.zone, () =>
        this.createClient(false, includeAuthForPublished)
          .collection(collectionName)
          .find({ ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      if (this.shouldRetryWithAuth(error)) {
        try {
          const { data } = await outsideZone(this.zone, () =>
            this.createClient(false, true)
              .collection(collectionName)
              .find({ ...options, status: 'published' })
          );

          this.setCache(cacheKey, data);
          return data as T;
        } catch (retryError) {
          console.error(
            `Failed to fetch collection "${collectionName}" after authenticated retry:`,
            retryError
          );
          return [] as unknown as T;
        }
      }

      console.error(`Failed to fetch collection "${collectionName}":`, error);
      return [] as unknown as T;
    }
  }

  async fetchSingleType<T = any>(
    singleTypeName: string,
    options?: any
  ): Promise<T> {
    if (this.isDraftMode) {
      try {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true, true)
            .single(singleTypeName)
            .find({ ...options, status: 'draft' })
        );
        return data as T;
      } catch (error) {
        console.error(`Failed to fetch draft single type "${singleTypeName}":`, error);
        return {} as T;
      }
    }

    const cacheKey = this.getCacheKey('single', singleTypeName, options);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached as T;
    }

    try {
      const { data } = await outsideZone(this.zone, () =>
        this.createClient(false, false)
          .single(singleTypeName)
          .find({ ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      if (this.shouldRetryWithAuth(error)) {
        try {
          const { data } = await outsideZone(this.zone, () =>
            this.createClient(false, true)
              .single(singleTypeName)
              .find({ ...options, status: 'published' })
          );

          this.setCache(cacheKey, data);
          return data as T;
        } catch (retryError) {
          console.error(
            `Failed to fetch single type "${singleTypeName}" after authenticated retry:`,
            retryError
          );
          return {} as T;
        }
      }

      console.error(`Failed to fetch single type "${singleTypeName}":`, error);
      return {} as T;
    }
  }

  async fetchDocument<T = any>(
    collectionName: string,
    documentId: string,
    options?: any
  ): Promise<T> {
    if (this.isDraftMode) {
      try {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true, true)
            .collection(collectionName)
            .findOne(documentId, { ...options, status: 'draft' })
        );
        return data as T;
      } catch (error) {
        console.error(`Failed to fetch draft document "${documentId}" from "${collectionName}":`, error);
        return {} as T;
      }
    }

    const cacheKey = this.getCacheKey('document', `${collectionName}-${documentId}`, options);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached as T;
    }

    try {
      const { data } = await outsideZone(this.zone, () =>
        this.createClient(false, false)
          .collection(collectionName)
          .findOne(documentId, { ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      if (this.shouldRetryWithAuth(error)) {
        try {
          const { data } = await outsideZone(this.zone, () =>
            this.createClient(false, true)
              .collection(collectionName)
              .findOne(documentId, { ...options, status: 'published' })
          );

          this.setCache(cacheKey, data);
          return data as T;
        } catch (retryError) {
          console.error(
            `Failed to fetch document "${documentId}" from "${collectionName}" after authenticated retry:`,
            retryError
          );
          return {} as T;
        }
      }

      console.error(`Failed to fetch document "${documentId}" from "${collectionName}":`, error);
      return {} as T;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
