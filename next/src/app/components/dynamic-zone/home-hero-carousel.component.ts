import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContainerComponent } from '../container/container.component';
import { StrapiImageComponent } from '../ui/strapi-image.component';

@Component({
  selector: 'app-home-hero-carousel',
  standalone: true,
  imports: [ContainerComponent, StrapiImageComponent],
  template: `
    <section class="relative border-b border-gray-100 bg-white py-10 md:py-14">
      @if (hasMultipleSlides && show_arrows) {
        <button
          type="button"
          (click)="prevSlide()"
          class="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-[#8c6276] text-white items-center justify-center"
          aria-label="Previous slide"
        >
          &#8249;
        </button>
        <button
          type="button"
          (click)="nextSlide()"
          class="hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-[#8c6276] text-white items-center justify-center"
          aria-label="Next slide"
        >
          &#8250;
        </button>
      }

      <app-container>
        @if (activeSlide; as slide) {
          <div class="grid gap-8 md:gap-10 lg:grid-cols-2 items-center min-h-[320px] md:min-h-[380px]">
            <div class="max-w-xl">
              @if (slide.eyebrow) {
                <p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{{ slide.eyebrow }}</p>
              }
              <h1 class="text-3xl md:text-4xl font-bold leading-tight text-[#152744]">{{ slide.heading }}</h1>
              @if (slide.sub_heading) {
                <p class="mt-4 text-sm md:text-base leading-relaxed text-[#486079]">{{ slide.sub_heading }}</p>
              }

              <div class="mt-6 flex flex-wrap gap-3">
                @if (slide.primary_cta?.text && slide.primary_cta?.URL) {
                  <a
                    [href]="getLinkHref(slide.primary_cta.URL)"
                    [attr.target]="slide.primary_cta?.target || '_self'"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center rounded-md bg-[#8c6276] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {{ slide.primary_cta.text }}
                  </a>
                }
                @if (slide.secondary_cta?.text && slide.secondary_cta?.URL) {
                  <a
                    [href]="getLinkHref(slide.secondary_cta.URL)"
                    [attr.target]="slide.secondary_cta?.target || '_self'"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center rounded-md bg-[#404254] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {{ slide.secondary_cta.text }}
                  </a>
                }
              </div>
            </div>

            <div class="w-full">
              <div class="overflow-hidden rounded-2xl border border-gray-200">
                <app-strapi-image
                  [src]="slide.desktop_image?.url"
                  [alt]="slide.desktop_image?.alternativeText || slide.heading"
                  className="h-[260px] w-full object-cover md:h-[360px]"
                  [width]="960"
                  [height]="640"
                />
              </div>
            </div>
          </div>

          @if (hasMultipleSlides && show_dots) {
            <div class="mt-8 flex items-center justify-center gap-2">
              @for (dot of dotIndexes; track dot) {
                <button
                  type="button"
                  (click)="goToSlide(dot)"
                  [class]="dot === currentIndex ? 'h-2.5 w-7 rounded-full bg-[#8c6276]' : 'h-2.5 w-2.5 rounded-full bg-gray-300'"
                  [attr.aria-label]="'Go to slide ' + (dot + 1)"
                ></button>
              }
            </div>
          }
        }
      </app-container>
    </section>
  `,
})
export class HomeHeroCarouselComponent implements OnInit, OnChanges, OnDestroy {
  @Input() slides: any[] = [];
  @Input() show_arrows = true;
  @Input() show_dots = true;
  @Input() autoplay = false;
  @Input() autoplay_interval_ms = 6000;
  @Input() locale = 'en';

  currentIndex = 0;

  private readonly platformId = inject(PLATFORM_ID);
  private autoRotateTimer: ReturnType<typeof setInterval> | null = null;

  get activeSlide(): any | null {
    if (!this.slides?.length) {
      return null;
    }

    return this.slides[this.currentIndex] || this.slides[0];
  }

  get hasMultipleSlides(): boolean {
    return (this.slides?.length || 0) > 1;
  }

  get dotIndexes(): number[] {
    return Array.from({ length: this.slides?.length || 0 }, (_, index) => index);
  }

  ngOnInit(): void {
    this.restartAutoplay();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.currentIndex >= (this.slides?.length || 0)) {
      this.currentIndex = 0;
    }
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    this.clearAutoplay();
  }

  prevSlide(): void {
    if (!this.hasMultipleSlides) {
      return;
    }

    this.currentIndex =
      this.currentIndex === 0 ? (this.slides.length || 1) - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    if (!this.hasMultipleSlides) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  getLinkHref(url: string): string {
    const normalized = (url || '').trim();
    if (!normalized) {
      return '#';
    }

    if (this.isExternalUrl(normalized)) {
      return normalized;
    }

    if (normalized.startsWith(`/${this.locale}/`) || normalized === `/${this.locale}`) {
      return normalized;
    }

    if (normalized === '/') {
      return `/${this.locale}`;
    }

    if (normalized.startsWith('/')) {
      return `/${this.locale}${normalized}`;
    }

    return `/${this.locale}/${normalized}`;
  }

  private isExternalUrl(url: string): boolean {
    return /^(https?:|mailto:|tel:)/i.test(url);
  }

  private restartAutoplay(): void {
    this.clearAutoplay();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.autoplay || !this.hasMultipleSlides) {
      return;
    }

    const interval = this.autoplay_interval_ms && this.autoplay_interval_ms > 0
      ? this.autoplay_interval_ms
      : 6000;

    this.autoRotateTimer = setInterval(() => {
      this.nextSlide();
    }, interval);
  }

  private clearAutoplay(): void {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
      this.autoRotateTimer = null;
    }
  }
}