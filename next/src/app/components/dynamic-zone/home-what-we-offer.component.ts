import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { VideoEmbedComponent } from '../ui/video-embed.component';
import { StrapiImageComponent } from '../ui/strapi-image.component';

@Component({
  selector: 'app-home-what-we-offer',
  standalone: true,
  imports: [ContainerComponent, VideoEmbedComponent, StrapiImageComponent],
  template: `
    <section class="py-14 md:py-20" [style.background-color]="background_color || '#77c8be'">
      <app-container>
        <div class="mx-auto max-w-4xl text-center text-white">
          <h2 class="text-3xl md:text-5xl font-bold">{{ heading }}</h2>
          @if (sub_heading) {
            <p class="mt-4 text-sm md:text-base leading-relaxed text-white/90">{{ sub_heading }}</p>
          }
        </div>

        <div class="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] items-center">
          <div class="overflow-hidden rounded-2xl border border-white/20 bg-black/10">
            @if (resolvedVideoUrl) {
              <app-video-embed [src]="resolvedVideoUrl" [title]="video.caption || heading || 'What we offer video'" />
            } @else {
              <app-strapi-image
                [src]="video_poster?.url"
                [alt]="video_poster?.alternativeText || heading || 'What we offer'"
                className="h-[280px] w-full object-cover md:h-[360px]"
                [width]="960"
                [height]="540"
              />
            }
          </div>

          <div class="space-y-5">
            @for (item of items || []; track item.id || $index) {
              <article class="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                <div class="flex items-start gap-4">
                  <div class="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                    @if (item.icon?.url) {
                      <app-strapi-image
                        [src]="item.icon.url"
                        [alt]="item.icon.alternativeText || item.title || 'Feature icon'"
                        className="h-5 w-5 object-contain"
                        [width]="20"
                        [height]="20"
                      />
                    } @else {
                      <span class="text-sm font-bold text-white">•</span>
                    }
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-white">{{ item.title }}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-white/90">{{ item.description }}</p>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </app-container>
    </section>
  `,
})
export class HomeWhatWeOfferComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() background_color = '#77c8be';
  @Input() video: any;
  @Input() video_poster: any;
  @Input() items: any[] = [];
  @Input() locale = 'en';

  get resolvedVideoUrl(): string | null {
    const url = this.video?.url;
    if (!url) {
      return null;
    }

    return this.toEmbedUrl(url);
  }

  private toEmbedUrl(url: string): string {
    if (!url) {
      return '';
    }

    if (/youtube\.com\/embed\//i.test(url)) {
      return url;
    }

    const watchMatch = url.match(/[?&]v=([^&]+)/i);
    if (/youtube\.com\/watch/i.test(url) && watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
    if (shortMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/i);
    if (shortsMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    return url;
  }
}

