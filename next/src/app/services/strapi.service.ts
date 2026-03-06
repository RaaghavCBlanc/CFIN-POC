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

  private createClient(isDraftMode: boolean = false) {
    const headers: Record<string, string> = {};

    if (isDraftMode) {
      headers['strapi-encode-source-maps'] = 'true';
    }

    if (isPlatformBrowser(this.platformId)) {
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

  private getCacheKey(type: string, name: string, options?: any): string {
    return `${type}-${name}-${JSON.stringify(options || {})}`;
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

  async fetchCollectionType<T = any[]>(
    collectionName: string,
    options?: any
  ): Promise<T> {
    try {
      if (this.isDraftMode) {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true)
            .collection(collectionName)
            .find({ ...options, status: 'draft' })
        );
        return data as T;
      }

      const cacheKey = this.getCacheKey('collection', collectionName, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached as T;

      const { data } = await outsideZone(this.zone, () =>
        this.createClient()
          .collection(collectionName)
          .find({ ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      console.error(`Failed to fetch collection "${collectionName}":`, error);
      return [] as unknown as T;
    }
  }

  async fetchSingleType<T = any>(
    singleTypeName: string,
    options?: any
  ): Promise<T> {
    try {
      if (this.isDraftMode) {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true)
            .single(singleTypeName)
            .find({ ...options, status: 'draft' })
        );
        return data as T;
      }

      const cacheKey = this.getCacheKey('single', singleTypeName, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached as T;

      const { data } = await outsideZone(this.zone, () =>
        this.createClient()
          .single(singleTypeName)
          .find({ ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      console.error(`Failed to fetch single type "${singleTypeName}":`, error);
      return {} as T;
    }
  }

  async fetchDocument<T = any>(
    collectionName: string,
    documentId: string,
    options?: any
  ): Promise<T> {
    try {
      if (this.isDraftMode) {
        const { data } = await outsideZone(this.zone, () =>
          this.createClient(true)
            .collection(collectionName)
            .findOne(documentId, { ...options, status: 'draft' })
        );
        return data as T;
      }

      const cacheKey = this.getCacheKey('document', `${collectionName}-${documentId}`, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached as T;

      const { data } = await outsideZone(this.zone, () =>
        this.createClient()
          .collection(collectionName)
          .findOne(documentId, { ...options, status: 'published' })
      );

      this.setCache(cacheKey, data);
      return data as T;
    } catch (error) {
      console.error(`Failed to fetch document "${documentId}" from "${collectionName}":`, error);
      return {} as T;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

