import { Component, Input } from '@angular/core';
import { format, formatDistanceToNow } from 'date-fns';
import { ContainerComponent } from './container/container.component';
import { DynamicZoneManagerComponent } from './dynamic-zone/manager.component';
import type {
  Article,
  ArticleContentComponent,
  ArticleContentTextComponent,
  ArticleContentVideoEmbeddingComponent,
} from '../types/types';
import { strapiImage } from '../utils/utils';
import { StrapiBlocksComponent } from './ui/strapi-blocks.component';
import { StrapiImageComponent } from './ui/strapi-image.component';
import { VideoEmbedComponent } from './ui/video-embed.component';

@Component({
  selector: 'app-blog-layout',
  standalone: true,
  imports: [
    ContainerComponent,
    DynamicZoneManagerComponent,
    StrapiImageComponent,
    StrapiBlocksComponent,
    VideoEmbedComponent,
  ],
  template: `
    <div class="relative overflow-hidden">
      <div class="py-10 px-8" [style.background-color]="pageData?.banner_background_color || '#7a9e8e'">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <h1 class="text-3xl font-bold text-white">{{ pageData?.heading || 'Articles' }}</h1>
          @if (bannerImageUrl) {
            <img [src]="bannerImageUrl" alt="" class="h-16 md:h-20 object-contain" />
          }
        </div>
      </div>

      <app-container className="py-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mt-4">
          {{ article?.title }}
        </h2>

        <div class="flex items-center justify-between mt-4 pb-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#7a9e8e] flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-bold">C</span>
            </div>
            <div class="text-sm text-gray-600">
              By <span class="text-[#2a6496]">Community Manager</span>
              <span class="ml-1">posted {{ relativeDate(article?.publishedAt || '') }}</span>
            </div>
          </div>
          <button class="text-xs text-gray-400 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition">
            &#x2764; Like
          </button>
        </div>

        <div class="w-full mx-auto mt-6">
          @if (article?.image; as articleImage) {
            <app-strapi-image
              [src]="articleImage.url"
              [height]="800"
              [width]="800"
              className="w-full max-h-[500px] object-cover rounded"
              [alt]="article?.title || ''"
            />
          }
        </div>

        <div class="xl:relative">
          <div class="mx-auto max-w-3xl">
            <article class="pb-8 pt-8">
              <div class="prose prose-sm prose-gray max-w-none">
                @if (articleBodyComponents.length) {
                  @for (item of articleBodyComponents; track trackContentComponent($index, item)) {
                    @if (isContentBlock(item)) {
                      <app-strapi-blocks [content]="item.content" />
                    } @else if (isVideoBlock(item)) {
                      <figure class="not-prose my-8" data-video-embed-version="2026-03-06-2">
                        <app-video-embed
                          [src]="videoEmbedSrc(item)"
                          [title]="item.caption || 'Embedded video'"
                          [allow]="iframeAllow(item)"
                        />

                        @if (!videoEmbedSrc(item)) {
                          <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-blue-600 underline break-all">
                            {{ item.url }}
                          </a>
                        }

                        @if (item.caption) {
                          <figcaption class="mt-3 text-sm text-gray-500">{{ item.caption }}</figcaption>
                        }
                      </figure>
                    }
                  }
                } @else {
                  <app-strapi-blocks [content]="article?.content || null" />
                }
              </div>
            </article>
          </div>
        </div>

        @if (article?.dynamic_zone) {
          <app-dynamic-zone-manager
            [dynamicZone]="article?.dynamic_zone || []"
            [locale]="locale"
          />
        }
      </app-container>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class BlogLayoutComponent {
  @Input() article: Article | null = null;
  @Input() pageData: any;
  @Input() locale = 'en';

  get bannerImageUrl(): string | null {
    const url = this.pageData?.banner_image?.url;
    return url ? strapiImage(url) : null;
  }

  get articleBodyComponents(): ArticleContentComponent[] {
    const content = this.article?.content_component;
    return Array.isArray(content) ? content : [];
  }

  trackContentComponent(index: number, item: ArticleContentComponent): string {
    return `${item.__component}-${item.id ?? index}`;
  }

  isContentBlock(item: ArticleContentComponent): item is ArticleContentTextComponent {
    return item.__component === 'shared.content';
  }

  isVideoBlock(item: ArticleContentComponent): item is ArticleContentVideoEmbeddingComponent {
    return item.__component === 'shared.video-embedding';
  }

  iframeAllow(item: ArticleContentVideoEmbeddingComponent): string {
    const base = ['accelerometer', 'clipboard-write', 'encrypted-media', 'gyroscope', 'picture-in-picture', 'web-share'];
    if (item.autoplay) {
      base.unshift('autoplay');
    }
    return base.join('; ');
  }

  videoEmbedSrc(item: ArticleContentVideoEmbeddingComponent): string | null {
    return this.buildEmbedUrl(item.url, !!item.autoplay);
  }

  relativeDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: false }) + ' ago';
    } catch {
      return dateStr;
    }
  }

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }

  private buildEmbedUrl(rawUrl: string, autoplay: boolean): string | null {
    const parsedUrl = this.toUrl(rawUrl);
    if (!parsedUrl) return null;

    const host = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
      const embedUrl = this.toYoutubeEmbedUrl(parsedUrl);
      if (!embedUrl) return null;
      if (autoplay) {
        embedUrl.searchParams.set('autoplay', '1');
        embedUrl.searchParams.set('mute', '1');
      }
      return embedUrl.toString();
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const embedUrl = this.toVimeoEmbedUrl(parsedUrl);
      if (!embedUrl) return null;
      if (autoplay) {
        embedUrl.searchParams.set('autoplay', '1');
        embedUrl.searchParams.set('muted', '1');
      }
      return embedUrl.toString();
    }

    return null;
  }

  private toUrl(rawUrl: string): URL | null {
    const trimmed = rawUrl?.trim();
    if (!trimmed) return null;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      return new URL(withProtocol);
    } catch {
      return null;
    }
  }

  private toYoutubeEmbedUrl(url: URL): URL | null {
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const segments = url.pathname.split('/').filter(Boolean);

    let videoId = url.searchParams.get('v') || '';

    if (!videoId && host === 'youtu.be') {
      videoId = segments[0] || '';
    }

    if (!videoId && (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'live')) {
      videoId = segments[1] || '';
    }

    if (!videoId) return null;

    const normalizedId = videoId.trim();
    if (!/^[A-Za-z0-9_-]{6,}$/.test(normalizedId)) {
      return null;
    }

    const embed = new URL(`https://www.youtube.com/embed/${normalizedId}`);
    embed.searchParams.set('rel', '0');
    embed.searchParams.set('modestbranding', '1');
    embed.searchParams.set('playsinline', '1');
    embed.searchParams.set('feature', 'oembed');

    const start = url.searchParams.get('start') || url.searchParams.get('t');
    const startSeconds = this.parseStartSeconds(start);
    if (startSeconds !== null) {
      embed.searchParams.set('start', String(startSeconds));
    }

    return embed;
  }

  private toVimeoEmbedUrl(url: URL): URL | null {
    const segments = url.pathname.split('/').filter(Boolean);
    let videoId = '';

    if (segments[0] === 'video') {
      videoId = segments[1] || '';
    } else {
      videoId = segments.find(segment => /^\d+$/.test(segment)) || '';
    }

    if (!videoId) return null;

    const embed = new URL(`https://player.vimeo.com/video/${videoId}`);
    embed.searchParams.set('title', '0');
    embed.searchParams.set('byline', '0');
    embed.searchParams.set('portrait', '0');
    embed.searchParams.set('dnt', '1');
    return embed;
  }

  private parseStartSeconds(value: string | null): number | null {
    if (!value) return null;

    if (/^\d+$/.test(value)) {
      return Number(value);
    }

    const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
    if (!match) return null;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }
}